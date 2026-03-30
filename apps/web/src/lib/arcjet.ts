import arcjet, { slidingWindow } from "@arcjet/next";
import { server_env } from "@repo/env";

const aj = arcjet({
    key: server_env.ARCJET_API!,
    rules: [
        slidingWindow({
            mode: "LIVE",
            characteristics: ["ip.src"],
            interval: 60,
            max: 10,
        }),
    ],
});

export default aj;
