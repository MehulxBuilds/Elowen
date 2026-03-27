import { kafka, TOPICS } from "./client";
import type { Producer } from "kafkajs";
import { Prisma } from "@repo/db";

interface UserQueryMessage {
    id: string
}

export interface ResponseProcessorMessage {
    id: string,
}

export class ResponseProcessorProducer {
    private producer: Producer;
    private isConnected = false;

    constructor() {
        this.producer = kafka.producer();
    }

    async connect() {
        if (!this.isConnected) {
            await this.producer.connect();
            this.isConnected = true;
        }
    }

    async disconnect() {
        if (this.isConnected) {
            await this.producer.disconnect();
            this.isConnected = false;
        }
    }

    async publishPost(message: ResponseProcessorMessage): Promise<string> {
        await this.connect();

        const topic = TOPICS.RESPONSE_PROCESSOR;
        const partitionKey = message.id;

        try {
            await this.producer.send({
                topic,
                messages: [
                    {
                        key: partitionKey,
                        value: JSON.stringify(message),
                    },
                ],
            });

            return message?.id;
        } catch (error) {
            console.error("Failed to publish message:", error);
            throw error;
        }
    }
};

export class UserQueryProducer {
    private producer: Producer;
    private isConnected = false;

    constructor() {
        this.producer = kafka.producer();
    }

    async connect() {
        if (!this.isConnected) {
            await this.producer.connect();
            this.isConnected = true;
        }
    }

    async disconnect() {
        if (this.isConnected) {
            await this.producer.disconnect();
            this.isConnected = false;
        }
    }

    async publishPost(message: UserQueryMessage): Promise<string> {
        await this.connect();

        const topic = TOPICS.USER_QUERY;
        const partitionKey = message.id;

        try {
            await this.producer.send({
                topic,
                messages: [
                    {
                        key: partitionKey,
                        value: JSON.stringify(message),
                    },
                ],
            });

            return message?.id;
        } catch (error) {
            console.error("Failed to publish message:", error);
            throw error;
        }
    }
}

// Singleton instance
type ProducerMap = {
    query: UserQueryProducer,
    response: ResponseProcessorProducer
};

const producers: Partial<ProducerMap> = {};

export function getProducer<T extends keyof ProducerMap>(
    type: T
): ProducerMap[T] {
    if (!producers[type]) {
        switch (type) {
            case "query":
                producers[type] = new UserQueryProducer() as ProducerMap[T];
                break;
            case "response":
                producers[type] = new ResponseProcessorProducer() as ProducerMap[T];
                break;
        }
    }

    return producers[type]!;
};