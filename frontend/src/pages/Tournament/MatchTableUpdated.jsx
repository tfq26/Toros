import { useState } from "react";
import ScoreModalUpdated from "@/pages/Modals/scoreModalUpdated.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import LoadingModal from "../Modals/LoadingModal.jsx"; // Import the new LoadingModal

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
        <>
            {loading && (
                <LoadingModal
                    isLoading={loading}
                    message="Updating match..."
                    description="Please wait while we update the match."
                />
            )}
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="overflow-x-auto rounded-lg w-full flex-grow min-h-[600px]">
                    <Table className="w-full">
                        <TableHeader className="flex text-center font-medium hover:bg-none dark:bg-transparent">
                            <TableRow className="flex py-5 text-center font-medium w-full hover:bg-muted/0 dark:bg-gray-950">
                                <TableHead className="flex-1 font-bold text-center text-4xl">Team 1</TableHead>
                                <TableHead className="flex-1 font-bold text-center text-4xl">Team 2</TableHead>
                                <TableHead className="flex-1 font-bold text-center text-4xl">Score</TableHead>
                                <TableHead className="flex-1 font-bold text-center text-4xl">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {matches.length > 0 ? (
                                matches.map((match) => (
                                    <TableRow
                                        key={match.id}
                                        className="flex w-full odd:bg-emerald-50 even:bg-emerald-100 hover:bg-emerald-700 transition dark:odd:bg-emerald-900 dark:even:bg-emerald-800 dark:hover:bg-emerald-700 py-6"
                                    >
                                        <TableCell className="flex-1 text-center dark:text-gray-200 text-xl">
                                            {match.team1?.name ?? "N/A"}
                                        </TableCell>
                                        <TableCell className="flex-1 text-center dark:text-gray-200 text-xl">
                                            {match.team2?.name ?? "N/A"}
                                        </TableCell>
                                        <TableCell
                                            className="flex-1 text-center font-semibold dark:text-gray-200 cursor-pointer hover:underline text-xl w-fit"
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
        </>
    );
};

export default MatchTableUpdated;
