import React from "react";

const MatchTable = ({ matches, updateMatch }) => {
    const handleStatusChange = (match, newStatus) => {
        if (newStatus === "Complete") {
            // Prompt the user for scores
            const team1Score = parseInt(prompt(`Enter score for ${match.team1?.name || "Team 1"}:`), 10);
            const team2Score = parseInt(prompt(`Enter score for ${match.team2?.name || "Team 2"}:`), 10);

            if (!isNaN(team1Score) && !isNaN(team2Score)) {
                // Update match with entered scores
                updateMatch(match.id, team1Score, team2Score, newStatus);
            } else {
                alert("Invalid input. Please enter numeric values for the scores.");
            }
        } else {
            // Update match without prompting for scores
            updateMatch(match.id, match.team1Score || 0, match.team2Score || 0, newStatus);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Live Tournament Matches (Table View)</h2>
            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Team 1</th>
                    <th className="border border-gray-300 px-4 py-2">Team 2</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                    <th className="border border-gray-300 px-4 py-2">Score</th>
                </tr>
                </thead>
                <tbody>
                {matches.length > 0 ? (
                    matches.map((match) => (
                        <tr key={match.id}>
                            <td className="border border-gray-300 px-4 py-2">{match.team1?.name || "N/A"}</td>
                            <td className="border border-gray-300 px-4 py-2">{match.team2?.name || "N/A"}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {/* Dropdown for Status */}
                                <select
                                    value={match.status}
                                    onChange={(e) => handleStatusChange(match, e.target.value)}
                                    className="border rounded px-2 py-1"
                                >
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Complete">Complete</option>
                                </select>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {match.team1Score || 0} - {match.team2Score || 0}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td className="border border-gray-300 px-4 py-2 text-center" colSpan={4}>
                            No matches available.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default MatchTable;
