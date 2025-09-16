export default function Moves({ moves }: { moves: string[] }) {
    return (
        <div className="flex flex-col h-full w-full text-white">
            {/* Title */}
            <h2 className="font-extrabold text-2xl mb-4 text-center tracking-wide">
                Moves
            </h2>

            {/* Moves list */}
            <div className="flex flex-col space-y-2 w-full text-center overflow-y-auto max-h-[500px] px-2">
                {moves.map((move, index) => {
                    // Expecting move format: "from e2 to e4"
                    const parts = move.split(" ");
                    return (
                        <div
                            key={index}
                            className={`px-3 py-1 rounded-lg shadow-md text-sm
                ${index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"} hover:bg-gray-600 transition`}
                        >
                            {parts.map((part, i) => {
                                if (part === "from" || part === "to") {
                                    return (
                                        <span key={i} className="font-bold text-yellow-400 mx-1">
                                            {part}
                                        </span>
                                    );
                                } else if (/^[a-h][1-8]$/.test(part)) {
                                    // This is a square like e2, e4
                                    return (
                                        <span key={i} className="font-semibold text-green-400 mx-1">
                                            {part}
                                        </span>
                                    );
                                } else {
                                    return <span key={i} className="mx-1">{part}</span>;
                                }
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
