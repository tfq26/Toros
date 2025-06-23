import React, { useState, useEffect, useCallback, memo } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
import axios from "axios";

// --- Configuration & Constants ---
const API_BASE_URL = "http://localhost:8080/api";
const CONSTANTS = {
    API_ENDPOINTS: {
        STANDINGS: "/teams/standings",
        RESET_STANDINGS: "/teams/reset",
        TEAM_MATCHES_BY_NAME: "/tournaments/teamMatchesByName/", // Note the trailing slash
    },
    EXPORT_FILENAMES: {
        EXCEL: "team_standings.xlsx",
        PDF: "team_standings.pdf",
    },
};

// Create a reusable Axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// --- Sub-components for better structure and reusability ---

// Memoized TeamCard to prevent unnecessary re-renders
const TeamCard = memo(({ team, index, isSelected, onTeamClick }) => (
    <div
        className={`p-4 border rounded-lg shadow transition-colors duration-200 cursor-pointer ${
            isSelected
                ? "bg-blue-100 border-blue-400 ring-2 ring-blue-300"
                : "bg-white hover:bg-gray-100"
        }`}
        onClick={() => onTeamClick(team)}
    >
        <h2 className="text-xl font-semibold truncate">
            {index + 1}. {team.name}
        </h2>
        <p className="text-sm text-gray-500">Team ID: {team.id}</p>
        <div className="flex justify-between mt-2 text-gray-700">
            <span>Wins: <span className="font-bold text-green-600">{team.wins}</span></span>
            <span>Losses: <span className="font-bold text-red-600">{team.losses}</span></span>
            <span>Played: <span className="font-bold">{team.matchesPlayed}</span></span>
        </div>
    </div>
));

// Action buttons component
const ActionButtons = ({ onExportExcel, onExportPDF, onClearStandings, isLoading }) => (
    <div className="mb-6 flex flex-wrap gap-2">
        <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400"
            onClick={onExportExcel}
            disabled={isLoading}
        >
            Export to Excel
        </button>
        <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            onClick={onExportPDF}
            disabled={isLoading}
        >
            Export to PDF
        </button>
        <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-gray-400"
            onClick={onClearStandings}
            disabled={isLoading}
        >
            Clear Standings
        </button>
    </div>
);

// Component to display the list of matches for a selected team
const TeamMatchList = ({ teamName, matches, isLoading }) => (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Matches for {teamName}</h2>
        {isLoading ? (
            <p>Loading matches...</p>
        ) : matches.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
                {matches.map((match, index) => (
                    <li key={match.id || index}>
                        {match.team1?.name || "N/A"} vs {match.team2?.name || "N/A"}
                        <span className="ml-4 font-mono p-1 bg-gray-200 rounded text-sm">
                            {match.team1Score || 0} - {match.team2Score || 0}
                        </span>
                        <span className={`ml-4 text-xs font-semibold uppercase px-2 py-1 rounded-full ${
                            match.status === 'COMPLETED' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                        }`}>
                            {match.status || 'PENDING'}
                        </span>
                    </li>
                ))}
            </ul>
        ) : (
            <p>No matches found for this team.</p>
        )}
    </div>
);


// --- Main Component ---

function TeamStandings() {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamMatches, setTeamMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // For initial page load
    const [loadingMatches, setLoadingMatches] = useState(false); // For loading team-specific matches
    const [error, setError] = useState(null);

    // Fetch initial team standings
    const fetchStandings = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(CONSTANTS.API_ENDPOINTS.STANDINGS);
            const validTeams = response.data.filter(
                (team) => team.name && team.name.includes(" & ")
            );
            setTeams(validTeams);
        } catch (err) {
            console.error("Error fetching standings:", err.message || err);
            setError("Failed to fetch standings. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        document.title = "Team Standings";
        fetchStandings();
    }, [fetchStandings]);


    // Action: Clear all standings
    const clearStandings = async () => {
        if (!window.confirm("Are you sure you want to reset all standings? This action cannot be undone.")) return;

        setError(null);
        try {
            await apiClient.delete(CONSTANTS.API_ENDPOINTS.RESET_STANDINGS);
            alert("Standings reset successfully!");
            setTeams([]);
            setSelectedTeam(null);
            setTeamMatches([]);
        } catch (err) {
            console.error("Error resetting standings:", err.message || err);
            setError("Failed to reset standings. Please try again later.");
        }
    };

    // Action: Export to Excel
    const exportToExcel = () => {
        const data = teams.map(({ name, id, wins, losses, matchesPlayed }) => ({
            "Team Name": name,
            "Team ID": id,
            "Wins": wins,
            "Losses": losses,
            "Matches Played": matchesPlayed,
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Team Standings");
        XLSX.writeFile(workbook, CONSTANTS.EXPORT_FILENAMES.EXCEL);
    };

    // Action: Export to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Team Standings", 14, 15);
        autoTable(doc, {
            head: [["Team Name", "Team ID", "Wins", "Losses", "Matches Played"]],
            body: teams.map(team => [team.name, team.id, team.wins, team.losses, team.matchesPlayed]),
            startY: 20,
        });
        doc.save(CONSTANTS.EXPORT_FILENAMES.PDF);
    };

    // Action: Fetch matches for a specific team by name
    const fetchTeamMatches = async (teamName) => {
        setLoadingMatches(true);
        setError(null);
        setTeamMatches([]); // Clear previous matches
        try {
            const response = await apiClient.get(
                `${CONSTANTS.API_ENDPOINTS.TEAM_MATCHES_BY_NAME}${encodeURIComponent(teamName)}`
            );
            console.log("Fetched matches for", teamName, ":", response.data);
            setTeamMatches(response.data);
        } catch (err) {
            console.error("Error fetching team matches:", err.message || err);
            setError("Failed to retrieve matches for the selected team.");
        } finally {
            setLoadingMatches(false);
        }
    };

    // Handler for clicking a team card
    const handleTeamClick = useCallback((team) => {
        // If the same team is clicked again, deselect it
        if (selectedTeam?.id === team.id) {
            setSelectedTeam(null);
            setTeamMatches([]);
        } else {
            setSelectedTeam(team);
            fetchTeamMatches(team.name);
        }
    }, [selectedTeam]); // Dependency on selectedTeam to know its current value

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-gray-800">Team Standings</h1>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                <ActionButtons
                    onExportExcel={exportToExcel}
                    onExportPDF={exportToPDF}
                    onClearStandings={clearStandings}
                    isLoading={isLoading || loadingMatches}
                />

                {isLoading ? (
                    <p>Loading standings...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teams.map((team, index) => (
                            <TeamCard
                                key={team.id}
                                team={team}
                                index={index}
                                isSelected={selectedTeam?.id === team.id}
                                onTeamClick={handleTeamClick}
                            />
                        ))}
                    </div>
                )}

                {selectedTeam && (
                    <TeamMatchList
                        teamName={selectedTeam.name}
                        matches={teamMatches}
                        isLoading={loadingMatches}
                    />
                )}
            </div>
        </div>
    );
}

export default TeamStandings;