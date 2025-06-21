import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FaSpinner, FaPlusCircle } from "react-icons/fa";

import TournamentItem from "../Components/TournamentItem.jsx";

// ✨ RENAMED: The hook now has a more specific purpose.
function useMyTournaments() {
    const [tournaments, setTournaments] = useState([]);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState(null);
    const {
        isLoading: isAuthLoading,
        isAuthenticated,
        getAccessTokenSilently,
        loginWithRedirect,
    } = useAuth0();
    const navigate = useNavigate();

    // Inside your useMyTournaments hook

    // In your useMyTournaments hook inside MyTournamentsPage.jsx

    const fetchData = useCallback(async () => {
        // This check correctly prevents the call if the user is not logged in.
        if (!isAuthenticated) {
            setStatus("unauthenticated");
            return;
        }

        setStatus("loading");
        try {
            // STEP 1: Get the access token from Auth0 before making the call.
            console.log("Getting access token...");
            const token = await getAccessTokenSilently();
            console.log("Token received, making API call...");

            // STEP 2: Include the token in the 'Authorization' header of your request.
            const response = await axios.get("http://localhost:8080/api/tournaments/my", {
                headers: {
                    Authorization: `Bearer ${token}` // ✨ This is the critical fix
                }
            });

            // Assuming the response data is the array of tournaments
            setTournaments(Array.isArray(response.data) ? response.data : []);
            setStatus("success");

        } catch (err) {
            console.error("Error fetching user's tournaments:", err);
            setError("We couldn't load your tournaments. Please try again.");
            setStatus("error");
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    useEffect(() => {
        if (!isAuthLoading) {
            fetchData();
        }
    }, [isAuthLoading, fetchData]);

    // ✨ NEW: Handler for managing a tournament.
    const handleManage = (id) => navigate(`/tournament/manage/${id}`);
    const handleView = (id) => navigate(`/tournament/live/${id}`);

    // ✨ REMOVED: All state and handlers related to registration have been deleted.

    return useMemo(() => ({
        status,
        tournaments,
        error,
        refetch: fetchData,
        handleView,
        handleManage, // ✨ Exposing the new handler
        isAuthenticated,
        loginWithRedirect,
    }), [status, tournaments, error, fetchData, isAuthenticated, loginWithRedirect]);
}


// ✨ RENAMED: The component now has a more descriptive name.
export default function MyTournamentsPage() {
    const {
        status,
        tournaments,
        error,
        refetch,
        handleView,
        handleManage,
        isAuthenticated,
        loginWithRedirect
    } = useMyTournaments();

    useEffect(() => {
        document.title = "My Tournaments";
    }, []);

    const renderContent = () => {
        if (status === 'loading') {
            return (
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                    <FaSpinner className="animate-spin text-4xl text-gray-400" />
                    <p className="text-muted-foreground">Loading your tournaments...</p>
                </div>
            );
        }

        // ✨ NEW: A dedicated state for when the user is not logged in.
        if (status === 'unauthenticated' || !isAuthenticated) {
            return (
                <div className="text-center py-10">
                    <h3 className="text-xl font-semibold text-foreground">Please log in to view your tournaments.</h3>
                    <Button onClick={() => loginWithRedirect()} className="mt-6">Log In</Button>
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
                        // ✨ REMOVED: isRegistered prop is gone.
                        onView={() => handleView(t.id)}
                        // ✨ REPLACED: onRegister is now onManage.
                        onManage={() => handleManage(t.id)}
                    />
                ))}
            </ul>
        );
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6">
            <Card className="w-full max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-3xl font-bold">My Tournaments</CardTitle>
                    <Button onClick={() => navigate("/tournament/setup")}>
                        <FaPlusCircle className="mr-2" /> Create New
                    </Button>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>
            {/* ✨ REMOVED: The RegisterModal is no longer needed here. */}
        </div>
    );
}

// ✨ UPDATED: The message is now more appropriate for this page.
const NoTournamentsFound = ({ onRefresh }) => {
    const navigate = useNavigate();
    return (
        <div className="text-center py-10">
            <h3 className="text-xl font-semibold text-foreground">You haven&#39;t created any tournaments yet.</h3>
            <p className="text-muted-foreground mt-2">Get started by setting up your first one!</p>
            <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline" onClick={onRefresh}>Refresh List</Button>
                <Button onClick={() => navigate("/tournament/setup")}>Setup a Tournament</Button>
            </div>
        </div>
    );
};