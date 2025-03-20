import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchTournamentById } from "../utils/dataUtils.js"; // Import the helper
import { Helmet } from "react-helmet";

const TournamentList = () => {
    const [tournaments, setTournaments] = useState([]); // Always an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    /** ✅ Fetch Active Tournament(s) */
    useEffect(() => {
        const fetchTournaments = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8080/api/tournament/activeTournament");
                let data = response.data;
                console.log("Raw active tournament response:", data);

                // If the response is a string, it's a single tournament ID.
                if (typeof data === "string") {
                    const tournamentDetail = await fetchTournamentById(data.trim());
                    if (tournamentDetail) {
                        setTournaments([tournamentDetail]);
                    } else {
                        console.error("❌ Failed to fetch tournament details for ID:", data);
                        setTournaments([]);
                    }
                } else if (Array.isArray(data)) {
                    // If it's already an array of tournament objects, use it directly.
                    setTournaments(data);
                } else {
                    console.error("❌ Unexpected response format:", data);
                    setTournaments([]);
                }
            } catch (err) {
                console.error("❌ Error fetching tournaments:", err);
                setError("Failed to load tournaments.");
                setTournaments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTournaments();
    }, []);

    /** ✅ Navigate to Selected Tournament */
    const handleSelectTournament = (tournamentId) => {
        navigate(`/tournament/live/${tournamentId}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-3xl bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
                    Active Tournaments
                </h2>

                {loading ? (
                    <p className="text-center text-gray-500">Loading tournaments...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : tournaments.length === 0 ? (
                    // Change: Handle empty list by showing a friendly message instead of an error response.
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-800 dark:text-white text-center">No active tournaments found.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Refresh
                        </button>
                    </div>
                ) : (
                    <ul className="mt-4 space-y-3">
                        {tournaments.map((tournament) => (
                            <li
                                key={tournament.id} // Ensure unique key
                                className="border p-4 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                onClick={() => handleSelectTournament(tournament.id)}
                            >
                                <p className="text-lg font-semibold">{tournament.name}</p>
                                <p className="text-gray-600 dark:text-gray-300">ID: {tournament.id}</p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Started: {new Date(tournament.dateHeld).toLocaleString()}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">Status: {tournament.status}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TournamentList;
