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
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("return from player 1");
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("Rturn from player 2");
            return;
        }
        try {
            this.board.move(move);
        }
        catch (e) {
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? "balack" : "white"
                }
            }));
            this.player2.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? "balack" : "white"
                }
            }));
            return;
        }
        console.log("ouside the move send");
        if (this.moveCount % 2 === 0) {
            console.log("inside themove send");
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        this.moveCount++;
    }
}
exports.Game = Game;
