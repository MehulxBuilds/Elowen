import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { server_env as env } from "@repo/env"
import userRoutes from "./routes/user-routes.js";
const app = express();

const allowedOrigins = [env.WEB_APP_URL,].filter(
    (origin): origin is string => Boolean(origin),
);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    }),
);

app.use(cookieParser());
app.use(express.json());

app.get('/health', (req, res) => {
    res.send("All Good!")
})

app.use("/api/v1/user", userRoutes);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
