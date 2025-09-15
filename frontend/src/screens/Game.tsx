import { useSocket } from "../hooks/useSocket";
import ChessBoard from "../components/ChessBoard";
import { useEffect, useState } from "react";
import { Chess, type Square } from "chess.js";

import Moves from "../components/Moves";
import CLock from "../components/Clock";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const INVALID_MOVE = "invalid_move";

export default function Game() {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false);
    const [from, setFrom] = useState<Square | null>(null);
    const [moves, setMoves] = useState<string[]>([]);
    const [myTurn, setMyTurn] = useState(false);
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
                    message.payload.color === "white" ? setMyTurn(true) : setMyTurn(false);
                    console.log("Game initialised");
                    break;
                case MOVE:
                    chess.move(message.payload);
                    setMoves((prev) => [...prev, `from ${message.payload.from} to ${message.payload.to}`])
                    setBoard(chess.board());
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
        <div className="flex justify-center items-start pt-10 h-screen w-screen bg-gray-900">
            <div className="flex gap-10">
                {/* Chessboard */}
                <div className="w-[640px] h-[640px]">
                    <ChessBoard from={from} socket={socket} board={board} setFrom={setFrom} />

                </div>

                {/* Info panel */}
                <div className={`flex  h-[640px] w-[320px] ${started ? "bg-slate-800" : ""}`}>

                    {!started && (
                        <div className="flex flex-col justify-center items-center space-y-6 h-full w-full">
                            <button
                                onClick={() => {
                                    socket?.send(JSON.stringify({ type: INIT_GAME }));
                                }}
                                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition flex "
                            >
                                Play Online
                            </button>
                        </div>
                    )}
                    {started && (
                        <div >
                            <CLock myTurn={myTurn} />
                            <div className="flex justify-center w-full"><Moves moves={moves} /> </div>
                        </div>

                    )}

                </div>
            </div>
        </div>

    );
}
