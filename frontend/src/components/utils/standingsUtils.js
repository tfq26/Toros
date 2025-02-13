import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper function to get the token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch team standings
export const fetchStandings = async () => {
    try {
        const response = await fetch("http://localhost:8080/api/bracket");
        if (!response.ok) {
            throw new Error("Failed to fetch bracket standings.");
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

// Fetch all matches for bracket data
export const fetchAllMatches = async () => {
    try {
        const response = await axios.get("http://localhost:8080/api/tournament/live", {
            headers: getAuthHeaders(),
        });
        return response.data || [];
    } catch (error) {
        console.error("Error fetching matches:", error);
        throw new Error("Failed to fetch matches for the bracket.");
    }
};

// Clear all standings
export const clearStandings = async () => {
    try {
        const response = await axios.delete("http://localhost:8080/api/teams/reset", {
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            return "Standings reset successfully!";
        }
        return "Failed to reset standings.";
    } catch (error) {
        console.error("Error resetting standings:", error);
        throw new Error("Failed to reset standings. Please try again later.");
    }
};

// Export standings to Excel
export const exportToExcel = (teams) => {
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
export const exportToPDF = (teams) => {
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
export const fetchTeamMatches = async (teamName) => {
    try {
        const response = await axios.get(
            `http://localhost:8080/api/tournament/teamMatchesByName/${encodeURIComponent(teamName)}`,
            {
                headers: getAuthHeaders(),
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching team matches:", error);
        throw new Error("Failed to retrieve matches for the selected team.");
    }
};
