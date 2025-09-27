import React, { useState, useCallback, useEffect } from "react";
import { useRouteError, useNavigate, useLocation, isRouteErrorResponse } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useError } from "@/contexts/ErrorContext";

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

/**
 * ErrorPage component that handles all types of errors in the application
 * @param {Object} props - Component props
 * @param {Error|Object} [props.error] - The error object
 * @param {Function} [props.onRetry] - Callback function to retry the failed operation
 */
const ErrorPage = ({ error: propError, onRetry }) => {
    // Make these hooks optional with try-catch to handle cases where they're used outside their providers
    let navigate = () => console.warn('Navigate function not available');
    let location = { pathname: '/' };
    let routeError = null;
    
    try {
        // Only use these hooks if we're inside a Router
        const nav = useNavigate();
        const loc = useLocation();
        const rError = useRouteError();
        navigate = nav;
        location = loc;
        routeError = rError;
    } catch (e) {
        console.debug('Router context not available, using fallback navigation');
    }
    
    // Handle ErrorContext more gracefully
    let contextError = null;
    let setError = () => {}; // Default no-op function
    try {
        const { error, setError: setErrorFromContext } = useError?.() || {};
        contextError = error;
        setError = setErrorFromContext || setError;
    } catch (e) {
        console.debug('ErrorContext not available, using fallback error handling');
    }

    const [showRaw, setShowRaw] = useState(false);
    
    // Get error from props, route, or context
    const navigatedError = location.state?.error;
    const error = propError || routeError || navigatedError || contextError || {};
    
    // Clear the error from context when component unmounts
    useEffect(() => {
        return () => setError(null);
    }, [setError]);

    // ✨ Safely parse details from the error object, providing defaults
    let errorCode = error?.status || error?.code || error?.statusCode || "Error";
    let message = error?.message || error?.statusText || "An unexpected error occurred.";
    let detailedMessage = error?.detailed || error?.details || error?.response?.data?.message || null;

    // Handle specific error types
    if (isRouteErrorResponse(error)) {
        errorCode = error.status || "Routing Error";
        message = error.statusText || "The requested page could not be found.";
        detailedMessage = detailedMessage || `The server responded with status ${error.status}`;
    } else if (error instanceof Error) {
        errorCode = error.name || "Exception";
        message = error.message || message;
    }

    const rawError = safeJsonStringify(error);

    const handleRetry = useCallback(() => {
        // Clear the error from context
        setError(null);
        
        if (onRetry) {
            onRetry();
        } else {
            // Default behavior: go back to home
            navigate('/', { replace: true });
        }
    }, [onRetry, navigate, setError]);

    const handleGoHome = useCallback(() => {
        // Clear the error from context when navigating home
        setError(null);
        navigate('/', { replace: true });
    }, [navigate, setError]);

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
                <img 
                    src="/bull_emoji_03-512.webp" 
                    alt="Bull Emoji" 
                    className="h-24 w-24" 
                    onError={(e) => {
                        // Fallback if image fails to load
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTEgMThoMnYtMmgtdjJ6bTEuNjEtMTMuNTRjLjQzLS4zNyAxLjA0LS4zNSAxLjQyLjA4Yy4zNy40My4zNSAxLjA0LS4wOCAxLjQyYy0xLjA1LjkxLTEuNjcgMi4xLTEuNzIgMy4zM0gxM3YyaC0ydi0uN2MwLS43LjE2LTEuMzkuNDMtMmgwYy4wMS0uMDEuMDItLjAzLjAzLS4wNGMxLjA5LS43OCAxLjU0LTIuMjQgMS4wNS0zLjVjLS4yNS0uNjQtLjc1LTEuMTYtMS4zOS0xLjQ2Yy0uNjQtLjMtMS4zNS0uMzUtMS45OS0uMTR6Ii8+PC9zdmc+';
                    }}
                />
            </motion.div>

            <motion.h1
                variants={itemVariants}
                className="text-5xl font-bold text-red-600 dark:text-red-400 mb-2"
            >
                {errorCode}
            </motion.h1>

            <motion.div
                variants={itemVariants}
                className="text-xl text-gray-700 dark:text-gray-300 mb-4 text-center max-w-lg"
            >
                {message}
                {detailedMessage && (
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {detailedMessage}
                    </div>
                )}
            </motion.div>

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

            <motion.div 
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
                variants={itemVariants}
            >
                <Button 
                    onClick={handleGoHome}
                    variant="default"
                    className="w-full sm:w-auto"
                >
                    Go Home
                </Button>
                
                {(onRetry || errorCode !== '404') && (
                    <Button
                        onClick={handleRetry}
                        variant={onRetry ? 'secondary' : 'outline'}
                        className="w-full sm:w-auto"
                    >
                        {onRetry ? 'Try Again' : 'Reload Page'}
                    </Button>
                )}
                
                {process.env.NODE_ENV === 'development' && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowRaw(!showRaw)}
                        className="mt-2 sm:mt-0"
                    >
                        {showRaw ? 'Hide Details' : 'Show Details'}
                    </Button>
                )}
            </motion.div>
            
            {showRaw && (
                <motion.div 
                    className="mt-6 w-full max-w-2xl overflow-auto bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-xs"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <pre className="whitespace-pre-wrap break-words">
                        {rawError}
                    </pre>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ErrorPage;