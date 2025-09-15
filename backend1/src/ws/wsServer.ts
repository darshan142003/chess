import { WebSocket, WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import jwt from "jsonwebtoken";

interface UserSocket extends WebSocket {
    userId?: number;
}

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on('connection', (ws: UserSocket, req) => {
    const token = new URL(req.url!, "http://localhost").searchParams.get("token");

    if (!token) {
        ws.close();
        return;
    }

    try {
        const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
        ws.userId = payload.userId;
        console.log(`User ${ws.userId} connected`);

        // Add user to game manager now that we know the userId
        gameManager.addUser(ws);

        // Clean up on disconnect
        ws.on("close", () => gameManager.removeUser(ws));
    } catch (err) {
        ws.close();
    }
});