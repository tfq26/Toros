import React from "react";

const Sidebar = ({
                     matchStats,
                     endTournament,
                     viewMode,
                     setViewMode,
                     tournamentConfig,
                 }) => (
    <div className="sticky top-4 border p-4 rounded shadow bg-white flex flex-col items-center h-fit">
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
        <p><strong>Completed:</strong> {matchStats.complete}</p>
        <p><strong>In Progress:</strong> {matchStats.inProgress}</p>
        <p><strong>Not Started:</strong> {matchStats.notStarted}</p>

        {/* Toggle View */}
        <button
            onClick={() => setViewMode(viewMode === "tile" ? "table" : "tile")}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition mt-4"
        >
            {viewMode === "tile" ? "Switch to Table View" : "Switch to Tile View"}
        </button>

        {/* End Tournament Button */}
        <button
            onClick={endTournament} // Call the `endTournament` function
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition mt-4"
        >
            End Tournament
        </button>
    </div>
);

export default Sidebar;
