import { Kafka, logLevel } from "kafkajs";
import { server_env as env } from "@repo/env"

export const kafka = new Kafka({
    clientId: "console-me",
    brokers: (env.KAFKA_BROKER || "localhost:9092").split(","),
    logLevel: logLevel.ERROR,
    retry: {
        initialRetryTime: 100,
        retries: 8,
    },
});

// Kafka Topics
export const TOPICS = {
    USER_QUERY: "user-query",
    RESPONSE_PROCESSOR: "response-processing",
} as const;

// Topic configurations
export const TOPIC_CONFIGS = {
    [TOPICS.USER_QUERY]: {
        numPartitions: 1,
        replicationFactor: 1,
    },
    [TOPICS.RESPONSE_PROCESSOR]: {
        numPartitions: 1,
        replicationFactor: 1,
    },
};