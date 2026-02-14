import React, { useState, useEffect } from "react";
import ScoreModalUpdated from "@/pages/Modals/scoreModalUpdated.jsx";
import LoadingModal from "@/pages/Modals/LoadingModal.jsx"; // Import the new LoadingModal

const MatchTable = ({ matches, refreshMatches, updateMatch }) => {
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Listen for window resize events to detect mobile viewports.
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        // Run once on mount to set the initial viewport flag.
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

    // Filter out any invalid match objects to avoid rendering empty rows.
    const validMatches = matches.filter((match) => match && match.id);

    return (
        <>
            {loading && (
                <LoadingModal
                    isLoading={loading}
                    message="Updating match..."
                    description="Please wait while we update the match."
                />
            )}

            {isMobile ? (
                // Mobile-optimized view: smaller text and only essential details.
                <div className="flex flex-col gap-4 p-2">
                    {validMatches.length > 0 ? (
                        validMatches.map((match) => (
                            <div
                                key={match.id}
                                className="bg-gray-100 dark:bg-gray-800 p-3 rounded shadow flex flex-col"
                            >
                                <div className="text-sm font-semibold text-center">
                                    {match.team1?.name ?? "N/A"}{" "}
                                    {match.team1?.wins != null && `(${match.team1.wins} wins)`} vs{" "}
                                    {match.team2?.name ?? "N/A"}{" "}
                                    {match.team2?.wins != null && `(${match.team2.wins} wins)`}
                                </div>
                                <div className="text-xs text-center mt-1">
                                    Score: {match.team1Score ?? "N/A"} - {match.team2Score ?? "N/A"}
                                </div>
                                <div className="flex justify-center mt-2">
                                    <button
                                        onClick={() => openModal(match)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                                        disabled={loading}
                                    >
                                        {loading ? "Updating..." : "Update Score"}
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
                // Desktop view: full table with detailed information.
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="overflow-x-auto rounded-lg w-full flex-grow">
                        <table className="table-auto w-full dark:border-gray-900 h-full">
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
                            </tr>
                            </thead>
                            <tbody>
                            {validMatches.length > 0 ? (
                                validMatches.map((match) => (
                                    <tr
                                        key={match.id}
                                        className="odd:bg-emerald-50 even:bg-emerald-100 hover:bg-emerald-200 transition dark:odd:bg-green-800 dark:even:bg-green-700 dark:hover:bg-green-600"
                                    >
                                        <td className="border px-6 py-3 text-center border-green-500 dark:border-green-900 dark:text-gray-200">
                                            {match.team1?.name ?? "N/A"}{" "}
                                            {match.team1?.wins != null && `(${match.team1.wins} wins)`}
                                        </td>
                                        <td className="border px-6 py-3 text-center border-green-500 dark:border-green-900 dark:text-gray-200">
                                            {match.team2?.name ?? "N/A"}{" "}
                                            {match.team2?.wins != null && `(${match.team2.wins} wins)`}
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
                </div>
            )}

            {/* Score Modal with correct `onSubmit` */}
            <ScoreModalUpdated
                isOpen={isModalOpen}
                match={selectedMatch}
                onClose={closeModal}
                onSubmit={handleScoreUpdate}
            />
        </>
    );
};

export default MatchTable;
