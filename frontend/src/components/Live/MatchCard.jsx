import React from "react";
import { formatTo12HourTime, convertLevel, getEmojiForRank } from "../utils/playerUtils";

const MatchCard = ({ match, updateMatch }) => {
    if (!updateMatch) {
        console.error("❌ `updateMatch` function is missing in MatchCard!");
    }

    const handleStatusChange = (newStatus) => {
        if (newStatus === "Complete") {
            // Prompt the user for scores when marking a match as complete
            const team1ScoreInput = prompt(`Enter score for ${match.team1?.name || "Team 1"}:`) || "0";
            const team2ScoreInput = prompt(`Enter score for ${match.team2?.name || "Team 2"}:`) || "0";

            const team1Score = parseInt(team1ScoreInput, 10);
            const team2Score = parseInt(team2ScoreInput, 10);

            if (!isNaN(team1Score) && !isNaN(team2Score)) {
                // Call the updateMatch function from props, which should invoke the backend
                updateMatch(match.id, team1Score, team2Score, newStatus);
            } else {
                alert("⚠️ Invalid input. Please enter numeric values for the scores.");
            }
        } else {
            // For other statuses, update the match without prompting for scores
            updateMatch(match.id, match.team1Score ?? 0, match.team2Score ?? 0, newStatus);
        }
    };

    return (
        <div className="p-3 rounded shadow bg-emerald-800 space-y-2">
            {/* Match Header */}
            <div className="flex justify-between items-center">
                <p className="text-lg font-bold">Match {match.id || "N/A"}</p>
                <select
                    value={match.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="border rounded px-2 py-1 bg-none text-black"
                >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                </select>
            </div>

            {/* Team Information */}
            <div className="space-y-2">
                <p className="font-bold">Team 1: {match.team1.player1?.name + " & " + match.team1.player2?.name}</p>
                <p>
                    Rank: {convertLevel(match.team1.player1?.placement ?? "N/A")}{" "}
                    {getEmojiForRank(convertLevel(match.team1.player1?.placement ?? "N/A"))}
                </p>
                <p className="font-bold">Team 2: {match.team2.player1?.name + " & " + match.team2.player2?.name}</p>
                <p>
                    Rank: {convertLevel(match.team2.player1?.placement ?? "N/A")}{" "}
                    {getEmojiForRank(convertLevel(match.team2.player1?.placement ?? "N/A"))}
                </p>
                <p>
                    <strong>Score:</strong> {match.team1Score ?? "N/A"} - {match.team2Score ?? "N/A"}
                </p>
            </div>

            {/* Match Timing */}
            <div className="text-sm">
                <p>
                    <strong>Start Time:</strong> {formatTo12HourTime(match.startTime ?? "N/A")}
                </p>
                <p>
                    <strong>End Time:</strong> {formatTo12HourTime(match.endTime ?? "N/A")}
                </p>
            </div>
        </div>
    );
};

export default MatchCard;
