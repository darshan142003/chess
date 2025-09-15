import { useEffect, useRef, useState } from "react";

export default function Clock({ myTurn }: { myTurn: boolean }) {
    const [timeLeft, setTimeLeft] = useState(600);

    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (myTurn) {
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
    }, [myTurn]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="text-white font-extrabold text-3xl">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
    );
}
