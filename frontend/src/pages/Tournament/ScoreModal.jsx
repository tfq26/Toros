import React, { useState, useEffect } from "react";

const ScoreModal = ({ isOpen, onClose, match, onSubmit }) => {
    if (!isOpen || !match) return null;

    const [team1Score, setTeam1Score] = useState(match.team1Score || 0);
    const [team2Score, setTeam2Score] = useState(match.team2Score || 0);
    const [status, setStatus] = useState(match.status || "Scheduled");

    /** ✅ Ensure scores update when the modal opens with a new match */
    useEffect(() => {
        setTeam1Score(match.team1Score || 0);
        setTeam2Score(match.team2Score || 0);
        setStatus(match.status || "Scheduled");
    }, [match]);

    /** ✅ Handle score validation */
    const handleScoreChange = (team, value) => {
        let newValue = parseInt(value, 10);
        if (isNaN(newValue)) newValue = 0;
        if (newValue <= 0) newValue = 0;
        if (newValue > 21) newValue = 21;

        if (team === "team1") setTeam1Score(newValue);
        if (team === "team2") setTeam2Score(newValue);
    };

    /** ✅ Handle submission */
    const handleSubmit = () => {
        if (!onSubmit) {
            console.error("❌ `onSubmit` function is undefined in ScoreModal!");
            return;
        }

        console.log("✅ Submitting Match Update from ScoreModal", match);
        onSubmit({
            ...match,
            team1Score,
            team2Score,
            status,
        });

        onClose(); // Close modal after submission
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-none bg-opacity-50 backdrop-blur-md z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 border border-gray-300 dark:border-gray-600">
                <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">
                    Update Match Score
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-300">
                    {match.team1?.name} vs {match.team2?.name}
                </p>

                {/* Team 1 Score */}
                <div className="mt-4">
                    <label className="block font-semibold text-gray-700 dark:text-gray-200">
                        {match.team1?.name} Score
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="21"
                        value={team1Score}
                        onChange={(e) => handleScoreChange("team1", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white dark:border-gray-500"
                    />
                </div>

                {/* Team 2 Score */}
                <div className="mt-4">
                    <label className="block font-semibold text-gray-700 dark:text-gray-200">
                        {match.team2?.name} Score
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="21"
                        value={team2Score}
                        onChange={(e) => handleScoreChange("team2", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white dark:border-gray-500"
                    />
                </div>

                {/* Match Status */}
                <div className="mt-4">
                    <label className="block font-semibold text-gray-700 dark:text-gray-200">
                        Match Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white dark:border-gray-500"
                    >
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Complete">Complete</option>
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-between">
                    <button
                        onClick={onClose}
                        className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Save Score
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScoreModal;
