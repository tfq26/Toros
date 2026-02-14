// src/components/LoadingModal.jsx
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Progress } from "@/components/ui/progress.jsx";

export default function LoadingModal({
                                         message = "Loading...",
                                         description = "Please wait while we fetch the latest data.",
                                         isLoading,
                                     }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;
        if (isLoading) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress((prev) => (prev < 90 ? prev + 10 : prev));
            }, 300);
        } else {
            setProgress(100);
            setTimeout(() => setProgress(0), 500);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    return (
        <AnimatePresence>
            {isLoading && (
                // full‐screen overlay
                <motion.div
                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                >
                    {/* centered card */}
                    <motion.div
                        key="modal"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 30, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-[90vw] sm:max-w-sm mx-auto p-4 sm:p-6"
                    >
                        {/* Title */}
                        <motion.h2
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center"
                        >
                            {message}
                        </motion.h2>

                        {/* Animated progress bar container */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "easeOut", duration: 0.3 }}
                            className="w-full mb-4"
                        >
                            <Progress value={progress} className="h-2 rounded-full" />
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center"
                        >
                            {description}
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
