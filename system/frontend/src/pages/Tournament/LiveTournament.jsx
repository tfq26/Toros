import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";

// Components
import MatchTabs from "./MatchTabs";
import EndTournamentModalUpdated from "@/pages/Modals/EndTournamentModalUpdated.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.jsx";
import { FaWindowMaximize, FaFlagCheckered, FaExclamationTriangle } from "react-icons/fa";

// Utilities & Context
import { fetchMatchesByTournament } from "@/utils/functions/dataUtils.js";
import { useTournament } from "@/contexts/TournamentContext.jsx";
import { useResponsive } from "@/contexts/ResponsiveContext.jsx";

export default function LiveTournament() {
    const { tournamentId } = useParams();
    const { isMobile } = useResponsive();

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

    const handleOpenWindow = () => {
        window.open(`/tournament/live/window/${tournamentId}`, '_blank', 'noopener,noreferrer');
    };


    const checkForDuplicates = () => {
        console.log("Checking for duplicate matches...");
        alert("Duplicate check feature not yet implemented.");
    };

    if (isLoading) return <div className="p-6 text-center text-lg">🔄 Loading tournament data...</div>;
    if (error) return <div className="p-6 text-center text-red-500">❌ Couldn’t load tournament: {error.message}</div>;
    if (!tournamentConfig) return <div className="p-6 text-center text-gray-500">⚠️ No tournament data available.</div>;

    return (
        <TooltipProvider>
            <div className="flex flex-col p-2 md:p-4 gap-4">
                {/* --- RESPONSIVE HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-card text-card-foreground p-3 rounded-lg shadow gap-4">
                    <h1 className="text-xl md:text-2xl font-bold text-center md:text-left">
                        {tournamentConfig.name}
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        {/* Window View Button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size={isMobile ? "icon" : "sm"} onClick={handleOpenWindow}>
                                    <FaWindowMaximize className="h-4 w-4" />
                                    <span className="sr-only md:not-sr-only md:ml-2">Window View</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Window View</p></TooltipContent>
                        </Tooltip>

                        {/* Check Duplicates Button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="secondary" size={isMobile ? "icon" : "sm"} onClick={checkForDuplicates}>
                                    <FaExclamationTriangle className="h-4 w-4" />
                                    <span className="sr-only md:not-sr-only md:ml-2">Check Duplicates</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Check Duplicate Match-ups</p></TooltipContent>
                        </Tooltip>

                        <Separator orientation="vertical" className="h-6 mx-1" />

                        {/* End Tournament Button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="destructive" size={isMobile ? "icon" : "sm"} onClick={() => setShowEndModal(true)}>
                                    <FaFlagCheckered className="h-4 w-4" />
                                    <span className="sr-only md:not-sr-only md:ml-2">End Tournament</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>End Tournament</p></TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {/* --- Main Content --- */}
                <div className="flex-grow">
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

                {/* --- Modals --- */}
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
        </TooltipProvider>
    );
}