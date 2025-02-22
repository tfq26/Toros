import { useState, useEffect } from "react";
import axios from "axios";
import MatchTabs from "./MatchTabs";
import Sidebar from "./Sidebar.jsx";
import SlidingWindow from "../SlidingWindow.jsx";
import { PiArrowSquareLeftBold } from "react-icons/pi";

const LiveTournament = ({ tournamentConfig }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        fetchMatches();
    }, []);

    /** ✅ Fetch Matches */
    const fetchMatches = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/api/tournament/matches");
            setMatches(response.data);
        } catch (err) {
            console.error("❌ Error fetching matches:", err);
        } finally {
            setLoading(false);
        }
    };

    /** ✅ Update Match */
    const updateMatch = async (updatedMatch) => {
        if (!updatedMatch.id) {
            console.error("❌ Match ID is missing! Cannot update match.");
            return;
        }

        try {
            const response = await axios.patch(`http://localhost:8080/api/tournament/match/${updatedMatch.id}`, {
                team1Score: updatedMatch.team1Score,
                team2Score: updatedMatch.team2Score,
                status: updatedMatch.status,
            });

            if (response.status === 200) {
                console.log("✅ Match updated successfully:", response.data);
                fetchMatches(); // Refresh matches after update
            } else {
                throw new Error("Server error: Failed to update match.");
            }
        } catch (error) {
            console.error("❌ Error updating match:", error.message);
            alert("An error occurred while updating the match.");
        }
    };

    return (
        <div className="w-auto h-screen flex flex-col md:flex-row pr-6 relative">
            <div className="flex-grow flex flex-col p-6 overflow-auto mr-24">
                <h1 className="text-2xl font-bold">Live Tournament Matches</h1>

                {/* ✅ Display Loading Indicator */}
                {loading ? (
                    <p className="text-center text-gray-500">Loading matches...</p>
                ) : (
                    <MatchTabs
                        matches={matches}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        refreshMatches={fetchMatches}
                        updateMatch={updateMatch} // ✅ Ensure updateMatch is passed
                    />
                )}
            </div>

            {/* Floating Sidebar Toggle Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed right-7 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition z-50"
            >
                {isSidebarOpen ? "❌ Close" : <PiArrowSquareLeftBold className="text-3xl" />}
            </button>

            {/* Sidebar Sliding Window */}
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
                            />
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default LiveTournament;
