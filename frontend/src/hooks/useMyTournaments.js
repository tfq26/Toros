// src/hooks/useMyTournaments.js
import { useState, useEffect, useCallback, useMemo } from "react";
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

    const fetchData = useCallback(async () => {
        if (!isAuthenticated) {
            setStatus("unauthenticated");
            return;
        }

        setStatus("loading");
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(
                "http://localhost:8080/api/tournaments/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTournaments(Array.isArray(response.data) ? response.data : []);
            setStatus("success");
        } catch (err) {
            console.error("Error fetching user's tournaments:", err);
            setError("We couldn't load your tournaments. Please try again.");
            setStatus("error");
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    const handleTournamentClick = (tournamentId) => {
        navigate(`/tournament/live/${tournamentId}`);
    };

    const handleManage = (id) => {
        navigate(`/tournament/manage/${id}`);
    };

    const handleView = (id) => {
        navigate(`/tournament/live/${id}`);
    };

    useEffect(() => {
        if (!isAuthLoading) {
            fetchData();
        }
    }, [isAuthLoading, fetchData]);

    return useMemo(
        () => ({
            status,
            tournaments,
            error,
            refetch: fetchData,
            handleView,
            handleManage,
            handleTournamentClick,
            isAuthenticated,
            loginWithRedirect,
        }),
        [
            status,
            tournaments,
            error,
            fetchData,
            handleView,
            handleManage,
            handleTournamentClick,
            isAuthenticated,
            loginWithRedirect,
        ]
    );
}
