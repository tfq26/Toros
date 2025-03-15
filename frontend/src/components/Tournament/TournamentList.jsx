import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TournamentList = () => {
    const [tournaments, setTournaments] = useState([]); // ✅ Always an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    /** ✅ Fetch Active Tournaments */
    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/tournament/activeTournaments");

                if (Array.isArray(response.data)) {
                    setTournaments(response.data);
                } else {
                    console.error("❌ Unexpected response format:", response.data);
                    setTournaments([]); // ✅ Ensure it's always an array
                }
            } catch (err) {
                console.error("❌ Error fetching tournaments:", err);
                setError("Failed to load tournaments.");
                setTournaments([]); // ✅ Prevents crashes
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
                    <p className="text-center text-gray-600">No active tournaments found.</p>
                ) : (
                    <ul className="mt-4 space-y-3">
                        {tournaments.map((tournament) => (
                            <li
                                key={tournament.id}
                                className="border p-4 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                onClick={() => handleSelectTournament(tournament.id)}
                            >
                                <p className="text-lg font-semibold">{tournament.name}</p>
                                <p className="text-gray-600 dark:text-gray-300">ID: {tournament.id}</p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Started: {new Date(tournament.dateHeld).toLocaleString()}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">Status: {tournament.status}</p>

                                {tournament.teams && tournament.teams.length > 0 ? (
                                    <div className="mt-2">
                                        <p className="font-medium text-gray-700 dark:text-white">Teams:</p>
                                        <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                                            {tournament.teams.map((team) => (
                                                <li key={team.id}>
                                                    {team.name} (Skill: {team.skillLevel || "N/A"})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 mt-2">No teams available.</p>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TournamentList;
