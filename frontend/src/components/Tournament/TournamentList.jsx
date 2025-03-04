import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchTournamentById } from "../utils/dataUtils.js";

const TournamentList = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    /** ✅ Fetch All Active Tournaments using data utils */
    useEffect(() => {
        const fetchTournaments = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:8080/api/tournament/activeTournaments");
                const text = await response.text(); // read raw text response
                console.log("Raw active tournament response:", text);

                // If your endpoint returns just an ID string, wrap it in an array for consistency:
                let data = text.trim() ? [text.trim()] : [];

                // Log the parsed data
                console.log("Parsed tournament IDs:", data);

                // Use the helper function to fetch full tournament details for each ID
                const tournamentDetails = await Promise.all(
                    data.map(tournamentId => fetchTournamentById(tournamentId))
                );
                console.log("Fetched tournament details:", tournamentDetails);

                // Filter out any null results from failed fetches
                setTournaments(tournamentDetails.filter(t => t !== null));
            } catch (err) {
                console.error("❌ Error fetching tournaments:", err);
                setError("Failed to load tournaments.");
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
                    🏆 Active Tournaments
                </h2>

                {loading ? (
                    <p className="text-center text-gray-500">Loading tournaments...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : tournaments.length === 0 ? (
                    <div className="text-center">
                        <p className="text-gray-600">No active tournaments found.</p>
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
                                key={tournament.id} // Unique key
                                className="border p-4 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                onClick={() => handleSelectTournament(tournament.id)}
                            >
                                <p className="text-lg font-semibold">{tournament.name}</p>
                                <p className="text-gray-600 dark:text-gray-300">ID: {tournament.id}</p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Started: {new Date(tournament.dateHeld).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TournamentList;
