import React, { useState } from "react";
import { useRouteError, useNavigate, useLocation, isRouteErrorResponse } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.2 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

/**
 * ✨ A safe JSON.stringify function that handles complex objects and circular references
 * without crashing the entire component.
 */
function safeJsonStringify(obj) {
    if (obj === undefined || obj === null) {
        return '"No error details available."';
    }
    const cache = new Set();
    try {
        return JSON.stringify(
            obj,
            (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (cache.has(value)) return '[Circular Reference]';
                    cache.add(value);
                }
                return value;
            },
            2
        );
    } catch (e) {
        return '"Could not stringify the error object."';
    }
}


export default function ErrorPage() {
    const navigate = useNavigate();
    const [showRaw, setShowRaw] = useState(false);

    // ✨ This logic safely gets an error from ANY source without crashing
    const routeError = useRouteError();
    const location = useLocation();
    const navigatedError = location.state?.error;
    const error = routeError || navigatedError;

    // ✨ Safely parse details from the error object, providing defaults
    let errorCode = "Error";
    let message = "An unexpected error occurred.";
    let detailedMessage = null;

    if (error) {
        if (isRouteErrorResponse(error)) {
            errorCode = error.status || "Routing Error";
            message = error.statusText || "The requested page could not be found.";
        } else if (error instanceof Error) {
            errorCode = error.name || "Exception";
            message = error.message || message;
        }
        // Check for custom properties we might have added
        errorCode = error.city || errorCode;
        message = error.message || message; // error.message is often the most useful
        detailedMessage = error.detailed || error.detailedMessage || null;
    }

    const rawError = safeJsonStringify(error);

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                variants={itemVariants}
                className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <img src="/bull_emoji_03-512.webp" alt="Bull Emoji" className="h-24 w-24" />
            </motion.div>

            <motion.h1
                variants={itemVariants}
                className="text-5xl font-bold text-red-600 dark:text-red-400 mb-2"
            >
                {errorCode}
            </motion.h1>

            <motion.p
                variants={itemVariants}
                className="text-xl text-gray-700 dark:text-gray-300 mb-4 text-center max-w-lg"
            >
                {message}
            </motion.p>

            {detailedMessage && (
                <motion.div
                    variants={itemVariants}
                    className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow w-full max-w-lg"
                >
                    <p className="text-sm italic text-gray-600 dark:text-gray-400">
                        <strong>Details:</strong> {detailedMessage}
                    </p>
                </motion.div>
            )}

            <motion.button
                variants={itemVariants}
                onClick={() => setShowRaw(prev => !prev)}
                className="mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
            >
                {showRaw ? "Hide" : "Show"} Raw Technical Details
            </motion.button>

            {showRaw && (
                <motion.pre
                    variants={itemVariants}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="w-full max-w-3xl overflow-auto bg-black text-green-400 text-sm p-4 rounded-lg shadow"
                >
                    {rawError}
                </motion.pre>
            )}

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
}