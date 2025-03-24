import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MatchTabs from "./MatchTabs";
import Sidebar from "./Sidebar.jsx";
import SlidingWindow from "../SlidingWindow.jsx";
import { PiArrowSquareLeftBold } from "react-icons/pi";
// Import both functions from dataUtils
import { fetchAllMatches, fetchMatchesByTournament } from "../utils/dataUtils.js";
import WindowView from "./Viewer/WindowView.jsx";
import EndTournamentModal from "../Modals/EndTournamentModal.jsx";
import {RxHamburgerMenu} from "react-icons/rx";
import {Button} from "@/components/ui/button.jsx"; // Import the new modal

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
    }, [tournamentConfig]);

    const fetchMatches = async () => {
        setLoading(true);
        try {
            // If tournamentConfig is provided and has an id, fetch matches by tournament.
            if (tournamentConfig && tournamentConfig.id) {
                const tournamentMatches = await fetchMatchesByTournament(tournamentConfig.id);
                setMatches(tournamentMatches);
            } else {
                // Fallback: fetch all matches
                const fullMatches = await fetchAllMatches();
                setMatches(fullMatches);
            }
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
            const response = await axios.patch(
                `http://localhost:8080/api/tournament/${updatedMatch.id}`,
                {
                    team1Score: updatedMatch.team1Score,
                    team2Score: updatedMatch.team2Score,
                    status: updatedMatch.status,
                }
            );
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
        try {
            const response = await axios.post("http://localhost:8080/api/tournament/end");
            if (response.status === 200) {
                console.log("🏁 Tournament ended successfully.");
            } else {
                throw new Error("Failed to end tournament.");
            }
        } catch (error) {
            console.error("❌ Error ending tournament:", error);
        }
    };

    return (
        <div className="w-auto h-screen flex flex-col md:flex-row relative">
            <div className="flex-grow flex flex-col overflow-auto px-6 py-6 pr-20">
                <Button
                    onClick={() => navigate("/tournament/list")}
                    className="mb-4 flex items-center gap-2 text-red-600 hover:text-red-800 transition w-fit bg-transparent hover:bg-transparent shadow-none"
                >
                    <PiArrowSquareLeftBold className="text-2xl" />
                    <span className="text-lg font-semibold">Back to Tournament List</span>
                </Button>

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

            <Button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`fixed right-5 text-7xl top-11 transform -translate-y-1/2 hover:text-amber-200 w-[5%] h-auto transition duration-200 ease-in-out z-50 bg-transparent hover:opacity-75 ${
                    isSidebarOpen ? "text-7xl" : "text-white"
                }`}
            >
                {isSidebarOpen ? "" : <RxHamburgerMenu />}
            </Button>

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
