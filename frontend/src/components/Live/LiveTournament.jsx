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
    const [detailedError, setDetailedError] = useState(null);
    const [viewMode, setViewMode] = useState("tile");
    const [lastUpdated, setLastUpdated] = useState(null);
    const navigate = useNavigate();

    const fetchMatches = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/api/tournament/matches");
            setMatches(response.data || []);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || "Failed to fetch live matches. Please try again.";
            const detailedMessage = err.response?.data?.detailedMessage || null;
            setError(errorMessage);
            setDetailedError(detailedMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
        // Automatically refresh every 30 seconds
        const interval = setInterval(fetchMatches, 30000);
        return () => clearInterval(interval);
    }, []);

    const endTournament = async () => {
        if (
            window.confirm(
                "Are you sure you want to end the tournament? This action cannot be undone."
            )
        ) {
            try {
                const response = await axios.post("http://localhost:8080/api/tournament/end");
                if (response.status === 200) {
                    alert("Tournament ended successfully!");
                    setTournamentSetupComplete(false); // Reset the tournament state
                    navigate("/"); // Redirect to the home page
                } else {
                    alert("Failed to end the tournament. Please try again.");
                }
            } catch (error) {
                console.error("Error ending tournament:", error.message);
                alert("An error occurred while ending the tournament. Please try again.");
            }
        }
    };

    const matchStats = matches.reduce(
        (stats, match) => {
            if (match.status === "Complete") stats.complete++;
            else if (match.status === "In Progress") stats.inProgress++;
            else if (match.status === "Scheduled") stats.notStarted++;
            return stats;
        },
        { complete: 0, inProgress: 0, notStarted: 0 }
    );

    if (loading) {
        return (
            <LoadingModal
                message="Fetching Live Matches"
                description="We're fetching the latest match data. Please wait..."
            />
        );
    }

    if (error) {
        return <ErrorPage statusCode={500} message={error} detailedMessage={detailedError} />;
    }

    return (
        <div className="container mx-auto px-5 py-6 flex gap-6">
            {/* Main Content */}
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Live Tournament Matches</h1>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={fetchMatches}
                            className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
                        >
                            Refresh
                        </button>
                        {lastUpdated && (
                            <span className="text-sm text-gray-600">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
                        )}
                    </div>
                </div>
                {viewMode === "tile" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {matches.map((match, index) => (
                            <MatchCard
                                key={match.id || index}
                                match={{ ...match, id: match.id || index + 1 }}
                                updateMatch={() => {}}
                            />
                        ))}
                    </div>
                ) : (
                    <MatchTable matches={matches} updateMatch={() => {}} />
                )}
            </div>

            {/* Sidebar */}
            <Sidebar
                matchStats={matchStats}
                endTournament={endTournament}
                viewMode={viewMode}
                setViewMode={setViewMode}
                tournamentConfig={tournamentConfig}
            />
        </div>
    );
};

export default LiveTournament;
