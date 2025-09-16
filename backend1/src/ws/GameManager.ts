import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";

import { PrismaClient } from "@prisma/client";
import { Game } from "./Game";

interface UserSocket extends WebSocket {
    userId?: number;
}

export class GameManager {
    private prisma = new PrismaClient();
    private games: Game[];
    private pendingUser: UserSocket | null;
    private users: UserSocket[];
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: UserSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: UserSocket) {
        this.users = this.users.filter(user => user !== socket);
    }

    private addHandler(socket: UserSocket) {
        socket.on("message", async (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    const newGame = await this.prisma.game.create({
                        data: {
                            whitePlayerId: this.pendingUser.userId!,
                            blackPlayerId: socket.userId!,
                            fen: "start"
                        }
                    })
                    const game = new Game(this.pendingUser, socket, newGame.id);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }

            if (message.type === MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.payload);
                }
            }
        })
    }

}; 
