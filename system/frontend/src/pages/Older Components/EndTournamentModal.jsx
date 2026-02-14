import React from "react";
import { useNavigate } from "react-router-dom";

const EndTournamentModal = ({ isOpen, onClose, endTournament }) => {
    const navigate = useNavigate();

    const handleConfirm = async () => {
        try {
            await endTournament(); // call the function to end the tournament
            onClose(); // close the modal
            // Navigate back to the tournament list
            navigate("/tournament/my");
        } catch (error) {
            console.error("Error ending tournament:", error);
            alert("An error occurred while ending the tournament.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-lg flex justify-center items-center z-50 transition">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full animate__animated animate__fadeIn relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-xl font-bold"
                >
                    ❌
                </button>

                <h2 className="text-xl font-bold mb-4 text-center">End Tournament?</h2>
                <p className="mb-6 text-center">
                    Are you sure you want to end the tournament? This action cannot be undone.
                </p>

                <div className="flex justify-around">
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        Yes, End Tournament
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EndTournamentModal;
