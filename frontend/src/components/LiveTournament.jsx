import React, { useEffect, useState } from "react";
import axios from "axios";
import ErrorPage from "./Error"; // Importing the existing ErrorPage component

const LiveTournament = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detailedError, setDetailedError] = useState(null); // For detailed error messages

    // Fetch matches from backend
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/tournament/live");
                setMatches(response.data);
                setLoading(false);
            } catch (err) {
                const errorMessage = err.response?.data?.message || "Failed to fetch live matches. Please try again.";
                const detailedMessage = err.response?.data?.detailedMessage || null;
                setError(errorMessage);
                setDetailedError(detailedMessage);
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    // Update match scores
    const updateMatch = async (id, team1Score, team2Score, status) => {
        try {
            await axios.patch(`http://localhost:8080/api/tournament/live/${id}`, null, {
                params: { team1Score, team2Score, status },
            });
            setMatches((prevMatches) =>
                prevMatches.map((match) =>
                    match.id === id ? { ...match, team1Score, team2Score, status } : match
                )
            );
            alert("Match updated successfully!");
        } catch (err) {
            alert("Failed to update match. Please try again.");
        }
    };

    if (loading) return <div>Loading matches...</div>;
    if (error) return <ErrorPage statusCode={500} message={error} detailedMessage={detailedError} />; // Pass detailed error

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Live Tournament Matches</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.map((match) => (
                    <div key={match.id} className="border p-4 rounded shadow">
                        <h2 className="text-lg font-bold mb-2">Court {match.courtNumber}</h2>
                        <p className="mb-2">
                            <strong>Team 1:</strong> {match.team1}
                        </p>
                        <p className="mb-2">
                            <strong>Team 2:</strong> {match.team2}
                        </p>
                        <p className="mb-2">
                            <strong>Score:</strong> {match.team1Score} - {match.team2Score}
                        </p>
                        <p className="mb-4">
                            <strong>Status:</strong> {match.status}
                        </p>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => {
                                const team1Score = prompt("Enter Team 1 score:", match.team1Score);
                                const team2Score = prompt("Enter Team 2 score:", match.team2Score);
                                const status = prompt("Enter Match Status:", match.status);
                                if (team1Score && team2Score && status) {
                                    updateMatch(match.id, parseInt(team1Score), parseInt(team2Score), status);
                                }
                            }}
                        >
                            Update Match
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveTournament;
