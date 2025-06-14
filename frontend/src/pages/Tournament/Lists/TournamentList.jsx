// src/pages/TournamentList.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

// Assuming you have these components from your UI library (like shadcn/ui)
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FaSpinner } from "react-icons/fa";

import TournamentItem from "../Components/TournamentItem.jsx";
import RegisterModal from "@/pages/Modals/registerModal.jsx";

// --- Custom Hook for All Tournament Logic ---
function useTournaments() {
    const [data, setData] = useState({ tournaments: [], registeredIds: [] });
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState(null);
    const { isAuthenticated, loginWithRedirect, getAccessTokenSilently, user } = useAuth0();
    const navigate = useNavigate();

    // Modal state
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);

    const fetchData = useCallback(async () => {
        if (!user?.sub) {
            // If user isn't loaded yet, wait. Can be handled better with Auth0Provider isLoading state.
            setStatus('loading');
            return;
        }

        setStatus("loading");
        try {
            const token = await getAccessTokenSilently();

            // Fetch active tournaments and user data in parallel for speed
            const [tournamentsResp, userResp] = await Promise.all([
                axios.get("http://localhost:8080/api/tournament/active"),
                axios.get(`http://localhost:8080/api/users/auth0/${user.sub}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            const tournaments = Array.isArray(tournamentsResp.data) ? tournamentsResp.data : [];
            const userId = userResp.data.id;

            // Fetch registrations after getting user ID
            const regResp = await axios.get(`http://localhost:8080/api/registration/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const registeredIds = regResp.data.map((r) => r.tournamentId);

            setData({ tournaments, registeredIds });
            setStatus("success");
        } catch (err) {
            console.error("Failed to fetch tournament data:", err);
            setError("We couldn't load the tournaments. Please try again.");
            setStatus("error");
        }
    }, [getAccessTokenSilently, user?.sub]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        } else {
            // If not authenticated, we can just fetch public tournaments without registration info
            // For now, we'll just show loading until they are authenticated.
            setStatus('loading');
        }
    }, [isAuthenticated, fetchData]);

    // Actions
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

    // Optimistic UI update: Mark as registered instantly
    const onRegistered = (tournamentId) => {
        setData(prevData => ({
            ...prevData,
            registeredIds: [...prevData.registeredIds, tournamentId]
        }));
        closeRegister();
    };

    // Memoize the return value to stabilize props for child components
    return useMemo(() => ({
        status,
        tournaments: data.tournaments,
        registeredIds: data.registeredIds,
        error,
        refetch: fetchData,
        handleView,
        handleRegister,
        modalProps: {
            isOpen: isRegisterOpen,
            tournament: selectedTournament,
            onClose: closeRegister,
            onRegistered: () => onRegistered(selectedTournament.id)
        }
    }), [data, status, error, fetchData, handleView, handleRegister, isRegisterOpen, selectedTournament]);
}


// --- The Refactored UI Component ---
export default function TournamentList() {
    const { status, tournaments, registeredIds, error, refetch, handleView, handleRegister, modalProps } = useTournaments();

    useEffect(() => {
        document.title = "Tournament List";
    }, []);

    const renderContent = () => {
        if (status === 'loading') {
            return (
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                    <FaSpinner className="animate-spin text-4xl text-gray-400" />
                    <p className="text-muted-foreground">Loading tournaments...</p>
                </div>
            );
        }

        if (status === 'error') {
            return (
                <div className="text-center py-10">
                    <p className="text-lg font-semibold text-destructive">{error}</p>
                    <Button onClick={refetch} className="mt-4">Try Again</Button>
                </div>
            );
        }

        if (tournaments.length === 0) {
            return <NoTournamentsFound onRefresh={refetch} />;
        }

        return (
            <ul className="mt-4 space-y-4">
                {tournaments.map((t) => (
                    <TournamentItem
                        key={t.id}
                        tournament={t}
                        isRegistered={registeredIds.includes(t.id)}
                        onView={() => handleView(t.id)}
                        onRegister={() => handleRegister(t)}
                    />
                ))}
            </ul>
        );
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle className="text-center text-3xl font-bold">
                        Active Tournaments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>

            {modalProps.isOpen && <RegisterModal {...modalProps} />}
        </div>
    );
}

// A small component for the empty state to keep the main return clean
const NoTournamentsFound = ({ onRefresh }) => {
    const navigate = useNavigate();
    return (
        <div className="text-center py-10">
            <h3 className="text-xl font-semibold text-foreground">No active tournaments found.</h3>
            <p className="text-muted-foreground mt-2">Check back later or set up a new one!</p>
            <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline" onClick={onRefresh}>Refresh</Button>
                <Button onClick={() => navigate("/tournament/setup")}>Setup a Tournament</Button>
            </div>
        </div>
    );
};
// PropTypes can be added later if needed, but for now, this is a functional component
// that uses hooks to manage state and side effects cleanly.
// This keeps the component focused on rendering and logic, while the custom hook handles data fetching and state management.
// This approach allows for better separation of concerns and makes the component easier to test and maintain.

