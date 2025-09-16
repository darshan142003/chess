import { useSocket } from "../hooks/useSocket";
import ChessBoard from "../components/ChessBoard";
import { useEffect, useState } from "react";
import { Chess, type Square } from "chess.js";

import Moves from "../components/Moves";
import Clock from "../components/Clock";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const INVALID_MOVE = "invalid_move";

export const pieceSymbols: Record<string, string> = {
    p: "♙", r: "♖", n: "♘", b: "♗", q: "♕", k: "♔",
    P: "♟︎", R: "♜", N: "♞", B: "♝", Q: "♛", K: "♚"
};

export default function Game() {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false);
    const [from, setFrom] = useState<Square | null>(null);
    const [moves, setMoves] = useState<string[]>([]);
    const [myColor, setMyColor] = useState("");
    const [whiteTurn, setWhiteTurn] = useState(true);
    const [blackTurn, setBlackTurn] = useState(false);

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);

            switch (message.type) {
                case INIT_GAME:
                    const newChess = new Chess();
                    setChess(newChess);
                    setBoard(newChess.board());
                    setStarted(true);
                    setMyColor(message.payload.color);
                    console.log("Game initialised");
                    break;

                case MOVE:
                    chess.move(message.payload.move);
                    const fromSquare = message.payload.move.from;
                    const toSquare = message.payload.move.to;
                    // const piece = message.payload.move.piece;
                    setMoves((prev) => [
                        ...prev,
                        `${message.payload.move.from} to ${message.payload.move.to}`,
                    ]);
                    setBoard(chess.board());

                    if (message.payload.color === "white") {
                        setWhiteTurn(false);
                        setBlackTurn(true);
                    } else {
                        setBlackTurn(false);
                        setWhiteTurn(true);
                    }
                    console.log("Move Made");
                    break;

                case GAME_OVER:
                    console.log("Game Over");
                    break;

                case INVALID_MOVE:
                    setFrom(null); // reset the selection
                    break;

                default:
                    break;
            }
        };
    }, [socket, chess]);

    if (!socket) return <div>Connecting...</div>;

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-gray-900 text-white">
            <div className="flex gap-8">
                {/* Left side (Board + Clocks) */}
                <div className="flex flex-col items-center">
                    {/* Clocks only visible after game started */}
                    {started && myColor === "white" && (
                        <Clock isActive={blackTurn} label="Black" />
                    )}
                    {started && myColor === "black" && (
                        <Clock isActive={whiteTurn} label="White" />
                    )}

                    {/* Board always visible */}
                    <div className="w-[640px] h-[640px] shadow-lg border-2 border-gray-700">
                        <ChessBoard
                            color={myColor}
                            board={board}
                            socket={socket}
                            from={from}
                            setFrom={setFrom}
                        />
                    </div>

                    {started && myColor === "white" && (
                        <Clock isActive={whiteTurn} label="White" />
                    )}
                    {started && myColor === "black" && (
                        <Clock isActive={blackTurn} label="Black" />
                    )}
                </div>

                {/* Right side (Info panel) */}
                <div className="flex flex-col h-[640px] w-[280px] bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                    {!started ? (
                        <div className="flex flex-col justify-center items-center flex-1 space-y-6">
                            <button
                                onClick={() => {
                                    socket?.send(JSON.stringify({ type: INIT_GAME }));
                                }}
                                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
                            >
                                Play Online
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col flex-1 p-4 h-full w-full">
                            <div className="flex-1 overflow-y-auto bg-gray-900 rounded-md ">
                                <Moves moves={moves} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
