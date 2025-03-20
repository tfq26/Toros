import React, { useState, useEffect } from "react";
import { loadMatchDetails, fetchAllMatches } from "../../utils/dataUtils.js";

// Helper function to compute category based on team skill levels.
function computeCategory(match) {
    // Get skill level from each team; default to 0 if not provided.
    const skill1 = match.team1?.skillLevel || 0;
    const skill2 = match.team2?.skillLevel || 0;
    const average = (skill1 + skill2) / 2;

    // Example thresholds; adjust as needed.
    if (average < 3) return "Beginner";
    if (average < 7) return "Intermediate";
    return "Advanced";
}

const WindowView = ({ matches: initialMatches = [], rotationInterval = 5000 }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch match details on mount or when initialMatches change.
    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                let fullMatches = [];
                // If initialMatches is provided and non-empty:
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
                    // If no matches are passed in, fetch them from the backend.
                    console.log("No initial matches provided. Re-fetching all matches...");
                    fullMatches = await fetchAllMatches();
                }
                // If a match doesn't have a category property, compute it.
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

    // Categories to rotate through.
    const categories = ["Beginner", "Intermediate", "Advanced"];
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % categories.length);
        }, rotationInterval);
        return () => clearInterval(timer);
    }, [rotationInterval]);

    const currentCategory = categories[currentCategoryIndex];

    // Filter matches based on the current category.
    const filteredMatches = matches.filter(
        (match) => match.category === currentCategory
    );

    console.log("Current Category:", currentCategory);
    console.log("Filtered matches for current category:", filteredMatches);

    return (
        <div className="p-4">
            <h2 className="text-center text-2xl font-bold mb-4">
                {currentCategory} Matches
            </h2>
            {loading ? (
                <p className="text-center">Loading matches...</p>
            ) : filteredMatches.length === 0 ? (
                <p className="text-center">No matches found for {currentCategory}.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredMatches.map((match) => (
                        <div
                            key={match.id}
                            className="border p-4 rounded shadow hover:shadow-lg transition"
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
