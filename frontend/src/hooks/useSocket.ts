import { useEffect, useState } from "react";

const WS_URL = "ws://localhost:8080";

interface UserSocket extends WebSocket {
    userId?: number;
}

export const useSocket = () => {
    const [socket, setSocket] = useState<UserSocket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token"); // get JWT token
        if (!token) return; // don’t connect if not logged in

        const ws = new WebSocket(`${WS_URL}?token=${token}`) as UserSocket;

        ws.onopen = () => {
            console.log("connected");
            setSocket(ws);
        };

        ws.onclose = () => {
            console.log("disconnected");
            setSocket(null);
        };

        ws.onerror = (event) => {
            console.log("WebSocket error:", event);
        };

        return () => {
            ws.close();
        };
    }, []);

    return socket;
};
