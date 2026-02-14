import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { fetchMatchesByTournament } from "@/utils/functions/dataUtils.js";

// --- Custom Hooks ---

const useTournamentData = ({ tournamentId, pollInterval = 60000 }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!tournamentId) return;
        console.log(`Fetching match data for tournament: ${tournamentId}...`);
        try {
            const fullMatches = await fetchMatchesByTournament(tournamentId);
            setMatches(fullMatches);
            setError(null);
        } catch (err) {
            console.error("Error fetching match details:", err);
            setError("Could not load match data for this tournament.");
        } finally {
            setLoading(false);
        }
    }, [tournamentId]);

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, pollInterval);
        return () => clearInterval(intervalId);
    }, [fetchData, pollInterval]);

    return { matches, loading, error };
};

const useLiveClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return time;
};


// --- Child Components ---

const MatchCard = ({ match }) => (
    <div className="flex flex-col rounded-lg shadow-lg p-6 text-center bg-emerald-500 text-white dark:bg-emerald-600">
        <div className="mb-2"><span className="font-bold text-sm uppercase tracking-wider">Court {match.courtNumber}</span></div>
        <div className="flex-grow text-2xl md:text-3xl font-bold mb-3">
            <span>{match.team1.name}</span>
            <span className="mx-2 text-lg font-normal text-white/70">vs</span>
            <span>{match.team2.name}</span>
        </div>
        <div className="text-sm"><span className="font-semibold py-1 px-3 rounded-full bg-white/20">Playing Now</span></div>
    </div>
);

// ✨ MODIFIED: Header is now static and doesn't need the 'category' prop.
const WindowViewHeader = ({ time }) => (
    <div className="flex justify-between items-center pb-4 border-b-2 border-gray-200 dark:border-gray-700">
        <div className="text-left">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white">Live Schedule</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">All Matches</p>
        </div>
        <div className="text-right">
            <div className="text-5xl font-bold text-emerald-500 dark:text-emerald-400">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-lg text-gray-500 dark:text-gray-400">{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </div>
    </div>
);

const NextUpMatchItem = ({ match }) => (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
        <div>
            <p className="font-bold text-gray-800 dark:text-white">{match.team1.name} vs {match.team2.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Court {match.courtNumber}</p>
        </div>
        <div className="text-right font-semibold text-emerald-500 dark:text-emerald-400">
            {new Date(match.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </div>
    </div>
);

const NextUpSidebar = ({ matches, time }) => {
    // This logic correctly shows the next 5 upcoming matches from all categories
    const nextUpMatches = useMemo(() => {
        const now = new Date(time);
        return matches
            .filter(m => new Date(m.startTime) > now)
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            .slice(0, 8); // Showing a few more since we have the space
    }, [matches, time]);

    return (
        <aside className="w-full lg:w-1/3 xl:w-1/4 h-full bg-gray-100 dark:bg-gray-800 p-6 flex flex-col">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Next Up</h2>
            {nextUpMatches.length > 0 ? (
                <div className="space-y-3 overflow-y-auto">
                    {nextUpMatches.map(match => <NextUpMatchItem key={match.id} match={match} />)}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-center text-xl text-gray-500">No more matches scheduled.</p>
                </div>
            )}
        </aside>
    );
};


// --- Main Component ---
const WindowView = () => {
    const { tournamentId } = useParams();
    const time = useLiveClock();
    const { matches, loading, error } = useTournamentData({ tournamentId, pollInterval: 60000 });

    // ✨ MODIFIED: Filtering logic is now simpler, no longer needs category.
    const nowPlayingMatches = useMemo(() => {
        return matches.filter(m =>
            new Date(m.startTime) <= time &&
            new Date(m.endTime) > time
        );
    }, [matches, time]);

    if (loading) {
        return <p className="flex items-center justify-center min-h-screen text-2xl text-gray-500 bg-gray-900">Loading Tournament Matches...</p>;
    }

    if (error) {
        return <p className="flex items-center justify-center min-h-screen text-2xl text-red-500 bg-gray-900">{error}</p>;
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            <main className="flex-1 p-8 overflow-y-auto">
                <WindowViewHeader time={time} />

                {/* ✨ REMOVED: The rotating progress bar is no longer needed. */}
                <div className="mt-8 space-y-10">
                    <div>
                        <h2 className="text-3xl font-bold mb-4 border-l-4 border-emerald-500 pl-4 text-gray-800 dark:text-white">Now Playing</h2>
                        {nowPlayingMatches.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {nowPlayingMatches.map((match) => <MatchCard key={match.id} match={match} />)}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-48">
                                <p className="text-center text-xl text-gray-500">No matches currently in progress.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <NextUpSidebar matches={matches} time={time} />
        </div>
    );
};

export default WindowView;