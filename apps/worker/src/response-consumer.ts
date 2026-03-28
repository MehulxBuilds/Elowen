import { kafka, TOPICS, getProducer } from "@repo/kafka";
import type { Consumer, EachBatchPayload, ResponseProcessorMessage, UserQueryMessage } from "@repo/kafka";
import { getUserMessageCache } from "@repo/cache";
import { client } from "@repo/db";
import { generateOpenRouterText } from "@repo/ai-service";
import { v4 as uuidv4 } from "uuid";

export class ResponseConsumer {
    private consumer: Consumer;
    private isRunning = false;

    constructor() {
        this.consumer = kafka.consumer({
            groupId: "query-group",
        });
    }

    async start() {
        if (this.isRunning) return;

        try {
            await this.consumer.connect();
            console.log("Kafka ResponseConsumer: Connected and listening...");

            await this.consumer.subscribe({
                topics: [TOPICS.USER_QUERY],
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
                    const batchSize = 10; // Lower batch size for automate due to API calls
                    const flushInterval = 5000;

                    console.log(
                        `ResponseConsumer received ${messages.length} messages from Kafka`,
                    );

                    let currentBatch: (UserQueryMessage & { offset: string })[] = [];
                    let lastFlush = Date.now();

                    for (const message of messages) {
                        if (!isRunning()) break;

                        try {
                            const rawValue = message.value?.toString();
                            if (!rawValue) continue;

                            const content = JSON.parse(rawValue) as UserQueryMessage;
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
            console.log("Kafka ResponseConsumer: Stopped successfully");
        }
    }

    private async processBatchItems(
        messages: (UserQueryMessage & { offset: string })[],
    ) {
        if (messages.length === 0) return;

        console.log(`⚡ ResponseConsumer processing batch of ${messages.length} items...`);
        const startTime = Date.now();

        const responseProducer = getProducer("response");

        for (const msg of messages) {
            try {
                const cacheKey = `user:${msg.userId}:msg`;

                // 1. Grab last 10 messages from cache, fallback to DB
                let history = await getUserMessageCache().getMessage(cacheKey);
                if (!history) {
                    const dbMessages = await client.message.findMany({
                        where: { userId: msg.userId, chatId: msg.chatId },
                        orderBy: { createdAt: "desc" },
                        take: 10,
                        select: { messageRole: true, content: true },
                    });
                    history = dbMessages.reverse();
                }

                // 2. Format as AI context
                const context = history.slice(-10).map((m: any) => ({
                    role: m.messageRole === "ASSISTANT" ? "assistant" as const : "user" as const,
                    content: m.content,
                }));

                // 3. Get user's selected model
                const user = await client.user.findUnique({
                    where: { id: msg.userId },
                    select: { modelId: true },
                });

                // 4. Generate AI reply
                const content = await generateOpenRouterText({
                    modelId: user?.modelId ?? "arcee-ai/trinity-mini:free",
                    context,
                    prompt: msg.query,
                });

                // Create raw processor message with gathered data
                const responseMessage: ResponseProcessorMessage = {
                    id: uuidv4(),
                    userId: msg.userId,
                    chatId: msg.chatId,
                    content: content.text,
                    createdAt: msg.createdAt,
                    role: "ASSISTANT",
                    type: "NORMAL",
                    tokens: content.token,
                };

                const userMessage: ResponseProcessorMessage = {
                    id: msg.id,
                    userId: msg.userId,
                    chatId: msg.chatId,
                    content: msg.query,
                    createdAt: msg.createdAt,
                    role: "USER",
                    type: "NORMAL",
                };

                // Push agent message to processor queue
                await responseProducer.publishMessage(responseMessage);

                // Push user message to processor queue
                await responseProducer.publishMessage(userMessage);
                console.log(`✅ Produced Response Successfully`);
            } catch (error) {
                console.error(`❌ Failed to process automate message ${msg.id}:`, error);
            }
        }

        const duration = Date.now() - startTime;
        console.log(`✅ ResponseConsumer batch processed in ${duration} ms`);
    }

    async getLag(): Promise<number> {
        const admin = kafka.admin();
        try {
            await admin.connect();
            let totalLag = 0;
            const groupOffsets = await admin.fetchOffsets({
                groupId: "query-group",
                topics: [TOPICS.USER_QUERY],
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

let ResponseConsumerInstance: ResponseConsumer | null = null;
export function getResponseConsumer(): ResponseConsumer {
    if (!ResponseConsumerInstance) {
        ResponseConsumerInstance = new ResponseConsumer();
    }
    return ResponseConsumerInstance;
}

