import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import ExportMatches from "@/components/ExportMatches.jsx";

const TournamentSidebar = ({
                               tournamentID,
                               setupProperties: propSetupProperties, // Receive setupProperties as a prop (optional)
                               matchStats,
                               endTournament,
                               fetchMatches,
                               sortOrder,
                               setSortOrder,
                           }) => {
    const [isLoading, setIsLoading] = useState(false);
    // Initialize local state with the passed prop or empty array
    const [setupProperties, setSetupProperties] = useState(
        propSetupProperties || []
    );

    // Update local state when prop changes
    useEffect(() => {
        setSetupProperties(propSetupProperties || []);
    }, [propSetupProperties]);

    // Fallback: if no setupProperties were provided, fetch from API using tournamentID
    useEffect(() => {
        if (!tournamentID || propSetupProperties) {
            // Skip fetching if tournamentID is missing or if the prop was provided.
            return;
        }
        axios
            .get(`http://localhost:8080/api/tournament/${tournamentID}`)
            .then((response) => {
                const tournament = response.data;
                if (tournament && tournament.setupProperties) {
                    setSetupProperties(tournament.setupProperties);
                    console.log(
                        "✅ Loaded setupProperties from API:",
                        tournament.setupProperties
                    );
                } else {
                    console.warn(
                        "⚠️ No setupProperties found for tournament with ID:",
                        tournamentID
                    );
                }
            })
            .catch((err) => {
                console.error("❌ Error fetching tournament data:", err);
            });
    }, [tournamentID, propSetupProperties]);

    /** Refresh Matches */
    const handleFetchMatches = async () => {
        if (!fetchMatches) {
            console.error("❌ fetchMatches function is missing!");
            return;
        }
        setIsLoading(true);
        try {
            await fetchMatches();
            console.log("✅ Matches refreshed successfully.");
        } catch (err) {
            console.error("❌ Error fetching matches:", err);
            alert("Failed to fetch live matches.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="sticky top-4 border p-4 rounded shadow bg-orange-200 dark:bg-gray-800 flex flex-col items-center h-fit">
            <h2 className="text-xl font-bold mb-4 text-center">Tournament Overview</h2>

            {/* Display Tournament Setup Properties */}
            <div className="w-full mb-4">
                <h3 className="text-lg font-semibold mb-2">Tournament Setup</h3>
                {setupProperties && setupProperties.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-600">
                        {setupProperties.map((prop, index) => (
                            <li key={index}>{prop}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No setup properties available.</p>
                )}
            </div>

            {/* Match Statistics */}
            <h3 className="text-lg font-semibold mt-4">Match Statistics</h3>
            <p>
                <strong>Completed:</strong> {matchStats?.complete ?? "N/A"}
            </p>
            <p>
                <strong>In Progress:</strong> {matchStats?.inProgress ?? "N/A"}
            </p>
            <p>
                <strong>Not Started:</strong> {matchStats?.notStarted ?? "N/A"}
            </p>

            {/* Sorting Button */}
            <Button
                onClick={() =>
                    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                }
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
                    isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-600 transition text-lg"
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

            {/* Export Matches Component */}
            <ExportMatches />
        </div>
    );
};

export default TournamentSidebar;
