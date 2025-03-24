import React, { useState } from "react";
import { formatTo12HourTime, convertLevel, getEmojiForRank } from "../utils/playerUtils";
import ScoreModal from "../Modals/ScoreModal.jsx";

const MatchCard = ({ match, updateMatch }) => {
    const [isModalOpen, setModalOpen] = useState(false);

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
            updateMatch(updatedMatch); // ✅ Call updateMatch with updated match object
        }
    };

    /** ✅ Handle score update from modal */
    const handleScoreUpdate = (updatedMatch) => {
        updateMatch(updatedMatch);
        closeModal();
    };

    return (
        <div className="p-3 rounded shadow dark:bg-emerald-800 bg-emerald-400 space-y-2">
            <div className="flex justify-between items-center">
                <p className="text-lg font-bold">Match {match.id || "N/A"}</p>
                <select
                    value={match.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="rounded px-2 py-1 bg-white dark:bg-green-900 dark:text-white text-black"
                >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                </select>
            </div>

            <div className="space-y-2">
                <p className="font-bold">Team 1: {match.team1.player1?.name} & {match.team1.player2?.name}</p>
                <p>
                    Rank: {convertLevel(match.team1.player1?.placement ?? "N/A")}{" "}
                    {getEmojiForRank(convertLevel(match.team1.player1?.placement ?? "N/A"))}
                </p>
                <p className="font-bold">Team 2: {match.team2.player1?.name} & {match.team2.player2?.name}</p>
                <p>
                    Rank: {convertLevel(match.team2.player1?.placement ?? "N/A")}{" "}
                    {getEmojiForRank(convertLevel(match.team2.player1?.placement ?? "N/A"))}
                </p>
                <p><strong>Score:</strong> {match.team1Score ?? "N/A"} - {match.team2Score ?? "N/A"}</p>
            </div>

            <div className="text-sm">
                <p><strong>Start Time:</strong> {formatTo12HourTime(match.startTime ?? "N/A")}</p>
                <p><strong>End Time:</strong> {formatTo12HourTime(match.endTime ?? "N/A")}</p>
            </div>

            <ScoreModal
                isOpen={isModalOpen}
                match={match}
                onClose={closeModal}
                onSubmit={handleScoreUpdate}
            />
        </div>
    );
};

export default MatchCard;
