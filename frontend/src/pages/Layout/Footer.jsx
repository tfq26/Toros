import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
    const [clicks, setClicks] = useState(0);
    const [showSecret, setShowSecret] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Effect to check for mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile(); // Check on initial render
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleClick = () => {
        const newCount = clicks + 1;
        setClicks(newCount);

        const requiredClicks = isMobile ? 3 : 5;

        if (newCount >= requiredClicks) {
            setShowSecret(true);
            setTimeout(() => {
                setShowSecret(false);
                setClicks(0);
            }, 5000); // Hide after 5 seconds
        }
    };

    // Animation variants for the container and text
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // Each child will animate 0.1s after the previous one
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };


    return (
        <footer className="w-full bg-muted/50 text-muted-foreground relative">
            <div className="max-w-auto mx-auto px-4 text-center py-4">
                <p
                    className="text-sm cursor-pointer select-none"
                    onClick={handleClick}
                    title="😉"
                >
                    &copy; {new Date().getFullYear()} Toros, Inc. Created with ❤️ by {"Taufeeq Ali"}
                </p>
            </div>

            <AnimatePresence>
                {showSecret && (
                    <motion.div
                        className="fixed inset-0 flex flex-col items-center justify-center bg-pink-50 dark:bg-rose-900 text-pink-800 dark:text-pink-100 p-6 z-[100] animate-pulse-bg"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                    >
                        <motion.h2 variants={itemVariants} className="text-2xl font-bold">
                            Hi my love 💖
                        </motion.h2>
                        <motion.p variants={itemVariants} className="mt-2 text-center max-w-md">
                            You found the secret! Just a little reminder that you mean the world to me.
                            I’m lucky every day to have you 💕
                        </motion.p>

                        {/* Floating hearts animation */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {[...Array(15)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute text-pink-500 animate-float-heart-v2"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        bottom: '-20px',
                                        fontSize: `${Math.random() * 1 + 0.5}rem`, // Vary size
                                        opacity: Math.random() * 0.5 + 0.5, // Vary opacity
                                        animationDelay: `${i * 0.4}s`,
                                        animationDuration: `${Math.random() * 4 + 5}s`
                                    }}
                                >
                                    ❤️
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </footer>
    );
}
