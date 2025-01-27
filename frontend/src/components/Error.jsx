import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Destructure error details from state or use defaults
    const {
        statusCode = 500,
        message = "An unexpected error occurred.",
        detailedMessage = null,
        errorMessages = [], // Array of error messages for detailed display
    } = location.state || {};

    return (
        <div className="text-center py-20">
            {/* Add SVG */}
            <div className="flex justify-center mb-6">
                <img
                    src="/bull_emoji_03-512.webp"
                    alt="Bull Emoji"
                    className="h-24 w-24"
                />
            </div>

            <h1 className="text-4xl font-bold text-red-500">Error {statusCode}</h1>

            {/* Display standard message */}
            <p className="text-lg mt-4">{message}</p>

            {/* Display detailed error message if available */}
            {detailedMessage && (
                <div className="mt-2 text-sm text-gray-600 italic">
                    <p><strong>Details:</strong></p>
                    <p>{detailedMessage}</p>
                </div>
            )}

            {/* Display list of error messages if provided */}
            {errorMessages.length > 0 && (
                <div className="mt-4 text-left max-w-lg mx-auto">
                    <h2 className="text-lg font-semibold text-gray-700">Error Details:</h2>
                    <ul className="list-disc pl-5">
                        {errorMessages.map((err, index) => (
                            <li key={index} className="text-sm text-gray-600">
                                {err}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Back to Home Button */}
            <button
                className="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                onClick={() => navigate("/")}
            >
                Back to Home
            </button>
        </div>
    );
};

export default ErrorPage;
