import React, { useState, useEffect } from "react";
import axios from "axios";

const MatchTest = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /** ✅ Fetch Matches from API */
    const fetchMatches = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/api/tournament/matches");
            console.log("📡 API Response:", response.data);
            setMatches(response.data || []); // ✅ Ensure we set an array
            setError(null);
        } catch (err) {
            console.error("❌ Error fetching matches:", err);
            setError("Failed to fetch matches.");
        } finally {
            setLoading(false);
        }
    };

    /** Fetch Data on Component Mount */
    useEffect(() => {
        fetchMatches();
    }, []);

    /** ✅ Show Loading State */
    if (loading) {
        return <p>⏳ Loading matches...</p>;
    }

    /** ✅ Show Error State */
    if (error) {
        return <p className="text-red-500">❌ {error}</p>;
    }

    /** ✅ Render Matches */
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Match Test Component</h1>
            <button onClick={fetchMatches} className="bg-blue-500 text-white px-3 py-2 rounded mb-4">
                Refresh Matches
            </button>
            {matches.length === 0 ? (
                <p className="text-gray-500">⚠️ No matches found.</p>
            ) : (
                <ul className="space-y-2">
                    {matches.map((match) => (
                        <li key={match.id} className="border p-3 rounded bg-gray-100">
                            <strong>Match ID:</strong> {match.id || "N/A"} <br />

                            {/* ✅ Display Player Names for Team 1 */}
                            <strong>Team 1:</strong>
                            {match.team1?.player1?.name ?? "Unknown Player 1"} &
                            {match.team1?.player2?.name ?? "Unknown Player 2"}
                            <span> ({match.team1?.name || "No Team Name"})</span>
                            <br />

                            {/* ✅ Display Player Names for Team 2 */}
                            <strong>Team 2:</strong>
                            {match.team2?.player1?.name ?? "Unknown Player 1"} &
                            {match.team2?.player2?.name ?? "Unknown Player 2"}
                            <span> ({match.team2?.name || "No Team Name"})</span>
                            <br />

                            <strong>Status:</strong> {match.status || "N/A"} <br />
                            <strong>Score:</strong> {match.team1Score ?? "N/A"} - {match.team2Score ?? "N/A"}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MatchTest;
