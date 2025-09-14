import { useNavigate } from "react-router-dom"

export default function Landing() {
    const navigate = useNavigate();
    return (
        <div className="flex justify-center pt-15 h-screen w-screen">
            <div className="grid grid-col-1 gap-4  md:grid-cols-2 gap-4">

                <div className="w-[400px]">
                    <img src={"chessBoard.png"} />
                </div>

                <div className="flex justify-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="font-extrabold text-3xl text-white">
                            Best Chess game to play !!
                        </div>
                        <button onClick={() => navigate("/game")} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                            Play Online
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
