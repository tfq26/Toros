import React from "react";

const MatchTable = ({ matches, updateMatch }) => {
    const handleStatusChange = (match, newStatus) => {
        if (newStatus === "Complete") {
            // Prompt the user for scores when the status is Complete
            const team1ScoreInput = prompt(`Enter score for ${match.team1?.name || "Team 1"}:`);
            const team2ScoreInput = prompt(`Enter score for ${match.team2?.name || "Team 2"}:`);
            const team1Score = parseInt(team1ScoreInput, 10);
            const team2Score = parseInt(team2ScoreInput, 10);

            if (!isNaN(team1Score) && !isNaN(team2Score)) {
                updateMatch(match.id, team1Score, team2Score, newStatus);
            } else {
                alert("Invalid input. Please enter numeric values for the scores.");
            }
        } else {
            // For statuses other than "Complete", update match without modifying scores
            updateMatch(match.id, match.team1Score || 0, match.team2Score || 0, newStatus);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">(Table View)</h2>
            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                <tr className="bg-red-500 text-white">
                    <th className="border border-gray-300 px-4 py-2">Team 1</th>
                    <th className="border border-gray-300 px-4 py-2">Team 2</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                    <th className="border border-gray-300 px-4 py-2">Score</th>
                </tr>
                </thead>
                <tbody>
                {matches && matches.length > 0 ? (
                    matches.map((match) => (
                        <tr
                            key={match.id}
                            className="odd:bg-emerald-200 even:bg-emerald-300 hover:bg-emerald-500 transition text-center text-2xl font-bold"
                        >
                            <td className="border border-gray-300 px-4 py-2">{match.team1?.name || "N/A"}</td>
                            <td className="border border-gray-300 px-4 py-2">{match.team2?.name || "N/A"}</td>
                            <td className="border border-gray-300 px-4 py-2">
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
