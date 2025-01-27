import React from "react";
import { formatTo12HourTime, convertLevel, getEmojiForRank } from "../utils/playerUtils"; // Adjust path if needed

const MatchCard = ({ match, updateMatch }) => {
    const handleStatusChange = (newStatus) => {
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
        <div className="border p-4 rounded shadow space-y-2">
            <div className="flex justify-between items-center">
                <p className="text-lg font-bold">Match {match.id}</p>
                <select
                    value={match.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                </select>
            </div>
            <div>
                <p className="font-bold">Team 1: {match.team1?.name || "N/A"}</p>
                <p>
                    Rank: {convertLevel(match.team1?.placement)} {getEmojiForRank(convertLevel(match.team1?.placement))}
                </p>
                <p className="font-bold">Team 2: {match.team2?.name || "N/A"}</p>
                <p>
                    Rank: {convertLevel(match.team2?.placement)} {getEmojiForRank(convertLevel(match.team2?.placement))}
                </p>
                <p>Score: {match.team1Score || 0} - {match.team2Score || 0}</p>
            </div>
            <p>
                <strong>Start Time:</strong> {formatTo12HourTime(match.startTime)}
            </p>
            <p>
                <strong>End Time:</strong> {formatTo12HourTime(match.endTime)}
            </p>
        </div>
    );
};

export default MatchCard;
