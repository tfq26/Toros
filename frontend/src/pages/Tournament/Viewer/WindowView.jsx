import React, { useState, useEffect } from "react";
import { loadMatchDetails, fetchAllMatches } from "@/utils/functions/dataUtils.js";
import { motion } from "framer-motion";

// --- Helper Functions ---
function computeCategory(match) {
    const skill1 = match.team1?.skillLevel || 0;
    const skill2 = match.team2?.skillLevel || 0;
    const average = (skill1 + skill2) / 2;
    if (average < 3) return "Beginner";
    if (average < 7) return "Intermediate";
    return "Advanced";
}

const useLiveClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return time;
};

// --- Child Components for better structure ---
const MatchCard = ({ match, isNowPlaying }) => (
    <div
        className={`flex flex-col rounded-lg shadow-lg p-6 text-center transition-all duration-300 ${
            isNowPlaying
                ? 'bg-emerald-500 text-white dark:bg-emerald-600'
                : 'bg-white dark:bg-gray-800'
        }`}
    >
        <div className="mb-2">
            <span className="font-bold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Court {match.courtNumber}
            </span>
        </div>
        <div className="flex-grow text-2xl md:text-3xl font-bold mb-3">
            <span>{match.team1.name}</span>
            <span className="mx-2 text-lg font-normal text-gray-400 dark:text-gray-500">vs</span>
            <span>{match.team2.name}</span>
        </div>
        <div className="text-sm">
            <span className={`font-semibold py-1 px-3 rounded-full ${
                isNowPlaying
                    ? 'bg-white/20'
                    : 'bg-gray-200 dark:bg-gray-700'
            }`}>
                {isNowPlaying ? 'Playing Now' : `Starts at ${new Date(match.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}
            </span>
        </div>
    </div>
);

const WindowViewHeader = ({ category, time }) => (
    <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
        <div className="text-left">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white">{category}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">Match Schedule</p>
        </div>
        <div className="text-right">
            <div className="text-5xl font-bold text-emerald-500 dark:text-emerald-400">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-lg text-gray-500 dark:text-gray-400">
                {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
        </div>
    </div>
);


// --- Main Component ---
const WindowView = ({ matches: initialMatches = [], rotationInterval = 15000 }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const categories = ["Beginner", "Intermediate", "Advanced"];
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const time = useLiveClock();

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                let fullMatches = [];
                // Simplified logic: If initialMatches are IDs, fetch details. Otherwise, use them directly.
                if (initialMatches.length > 0 && typeof initialMatches[0] === "string") {
                    fullMatches = await loadMatchDetails(initialMatches);
                } else if (initialMatches.length > 0) {
                    fullMatches = initialMatches;
                } else {
                    fullMatches = await fetchAllMatches();
                }

                setMatches(fullMatches.map(match => ({
                    ...match,
                    category: match.category || computeCategory(match),
                })));
            } catch (error) {
                console.error("Error fetching match details in WindowView:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [initialMatches]); // Dependency array is simpler and more reliable.

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentCategoryIndex(prev => (prev + 1) % categories.length);
        }, rotationInterval);
        return () => clearInterval(timer);
    }, [rotationInterval, categories.length]);

    const currentCategory = categories[currentCategoryIndex];

    // Filter matches and then separate them into "now playing" and "upcoming"
    const nowPlayingMatches = matches.filter(
        (m) => m.category === currentCategory && new Date(m.startTime) <= time && new Date(m.endTime) > time
    );
    const upcomingMatches = matches.filter(
        (m) => m.category === currentCategory && new Date(m.startTime) > time
    ).sort((a,b) => new Date(a.startTime) - new Date(b.startTime));


    return (
        // ✨ FIXED: Removed the top padding (`pt-24`) so the component takes up the full screen height.
        <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            <WindowViewHeader category={currentCategory} time={time} />

            {/* Auto-rotation Progress Bar */}
            <motion.div
                key={currentCategoryIndex} // Reset animation when category changes
                className="h-1 bg-emerald-500 mb-8"
                initial={{ width: "0%" }}
                animate={{ width: "100%", transition: { duration: rotationInterval / 1000, ease: "linear" } }}
            />

            {loading ? (
                <p className="text-center text-2xl text-gray-500">Loading Matches...</p>
            ) : (
                <div className="space-y-10">
                    {/* Now Playing Section */}
                    <div>
                        <h2 className="text-3xl font-bold mb-4 border-l-4 border-emerald-500 pl-4">Now Playing</h2>
                        {nowPlayingMatches.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {nowPlayingMatches.map((match) => (
                                    <MatchCard key={match.id} match={match} isNowPlaying={true} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-xl text-gray-500 py-8">No matches currently in progress for this category.</p>
                        )}
                    </div>

                    {/* Upcoming Section */}
                    <div>
                        <h2 className="text-3xl font-bold mb-4 border-l-4 border-gray-400 pl-4">Upcoming</h2>
                        {upcomingMatches.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {upcomingMatches.map((match) => (
                                    <MatchCard key={match.id} match={match} isNowPlaying={false} />
                                ))}
                            </div>
                        ): (
                            <p className="text-center text-xl text-gray-500 py-8">No upcoming matches scheduled for this category.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WindowView;
