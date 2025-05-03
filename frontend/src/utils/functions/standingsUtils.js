// src/utils/bracketUtils.js
import axios from "axios"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { getAuth0AccessToken } from "@/utils/functions/authUtils.js"

const API_BASE = "http://localhost:8080/api"

/**
 * Fetch team standings (protected).
 * @param {() => Promise<string>} getAccessTokenSilently
 */
export async function fetchStandings(getAccessTokenSilently) {
    const token = await getAuth0AccessToken(getAccessTokenSilently)
    const { data } = await axios.get(`${API_BASE}/bracket`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    return data
}

/**
 * Fetch all matches for bracket data (protected).
 * @param {() => Promise<string>} getAccessTokenSilently
 */
export async function fetchAllMatches(getAccessTokenSilently) {
    const token = await getAuth0AccessToken(getAccessTokenSilently)
    try {
        const { data } = await axios.get(`${API_BASE}/tournament/matches`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return data || []
    } catch (err) {
        console.error("Error fetching matches:", err)
        throw new Error("Failed to fetch matches for the bracket.")
    }
}

/**
 * Clear all standings (protected).
 * @param {() => Promise<string>} getAccessTokenSilently
 */
export async function clearStandings(getAccessTokenSilently) {
    const token = await getAuth0AccessToken(getAccessTokenSilently)
    try {
        const response = await axios.delete(`${API_BASE}/teams/reset`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.status === 200
            ? "Standings reset successfully!"
            : "Failed to reset standings."
    } catch (err) {
        console.error("Error resetting standings:", err)
        throw new Error("Failed to reset standings. Please try again later.")
    }
}

/**
 * Export standings to Excel (no auth needed).
 * @param {Array} teams
 */
export function exportToExcel(teams) {
    const data = teams.map((team) => ({
        "Team Name":      team.name,
        "Team ID":        team.id,
        Wins:             team.wins,
        Losses:           team.losses,
        "Matches Played": team.matchesPlayed,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Team Standings")
    XLSX.writeFile(wb, "team_standings.xlsx")
}

/**
 * Export standings to PDF (no auth needed).
 * @param {Array} teams
 */
export function exportToPDF(teams) {
    const doc = new jsPDF()
    doc.text("Team Standings", 20, 10)
    const body = teams.map((team) => [
        team.name,
        team.id,
        team.wins,
        team.losses,
        team.matchesPlayed,
    ])
    autoTable(doc, {
        head: [["Team Name", "Team ID", "Wins", "Losses", "Matches Played"]],
        body,
    })
    doc.save("team_standings.pdf")
}

/**
 * Fetch matches for a specific team (protected).
 * @param {() => Promise<string>} getAccessTokenSilently
 * @param {string} teamName
 */
export async function fetchTeamMatches(getAccessTokenSilently, teamName) {
    const token = await getAuth0AccessToken(getAccessTokenSilently)
    try {
        const { data } = await axios.get(
            `${API_BASE}/tournament/teamMatchesByName/${encodeURIComponent(teamName)}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        )
        return data
    } catch (err) {
        console.error("Error fetching team matches:", err)
        throw new Error("Failed to retrieve matches for the selected team.")
    }
}
