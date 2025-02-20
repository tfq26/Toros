import React from "react";

const MatchTable = ({ matches, updateMatch }) => {
    if (!updateMatch) {
        console.error("❌ `updateMatch` function is missing in MatchTable!");
    }

    const handleStatusChange = (match, newStatus) => {
        if (newStatus === "Complete") {
            const team1Score = parseInt(prompt(`Enter score for ${match.team1?.name || "Team 1"}:`), 10);
            const team2Score = parseInt(prompt(`Enter score for ${match.team2?.name || "Team 2"}:`), 10);

            if (!isNaN(team1Score) && !isNaN(team2Score)) {
                updateMatch(match.id, team1Score, team2Score, newStatus);
            } else {
                alert("⚠️ Invalid input. Please enter numeric values for the scores.");
            }
        } else {
            updateMatch(match.id, match.team1Score ?? 0, match.team2Score ?? 0, newStatus);
        }
    };

    return (
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
            {matches.map((match) => (
                <tr key={match.id} className="text-center font-bold odd:bg-emerald-200 even:bg-emerald-400 hover:bg-emerald-500 transition">
                    <td className="border border-gray-300 px-4 py-2">{match.team1.player1?.name + " & " + match.team1.player2?.name ?? "⚠️ Missing Team"}</td>
                    <td className="border border-gray-300 px-4 py-2">{match.team2.player1?.name + " & " + match.team2.player2?.name ?? "⚠️ Missing Team"}</td>
                    <td className="border border-gray-300 px-4 py-2">
                        <select value={match.status} onChange={(e) => handleStatusChange(match, e.target.value)}>
                            <option value="Scheduled">Scheduled</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Complete">Complete</option>
                        </select>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                        {match.team1Score ?? "N/A"} - {match.team2Score ?? "N/A"}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default MatchTable;
