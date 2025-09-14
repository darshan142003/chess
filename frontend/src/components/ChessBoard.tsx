import { type Color, type PieceSymbol, type Square } from "chess.js";
import { MOVE } from "../screens/Game";

export default function ChessBoard({ from, board, socket, setFrom }: {
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
    from: Square | null;
    setFrom: any;
}) {

    // const [from, setFrom] = useState<null | Square>(null);

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

                                // const result = chess.move(move);


                                // setBoard(chess.board());
                                socket.send(JSON.stringify({
                                    type: MOVE,
                                    payload: { move }
                                }));
                                console.log(`${from} to ${squareRepresentation}`)
                                setFrom(null);
                            }
                        }}
                        className={`flex justify-center items-center 
              ${(Math.floor(i / 8) + (i % 8)) % 2 === 0 ? 'bg-[#739552]' : 'bg-[#EBECD0]'}`}
                    >
                        {square ? (
                            <img src={square.color === "w" ? `/w${square.type.toUpperCase()}.svg` : `/b${square.type.toUpperCase()}.svg`}>
                            </img>
                        ) : null}
                    </div>
                );
            })}

        </div >
    );
}
