import React, { useState, useEffect } from "react";
import {Button} from "@/components/ui/button.jsx";

const Sidebar = ({
                     matchStats,
                     endTournament,
                     tournamentConfig,
                     fetchMatches,
                     sortOrder, // ✅ Receive sorting order
                     setSortOrder, // ✅ Function to update sorting order
                 }) => {
    const [isLoading, setIsLoading] = useState(false);

    /** ✅ Log tournamentConfig on render */
    console.log("🎾 Received tournamentConfig:", tournamentConfig);

    /** ✅ Effect to log updates in tournamentConfig */
    useEffect(() => {
        if (!tournamentConfig) {
            console.warn("⚠️ tournamentConfig is NULL! Waiting for data...");
        } else {
            console.log("✅ Loaded tournamentConfig:", tournamentConfig);
        }
    }, [tournamentConfig]);

    /** ✅ Refresh Matches */
    const handleFetchMatches = async () => {
        if (!fetchMatches) {
            console.error("❌ fetchMatches function is missing!");
            return;
        }

        setIsLoading(true);
        try {
            await fetchMatches(); // ✅ Correctly calling the function from `MatchTabs`
            console.log("✅ Matches refreshed successfully.");
        } catch (err) {
            console.error("❌ Error fetching matches:", err);
            alert("Failed to fetch live matches.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="sticky top-4 border p-4 rounded shadow bg-white dark:bg-gray-800 flex flex-col items-center h-fit">
            <h2 className="text-xl font-bold mb-4 text-center">Tournament Overview</h2>
            <p><strong>Number of Courts:</strong> {tournamentConfig?.numCourts || "N/A"}</p>
            <p><strong>Games Per Team:</strong> {tournamentConfig?.gamesPerTeam || "N/A"}</p>
            <p><strong>Start Time:</strong> {tournamentConfig?.startTime || "N/A"}</p>
            <p><strong>Match Duration:</strong> {tournamentConfig?.matchDuration || "N/A"} minutes</p>
            <p><strong>Break Time:</strong> {tournamentConfig?.breakTime || "N/A"} minutes</p>
            <p><strong>Use Existing Players:</strong> {tournamentConfig?.useExistingPlayers ? "Yes" : "No"}</p>
            <p><strong>Tournament Tiered:</strong> {tournamentConfig?.tiered ? "Yes" : "No"}</p>

            {/* Match Statistics */}
            <h3 className="text-lg font-semibold mt-4">Match Statistics</h3>
            <p><strong>Completed:</strong> {matchStats?.complete ?? "N/A"}</p>
            <p><strong>In Progress:</strong> {matchStats?.inProgress ?? "N/A"}</p>
            <p><strong>Not Started:</strong> {matchStats?.notStarted ?? "N/A"}</p>

            {/* Sorting Button */}
            <Button
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-full mt-4 text-lg"
            >
                {sortOrder === "desc" ? "🔽 Sort Descending" : "🔼 Sort Ascending"}
            </Button>

            <Button
                onClick={() => window.open("/viewer", "_blank")}
                className="bg-amber-400 hover:bg-amber-500 text-white px-3 py-2 rounded mt-4 w-full text-lg"
            >
                Open Viewer in New Tab
            </Button>

            {/* Refresh Matches */}
            <Button
                onClick={handleFetchMatches}
                className={`bg-blue-500 text-white px-3 py-2 rounded mt-4 w-full ${
                    isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600 transition text-lg"
                }`}
                disabled={isLoading}
            >
                {isLoading ? "Refreshing..." : "Refresh Matches"}
            </Button>

            {/* End Tournament Button */}
            <Button
                onClick={endTournament}
                className="bg-red-500 text-white px-3 py-2 rounded mt-4 w-full hover:bg-red-600 transition text-lg"
            >
                End Tournament
            </Button>
        </div>
    );
};

export default Sidebar;
