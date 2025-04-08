import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

const LoadingModal = ({
                          message = "Loading...",
                          description = "Please wait while we fetch the latest data.",
                          isLoading,
                      }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval = null;
        if (isLoading) {
            // Reset progress when loading starts
            setProgress(0);
            // Increment progress until it reaches 90%
            interval = setInterval(() => {
                setProgress((prev) => (prev < 90 ? prev + 10 : prev));
            }, 300);
        } else {
            // When not loading, set to 100%
            setProgress(100);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    return (
        <div className="fixed inset-0 bg-gray-950 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col justify-center items-center max-w-sm w-full animate__animated animate__fadeIn">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                    {message}
                </h2>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-600 dark:text-white mt-4">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default LoadingModal;
