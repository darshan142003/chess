import { useEffect, useRef, useState } from "react";

export default function Clock({
    isActive,
    initialTime = 600,
    label,
}: {
    isActive: boolean;
    initialTime?: number;
    label?: string;
}) {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isActive) {
            if (intervalRef.current === null) {
                intervalRef.current = window.setInterval(() => {
                    setTimeLeft((prev) => {
                        if (prev <= 0) {
                            clearInterval(intervalRef.current!);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        } else {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isActive]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div
            className={`flex items-center justify-between gap-2 px-3 py-1 w-[120px] rounded-lg text-sm font-bold shadow-md 
      ${isActive ? "bg-green-600 text-white" : "bg-gray-800 text-gray-200"}`}
        >
            {label && <span className="text-xs font-semibold">{label}</span>}
            <span>
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
        </div>
    );
}
