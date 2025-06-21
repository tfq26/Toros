import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";

// Components
import MatchTabs from "./MatchTabs";
import EndTournamentModalUpdated from "@/pages/Modals/EndTournamentModalUpdated.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { FaWindowMaximize, FaFlagCheckered, FaExclamationTriangle } from "react-icons/fa";

// Utilities & Context
import { fetchMatchesByTournament } from "@/utils/functions/dataUtils.js";
import { useTournament } from "@/contexts/TournamentContext.jsx";

export default function LiveTournament() {
    const { tournamentId } = useParams();

    // Global state from context
    const tournamentContext = useTournament();
    if (!tournamentContext) {
        return <div className="p-6 text-center text-red-500">❌ Tournament context unavailable.</div>;
    }

    const {
        tournamentConfig,
        setTournamentConfig,
        setIsSetupComplete
    } = tournamentContext;

    // Page-specific state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loadingMatches, setLoadingMatches] = useState(true);
    const [sortOrder, setSortOrder] = useState("desc");
    const [showEndModal, setShowEndModal] = useState(false);

    // Effect to fetch main tournament configuration
    useEffect(() => {
        if (tournamentConfig?.id === tournamentId) {
            setIsLoading(false);
            return;
        }
        const fetchTournamentData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`/api/tournaments/${tournamentId}`);
                setTournamentConfig(response.data);
                setIsSetupComplete(response.data.status !== 'SETUP');
            } catch (err) {
                console.error("Error loading tournament config:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTournamentData();
    }, [tournamentId, tournamentConfig?.id, setTournamentConfig, setIsSetupComplete]);

    // Effect to update the browser document title
    useEffect(() => {
        if (tournamentConfig) {
            document.title = tournamentConfig.name ? `${tournamentConfig.name} • Live` : "Tournament Live";
        }
    }, [tournamentConfig]);

    // Logic for fetching matches
    const fetchMatches = useCallback(async () => {
        if (!tournamentConfig?.id) return;
        setLoadingMatches(true);
        try {
            const ms = await fetchMatchesByTournament(tournamentConfig.id);
            setMatches(ms);
        } catch (err) {
            console.error("Error fetching matches:", err);
            setMatches([]);
        } finally {
            setLoadingMatches(false);
        }
    }, [tournamentConfig?.id]);

    const debouncedFetch = useCallback(debounce(() => fetchMatches(), 500), [fetchMatches]);

    useEffect(() => {
        debouncedFetch();
        return () => debouncedFetch.cancel();
    }, [debouncedFetch]);

    // Robust optimistic update logic for a single match
    const updateMatch = async (updatedMatchData) => {
        const previousMatches = [...matches];
        const newMatches = matches.map(m =>
            m.id === updatedMatchData.id ? { ...m, ...updatedMatchData } : m
        );
        setMatches(newMatches);

        try {
            await axios.patch(
                `/api/match/${updatedMatchData.id}`,
                {
                    team1Score: updatedMatchData.team1Score,
                    team2Score: updatedMatchData.team2Score,
                    status: updatedMatchData.status,
                }
            );
        } catch (e) {
            console.error("❌ Failed to update match, reverting UI.", e);
            setMatches(previousMatches);
            alert("Failed to save match status. Please try again.");
        }
    };

    // ✨ FIXED: This now opens the new URL format you requested.
    const handleOpenWindow = () => {
        // Your router should now have a route like: /tournament/live/window/:tournamentId
        window.open(`/tournament/live/window/${tournamentId}`, '_blank', 'noopener,noreferrer');
    };


    // Placeholder for duplicate check logic
    const checkForDuplicates = () => {
        console.log("Checking for duplicate matches...");
        alert("Duplicate check feature not yet implemented.");
    };

    if (isLoading) return <div className="p-6 text-center text-lg">🔄 Loading tournament data...</div>;
    if (error) return <div className="p-6 text-center text-red-500">❌ Couldn’t load tournament: {error.message}</div>;
    if (!tournamentConfig) return <div className="p-6 text-center text-gray-500">⚠️ No tournament data available.</div>;

    return (
        <div className="flex flex-col p-4 gap-4">
            {/* Header */}
            <div className="flex items-center justify-between bg-card text-card-foreground p-4 rounded-lg shadow">
                <h1 className="text-2xl font-bold">
                    {tournamentConfig.name}
                </h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleOpenWindow}>
                        <FaWindowMaximize className="mr-2 h-4 w-4" /> Window View
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setShowEndModal(true)}>
                        <FaFlagCheckered className="mr-2 h-4 w-4" /> End Tournament
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow">
                <div className="mb-4">
                    <Button onClick={checkForDuplicates} variant="secondary">
                        <FaExclamationTriangle className="mr-2 h-4 w-4" /> Check Duplicate Match-ups
                    </Button>
                </div>

                <Separator className="my-4" />

                {loadingMatches ? (
                    <p className="text-center py-8">Loading matches…</p>
                ) : (
                    <MatchTabs
                        matches={matches}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        refreshMatches={fetchMatches}
                        updateMatch={updateMatch}
                    />
                )}
            </div>

            {/* Modals and other overlays */}
            <EndTournamentModalUpdated
                isOpen={showEndModal}
                onClose={() => setShowEndModal(false)}
                endTournament={async () => {
                    try {
                        await axios.post(`/api/tournament/${tournamentConfig.id}/end`);
                        console.log("Tournament ended.");
                    } catch (e) {
                        console.error("Failed to end tournament:", e);
                    }
                }}
            />
        </div>
    );
}
