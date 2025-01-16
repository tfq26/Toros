import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { statusCode = 500, message = "An unexpected error occurred." } = location.state || {};

    return (
        <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-red-500">Error {statusCode}</h1>
            <p className="text-lg mt-4">{message}</p>
            <button
                className="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => navigate("/")}
            >
                Back to Home
            </button>
        </div>
    );
};

export default ErrorPage;
