import React, { useState, useEffect } from "react";

export default function Footer() {
    const [clicks, setClicks] = useState(0);
    const [showSecret, setShowSecret] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    const handleClick = () => {
        const newCount = clicks + 1;
        setClicks(newCount);
        if (newCount === 5) {
            setShowSecret(true);
            setTimeout(() => {
                setFadeOut(true);
            }, 4000); // Start fading out after 4s
            setTimeout(() => {
                setShowSecret(false);
                setFadeOut(false);
                setClicks(0); // Reset clicks
            }, 5000); // Fully hide after 5s
        }
    };

    return (
        <footer className="w-full bg-emerald-100 dark:bg-black text-gray-400 py-18 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 text-center space-y-2">
                <p
                    className="text-sm cursor-pointer select-none"
                    onClick={handleClick}
                    title="😉"
                >
                    &copy; {new Date().getFullYear()} Toros, Inc.
                </p>
            </div>

            {showSecret && (
                <div
                    className={`absolute inset-0 flex flex-col items-center justify-center bg-pink-50 dark:bg-rose-900 text-pink-800 dark:text-pink-100 p-6 z-50 transition-opacity duration-1000 ${
                        fadeOut ? 'opacity-0' : 'opacity-100'
                    }`}
                >
                    <h2 className="text-2xl font-bold">Hi love 💖</h2>
                    <p className="mt-2 text-center max-w-md">
                        You found the secret! Just a little reminder that you mean the world to me.
                        I’m lucky every day to have you 💕
                    </p>

                    {/* Floating hearts */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(7)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute text-pink-500 text-xl animate-float-heart"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    bottom: '0%',
                                    animationDelay: `${i * 0.4}s`
                                }}
                            >
                                ❤️
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </footer>
    );
}
