import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
import axios from "axios";
import * as response from "autoprefixer";

function TeamStandings() {
    const [teams, setTeams] = useState([]); // Holds team standings
    const [selectedTeam, setSelectedTeam] = useState(null); // Currently selected team
    const [teamMatches, setTeamMatches] = useState([]); // Matches for the selected team
    const [matches, setMatches] = useState([]); // All matches for the bracket
    const [error, setError] = useState(null); // Error state
    const [loadingMatches, setLoadingMatches] = useState(false); // Loading state for matches

    // Fetch team standings
    const fetchStandings = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/teams/standings");
            const validTeams = response.data.filter(
                (team) => team.name && team.name.includes(" & ") // Ensure only valid team names
            );
            setTeams(validTeams);
        } catch (error) {
            console.error("Error fetching standings:", error.message || error);
            setError("Failed to fetch standings. Please try again later.");
        }
    };

    // Set the tab title to "Viewer" on mount.
    useEffect(() => {
        document.title = "Bracket";
    }, []);

    // Fetch all matches for bracket data
    const fetchAllMatches = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/tournament/live");
            if (Array.isArray(response.data)) {
                setMatches(response.data);
            } else {
                console.error("Invalid matches data. Expected an array but got:", response.data);
                setError("Unexpected match data format.");
            }
        } catch (error) {
            console.error("Error fetching all matches:", error.message || error);
            setError("Failed to fetch matches for the bracket.");
        }
    };

    // Clear all standings
    const clearStandings = async () => {
        if (!window.confirm("Are you sure you want to reset all standings?")) return;

        try {
            const response = await axios.delete("http://localhost:8080/api/teams/reset");
            if (response.status === 200) {
                alert("Standings reset successfully!");
                setTeams([]);
            }
        } catch (error) {
            console.error("Error resetting standings:", error.message || error);
            setError("Failed to reset standings. Please try again later.");
        }
    };

    // Export standings to Excel
    const exportToExcel = () => {
        const data = teams.map((team) => ({
            "Team Name": team.name,
            "Team ID": team.id,
            Wins: team.wins,
            Losses: team.losses,
            "Matches Played": team.matchesPlayed,
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Team Standings");
        XLSX.writeFile(workbook, "team_standings.xlsx");
    };

    // Export standings to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Team Standings", 20, 10);
        const tableData = teams.map((team) => [
            team.name,
            team.id,
            team.wins,
            team.losses,
            team.matchesPlayed,
        ]);
        autoTable(doc, {
            head: [["Team Name", "Team ID", "Wins", "Losses", "Matches Played"]],
            body: tableData,
        });
        doc.save("team_standings.pdf");
    };

    // Fetch matches for a specific team
    const fetchTeamMatches = async (Name) => {
        console.log("Fetching matches for team name:", Name);
        try {
            const response = await axios.get(`http://localhost:8080/api/tournament/teamMatchesByName/${encodeURIComponent(Name)}`);
            setTeamMatches(response.data);
            console.log("API response for team matches:", response.data);
            console.log("Updated teamMatches state:", teamMatches);
        } catch (error) {
            console.error("Error fetching team matches:", error.message || error);
            setError("Failed to retrieve matches for the selected team.");
        }
    };

    // Handle team selection
    const handleTeamClick = (team) => {
        console.log("Selected team Name:", team.name); // Log the team name
        setSelectedTeam(team);
        fetchTeamMatches(team.name); // Pass the team name to fetch matches
    };


    useEffect(() => {
        fetchStandings();
        fetchAllMatches();
    }, []);

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Team Standings</h1>
            {error && <div className="bg-red-500 text-white p-4 mb-4 rounded">{error}</div>}

            <div className="mb-6">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                    onClick={exportToExcel}
                >
                    Export to Excel
                </button>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                    onClick={exportToPDF}
                >
                    Export to PDF
                </button>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={clearStandings}
                >
                    Clear Standings
                </button>
            </div>

            {/* Display team standings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team, index) => (
                    <div
                        key={team.id}
                        className="p-4 border rounded shadow hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleTeamClick(team)}
                    >
                        <h2 className="text-xl font-semibold">{index + 1}. {team.name}</h2>
                        <p className="text-sm text-gray-600">Team ID: {team.id}</p>
                        <p>Wins: {team.wins}</p>
                        <p>Losses: {team.losses}</p>
                        <p>Matches Played: {team.matchesPlayed}</p>
                    </div>
                ))}
            </div>

            {/* Display selected team matches */}
            {selectedTeam && (
                <div className="mt-6">
                    <h2 className="text-xl font-bold">Matches for {selectedTeam.name}</h2>
                    {loadingMatches ? (
                        <p>Loading matches...</p>
                    ) : teamMatches.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {teamMatches.map((match, index) => (
                                <li key={index}>
                                    {match.team1?.name || "Unknown Team 1"} vs {match.team2?.name || "Unknown Team 2"} - Status: {match.status} - <span className="font-bold">Score: {match.team1Score || 0} - {match.team2Score || 0}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No matches found for this team.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default TeamStandings;
