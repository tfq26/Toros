import React from "react";
import { formatTo12HourTime, convertLevel, getEmojiForRank } from "../utils/playerUtils";

const MatchCard = ({ match, updateMatch }) => {
    const handleStatusChange = (newStatus) => {
        if (newStatus === "Complete") {
            // Prompt the user for scores when marking a match as complete
            const team1ScoreInput = prompt(`Enter score for ${match.team1?.name || "Team 1"}:`);
            const team2ScoreInput = prompt(`Enter score for ${match.team2?.name || "Team 2"}:`);
            const team1Score = parseInt(team1ScoreInput, 10);
            const team2Score = parseInt(team2ScoreInput, 10);

            if (!isNaN(team1Score) && !isNaN(team2Score)) {
                // Call the updateMatch function from props, which should invoke the backend
                updateMatch(match.id, team1Score, team2Score, newStatus);
            } else {
                alert("Invalid input. Please enter numeric values for the scores.");
            }
        } else {
            // For other statuses, update the match without prompting for scores
            updateMatch(match.id, match.team1Score || 0, match.team2Score || 0, newStatus);
        }
    };

    return (
        <div className="border p-4 rounded shadow bg-emerald-500 space-y-2">
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
                    Rank: {convertLevel(match.team1?.placement)}{" "}
                    {getEmojiForRank(convertLevel(match.team1?.placement))}
                </p>
                <p className="font-bold">Team 2: {match.team2?.name || "N/A"}</p>
                <p>
                    Rank: {convertLevel(match.team2?.placement)}{" "}
                    {getEmojiForRank(convertLevel(match.team2?.placement))}
                </p>
                <p>
                    Score: {match.team1Score || 0} - {match.team2Score || 0}
                </p>
            </div>
            <div>
                <p>
                    <strong>Start Time:</strong> {formatTo12HourTime(match.startTime)}
                </p>
                <p>
                    <strong>End Time:</strong> {formatTo12HourTime(match.endTime)}
                </p>
            </div>
        </div>
    );
};

export default MatchCard;
