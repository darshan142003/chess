import { WebSocket } from "ws";
import { Chess } from "Chess.js"
import { GAME_OVER, INIT_GAME, INVALID_MOVE, MOVE } from "./messages";
import { PrismaClient } from "@prisma/client";
export class Game {
    private prisma = new PrismaClient();
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private startTime: Date;
    private moveCount = 0;
    private gameId: number;

    constructor(player1: WebSocket, player2: WebSocket, gameId: number) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.gameId = gameId;
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }))
    }

    async makeMove(socket: WebSocket, move: { from: string; to: string }) {

        try {
            // Enforce turn order
            if (this.moveCount % 2 === 0 && socket !== this.player1) {
                console.log("Not player 1's turn");
                return;
            }
            if (this.moveCount % 2 === 1 && socket !== this.player2) {
                console.log("Not player 2's turn");
                return;
            }

            const result = this.board.move(move);
            // if (!result) throw new Error("Invalid move");

            // Invalid move
            if (!result) {
                console.log("Invalid move:", move);
                socket.send(JSON.stringify({
                    type: INVALID_MOVE,
                    payload: move
                }));
                return;
            }

            // Valid move → broadcast to both players
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));

            await this.prisma.move.create({
                data: {
                    gameId: this.gameId,
                    from: move.from,
                    to: move.to
                }
            })
            this.moveCount++;

            // Check game over
            if (this.board.isGameOver()) {
                const winner = this.board.turn() === 'w' ? "black" : "white";
                this.player1.send(JSON.stringify({
                    type: GAME_OVER,
                    payload: { winner }
                }));
                this.player2.send(JSON.stringify({
                    type: GAME_OVER,
                    payload: { winner }
                }));
            }
        } catch (e) {
            console.log("Invalid move:", move);
            socket.send(JSON.stringify({
                type: "INVALID_MOVE",
                payload: move
            }));
            return;
        }
    }
}