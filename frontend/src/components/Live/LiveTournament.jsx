import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorPage from "../Error.jsx";
import MatchCard from "./MatchCard";
import MatchTable from "./MatchTable";
import Sidebar from "./Sidebar.jsx";
import LoadingModal from "../LoadingModal";  // Import the loading modal

const LiveTournament = ({ setTournamentSetupComplete, tournamentConfig }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detailedError, setDetailedError] = useState(null);
    const [viewMode, setViewMode] = useState("tile");
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/tournament/live");
                setMatches(response.data || []);
                setLoading(false);
            } catch (err) {
                const errorMessage =
                    err.response?.data?.message || "Failed to fetch live matches. Please try again.";
                const detailedMessage = err.response?.data?.detailedMessage || null;
                setError(errorMessage);
                setDetailedError(detailedMessage);
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const endTournament = async () => {
        if (window.confirm("Are you sure you want to end the tournament? This action cannot be undone.")) {
            try {
                const response = await axios.post("http://localhost:8080/api/tournament/live/end");
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

    if (loading)
        return <LoadingModal message="Fetching Live Matches" description="We're fetching the latest match data. Please wait..." />;
    // Show loading modal while loading data
    if (error) return <ErrorPage statusCode={500} message={error} detailedMessage={detailedError} />;

    return (
        <div className="container mx-auto px-4 py-6 flex gap-6 w-screen p-5">
            {/* Main Content */}
            <div className="flex-grow">
                {viewMode === "tile" ? (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Live Tournament Matches (Tile View)</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {matches.map((match, index) => (
                                <MatchCard
                                    key={match.id || index}
                                    match={{ ...match, id: index + 1 }}
                                    updateMatch={() => {}}
                                />
                            ))}
                        </div>
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
