import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MatchTabs from "./MatchTabs";
import Sidebar from "./Sidebar.jsx";
import SlidingWindow from "../SlidingWindow.jsx";
import { PiArrowSquareLeftBold } from "react-icons/pi";
import { fetchAllMatches } from "../utils/dataUtils.js";
import WindowView from "./Viewer/WindowView.jsx";
import EndTournamentModal from "../Modals/EndTournamentModal.jsx"; // Import the new modal

const LiveTournament = ({ tournamentConfig }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState("desc");
    const [showWindowView, setShowWindowView] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false); // state for end tournament modal
    const navigate = useNavigate();

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        setLoading(true);
        try {
            const fullMatches = await fetchAllMatches();
            setMatches(fullMatches);
        } catch (err) {
            console.error("❌ Error fetching matches:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateMatch = async (updatedMatch) => {
        if (!updatedMatch.id) {
            console.error("❌ Match ID is missing! Cannot update match.");
            return;
        }
        try {
            const response = await axios.patch(`http://localhost:8080/api/match/${updatedMatch.id}`, {
                team1Score: updatedMatch.team1Score,
                team2Score: updatedMatch.team2Score,
                status: updatedMatch.status,
            });
            if (response.status === 200) {
                console.log("✅ Match updated successfully:", response.data);
                fetchMatches();
            } else {
                throw new Error("Server error: Failed to update match.");
            }
        } catch (error) {
            console.error("❌ Error updating match:", error.message);
            alert("An error occurred while updating the match.");
        }
    };

    // Function to end tournament using backend endpoint
    const endTournament = async () => {
        const response = await axios.post("http://localhost:8080/api/tournament/end");
        if (response.status === 200) {
            console.log("🏁 Tournament ended successfully.");
        } else {
            throw new Error("Failed to end tournament.");
        }
    };

    return (
        <div className="w-auto h-screen flex flex-col md:flex-row relative">
            <div className="flex-grow flex flex-col overflow-auto px-6 py-6 pr-20">
                <button
                    onClick={() => navigate("/tournament/list")}
                    className="mb-4 flex items-center gap-2 text-red-600 hover:text-red-800 transition"
                >
                    <PiArrowSquareLeftBold className="text-2xl" />
                    <span className="text-lg font-semibold">Back to Tournament List</span>
                </button>

                <h1 className="text-2xl font-bold">Live Tournament Matches</h1>

                {loading ? (
                    <p className="text-center text-gray-500">Loading matches...</p>
                ) : (
                    <MatchTabs
                        matches={matches}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        refreshMatches={fetchMatches}
                        updateMatch={updateMatch}
                    />
                )}
            </div>

            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed left-[95%] top-1/2 transform -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition z-50"
            >
                {isSidebarOpen ? "❌ Close" : <PiArrowSquareLeftBold className="text-3xl" />}
            </button>

            <button
                onClick={() => window.open("/viewer", "_blank")}
                className="fixed right-[2%] top-[5%] bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition z-50"
            >
                Open Viewer in New Tab
            </button>

            <SlidingWindow
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                sections={[
                    {
                        id: "sidebar",
                        label: "Sidebar",
                        content: (
                            <Sidebar
                                sortOrder={sortOrder}
                                setSortOrder={setSortOrder}
                                fetchMatches={fetchMatches}
                                tournamentConfig={tournamentConfig}
                                // Instead of ending tournament immediately, open the modal
                                endTournament={() => setShowEndModal(true)}
                            />
                        ),
                    },
                ]}
            />

            {showWindowView && (
                <div className="fixed bottom-0 right-0 w-96 h-96 bg-white dark:bg-gray-800 shadow-xl border p-4 z-40 overflow-auto">
                    <WindowView matches={matches} />
                </div>
            )}

            {/* End Tournament Modal */}
            <EndTournamentModal
                isOpen={showEndModal}
                onClose={() => setShowEndModal(false)}
                endTournament={endTournament}
            />
        </div>
    );
};

export default LiveTournament;
