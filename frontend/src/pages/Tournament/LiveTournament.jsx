// src/pages/Tournament/LiveTournament.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";

import MatchTabs from "./MatchTabs";
import WindowView from "./Viewer/WindowView.jsx";
import EndTournamentModalUpdated from "@/pages/Modals/EndTournamentModalUpdated.jsx";
import { Button } from "@/components/ui/button.jsx";

import {
    fetchMatchesByTournament,
} from "@/utils/functions/dataUtils.js";
import { useTournament } from "@/contexts/TournamentContext.jsx";

export default function LiveTournament() {
    const { tournamentId } = useParams();
    const {
        tournamentConfig,
        setTournamentConfig,
        setTournamentSetupComplete,
    } = useTournament();

    // local state for config + loading + error
    const [config, setConfig] = useState(null);
    const [loadingConfig, setLoadingConfig] = useState(true);
    const [configError, setConfigError] = useState(null);

    useEffect(() => {
        // if we already have the right config in context, use it
        if (tournamentConfig?.id === tournamentId) {
            setConfig(tournamentConfig);
            setLoadingConfig(false);
            return;
        }

        // otherwise fetch it
        setLoadingConfig(true);
        axios
            .get(`http://localhost:8080/api/tournament/${tournamentId}`)
            .then((res) => {
                setConfig(res.data);
                setTournamentConfig(res.data);
                setTournamentSetupComplete(true);
            })
            .catch((err) => {
                console.error("Error loading tournament config:", err);
                setConfigError(err);
            })
            .finally(() => {
                setLoadingConfig(false);
            });
    }, [
        tournamentConfig,
        tournamentId,
        setTournamentConfig,
        setTournamentSetupComplete,
    ]);

    // 1) Show loading while fetching config
    if (loadingConfig) {
        return (
            <div className="p-6 text-center">
                🔄 Loading tournament <strong>{tournamentId}</strong>…
            </div>
        );
    }

    // 2) Show error if the fetch failed
    if (configError) {
        return (
            <div className="p-6 text-center text-red-500">
                ❌ Couldn’t load tournament: {configError.message}
            </div>
        );
    }

    // 3) If for some reason we still don’t have config
    if (!config) {
        return (
            <div className="p-6 text-center text-gray-500">
                ⚠️ No tournament data available.
            </div>
        );
    }

    // from here on out, `config` is guaranteed non-null
    const setupProperties = config.setupProperties || [];

    // update document title
    useEffect(() => {
        document.title = config.tournamentName
            ? `${config.tournamentName} • Live`
            : "Tournament Live";
    }, [config]);

    // rest of your match logic…
    const [matches, setMatches] = useState([]);
    const [loadingMatches, setLoadingMatches] = useState(true);
    const [sortOrder, setSortOrder] = useState("desc");
    const [showWindowView] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);

    const fetchMatches = useCallback(async () => {
        setLoadingMatches(true);
        try {
            const ms = await fetchMatchesByTournament(config.id);
            setMatches(ms);
        } catch (err) {
            console.error("Error fetching matches:", err);
            setMatches([]);
        } finally {
            setLoadingMatches(false);
        }
    }, [config.id]);

    const debouncedFetch = useCallback(
        debounce(() => fetchMatches(), 500),
        [fetchMatches]
    );

    useEffect(() => {
        debouncedFetch();
        return () => debouncedFetch.cancel();
    }, [debouncedFetch]);

    const updateMatch = async (m) => {
        if (!m.id) return console.error("Match ID missing!");
        try {
            const res = await axios.patch(
                `http://localhost:8080/api/tournament/${m.id}`,
                {
                    team1Score: m.team1Score,
                    team2Score: m.team2Score,
                    status: m.status,
                }
            );
            if (res.status === 200) await fetchMatches();
        } catch (e) {
            console.error("Error updating match:", e);
            alert("Update failed");
        }
    };

    const checkForDuplicates = () => {
        /* your duplicate logic */
    };

    return (
        <div className="flex flex-col p-4">
            {/* header, sidebar, etc. */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded shadow">
                <h1 className="text-xl font-bold dark:text-white">
                    {config.tournamentName}
                </h1>
                {/* …sheet trigger/sidebar… */}
            </div>

            {/* main content */}
            <div className="flex-grow">
                <Button onClick={checkForDuplicates} variant="outline">
                    Check Duplicate Match-ups
                </Button>

                {setupProperties.length > 0 && (
                    <div className="mb-4 bg-white dark:bg-gray-800 p-2 rounded shadow">
                        {/* … */}
                    </div>
                )}

                {loadingMatches ? (
                    <p className="text-center">Loading matches…</p>
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

            {/* end modal & window view */}
            <EndTournamentModalUpdated
                isOpen={showEndModal}
                onClose={() => setShowEndModal(false)}
                endTournament={async () => {
                    try {
                        await axios.post("http://localhost:8080/api/tournament/end");
                        console.log("Tournament ended.");
                    } catch (e) {
                        console.error(e);
                    }
                }}
            />

            {showWindowView && (
                <div className="fixed inset-0 bg-white dark:bg-gray-800 p-4 z-40">
                    <WindowView matches={matches} />
                </div>
            )}
        </div>
    );
}
