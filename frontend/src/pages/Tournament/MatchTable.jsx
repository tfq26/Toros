import React, { useState } from "react";
import ScoreModalUpdated from "@/pages/Modals/scoreModalUpdated.jsx";
import LoadingModal from "../Modals/LoadingModal.jsx"; // Import the new LoadingModal

const MatchTable = ({ matches, refreshMatches, updateMatch }) => {
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    /** ✅ Open Modal */
    const openModal = (match) => {
        setSelectedMatch(match);
        setModalOpen(true);
    };

    /** ✅ Close Modal */
    const closeModal = () => {
        setSelectedMatch(null);
        setModalOpen(false);
    };

    /** ✅ Handle Score Update */
    const handleScoreUpdate = async (updatedMatch) => {
        if (!updateMatch) {
            console.error("❌ `updateMatch` function is missing in MatchTable!");
            return;
        }

        try {
            setLoading(true);
            await updateMatch(updatedMatch);
            refreshMatches(); // ✅ Ensure matches are refreshed after update
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
                    <table className="table-auto w-full dark:border-gray-600">
                        <thead>
                        <tr className="bg-emerald-600 dark:bg-emerald-950 text-white uppercase text-lg font-semibold">
                            <th className="border px-6 py-3 text-2xl text-center border-emerald-400 dark:border-emerald-900">
                                Team 1
                            </th>
                            <th className="border px-6 py-3 text-2xl text-center border-emerald-400 dark:border-emerald-900">
                                Team 2
                            </th>
                            <th className="border px-6 py-3 text-2xl text-center border-emerald-400 dark:border-emerald-900">
                                Score
                            </th>
                            <th className="border px-6 py-3 text-2xl text-center border-emerald-400 dark:border-emerald-900">
                                Status
                            </th>
                            <th className="border px-6 py-3 text-2xl text-center border-emerald-400 dark:border-emerald-900">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {matches.length > 0 ? (
                            matches.map((match) => (
                                <tr
                                    key={match.id}
                                    className="odd:bg-emerald-50 even:bg-emerald-100 hover:bg-emerald-200 transition dark:odd:bg-green-800 dark:even:bg-green-700 dark:hover:bg-green-600"
                                >
                                    <td className="border px-6 py-3 text-center border-green-500 dark:border-green-900 dark:text-gray-200">
                                        {match.team1?.name ?? "N/A"}
                                    </td>
                                    <td className="border px-6 py-3 text-center border-green-500 dark:border-green-900 dark:text-gray-200">
                                        {match.team2?.name ?? "N/A"}
                                    </td>
                                    <td className="border px-6 py-3 text-center font-semibold border-green-500 dark:border-green-900 dark:text-gray-200">
                                        {match.team1Score ?? "N/A"} - {match.team2Score ?? "N/A"}
                                    </td>
                                    <td className="border px-6 py-3 text-center border-green-500 dark:border-green-900">
                                        {match.status}
                                    </td>
                                    <td className="border px-6 py-3 text-center border-green-500 dark:border-green-900">
                                        <button
                                            onClick={() => openModal(match)}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                                            disabled={loading}
                                        >
                                            {loading ? "Updating..." : "Update Score"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                                >
                                    No matches found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* ✅ Score Modal with correct `onSubmit` */}
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

export default MatchTable;
