"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Chess_js_1 = require("Chess.js");
const messages_1 = require("./messages");
const client_1 = require("@prisma/client");
class Game {
    constructor(player1, player2, gameId) {
        this.prisma = new client_1.PrismaClient();
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess_js_1.Chess();
        this.startTime = new Date();
        this.gameId = gameId;
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        return __awaiter(this, void 0, void 0, function* () {
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
                        type: messages_1.INVALID_MOVE,
                        payload: move
                    }));
                    return;
                }
                // Valid move → broadcast to both players
                this.player1.send(JSON.stringify({
                    type: messages_1.MOVE,
                    payload: move
                }));
                this.player2.send(JSON.stringify({
                    type: messages_1.MOVE,
                    payload: move
                }));
                yield this.prisma.move.create({
                    data: {
                        gameId: this.gameId,
                        from: move.from,
                        to: move.to
                    }
                });
                this.moveCount++;
                // Check game over
                if (this.board.isGameOver()) {
                    const winner = this.board.turn() === 'w' ? "black" : "white";
                    this.player1.send(JSON.stringify({
                        type: messages_1.GAME_OVER,
                        payload: { winner }
                    }));
                    this.player2.send(JSON.stringify({
                        type: messages_1.GAME_OVER,
                        payload: { winner }
                    }));
                }
            }
            catch (e) {
                console.log("Invalid move:", move);
                socket.send(JSON.stringify({
                    type: "INVALID_MOVE",
                    payload: move
                }));
                return;
            }
        });
    }
}
exports.Game = Game;
