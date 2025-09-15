"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const wss = new ws_1.WebSocketServer({ port: 8080 });
const gameManager = new GameManager_1.GameManager();
wss.on('connection', (ws, req) => {
    const token = new URL(req.url, "http://localhost").searchParams.get("token");
    if (!token) {
        ws.close();
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        ws.userId = payload.userId;
        console.log(`User ${ws.userId} connected`);
        // Add user to game manager now that we know the userId
        gameManager.addUser(ws);
        // Clean up on disconnect
        ws.on("close", () => gameManager.removeUser(ws));
    }
    catch (err) {
        ws.close();
    }
});
