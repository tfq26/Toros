import React, { useState } from "react";
import ScoreModalUpdated from "@/pages/Modals/scoreModalUpdated.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";

const MatchTableUpdated = ({ matches, refreshMatches, updateMatch }) => {
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    /** Open Modal */
    const openModal = (match) => {
        setSelectedMatch(match);
        setModalOpen(true);
    };

    /** Close Modal */
    const closeModal = () => {
        setSelectedMatch(null);
        setModalOpen(false);
    };

    /** Handle Score Update */
    const handleScoreUpdate = async (updatedMatch) => {
        if (!updateMatch) {
            console.error("❌ `updateMatch` function is missing in MatchTable!");
            return;
        }

        try {
            setLoading(true);
            await updateMatch(updatedMatch);
            refreshMatches(); // Ensure matches are refreshed after update
        } catch (error) {
            console.error("❌ Error updating match:", error);
        } finally {
            setLoading(false);
            closeModal();
        }
    };

    return (
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="overflow-x-auto rounded-lg w-full flex-grow min-h-[600px]">
                <Table className="w-full">
                    <TableHeader className="flex text-center font-medium hover:bg-none">
                        <TableRow className="flex py-5 text-center font-medium w-full hover:bg-muted/0">
                            <TableHead className="flex-1 font-bold text-center text-4xl">Team 1</TableHead>
                            <TableHead className="flex-1 font-bold text-center text-4xl">Team 2</TableHead>
                            <TableHead className="flex-1 font-bold text-center text-4xl">Score</TableHead>
                            <TableHead className="flex-1 font-bold text-center text-4xl">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400">
                                    Updating match...
                                </TableCell>
                            </TableRow>
                        ) : matches.length > 0 ? (
                            matches.map((match) => (
                                <TableRow
                                    key={match.id}
                                    className="flex w-full odd:bg-emerald-50 even:bg-emerald-100 hover:bg-emerald-200 transition dark:odd:bg-green-800 dark:even:bg-green-700 dark:hover:bg-green-600 py-6"
                                >
                                    <TableCell className="flex-1 text-center dark:text-gray-200 text-2xl">
                                        {match.team1?.name ?? "N/A"}
                                    </TableCell>
                                    <TableCell className="flex-1 text-center dark:text-gray-200 text-2xl">
                                        {match.team2?.name ?? "N/A"}
                                    </TableCell>
                                    <TableCell
                                        className="flex-1 text-center font-semibold dark:text-gray-200 cursor-pointer hover:underline text-2xl"
                                        onClick={() => openModal(match)}
                                    >
                                        {match.team1Score ?? "N/A"} - {match.team2Score ?? "N/A"}
                                    </TableCell>
                                    <TableCell className="flex-1 text-center text-2xl">
                                        {match.status}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-6 text-gray-500 dark:text-gray-400">
                                    No matches found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Score Modal with correct `onSubmit` */}
            <ScoreModalUpdated
                isOpen={isModalOpen}
                match={selectedMatch}
                onClose={closeModal}
                onSubmit={handleScoreUpdate}
            />
        </div>
    );
};

export default MatchTableUpdated;
