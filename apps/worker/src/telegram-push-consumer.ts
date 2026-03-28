import { kafka, TOPICS, getProducer } from "@repo/kafka";
import type { Consumer, EachBatchPayload, ResponseProcessorMessage } from "@repo/kafka";
import { bot } from "@repo/bot";

export class TelegramPushConsumer {
    private consumer: Consumer;
    private isRunning = false;

    constructor() {
        this.consumer = kafka.consumer({
            groupId: "telegram-push-group",
        });
    }

    async start() {
        if (this.isRunning) return;

        try {
            await this.consumer.connect();
            console.log("Kafka TelegramPushConsumer: Connected and listening...");

            await this.consumer.subscribe({
                topics: [TOPICS.RESPONSE_PROCESSOR],
                fromBeginning: false,
            });

            await this.consumer.run({
                eachBatchAutoResolve: false,
                eachBatch: async ({
                    batch,
                    resolveOffset,
                    heartbeat,
                    isRunning,
                }: EachBatchPayload) => {
                    const messages = batch.messages;
                    const batchSize = 500;
                    const flushInterval = 3000;

                    console.log(
                        `TelegramPushConsumer received ${messages.length} messages from Kafka`,
                    );

                    let currentBatch: (ResponseProcessorMessage & { offset: string })[] = [];
                    let lastFlush = Date.now();

                    for (const message of messages) {
                        if (!isRunning()) break;

                        try {
                            const rawValue = message.value?.toString();
                            if (!rawValue) continue;

                            const content = JSON.parse(rawValue) as ResponseProcessorMessage;
                            currentBatch.push({
                                ...content,
                                offset: message.offset,
                            });

                            const now = Date.now();
                            if (
                                currentBatch.length >= batchSize ||
                                now - lastFlush >= flushInterval
                            ) {
                                await this.processBatchItems(currentBatch);
                                const lastMsg = currentBatch[currentBatch.length - 1];
                                if (lastMsg) {
                                    resolveOffset(lastMsg.offset);
                                }
                                await heartbeat();
                                currentBatch = [];
                                lastFlush = Date.now();
                            }
                        } catch (error) {
                            console.error(
                                "Error parsing/buffering post message:",
                                error,
                            );
                            resolveOffset(message.offset);
                        }
                    }

                    if (currentBatch.length > 0) {
                        await this.processBatchItems(currentBatch);
                        const lastMsg = currentBatch[currentBatch.length - 1];
                        if (lastMsg) {
                            resolveOffset(lastMsg.offset);
                        }
                        await heartbeat();
                    }
                },
            });

            this.isRunning = true;
        } catch (error) {
            console.error("Failed to start post consumer:", error);
            throw error;
        }
    }

    async stop() {
        if (this.isRunning) {
            await this.consumer.disconnect();
            this.isRunning = false;
            console.log("Kafka TelegramPushConsumer: Stopped successfully");
        }
    }

    private async processBatchItems(
        messages: (ResponseProcessorMessage & { offset: string })[],
    ) {
        if (messages.length === 0) return;

        console.log(`⚡ TelegramPushConsumer processing batch of ${messages.length} items...`);

        try {
            // Only send ASSISTANT replies back to Telegram
            const assistantMessages = messages.filter((m) => m.role === "ASSISTANT");

            for (const msg of assistantMessages) {
                try {
                    await bot.sendMessage(parseInt(msg.chatId), msg.content, { parse_mode: "Markdown" });
                    console.log(`✅ Sent reply to Telegram chatId ${msg.chatId}`);
                } catch (sendError) {
                    console.error(`❌ Failed to send message to chatId ${msg.chatId}:`, sendError);
                }
            }
        } catch (e) {
            console.error(
                "❌ Post database batch write failed. Initiating recovery...",
                e,
            );

            const producer = getProducer("response");
            try {
                for (const msg of messages) {
                    const originalMessage = { ...msg };
                    // @ts-expect-error - remove offset before re-publishing
                    delete originalMessage.offset;
                    await producer.publishMessage(originalMessage);
                }
                console.log(
                    `🔄 Post recovery: Re-queued ${messages.length} messages to Kafka topic.`,
                );
            } catch (produceError) {
                console.error(
                    "🔥 CRITICAL: Failed to re-queue post messages! Data loss possible.",
                    produceError,
                );
            }
        }
    }

    async getLag(): Promise<number> {
        const admin = kafka.admin();
        try {
            await admin.connect();
            let totalLag = 0;
            const groupOffsets = await admin.fetchOffsets({
                groupId: "telegram-push-group",
                topics: [TOPICS.RESPONSE_PROCESSOR],
            });

            for (const topicOffset of groupOffsets) {
                const topicOffsets = await admin.fetchTopicOffsets(
                    topicOffset.topic,
                );

                for (const partition of topicOffset.partitions) {
                    const consumerOffset = partition.offset
                        ? parseInt(partition.offset)
                        : 0;
                    const topicPartition = topicOffsets.find(
                        (tp: {
                            partition: number;
                            high: string;
                            low: string;
                        }) => tp.partition === partition.partition,
                    );
                    const highWatermark = topicPartition?.high
                        ? parseInt(topicPartition.high)
                        : 0;
                    totalLag += highWatermark - consumerOffset;
                }
            }
            return totalLag;
        } finally {
            await admin.disconnect();
        }
    }
}

let TelegramPushConsumerInstance: TelegramPushConsumer | null = null;
export function getTelegramPushConsumer(): TelegramPushConsumer {
    if (!TelegramPushConsumerInstance) {
        TelegramPushConsumerInstance = new TelegramPushConsumer();
    }
    return TelegramPushConsumerInstance;
}

