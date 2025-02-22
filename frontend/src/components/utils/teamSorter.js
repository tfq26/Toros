class TeamSorter {
    /**
     * Sort teams based on positive point differential, total points, and placement,
     * ensuring that completed matches rank higher than unfinished 0-0 games.
     * @param {Array} teams - List of teams to be sorted
     * @param {Array} matches - List of matches to check if a team has played
     * @returns {Array} Sorted teams in descending order (best team first)
     */
    static sortTeams(teams, matches = []) {
        if (!Array.isArray(matches)) {
            console.warn("⚠️ `matches` is not an array. Sorting may be incorrect.");
            matches = [];
        }

        console.log("📊 Sorting Debug - Initial Matches:");
        matches.forEach(match => {
            console.log(`🆔 Match ${match.id} | Status: ${match.status} | Team1: ${match.team1.totalPoints} | Team2: ${match.team2.totalPoints}`);
        });

        // Identify teams that have played at least one match with a non-0-0 score OR completed status
        const activeTeams = new Set();
        matches.forEach(match => {
            if (match.status === "Complete" || (match.team1.totalPoints > 0 || match.team2.totalPoints > 0)) {
                activeTeams.add(match.team1.id);
                activeTeams.add(match.team2.id);
            }
        });

        const sortedTeams = teams.sort((a, b) => {
            const aPlayed = activeTeams.has(a.id);
            const bPlayed = activeTeams.has(b.id);

            // 1️⃣ Ensure teams that have played rank higher than those that haven’t
            if (!aPlayed && !bPlayed) return 0;
            if (aPlayed && !bPlayed) return -1;
            if (!aPlayed && bPlayed) return 1;

            // 2️⃣ Sort by **positive point differential** (higher is better)
            const pointDiffA = Math.max(0, a.totalPoints - a.pointsConceded);
            const pointDiffB = Math.max(0, b.totalPoints - b.pointsConceded);
            if (pointDiffB !== pointDiffA) {
                return pointDiffB - pointDiffA;
            }

            // 3️⃣ Sort by **total points** (higher is better)
            if (b.totalPoints !== a.totalPoints) {
                return b.totalPoints - a.totalPoints;
            }

            // 4️⃣ Sort by placement (lower is better, but ignore null placements)
            const placementA = a.placement ?? Infinity; // Default null placement to large value
            const placementB = b.placement ?? Infinity;
            if (placementA !== placementB) {
                return placementA - placementB;
            }

            return 0; // Default case (equal teams)
        });

        console.log("🏆 Sorted Teams Ranking:");
        sortedTeams.forEach((team, index) => {
            console.log(`🔢 Rank ${index + 1}: ${team.name} | Point Diff: ${Math.max(0, team.totalPoints - team.pointsConceded)} | Total Points: ${team.totalPoints} | Placement: ${team.placement}`);
        });

        return sortedTeams;
    }
}

export default TeamSorter;
