import React, { useState } from "react";
import { formatTo12HourTime, convertLevel, getEmojiForRank } from "@/utils/functions/HelperFunctions.js";
import ScoreModal from "../Older Components/ScoreModal.jsx";
import {Button} from "@/components/ui/button.jsx";
import PropTypes from "prop-types";
import ScoreModalUpdated from "@/pages/Modals/scoreModalUpdated.jsx";

const MatchCard = ({ match, updateMatch }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isInspected, setIsInspected] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    /** ✅ Handle status change */
    const handleStatusChange = (newStatus) => {
        if (newStatus === "Complete") {
            openModal(); // Open modal when marked as complete
        } else {
            const updatedMatch = {
                ...match,
                status: newStatus,
            };
            updateMatch(updatedMatch);
        }
    };

    /** ✅ Handle score update from modal */
    const handleScoreUpdate = (updatedMatch) => {
        updateMatch(updatedMatch);
        closeModal();
    };

    /**
     * Combine player names for display.
     * If only player1 exists, return player1 name; if both exist, join with " & ".
     */
    const formatTeamPlayers = (team) => {
        if (!team) return "N/A";
        const player1Name = team.player1?.name || "N/A";
        const player2Name = team.player2?.name;
        return player2Name ? `${player1Name} & ${player2Name}` : player1Name;
    };

    /**
     * Get a display string for the team's rank.
     */
    const formatTeamRank = (team) => {
        if (!team) return "N/A";
        const level = convertLevel(team.skillLevel ?? "N/A");
        const emoji = getEmojiForRank(level);
        return `${level} ${emoji}`;
    };

    const handleInspect = () => {
        console.log("Inspecting match card:", match);
        setIsInspected((prev) => !prev);
    };

    return (
        <div
            className={`p-3 rounded shadow dark:bg-emerald-900 bg-emerald-500 space-y-2 ${isInspected ? "ring-4 ring-blue-500" : ""}`}
        >
            <div className="flex justify-between items-center">
                <p className="text-lg font-bold">{match.id || "N/A"}</p>
                <select
                    value={match.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="rounded px-2 py-1 bg-white dark:bg-emerald-950 dark:text-white text-black"
                >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                </select>
            </div>
            <p className="text-md font-semibold">Court {match.courtNumber || "N/A"}</p>

            <div className="space-y-2">
                <p className="font-bold">Team 1: {formatTeamPlayers(match.team1)}</p>
                <p>Rank: {formatTeamRank(match.team1)}</p>
                <p className="font-bold">Team 2: {formatTeamPlayers(match.team2)}</p>
                <p>Rank: {formatTeamRank(match.team2)}</p>
                <p>
                    <strong>Score:</strong> {match.team1Score ?? "N/A"} - {match.team2Score ?? "N/A"}
                </p>
            </div>

            <div className="text-sm">
                <p>
                    <strong>Start Time:</strong>{" "}
                    {formatTo12HourTime(match.startTime ?? "N/A")}
                </p>
                <p>
                    <strong>End Time:</strong>{" "}
                    {formatTo12HourTime(match.endTime ?? "N/A")}
                </p>
            </div>

            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleInspect}>
                    {isInspected ? "Stop Inspecting" : "Inspect"}
                </Button>
            </div>

            <ScoreModalUpdated
                isOpen={isModalOpen}
                match={match}
                onClose={closeModal}
                onSubmit={handleScoreUpdate}
            />
        </div>
    );
};

MatchCard.propTypes = {
    match: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        status: PropTypes.string,
        courtNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        team1: PropTypes.shape({
            player1: PropTypes.shape({ name: PropTypes.string }),
            player2: PropTypes.shape({ name: PropTypes.string }),
            skillLevel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
        team2: PropTypes.shape({
            player1: PropTypes.shape({ name: PropTypes.string }),
            player2: PropTypes.shape({ name: PropTypes.string }),
            skillLevel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
        team1Score: PropTypes.number,
        team2Score: PropTypes.number,
        startTime: PropTypes.string,
        endTime: PropTypes.string,
    }).isRequired,
    updateMatch: PropTypes.func.isRequired,
};

export default MatchCard;
