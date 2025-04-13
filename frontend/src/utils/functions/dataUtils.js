import axios from "axios";
import {DateTime} from "luxon";

// Load details for multiple matches given an array of match IDs
export async function loadMatchDetails(matchIds) {
    try {
        console.log("Loading match details for match IDs:", matchIds);
        const requests = matchIds.map((id) =>
            axios.get(`http://localhost:8080/api/matches/${id}`)
        );
        const responses = await Promise.all(requests);
        const matches = responses.map((res) => res.data);
        console.log("Loaded match details:", matches);
        return matches;
    } catch (error) {
        console.error("Error loading match details:", error);
        return [];
    }
}

/**
 * Fetch all match details.
 * This function retrieves an array of match IDs from the backend and then uses loadMatchDetails to get full match objects.
 */
export async function fetchAllMatches() {
    try {
        const response = await axios.get("http://localhost:8080/api/matches");
        console.log("Raw match IDs from backend:", response.data);
        const matchIds = response.data; // expecting an array of match ID strings
        const fullMatches = await loadMatchDetails(matchIds);
        return fullMatches;
    } catch (error) {
        console.error("Error fetching all matches:", error);
        return [];
    }
}

// Fetch matches for a tournament by tournament ID
export async function fetchMatchesByTournament(tournamentId) {
    try {
        console.log(`Fetching matches for tournament with ID: ${tournamentId}`);
        // Call the TournamentController endpoint that returns match IDs for the tournament.
        // Note: The URL here uses "/tournament/tournament/{tournamentId}" as defined in your controller.
        const response = await axios.get(`http://localhost:8080/api/tournament/tournament/${tournamentId}`);
        console.log(`Fetched match IDs for tournament ${tournamentId}:`, response.data);
        const matchIds = response.data; // expecting an array of match IDs

        // Use the existing loadMatchDetails function to get the full match objects.
        const matches = await loadMatchDetails(matchIds);
        console.log("Fetched full match details:", matches);
        return matches;
    } catch (error) {
        console.error(`Error fetching matches for tournament ${tournamentId}:`, error);
        return [];
    }
}

// Load details for multiple teams given an array of team IDs
export async function loadTeamDetails(teamIds) {
    try {
        console.log("Loading team details for team IDs:", teamIds);
        const requests = teamIds.map((id) =>
            axios.get(`http://localhost:8080/api/team/${id}`)
        );
        const responses = await Promise.all(requests);
        const teams = responses.map((res) => res.data);
        console.log("Loaded teams:", teams);
        return teams;
    } catch (error) {
        console.error("Error loading team details:", error);
        return [];
    }
}

// Fetch a tournament by its ID
export async function fetchTournamentById(tournamentId) {
    try {
        console.log(`Fetching tournament with ID: ${tournamentId}`);
        const response = await axios.get(`http://localhost:8080/api/tournament/${tournamentId}`);
        console.log(`Fetched tournament ${tournamentId}:`, response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching tournament:", error);
        return null;
    }
}

/**
 * Update a match by its ID.
 * This function sends a PATCH request with the updated scores and status.
 *
 * @param {string} matchId - The ID of the match to update.
 * @param {object} updateData - The update data containing team1Score, team2Score, and status.
 * @returns {object} The updated match data from the server.
 */
export async function updateMatch(matchId, updateData) {
    try {
        console.log(`Updating match with ID: ${matchId} with data:`, updateData);
        const response = await axios.patch(`http://localhost:8080/api/matches/${matchId}`, updateData);
        console.log(`Updated match ${matchId}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error updating match ${matchId}:`, error);
        throw error;
    }
}

export function convertDate(dateInput, locale = navigator.language) {
    // Ensure the date string is treated as UTC by appending "Z" if it doesn't have one.
    let isoString = dateInput;
    if (typeof dateInput === "string" && !dateInput.endsWith("Z")) {
        isoString += "Z";
    }

    // Parse the ISO string as UTC, then convert to the local time zone.
    const dt = DateTime.fromISO(isoString, { zone: 'utc' }).setZone('local');

    if (!dt.isValid) {
        console.error("Invalid date input:", dateInput);
        return "Invalid Date";
    }

    // Format the date using Luxon's DATETIME_MED format.
    return dt.setLocale(locale).toLocaleString(DateTime.DATETIME_MED);
}
