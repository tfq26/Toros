// src/pages/TournamentList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import TournamentItem from "../Components/TournamentItem.jsx";
import RegisterModal from "@/pages/Modals/registerModal.jsx";

export default function TournamentList() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registeredIds, setRegisteredIds] = useState([]);

    const { isAuthenticated, loginWithRedirect, getAccessTokenSilently, user } =
        useAuth0();
    const navigate = useNavigate();

    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const resp = await axios.get(
                    "http://localhost:8080/api/tournament/active"
                );
                setTournaments(Array.isArray(resp.data) ? resp.data : []);
            } catch {
                setError("Failed to load tournaments.");
            } finally {
                setLoading(false);
            }
        }

        async function fetchRegistrations() {
            if (isAuthenticated && user?.sub) {
                try {
                    const token = await getAccessTokenSilently();
                    const userResp = await axios.get(
                        `http://localhost:8080/api/users/auth0/${user.sub}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const userId = userResp.data.id;
                    const regResp = await axios.get(
                        `http://localhost:8080/api/registration/user/${userId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setRegisteredIds(regResp.data.map((r) => r.tournamentId));
                } catch (err) {
                    console.error(err);
                }
            }
        }

        fetchData();
        fetchRegistrations();
    }, [isAuthenticated, getAccessTokenSilently, user?.sub]);

    const handleView = (id) => navigate(`/tournament/live/${id}`);
    const handleRegister = (tourney) => {
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
        // optionally refresh registrations here
    };

    useEffect(() => {
        document.title = "Tournament List";
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg dark:bg-gray-900/50">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
                    My Tournaments
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
                            const isReg = registeredIds.includes(t.id);
                            const actions = [
                                {
                                    label: isReg ? "Registered" : "Register",
                                    type: "register",
                                    onClick: () => handleRegister(t),
                                    disabled: isReg,
                                    title: isReg ? "Already registered" : "Click to register",
                                    className:
                                        "bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded disabled:bg-gray-400",
                                },
                                {
                                    label: "View",
                                    type: "view",
                                    onClick: () => handleView(t.id),
                                },
                                // e.g. extra actions:
                                // {
                                //   label: "Contact",
                                //   type: "contact",
                                //   onClick: () => contactOrganizer(t.id),
                                // },
                                // {
                                //   label: "Start",
                                //   type: "start",
                                //   onClick: () => startTournament(t.id),
                                // },
                            ];

                            return (
                                <TournamentItem
                                    key={t.id}
                                    tournament={t}
                                    actions={actions}
                                />
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
}
