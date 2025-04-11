import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MatchTabs from "./MatchTabs";
import TournamentSidebar from "../Navbar/TournamentSidebar.jsx";
import SlidingWindow from "../Navbar/SlidingWindow.jsx";
import { fetchAllMatches, fetchMatchesByTournament } from "@/utils/functions/dataUtils.js";
import WindowView from "./Viewer/WindowView.jsx";
import EndTournamentModalUpdated from "@/pages/Modals/EndTournamentModalUpdated.jsx"; // Import the new modal
import { RxHamburgerMenu } from "react-icons/rx";
import { Button } from "@/components/ui/button.jsx";

const LiveTournament = ({ setupProperties, tournamentId }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState("desc");
    const [showWindowView, setShowWindowView] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMatches();
    }, [tournamentId]);

    const fetchMatches = async () => {
        setLoading(true);
        try {
            if (tournamentId) {
                const tournamentMatches = await fetchMatchesByTournament(tournamentId);
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

    // Set the tab title on mount.
    useEffect(() => {
        document.title = "Tournament Live";
    }, []);

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
        <div className="ml-14 w-auto h-screen flex flex-col md:flex-row relative">
            <div className="mb-18 flex-grow flex flex-col overflow-auto px-10 py-4 pr-20">
                <h1 className="text-2xl font-bold dark:text-white text-center">Live Tournament Matches</h1>

                {/* Display Tournament Setup Properties */}
                {setupProperties && setupProperties.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Tournament Setup</h2>
                        <ul>
                            {setupProperties.map((prop, index) => (
                                <li key={index} className="text-gray-600">{prop}</li>
                            ))}
                        </ul>
                    </div>
                )}

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
                className={`fixed right-10 text-7xl top-11 transform -translate-y-1/2 hover:text-amber-200 h-auto transition duration-200 ease-in-out z-50 bg-transparent hover:bg-muted/0 ${
                    isSidebarOpen ? "text-3xl" : "text-white"
                }`}
            >
                {isSidebarOpen ? "" : <RxHamburgerMenu className={"text-3xl"} />}
            </Button>

            <SlidingWindow
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                sections={[
                    {
                        id: "sidebar",
                        label: "Sidebar",
                        content: (
                            <TournamentSidebar
                                sortOrder={sortOrder}
                                setSortOrder={setSortOrder}
                                fetchMatches={fetchMatches}
                                tournamentId={tournamentId}
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
            <EndTournamentModalUpdated
                isOpen={showEndModal}
                onClose={() => setShowEndModal(false)}
                endTournament={endTournament}
            />
        </div>
    );
};

export default LiveTournament;
