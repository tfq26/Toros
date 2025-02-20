import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorPage from "../Error.jsx";
import MatchCard from "./MatchCard";
import MatchTable from "./MatchTable";
import Sidebar from "./Sidebar.jsx";
import LoadingModal from "../LoadingModal";

const LiveTournament = ({ setTournamentSetupComplete, tournamentConfig }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState("table"); // ✅ Default to table mode
    const [lastUpdated, setLastUpdated] = useState(null);
    const navigate = useNavigate();

    /** ✅ Fetch Matches from API */
    const fetchMatches = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/api/tournament/matches");
            console.log("📡 API Response:", response.data);
            setMatches((prevMatches) => [...response.data]); // ✅ Force state update
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            console.error("❌ Error fetching matches:", err);
            setError(err.response?.data?.message || "Failed to fetch live matches.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
        const interval = setInterval(fetchMatches, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        console.log("📢 Matches State Updated:", matches); // ✅ Debugging
    }, [matches]);

    useEffect(() => {
        console.log("🖥️ View Mode:", viewMode); // ✅ Debugging
    }, [viewMode]);

    const updateMatch = async (matchId, team1Score, team2Score, status) => {
        try {
            const response = await axios.patch(`http://localhost:8080/api/tournament/match/${matchId}`, {
                team1Score,
                team2Score,
                status
            });

            if (response.status === 200) {
                console.log(`✅ Match ${matchId} updated successfully.`);
                fetchMatches(); // Refresh match data after update
            } else {
                alert("⚠️ Failed to update match. Please try again.");
            }
        } catch (error) {
            console.error("❌ Error updating match:", error.message);
            alert("An error occurred while updating the match.");
        }
    };

    /** ✅ End Tournament */
    const endTournament = async () => {
        if (window.confirm("Are you sure you want to end the tournament?")) {
            try {
                const response = await axios.post("http://localhost:8080/api/tournament/end");
                if (response.status === 200) {
                    alert("✅ Tournament ended successfully!");
                    setTournamentSetupComplete(false);
                    navigate("/");
                } else {
                    alert("⚠️ Failed to end the tournament.");
                }
            } catch (error) {
                console.error("❌ Error ending tournament:", error.message);
                alert("An error occurred while ending the tournament.");
            }
        }
    };

    if (loading) {
        return <LoadingModal message="Fetching Live Matches" description="Please wait..." />;
    }

    if (error) {
        return <ErrorPage statusCode={500} message={error} />;
    }

    return (
        <div className="w-auto h-screen flex flex-col md:flex-row pr-6">
            {/* Match List & Content Section */}
            <div className="flex-grow flex flex-col p-6 overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Live Tournament Matches</h1>
                    <button onClick={fetchMatches} className="bg-blue-500 text-white px-3 py-2 rounded">
                        Refresh
                    </button>
                </div>

                <div className="flex-1 overflow-auto">
                    {viewMode === "tile" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {matches.map((match) => (
                                <MatchCard key={match.id} match={match} updateMatch={updateMatch} />
                            ))}
                        </div>
                    ) : (
                        <MatchTable key={matches.length} matches={matches} updateMatch={updateMatch} />
                    )}
                </div>
            </div>

            {/* Sidebar Section with right padding */}
            <Sidebar
                matchStats={{}}
                endTournament={endTournament}
                viewMode={viewMode}
                setViewMode={setViewMode}
                className="w-auto md:w-1/4 h-full bg-gray-200 p-4 pr-6"
            />
        </div>
    );
};

export default LiveTournament;
