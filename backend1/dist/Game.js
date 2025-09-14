"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Chess_js_1 = require("Chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess_js_1.Chess();
        this.startTime = new Date();
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
    }
}
exports.Game = Game;
