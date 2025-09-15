export default function Moves({ moves }: { moves: string[] }) {
    return (
        <div className="flex flex-col h-full w-full text-white">
            {/* Title centered at the top */}
            <h2 className="font-extrabold text-3xl mb-4 text-center">
                Moves
            </h2>

            {/* Moves list */}
            <div className="flex flex-col space-y-2 w-full text-center overflow-y-auto max-h-[500px]">
                {moves.map((move, index) => (
                    <div key={index}>{move}</div>
                ))}
            </div>
        </div>
    );
}
