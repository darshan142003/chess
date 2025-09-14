import { useSocket } from "../hooks/useSocket";
import ChessBoard from "../components/ChessBoard";
import { useEffect, useState } from "react";
import { Chess, type Square } from "chess.js";

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
                    console.log("Game initialised");
                    break;
                case MOVE:
                    chess.move(message.payload);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                {/* Chessboard */}
                <div className="w-[640px] h-[640px]">
                    <ChessBoard from={from} socket={socket} board={board} setFrom={setFrom} />
                </div>

                {/* Info panel */}
                <div className="flex justify-center">
                    <div className="flex flex-col items-center space-y-6">
                        {!started && <button
                            onClick={() => {
                                socket?.send(JSON.stringify({ type: INIT_GAME }));
                            }}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
                        >
                            Play Online
                        </button>}
                    </div>
                </div>
            </div>
        </div>
    );
}
