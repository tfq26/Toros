import axios from "axios";

// Fetch a match by its ID using the new MatchController endpoint
export async function fetchMatchById(matchId) {
    try {
        console.log(`Fetching match with ID: ${matchId}`);
        const response = await axios.get(`http://localhost:8080/api/match/${matchId}`);
        console.log(`Fetched match ${matchId}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching match ${matchId}:`, error);
        return null;
    }
}

// Load details for multiple matches given an array of match IDs
export async function loadMatchDetails(matchIds) {
    try {
        console.log("Loading match details for match IDs:", matchIds);
        const requests = matchIds.map((id) =>
            axios.get(`http://localhost:8080/api/match/${id}`)
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
        const response = await axios.get("http://localhost:8080/api/match");
        console.log("Raw match IDs from backend:", response.data);
        const matchIds = response.data; // expecting an array of match ID strings
        const fullMatches = await loadMatchDetails(matchIds);
        return fullMatches;
    } catch (error) {
        console.error("Error fetching all matches:", error);
        return [];
    }
}

// Fetch a team by its ID
export async function fetchTeamById(teamId) {
    try {
        console.log(`Fetching team with ID: ${teamId}`);
        const response = await axios.get(`http://localhost:8080/api/team/${teamId}`);
        console.log(`Fetched team ${teamId}:`, response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching team:", error);
        return null;
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
