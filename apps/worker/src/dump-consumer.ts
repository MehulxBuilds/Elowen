import { kafka, TOPICS, getProducer } from "@repo/kafka";
import { client, Decimal } from "@repo/db";
import type { Consumer, EachBatchPayload, ResponseProcessorMessage } from "@repo/kafka";
import { getUserMessageCache } from "@repo/cache";

export class DumpConsumer {
    private consumer: Consumer;
    private isRunning = false;

    constructor() {
        this.consumer = kafka.consumer({
            groupId: "dump-group",
        });
    }

    async start() {
        if (this.isRunning) return;

        try {
            await this.consumer.connect();
            console.log("Kafka DumpConsumer: Connected and listening...");

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
                    const batchSize = 50;
                    const flushInterval = 3000;

                    console.log(
                        `DumpConsumer received ${messages.length} messages from Kafka`,
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
            console.error("Failed to start dump consumer:", error);
            throw error;
        }
    }

    async stop() {
        if (this.isRunning) {
            await this.consumer.disconnect();
            this.isRunning = false;
            console.log("Kafka DumpConsumer: Stopped successfully");
        }
    }

    private async processBatchItems(
        messages: (ResponseProcessorMessage & { offset: string })[],
    ) {
        if (messages.length === 0) return;

        console.log(`⚡ DumpConsumer processing batch of ${messages.length} messages...`);
        const startTime = Date.now();

        try {
            // Batch fetch user models (one query for all unique userIds)
            const userIds = [...new Set(messages.map((m) => m.userId))];
            const users = await client.user.findMany({
                where: { id: { in: userIds } },
                select: { id: true, modelId: true },
            });
            const modelByUser = new Map(
                users.map((u) => [u.id, u.modelId ?? "arcee-ai/trinity-mini:free"]),
            );

            // 1. Save messages to DB
            await client.message.createMany({
                data: messages.map((msg) => ({
                    id: msg.id,
                    messageRole: msg.role,
                    messageType: msg.type,
                    userId: msg.userId,
                    chatId: msg.chatId,
                    content: msg.content,
                    model: modelByUser.get(msg.userId) ?? "arcee-ai/trinity-mini:free",
                    createdAt: new Date(msg.createdAt),
                })),
                skipDuplicates: true,
            });

            // 2. Update cache per user
            const messagesByUser = new Map<string, typeof messages>();
            for (const msg of messages) {
                const existing = messagesByUser.get(msg.userId) ?? [];
                existing.push(msg);
                messagesByUser.set(msg.userId, existing);
            }

            await Promise.all(
                Array.from(messagesByUser.entries()).map(([userId, userMsgs]) => {
                    const cacheKey = `user:${userId}:msg`;
                    return getUserMessageCache().addMessage(
                        cacheKey,
                        userMsgs.map((m) => ({
                            id: m.id,
                            messageRole: m.role,
                            content: m.content,
                            createdAt: m.createdAt,
                        })),
                    );
                }),
            );

            // 3. Update token usage per user (total + daily)
            const tokensByUser = new Map<string, number>();
            for (const msg of messages) {
                const tokens = msg.tokens || 0;
                if (tokens > 0) {
                    tokensByUser.set(msg.userId, (tokensByUser.get(msg.userId) ?? 0) + tokens);
                }
            }

            if (tokensByUser.size > 0) {
                const now = new Date();
                const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
                const usersWithTokens = Array.from(tokensByUser.keys());

                // Fetch existing daily records for today in one query
                const existingDaily = await client.userDailyUsage.findMany({
                    where: { userId: { in: usersWithTokens }, date: today },
                    select: { id: true, userId: true },
                });
                const dailyByUser = new Map(existingDaily.map((r) => [r.userId, r.id]));

                await Promise.all([
                    // Total usage
                    ...Array.from(tokensByUser.entries()).map(([userId, tokens]) =>
                        client.userUsage.upsert({
                            where: { userId },
                            create: { userId, tokenConsumed: new Decimal(tokens) },
                            update: { tokenConsumed: { increment: tokens } },
                        }),
                    ),
                    // Daily usage
                    ...Array.from(tokensByUser.entries()).map(([userId, tokens]) => {
                        const existingId = dailyByUser.get(userId);
                        return existingId
                            ? client.userDailyUsage.update({
                                where: { id: existingId },
                                data: { tokenConsumed: { increment: tokens } },
                            })
                            : client.userDailyUsage.create({
                                data: { userId, date: today, tokenConsumed: new Decimal(tokens) },
                            });
                    }),
                ]);
            }

            const duration = Date.now() - startTime;
            console.log(`✅ DumpConsumer saved ${messages.length} messages to DB and cache (${duration}ms)`);
        } catch (e) {
            console.error("❌ DB batch write failed. Re-queuing...", e);

            const producer = getProducer("response");
            try {
                for (const msg of messages) {
                    const { offset, ...original } = msg;
                    await producer.publishMessage(original);
                }
                console.log(`🔄 Re-queued ${messages.length} messages to Kafka`);
            } catch (produceError) {
                console.error(
                    "🔥 CRITICAL: Failed to re-queue messages! Data loss possible.",
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
                groupId: "dump-group",
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

let DumpConsumerInstance: DumpConsumer | null = null;
export function getDumpConsumer(): DumpConsumer {
    if (!DumpConsumerInstance) {
        DumpConsumerInstance = new DumpConsumer();
    }
    return DumpConsumerInstance;
}
