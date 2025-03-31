// Background.jsx
import React from "react";

export default function Background() {
    return (
        <div className="absolute inset-0 bg-white dark:bg-gray-950">
            <svg
                className="absolute inset-0 w-full h-full opacity-[0.15] dark:opacity-[0.07]"
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
            >
                <pattern id="wavy-pattern" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                    <path
                        d="M0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-blue-500 dark:text-blue-400"
                    />
                </pattern>
                <rect width="100%" height="100%" fill="url(#wavy-pattern)"/>
            </svg>
            <div
                className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-rose-950/30 dark:via-gray-950 dark:to-emerald-900/30"/>
        </div>
    );
}
