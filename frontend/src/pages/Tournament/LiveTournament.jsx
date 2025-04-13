import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MatchTabs from "./MatchTabs";
import TournamentSidebar from "@/components/Navbar/TournamentSidebar.jsx";
import { fetchAllMatches, fetchMatchesByTournament } from "@/utils/functions/dataUtils.js";
import WindowView from "./Viewer/WindowView.jsx";
import EndTournamentModalUpdated from "@/pages/Modals/EndTournamentModalUpdated.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet.jsx";
import { IoSettingsOutline } from "react-icons/io5";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";

const LiveTournament = ({ tournamentConfig, tournamentId }) => {
    // Extract setupProperties from tournamentConfig if it exists, otherwise default to an empty array.
    const setupProperties = tournamentConfig?.setupProperties || [];

    useEffect(() => {
        console.log("Setup Properties in LiveTournament:", setupProperties);
    }, [setupProperties]);

    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState("desc");
    const [showWindowView] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    // Remove useNavigate call if not needed:
    useNavigate();

    // Set the document title on mount.
    useEffect(() => {
        document.title = "Tournament Live";
    }, []);

    // Define fetchMatches as a function
    const fetchMatches = useCallback(async () => {
        setLoading(true);
        try {
            if (tournamentId) {
                const tournamentMatches = await fetchMatchesByTournament(tournamentId);
                setMatches(tournamentMatches);
            } else {
                // Fallback: fetch all matches.
                const fullMatches = await fetchAllMatches();
                setMatches(fullMatches);
            }
        } catch (err) {
            console.error("❌ Error fetching matches:", err);
            setMatches([]);
        } finally {
            setLoading(false);
        }
    }, [tournamentId]);

    // Wrap fetchMatches in a debounced function with a delay of 500ms.
    const debouncedFetchMatches = useCallback(
        debounce(() => {
            fetchMatches();
        }, 500),
        [fetchMatches]
    );

    // Call the debounced fetchMatches function whenever tournamentId changes.
    useEffect(() => {
        debouncedFetchMatches();
        return () => {
            debouncedFetchMatches.cancel();
        };
    }, [debouncedFetchMatches, tournamentId]);

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
                await fetchMatches();
            } else {
                throw new Error("Server error: Failed to update match.");
            }
        } catch (error) {
            console.error("❌ Error updating match:", error.message);
            alert("An error occurred while updating the match.");
        }
    };

    // Button handler for checking duplicate match-ups.
    const checkForDuplicateMatches = () => {
        const getMatchKey = (match) => {
            if (!match.team1 || !match.team2) return null;
            const team1Id = match.team1.id || match.team1.name;
            const team2Id = match.team2.id || match.team2.name;
            const sortedIds = [team1Id, team2Id].sort();
            return sortedIds.join("-");
        };

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
        <div className="flex flex-col p-4">
            {/* Mobile Header: Title and Hamburger Menu */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
                <h1 className="text-xl font-bold dark:text-white">Live Tournament Matches</h1>
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(true)}>
                            <IoSettingsOutline size={24} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Tournament Controls</SheetTitle>
                        </SheetHeader>
                        <TournamentSidebar
                            sortOrder={sortOrder}
                            setupProperties={setupProperties}
                            setSortOrder={setSortOrder}
                            fetchMatches={fetchMatches}
                            tournamentId={tournamentId}
                            endTournament={() => setShowEndModal(true)}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <div className="flex-grow">
                {/* Button to check for duplicate match-ups */}
                <div className="flex justify-center my-2">
                    <Button onClick={checkForDuplicateMatches} variant="outline">
                        Check Duplicate Match-ups
                    </Button>
                </div>

                {/* Display Tournament Setup Properties if available */}
                {setupProperties && setupProperties.length > 0 && (
                    <div className="mb-4 bg-white dark:bg-gray-800 p-2 rounded shadow">
                        <h2 className="text-lg font-semibold dark:text-white">Tournament Setup</h2>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                            {setupProperties.map((prop, index) => (
                                <li key={index}>{prop}</li>
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

            {/* End Tournament Modal */}
            <EndTournamentModalUpdated
                isOpen={showEndModal}
                onClose={() => setShowEndModal(false)}
                endTournament={async () => {
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
                }}
            />

            {/* Optional: Full screen modal for WindowView */}
            {showWindowView && (
                <div className="fixed inset-0 bg-white dark:bg-gray-800 p-4 z-40 overflow-auto">
                    <WindowView matches={matches} />
                </div>
            )}
        </div>
    );
};

LiveTournament.propTypes = {
    tournamentConfig: PropTypes.shape({
        setupProperties: PropTypes.array,
    }),
    tournamentId: PropTypes.string,
};

export default LiveTournament;
