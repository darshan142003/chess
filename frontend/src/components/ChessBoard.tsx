import { type Color, type PieceSymbol, type Square } from "chess.js";
import { MOVE } from "../screens/Game";

export default function ChessBoard({
    color,
    from,
    board,
    socket,
    setFrom,
}: {
    board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
    socket: WebSocket;
    from: Square | null;
    setFrom: any;
    color: string;
}) {
    // Flatten board
    let squares = board.flat();

    // Flip board if player is black
    if (color === "black") {
        squares = [...squares].reverse();
    }

    return (
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
            {squares.map((square, i) => {
                // Compute square notation (a1, b1, ... h8)
                let file = i % 8;
                let rank = 8 - Math.floor(i / 8);

                if (color === "black") {
                    file = 7 - (i % 8);
                    rank = Math.floor(i / 8) + 1;
                }

                const squareRepresentation = (String.fromCharCode(97 + file) +
                    rank) as Square;

                return (
                    <div
                        key={i}
                        onClick={() => {
                            if (!from) {
                                setFrom(squareRepresentation);
                            } else {
                                const move = { from, to: squareRepresentation };
                                socket.send(
                                    JSON.stringify({
                                        type: MOVE,
                                        payload: { move, color },
                                    })
                                );
                                console.log(`${from} to ${squareRepresentation}`);
                                setFrom(null);
                            }
                        }}
                        className={`flex justify-center items-center ${(Math.floor(i / 8) + (i % 8)) % 2 === 0
                            ? "bg-[#739552]"
                            : "bg-[#EBECD0]"
                            }`}
                    >
                        {square ? (
                            <img
                                src={
                                    square.color === "w"
                                        ? `/w${square.type.toUpperCase()}.svg`
                                        : `/b${square.type.toUpperCase()}.svg`
                                }
                                alt=""
                            // className="w-10 h-10"
                            />
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
}
