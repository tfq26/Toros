import React from "react";

const MatchTable = ({ matches, updateMatch }) => {
    if (!updateMatch) {
        console.error("❌ `updateMatch` function is missing in MatchTable!");
    }

    const handleScoreChange = (match, team, value) => {
        const newScore = value === "" ? "" : parseInt(value, 10);
        if (isNaN(newScore) || newScore < 0) return; // Prevent invalid scores

        const updatedMatch = { ...match };
        if (team === "team1") {
            updatedMatch.team1Score = newScore;
        } else {
            updatedMatch.team2Score = newScore;
        }
        updateMatch(updatedMatch.id, updatedMatch.team1Score, updatedMatch.team2Score, updatedMatch.status);
    };

    const handleStatusChange = (match, newStatus) => {
        updateMatch(match.id, match.team1Score ?? 0, match.team2Score ?? 0, newStatus);
    };

    return (
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <div className="overflow-x-auto rounded-lg w-full flex-grow min-h-[600px]">
                <table className="table-auto border-collapse border border-gray-300 w-full dark:border-gray-600">
                    <thead>
                    <tr className="bg-emerald-600 dark:bg-emerald-950 text-white uppercase text-lg font-semibold">
                        <th key="team1" className="border border-emerald-800 px-6 py-3 text-center dark:border-emerald-900">
                            Team 1
                        </th>
                        <th key="score1" className="border border-emerald-800 px-6 py-3 text-center dark:border-emerald-900">
                            Score
                        </th>
                        <th key="team2" className="border border-emerald-800 px-6 py-3 text-center dark:border-emerald-900">
                            Team 2
                        </th>
                        <th key="score2" className="border border-emerald-800 px-6 py-3 text-center dark:border-emerald-900">
                            Score
                        </th>
                        <th key="status" className="border border-emerald-800 px-6 py-3 text-center dark:border-emerald-900">
                            Status
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {matches.length > 0 ? (
                        matches.map((match, index) => (
                            <tr
                                key={match.id || index}
                                className="odd:bg-emerald-50 even:bg-emerald-100 hover:bg-emerald-200 transition dark:odd:bg-green-800 dark:even:bg-green-700 dark:hover:bg-green-600"
                            >
                                {/* Team 1 */}
                                <td className="border border-gray-300 px-6 py-3 text-center dark:border-green-900 dark:text-gray-200">
                                    {match.team1?.player1?.name ?? "N/A"} & {match.team1?.player2?.name ?? "N/A"}
                                </td>

                                {/* Team 1 Score Input */}
                                <td className="border border-gray-300 px-6 py-3 text-center dark:border-green-900">
                                    <input
                                        type="number"
                                        min="0"
                                        max="21"
                                        value={match.team1Score ?? ""}
                                        onChange={(e) => handleScoreChange(match, "team1", e.target.value)}
                                        className="w-16 p-1 border rounded dark:bg-gray-900 dark:text-white text-center"
                                    />
                                </td>

                                {/* Team 2 */}
                                <td className="border border-gray-300 px-6 py-3 text-center dark:border-green-900 dark:text-gray-200">
                                    {match.team2?.player1?.name ?? "N/A"} & {match.team2?.player2?.name ?? "N/A"}
                                </td>

                                {/* Team 2 Score Input */}
                                <td className="border border-gray-300 px-6 py-3 text-center dark:border-green-900">
                                    <input
                                        type="number"
                                        min="0"
                                        max="21"
                                        value={match.team2Score ?? ""}
                                        onChange={(e) => handleScoreChange(match, "team2", e.target.value)}
                                        className="w-16 p-1 border rounded dark:bg-gray-900 dark:text-white text-center"
                                    />
                                </td>

                                {/* Match Status Dropdown */}
                                <td className="border border-gray-300 px-6 py-3 text-center dark:border-green-900">
                                    <select
                                        value={match.status}
                                        onChange={(e) => handleStatusChange(match, e.target.value)}
                                        className="bg-white dark:bg-gray-900 dark:text-white border rounded px-2 py-1"
                                    >
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Complete">Complete</option>
                                    </select>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-gray-600 dark:text-gray-300 py-6">
                                No matches found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MatchTable;
