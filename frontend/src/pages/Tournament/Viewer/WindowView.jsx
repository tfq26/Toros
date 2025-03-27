import React, { useState, useEffect } from "react";
import { loadMatchDetails, fetchAllMatches } from "../../utils/dataUtils.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Helper function to compute category based on team skill levels.
function computeCategory(match) {
    const skill1 = match.team1?.skillLevel || 0;
    const skill2 = match.team2?.skillLevel || 0;
    const average = (skill1 + skill2) / 2;

    if (average < 3) return "Beginner";
    if (average < 7) return "Intermediate";
    return "Advanced";
}

const WindowView = ({ matches: initialMatches = [], rotationInterval = 5000 }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    // Categories to rotate through.
    const categories = ["Beginner", "Intermediate", "Advanced"];
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    // This state will be updated to force the timer to reset.
    const [resetTimer, setResetTimer] = useState(0);

    // Fetch match details on mount or when initialMatches change.
    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                let fullMatches = [];
                if (initialMatches.length > 0) {
                    console.log("Initial matches prop (from parent):", initialMatches);
                    if (typeof initialMatches[0] === "string") {
                        console.log("Fetching full match details for IDs:", initialMatches);
                        fullMatches = await loadMatchDetails(initialMatches);
                    } else {
                        console.log("Using provided full match objects.");
                        fullMatches = initialMatches;
                    }
                } else {
                    console.log("No initial matches provided. Re-fetching all matches...");
                    fullMatches = await fetchAllMatches();
                }
                fullMatches = fullMatches.map((match) => ({
                    ...match,
                    category: match.category || computeCategory(match),
                }));
                console.log("Full match details received:", fullMatches);
                setMatches(fullMatches);
            } catch (error) {
                console.error("Error fetching match details in WindowView:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [JSON.stringify(initialMatches)]);

    // Timer to automatically rotate categories.
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % categories.length);
        }, rotationInterval);
        return () => clearInterval(timer);
    }, [rotationInterval, resetTimer]);

    // Manual control functions that reset the timer.
    const handlePrev = () => {
        setCurrentCategoryIndex((prevIndex) =>
            (prevIndex - 1 + categories.length) % categories.length
        );
        setResetTimer((prev) => prev + 1);
    };

    const handleNext = () => {
        setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % categories.length);
        setResetTimer((prev) => prev + 1);
    };

    const currentCategory = categories[currentCategoryIndex];
    const filteredMatches = matches.filter(
        (match) => match.category === currentCategory
    );

    console.log("Current Category:", currentCategory);
    console.log("Filtered matches for current category:", filteredMatches);

    return (
        <div className="p-4">
            {/* Header with arrow controls and title */}
            <div className="flex items-center justify-center mb-4">
                <button
                    onClick={handlePrev}
                    className="p-2 hover:text-emerald-500 transition"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h2 className="text-center text-2xl font-bold mx-4">
                    {currentCategory} Matches
                </h2>
                <button
                    onClick={handleNext}
                    className="p-2 hover:text-emerald-500 transition"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>
            {loading ? (
                <p className="text-center">Loading matches...</p>
            ) : filteredMatches.length === 0 ? (
                <p className="text-center">
                    No matches found for {currentCategory}.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredMatches.map((match) => (
                        <div
                            key={match.id}
                            className="border p-4 rounded shadow hover:shadow-lg transition bg-emerald-100 dark:bg-emerald-700"
                        >
                            <h3 className="text-lg font-semibold">
                                {match.team1.name} vs {match.team2.name}
                            </h3>
                            <p>
                                <strong>Court:</strong> {match.courtNumber}
                            </p>
                            <p>
                                <strong>Time:</strong>{" "}
                                {new Date(match.startTime).toLocaleTimeString()} -{" "}
                                {new Date(match.endTime).toLocaleTimeString()}
                            </p>
                            <p>
                                <strong>Status:</strong> {match.status}
                            </p>
                            <p>
                                <strong>Category:</strong> {match.category}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WindowView;
