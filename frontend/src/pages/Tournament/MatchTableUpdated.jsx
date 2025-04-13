import { useState } from "react";
import ScoreModalUpdated from "@/pages/Modals/scoreModalUpdated.jsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx";
import LoadingModal from "../Modals/LoadingModal.jsx";

const MatchTableUpdated = ({ matches, refreshMatches, updateMatch, isMobile = false }) => {
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const openModal = (match) => {
        setSelectedMatch(match);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedMatch(null);
        setModalOpen(false);
    };

    const handleScoreUpdate = async (updatedMatch) => {
        if (!updateMatch) {
            console.error("❌ `updateMatch` function is missing in MatchTable!");
            return;
        }

        try {
            setLoading(true);
            await updateMatch(updatedMatch);
            refreshMatches();
        } catch (error) {
            console.error("❌ Error updating match:", error);
        } finally {
            setLoading(false);
            closeModal();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Complete":
                return "text-green-600 dark:text-green-300";
            case "In Progress":
                return "text-yellow-600 dark:text-yellow-300";
            case "Scheduled":
                return "text-blue-600 dark:text-blue-300";
            case "Incomplete":
                return "text-red-600 dark:text-red-300";
            default:
                return "text-gray-600 dark:text-gray-300";
        }
    };

    return (
        <>
            {loading && (
                <LoadingModal
                    isLoading={loading}
                    message="Updating match..."
                    description="Please wait while we update the match."
                />
            )}

            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="overflow-x-auto rounded-lg w-full flex-grow">
                    {isMobile ? (
                        <div className="flex flex-col gap-4 p-4">
                            {matches.length > 0 ? (
                                matches.map((match) => (
                                    <div
                                        key={match.id}
                                        className="bg-gray-200 dark:bg-emerald-700 p-4 rounded shadow"
                                    >
                                        <div className="text-center font-semibold text-lg">
                                            {match.team1?.name ?? "N/A"} vs {match.team2?.name ?? "N/A"}
                                        </div>
                                        <div className="text-center text-sm mt-2">
                                            Score: {match.team1Score ?? "N/A"} - {match.team2Score ?? "N/A"}
                                        </div>
                                        <div className="text-center text-xs mt-1 text-gray-600 dark:text-gray-300">
                                            Status:{" "}
                                            <span className={getStatusColor(match.status)}>
                                                {match.status}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex justify-center">
                                            <button
                                                onClick={() => openModal(match)}
                                                className="bg-yellow-500 text-white px-4 py-2 text-sm rounded hover:bg-yellow-600"
                                            >
                                                Update Score
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                    No matches found.
                                </div>
                            )}
                        </div>
                    ) : (
                        <Table className="w-full">
                            <TableHeader className="flex text-center font-medium dark:bg-transparent">
                                <TableRow className="flex py-5 w-full dark:bg-gray-950">
                                    <TableHead className="flex-1 font-bold text-2xl text-center">Team 1</TableHead>
                                    <TableHead className="flex-1 font-bold text-2xl text-center">Team 2</TableHead>
                                    <TableHead className="flex-1 font-bold text-2xl text-center">Score</TableHead>
                                    <TableHead className="flex-1 font-bold text-2xl text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {matches.length > 0 ? (
                                    matches.map((match) => (
                                        <TableRow
                                            key={match.id}
                                            className="flex w-full odd:bg-emerald-50 even:bg-emerald-100 hover:bg-emerald-700 dark:odd:bg-emerald-900 dark:even:bg-emerald-800 dark:hover:bg-emerald-700 py-6"
                                        >
                                            <TableCell className="flex-1 text-center dark:text-gray-200 text-xl">
                                                {match.team1?.name ?? "N/A"}
                                            </TableCell>
                                            <TableCell className="flex-1 text-center dark:text-gray-200 text-xl">
                                                {match.team2?.name ?? "N/A"}
                                            </TableCell>
                                            <TableCell
                                                className="flex-1 text-center font-semibold dark:text-gray-200 cursor-pointer hover:underline text-xl"
                                                onClick={() => openModal(match)}
                                            >
                                                {match.team1Score ?? "N/A"} - {match.team2Score ?? "N/A"}
                                            </TableCell>
                                            <TableCell className="flex-1 text-center text-xl">
                                                {match.status}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center py-6 text-gray-500 dark:text-gray-400"
                                        >
                                            No matches found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>

            {isModalOpen && selectedMatch && (
                <ScoreModalUpdated
                    isOpen={isModalOpen}
                    match={selectedMatch}
                    onClose={closeModal}
                    onSubmit={handleScoreUpdate}
                    refreshMatches={refreshMatches}
                />
            )}
        </>
    );
};

import PropTypes from "prop-types";

MatchTableUpdated.propTypes = {
    matches: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            team1: PropTypes.shape({
                name: PropTypes.string,
            }),
            team2: PropTypes.shape({
                name: PropTypes.string,
            }),
            team1Score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            team2Score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            status: PropTypes.string.isRequired,
        })
    ).isRequired,
    refreshMatches: PropTypes.func.isRequired,
    updateMatch: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
};

export default MatchTableUpdated;
