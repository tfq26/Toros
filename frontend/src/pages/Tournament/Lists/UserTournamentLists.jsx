// UserTournamentList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
} from "@/components/ui/context-menu.jsx";
import { convertDate } from "@/utils/functions/dataUtils.js";

const UserTournamentList = () => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTournaments = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const token = await getAccessTokenSilently();
                const response = await axios.get(
                    "http://localhost:8080/api/tournament/registered",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setTournaments(response.data || []);
                setError(null);
            } catch (err) {
                console.error("❌ Error fetching registered tournaments:", err);
                setError("Failed to load your tournaments.");
            } finally {
                setLoading(false);
            }
        };

        fetchTournaments();
    }, [isAuthenticated, getAccessTokenSilently]);

    const handleSelectTournament = (id) => {
        navigate(`/tournament/live/${id}`);
    };

    const handleEndTournament = async (id) => {
        // same as before...
    };

    if (loading) return <p className="text-center">Loading your tournaments…</p>;
    if (error)   return <p className="text-center text-red-500">{error}</p>;

    return tournaments.length === 0 ? (
        <p className="text-center">You’re not registered in any active tournaments.</p>
    ) : (
        <ul className="mt-4 space-y-3">
            {tournaments.map((t) => (
                <ContextMenu key={t.id}>
                    <ContextMenuTrigger asChild>
                        <li
                            className="border p-4 rounded-lg cursor-pointer hover:bg-emerald-100"
                            onClick={() => handleSelectTournament(t.id)}
                        >
                            <p className="text-lg font-semibold">{t.name}</p>
                            <p className="text-gray-600">Started: {convertDate(t.startTime, navigator.language)}</p>
                        </li>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem onSelect={() => handleEndTournament(t.id)}>
                            End Tournament
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            ))}
        </ul>
    );
};

export default UserTournamentList;
