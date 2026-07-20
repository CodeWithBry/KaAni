import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import ChatBotRouter from "./routes/chat-bot.js";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Frontend routes
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "ai.html"));
});
app.get("/ai.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "ai.html"));
});
app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/plan.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "plan.html"));
});
app.get("/health.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "health.html"));
});
app.get("/weather.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "weather.html"));
});
app.get("/farm.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "farm.html"));
});
app.get("/support.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "support.html"));
});

// API routes
app.use("/api/chat-bot/", ChatBotRouter);

export default app