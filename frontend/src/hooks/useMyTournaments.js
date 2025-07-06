import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export default function useMyTournaments() {
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

    //
    // Fetch all tournaments (public or admin-facing)
    // ✨ FIX: The dependency array is correct and does not include state it sets.
    //
    const fetchAllTournaments = useCallback(async () => {
        console.log("[useMyTournaments] ▶ fetchAllTournaments()");
        setStatus("loading");
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(
                "http://localhost:8080/api/tournaments/all",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTournaments(Array.isArray(response.data) ? response.data : []);
            setStatus("success");
        } catch (err) {
            console.error("[useMyTournaments] ❌ fetchAll error:", err.response?.status, err.response?.data ?? err.message);
            setError("Could not load all tournaments. Please try again.");
            setStatus("error");
        }
    }, [getAccessTokenSilently]);

    //
    // Fetch only *this user’s* tournaments
    // ✨ FIX: The dependency array is correct and does not include state it sets.
    //
    const fetchMyTournaments = useCallback(async () => {
        console.log("[useMyTournaments] ▶ fetchMyTournaments()", { isAuthenticated });
        if (!isAuthenticated) {
            console.log("[useMyTournaments] ⛔ Not authenticated");
            setStatus("unauthenticated");
            return;
        }

        setStatus("loading");
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(
                "http://localhost:8080/api/tournaments/my",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTournaments(Array.isArray(response.data) ? response.data : []);
            setStatus("success");
        } catch (err) {
            console.error("[useMyTournaments] ❌ fetchMy error:", err.response?.status, err.response?.data ?? err.message);
            setError("Could not load your tournaments. Please try again.");
            setStatus("error");
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    // ✨ IMPROVED: This initial load is now smarter.
    // It waits for auth to be ready, then fetches "my" tournaments if logged in,
    // or "all" tournaments if not. This prevents an unnecessary initial fetch of "all".
    useEffect(() => {
        if (!isAuthLoading) {
            if (isAuthenticated) {
                fetchMyTournaments();
            } else {
                // You could fetch all, or set to unauthenticated.
                // For a "My Tournaments" page, setting status directly is often better.
                setStatus("unauthenticated");
                setTournaments([]); // Clear any old tournaments
            }
        }
    }, [isAuthLoading, isAuthenticated, fetchMyTournaments]);


    // Navigation handlers are stable because `Maps` is stable.
    const handleTournamentClick = (id) => navigate(`/tournament/live/${id}`);
    const handleManage = (id) => navigate(`/tournament/manage/${id}`);
    const handleView = (id) => navigate(`/tournament/live/${id}`);

    // ✨ FIX: Removed the useMemo hook.
    // The functions are already stabilized by useCallback. Returning a new object
    // on every state change was the cause of the infinite loop.
    return {
        status,
        tournaments,
        error,
        refetchAll: fetchAllTournaments,
        refetchMine: fetchMyTournaments,
        handleView,
        handleManage,
        handleTournamentClick,
        isAuthenticated,
        loginWithRedirect,
    };
}