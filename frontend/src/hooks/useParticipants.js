import { useMemo } from 'react';

/**
 * A custom hook to process a tournament's participants and separate them
 * into formed teams and unpaired players.
 * @param {object} tournament - The full tournament object.
 * @returns {{pairedTeams: Array, unpairedPlayers: Array}}
 */
export default function useParticipants(tournament) {
    const { pairedTeams, unpairedPlayers } = useMemo(() => {
        const teams = tournament?.teams || [];
        const allRegisteredPlayers = tournament?.players || [];

        if (allRegisteredPlayers.length === 0) {
            return { pairedTeams: teams, unpairedPlayers: [] };
        }

        // 1. Create a Set of all player IDs that are already in a team.
        const pairedPlayerIds = new Set();
        teams.forEach(team => {
            // ✨ FIX: Use the correct '_id' property.
            if (team?.player1?._id) pairedPlayerIds.add(team.player1._id);
            if (team?.player2?._id) pairedPlayerIds.add(team.player2._id);
        });

        // 2. Filter the main player list to find players whose ID is NOT in the paired set.
        const unpaired = allRegisteredPlayers.filter(player => {
            // ✨ FIX: Use the correct '_id' property and add a guard for null players.
            return player && player._id && !pairedPlayerIds.has(player._id);
        });

        return { pairedTeams: teams, unpairedPlayers: unpaired };

    }, [tournament?.teams, tournament?.players]);

    return { pairedTeams, unpairedPlayers };
}