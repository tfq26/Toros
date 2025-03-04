// apiHelpers.js

// Fetch a team by its ID
export async function fetchTeamById(teamId) {
    try {
        const response = await fetch(`http://localhost:8080/api/team/${teamId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch team: ${response.statusText}`);
        }
        const teamData = await response.json();
        return teamData;
    } catch (error) {
        console.error('Error fetching team:', error);
        return null;
    }
}

// Fetch a match by its ID
export async function fetchMatchById(matchId) {
    try {
        const response = await fetch(`http://localhost:8080/api/match/${matchId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch match: ${response.statusText}`);
        }
        const matchData = await response.json();
        return matchData;
    } catch (error) {
        console.error('Error fetching match:', error);
        return null;
    }
}

// Fetch a tournament by its ID
export async function fetchTournamentById(tournamentId) {
    try {
        const response = await fetch(`http://localhost:8080/api/tournament/${tournamentId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch tournament: ${response.statusText}`);
        }
        const tournamentData = await response.json();
        return tournamentData;
    } catch (error) {
        console.error('Error fetching tournament:', error);
        return null;
    }
}

// Load details for multiple teams given an array of team IDs
export async function loadTeamDetails(teamIds) {
    const teams = await Promise.all(teamIds.map(id => fetchTeamById(id)));
    console.log('Teams:', teams);
    return teams;
}

// Load details for multiple matches given an array of match IDs
export async function loadMatchDetails(matchIds) {
    const matches = await Promise.all(matchIds.map(id => fetchMatchById(id)));
    console.log('Matches:', matches);
    return matches;
}
