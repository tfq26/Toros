// TournamentList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { convertDate } from "@/utils/functions/dataUtils.js";
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
} from "@/components/ui/context-menu.jsx";
import RegisterModal from "../../Modals/registerModal.jsx"; // ← placeholder you'll build

const TournamentList = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

    // Register‐modal state
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);

    // Fetch active tournaments
    useEffect(() => {
        const fetchTournaments = async () => {
            setLoading(true);
            try {
                const resp = await axios.get("http://localhost:8080/api/tournament/active");
                setTournaments(Array.isArray(resp.data) ? resp.data : []);
                setError(null);
            } catch (err) {
                console.error("Error fetching tournaments:", err);
                setError("Failed to load tournaments.");
            } finally {
                setLoading(false);
            }
        };
        fetchTournaments();
    }, []);

    const handleSelect = (id) => navigate(`/tournament/live/${id}`);

    const handleEnd = async (id) => {
        try {
            await axios.post("http://localhost:8080/api/tournament/end", { tournamentId: id });
            window.location.reload();
        } catch (err) {
            console.error("Error ending tournament:", err);
        }
    };

    const openRegister = (tourney) => {
        if (!isAuthenticated) {
            // prompt login
            return loginWithRedirect();
        }
        setSelectedTournament(tourney);
        setIsRegisterOpen(true);
    };

    const closeRegister = () => {
        setIsRegisterOpen(false);
        setSelectedTournament(null);
    };

    // (After you implement the modal you can call a callback to refresh)
    const onRegistered = () => {
        closeRegister();
        // Optionally refetch your tournaments or change state
    };

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
                        {tournaments.map((t) => (
                            <ContextMenu key={t.id}>
                                <ContextMenuTrigger asChild>
                                    <li className="border p-4 rounded-lg transition dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900">
                                        <div onClick={() => handleSelect(t.id)}>
                                            <p className="text-lg font-semibold">{t.name}</p>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                ID: {t.id}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                Started: {convertDate(t.startTime, navigator.language)}
                                            </p>
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                onClick={() => openRegister(t)}
                                                className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                                            >
                                                Register
                                            </button>
                                            <button
                                                onClick={() => handleSelect(t.id)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </li>
                                </ContextMenuTrigger>
                                <ContextMenuContent>
                                    <ContextMenuItem onSelect={() => handleEnd(t.id)}>
                                        End Tournament
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        ))}
                    </ul>
                )}
            </div>

            {/* Register Modal (you’ll implement it next) */}
            {isRegisterOpen && selectedTournament && (
                <RegisterModal
                    isOpen={isRegisterOpen}
                    tournament={selectedTournament}
                    onClose={closeRegister}
                    onRegistered={onRegistered}
                />
            )}
        </div>
    );
};

export default TournamentList;
