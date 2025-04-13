// TournamentList.jsx
import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchTournamentById } from "@/utils/functions/dataUtils.js";
import { convertDate } from "@/utils/functions/dataUtils.js";
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
} from "@/components/ui/context-menu";

const TournamentList = () => {
    const [tournaments, setTournaments] = useState([]); // Always an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch Active Tournament(s)
    useEffect(() => {
        const fetchTournaments = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/tournament/activeTournament"
                );
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

    // Navigate to Selected Tournament
    const handleSelectTournament = (tournamentId) => {
        navigate(`/tournament/live/${tournamentId}`);
    };

    // Handler to end a tournament by right-click context menu
    const handleEndTournament = async (tournamentId) => {
        try {
            // Send a request to end the tournament.
            // Assumes API endpoint accepts a tournamentId in the request body.
            const response = await axios.post(
                "http://localhost:8080/api/tournament/end",
                { tournamentId }
            );
            if (response.status === 200) {
                console.log("Tournament ended successfully:", tournamentId);
                // Refresh the tournament list (or update state accordingly)
                window.location.reload();
            } else {
                console.error("Failed to end tournament");
            }
        } catch (error) {
            console.error("Error ending tournament:", error);
        }
    };

    // Set the tab title on mount.
    useEffect(() => {
        document.title = "Tournament List";
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg dark:bg-gray-900/50">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
                    Active Tournaments
                </h2>

                {loading ? (
                    <p className="text-center text-gray-500">Loading tournaments...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : tournaments.length === 0 ? (
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                            No active tournaments found.
                        </p>
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Refresh
                            </button>
                            <button
                                onClick={() => (window.location.href = "/tournament/setup")}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Setup
                            </button>
                        </div>
                    </div>
                ) : (
                    <ul className="mt-4 space-y-3">
                        {tournaments.map((tournament) => (
                            <ContextMenu key={tournament.id}>
                                <ContextMenuTrigger asChild>
                                    <li
                                        className="border p-4 rounded-lg cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900 dark:bg-emerald-950 transition duration-200"
                                        onClick={() => handleSelectTournament(tournament.id)}
                                    >
                                        <p className="text-lg font-semibold">
                                            {tournament.name}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            ID: {tournament.id}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Started: {convertDate(tournament.startTime, navigator.language)}
                                        </p>
                                    </li>
                                </ContextMenuTrigger>
                                <ContextMenuContent>
                                    <ContextMenuItem onSelect={() => handleEndTournament(tournament.id)}>
                                        End Tournament
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TournamentList;
