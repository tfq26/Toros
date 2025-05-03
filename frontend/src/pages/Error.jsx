// src/pages/ErrorPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { when: "beforeChildren", staggerChildren: 0.2, duration: 0.5 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 10 },
    },
};

const ErrorPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        city = "Unknown",
        message = "An unexpected error occurred.",
        detailedMessage = null,
        errorMessages = [],
    } = location.state || {};

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Emoji / Illustration */}
            <motion.div
                variants={itemVariants}
                className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <img
                    src="/bull_emoji_03-512.webp"
                    alt="Bull Emoji"
                    className="h-24 w-24"
                />
            </motion.div>

            {/* Header */}
            <motion.h1
                variants={itemVariants}
                className="text-5xl font-bold text-red-600 dark:text-red-400 mb-2"
            >
                Error Code: {city}
            </motion.h1>

            {/* Main message */}
            <motion.p
                variants={itemVariants}
                className="text-xl text-gray-700 dark:text-gray-300 mb-4 text-center max-w-lg"
            >
                {message}
            </motion.p>

            {/* Detailed message */}
            {detailedMessage && (
                <motion.div
                    variants={itemVariants}
                    className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                >
                    <p className="text-sm italic text-gray-600 dark:text-gray-400">
                        <strong>Details:</strong> {detailedMessage}
                    </p>
                </motion.div>
            )}

            {/* Additional list */}
            {errorMessages.length > 0 && (
                <motion.div
                    variants={itemVariants}
                    className="mb-6 max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-4"
                >
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Additional Information:
                    </h2>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                        {errorMessages.map((err, idx) => (
                            <li key={idx}>{err}</li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* Back button */}
            <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="mt-4 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-lg focus:outline-none"
            >
                Back to Home
            </motion.button>
        </motion.div>
    );
};

export default ErrorPage;
