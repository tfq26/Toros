import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { convertDate } from "@/utils/functions/dataUtils.js";
import RegisterModal from "@/pages/Modals/registerModal.jsx";
import { Button } from "@/components/ui/button.jsx";

const TournamentList = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registeredIds, setRegisteredIds] = useState([]);

    const { isAuthenticated, loginWithRedirect, getAccessTokenSilently, user } = useAuth0();
    const navigate = useNavigate();

    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);

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

        const fetchRegistrations = async () => {
            if (isAuthenticated && user?.sub) {
                try {
                    const token = await getAccessTokenSilently();

                    // Step 1: fetch the full user from backend by Auth0 ID
                    const userResp = await axios.get(
                        `http://localhost:8080/api/users/auth0/${user.sub}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    const userId = userResp.data.id; // this is your internal MongoDB user ID

                    // Step 2: fetch registrations for that userId (you’ll need this endpoint too)
                    const regResp = await axios.get(
                        `http://localhost:8080/api/registration/user/${userId}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    setRegisteredIds(regResp.data.map((reg) => reg.tournamentId));
                } catch (err) {
                    console.error("Error fetching registration info:", err);
                }
            }
        };

        fetchTournaments();
        fetchRegistrations();
    }, [isAuthenticated]);

    const handleSelect = (id) => navigate(`/tournament/live/${id}`);

    const openRegister = (tourney) => {
        if (!isAuthenticated) return loginWithRedirect();
        setSelectedTournament(tourney);
        setIsRegisterOpen(true);
    };

    const closeRegister = () => {
        setIsRegisterOpen(false);
        setSelectedTournament(null);
    };

    const onRegistered = () => {
        closeRegister();
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
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded dark:bg-blue-700 dark:hover:bg-blue-800"
                            >
                                Refresh
                            </button>
                            <button
                                onClick={() => (window.location.href = "/tournament/setup")}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded dark:bg-green-700 dark:hover:bg-green-800"
                            >
                                Setup
                            </button>
                        </div>
                    </div>
                ) : (
                    <ul className="mt-4 space-y-3">
                        {tournaments.map((t) => {
                            const isRegistered = registeredIds.includes(t.id);
                            return (
                                <li
                                    key={t.id}
                                    className="border p-4 rounded-lg transition dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                                >
                                    <div onClick={() => handleSelect(t.id)} className="cursor-pointer">
                                        <p className="text-lg font-semibold">{t.name}</p>
                                        <p className="text-gray-600 dark:text-gray-300">ID: {t.id}</p>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Started: {convertDate(t.startTime, navigator.language)}
                                        </p>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <Button
                                            onClick={() => openRegister(t)}
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded disabled:bg-gray-400"
                                            disabled={isRegistered}
                                            title={isRegistered ? "Already registered" : "Click to register"}
                                        >
                                            {isRegistered ? "Registered" : "Register"}
                                        </Button>
                                        <Button
                                            onClick={() => handleSelect(t.id)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                        >
                                            View
                                        </Button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

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
