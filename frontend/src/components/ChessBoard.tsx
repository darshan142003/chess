import { Chess, type Color, type PieceSymbol, type Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";


export default function ChessBoard({ chess, setBoard, board, socket }: {
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
    setBoard: any,
    chess: Chess
}) {

    const [from, setFrom] = useState<null | Square>(null);

    return (
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
            {board.flat().map((square, i) => {
                const squareRepresentation = String.fromCharCode(97 + (i % 8)) + (8 - Math.floor(i / 8)) as Square;

                return (
                    <div
                        key={i}
                        onClick={() => {
                            if (!from) {
                                setFrom(squareRepresentation);
                            } else {

                                const move = { from, to: squareRepresentation };

                                const result = chess.move(move);

                                if (result) {
                                    setBoard(chess.board());
                                    socket.send(JSON.stringify({
                                        type: MOVE,
                                        payload: { move }
                                    }));
                                    setFrom(null);
                                    setBoard(chess.board())
                                    console.log(`${from} to ${squareRepresentation}`)
                                }

                            }
                        }}
                        className={`flex justify-center items-center 
              ${(Math.floor(i / 8) + (i % 8)) % 2 === 0 ? 'bg-[#739552]' : 'bg-[#EBECD0]'}`}
                    >
                        {square ? square.type : ""}
                    </div>
                );
            })}

        </div >
    );
}
