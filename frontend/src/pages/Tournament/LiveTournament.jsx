import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MatchTabs from "./MatchTabs";
import TournamentSidebar from "@/components/Navbar/TournamentSidebar.jsx";
import SlidingWindow from "@/components/Navbar/SlidingWindow.jsx";
import { fetchAllMatches, fetchMatchesByTournament } from "@/utils/functions/dataUtils.js";
import WindowView from "./Viewer/WindowView.jsx";
import EndTournamentModalUpdated from "@/pages/Modals/EndTournamentModalUpdated.jsx";
import { RxHamburgerMenu } from "react-icons/rx";
import { Button } from "@/components/ui/button.jsx";

const LiveTournament = ({ tournamentConfig, tournamentId }) => {
    // Extract setupProperties from tournamentConfig if it exists, otherwise default to empty array.
    const setupProperties = tournamentConfig?.setupProperties || [];

    // Log setupProperties whenever they change.
    useEffect(() => {
        console.log("Setup Properties in LiveTournament:", setupProperties);
    }, [setupProperties]);

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

    // Set the tab title on mount.
    useEffect(() => {
        document.title = "Tournament Live";
    }, []);

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

    /**
     * Compute a unique key based on the two teams playing.
     */
    const getMatchKey = (match) => {
        if (!match.team1 || !match.team2) return null;
        const team1Id = match.team1.id || match.team1.name;
        const team2Id = match.team2.id || match.team2.name;
        const sortedIds = [team1Id, team2Id].sort();
        return sortedIds.join("-");
    };

    /**
     * Check for duplicate matches by match-up.
     */
    const checkForDuplicateMatches = () => {
        const matchupCount = {};
        matches.forEach((match) => {
            const key = getMatchKey(match);
            if (key) {
                matchupCount[key] = (matchupCount[key] || 0) + 1;
            }
        });

        const duplicates = Object.keys(matchupCount).filter((key) => matchupCount[key] > 1);
        if (duplicates.length > 0) {
            const totalDuplicates = duplicates.reduce((acc, key) => acc + (matchupCount[key] - 1), 0);
            console.log(`Found ${totalDuplicates} duplicate match-up(s):`, duplicates);
        } else {
            console.log("No duplicate match-ups found.");
        }
    };

    return (
        <div className="ml-14 w-auto h-screen flex flex-col md:flex-row relative">
            <div className="mb-18 flex-grow flex flex-col overflow-auto px-10 py-4 pr-20">
                <h1 className="text-2xl font-bold dark:text-white text-center">Live Tournament Matches</h1>

                {/* Button to check for duplicate match-ups */}
                <div className="flex justify-center my-4">
                    <Button onClick={checkForDuplicateMatches} variant="outline">
                        Check Duplicate Match-ups
                    </Button>
                </div>

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
                {isSidebarOpen ? "" : <RxHamburgerMenu className="text-3xl" />}
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
                                setupProperties={setupProperties}
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
