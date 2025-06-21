import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
} from "@/components/ui/context-menu.jsx";
import { convertDate } from "@/utils/functions/dataUtils.js";
import { FaSpinner, FaSignOutAlt, FaEye } from "react-icons/fa"; // Importing icons

/**
 * ✨ NEW: Custom hook to encapsulate all logic for this page.
 */
function useRegisteredTournaments() {
    const { getAccessTokenSilently, isAuthenticated, isLoading: isAuthLoading } = useAuth0();
    const [tournaments, setTournaments] = useState([]);
    const [status, setStatus] = useState("loading");
    const navigate = useNavigate();

    const fetchTournaments = useCallback(async () => {
        if (!isAuthenticated) {
            setStatus("unauthenticated");
            return;
        }
        setStatus("loading");
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(
                "http://localhost:8080/api/tournaments/registered",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTournaments(response.data || []);
            setStatus("success");
        } catch (err) {
            console.error("❌ Error fetching registered tournaments:", err);
            setStatus("error");
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    useEffect(() => {
        // Wait for auth to be ready before fetching
        if (!isAuthLoading) {
            fetchTournaments();
        }
    }, [isAuthLoading, fetchTournaments]);

    const handleSelectTournament = (id) => {
        navigate(`/tournament/live/${id}`);
    };

    /**
     * ✨ NEW: Logic to handle withdrawing a user from a tournament.
     */
    const handleWithdraw = async (id) => {
        if (!window.confirm("Are you sure you want to withdraw from this tournament?")) {
            return;
        }

        // Optimistically remove the tournament from the UI
        setTournaments(prev => prev.filter(t => t.id !== id));

        try {
            const token = await getAccessTokenSilently();
            // This requires a new backend endpoint, e.g., DELETE or POST
            await axios.post(
                `http://localhost:8080/api/tournaments/${id}/withdraw`,
                {}, // Empty body for this example
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Optionally show a success notification here
        } catch (error) {
            console.error("❌ Failed to withdraw from tournament:", error);
            // If the API call fails, refetch the data to revert the UI change
            fetchTournaments();
            // Optionally show an error notification here
        }
    };

    return useMemo(() => ({
        tournaments,
        status,
        handleSelectTournament,
        handleWithdraw
    }), [tournaments, status, handleSelectTournament, handleWithdraw]);
}


/**
 * ✨ This component now cleanly handles rendering based on the hook's state.
 */
const UserTournamentList = () => {
    const { tournaments, status, handleSelectTournament, handleWithdraw } = useRegisteredTournaments();

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <FaSpinner className="animate-spin" />
                <span>Loading your registered tournaments…</span>
            </div>
        );
    }

    if (status === "error") {
        return <p className="text-center text-red-500">Failed to load your tournaments.</p>;
    }

    if (status === "unauthenticated") {
        return <p className="text-center text-muted-foreground">Please log in to see your tournaments.</p>;
    }

    return tournaments.length === 0 ? (
        <p className="text-center text-muted-foreground">You’re not registered in any active tournaments.</p>
    ) : (
        <ul className="space-y-3">
            {tournaments.map((t) => (
                <ContextMenu key={t.id}>
                    <ContextMenuTrigger asChild>
                        <li
                            className="border p-4 rounded-lg cursor-pointer transition-all hover:shadow-md hover:bg-muted dark:hover:bg-gray-800"
                            onClick={() => handleSelectTournament(t.id)}
                        >
                            <p className="text-lg font-semibold">{t.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {t.startDate ? `Starts: ${convertDate(t.startDate)}` : 'Date TBD'}
                            </p>
                        </li>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem onSelect={() => handleSelectTournament(t.id)} className="cursor-pointer">
                            <FaEye className="mr-2 h-4 w-4" />
                            View Live
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        {/* ✨ ACTION CHANGED: Replaced "End Tournament" with the correct action */}
                        <ContextMenuItem onSelect={() => handleWithdraw(t.id)} className="cursor-pointer text-red-600 focus:text-red-600">
                            <FaSignOutAlt className="mr-2 h-4 w-4" />
                            Withdraw from Tournament
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            ))}
        </ul>
    );
};

export default UserTournamentList;