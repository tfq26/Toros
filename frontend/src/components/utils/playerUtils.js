/**
 * Convert placement number to a readable rank.
 * @param {number} placement - The placement number (e.g., 1, 2, 3).
 * @returns {string} The rank name.
 */
export const convertLevel = (placement) => {
    switch (placement) {
        case 1:
            return "Beginner";
        case 2:
            return "Intermediate";
        case 3:
            return "Advanced";
        default:
            return "Unknown";
    }
};

/**
 * Get an emoji based on the rank.
 * @param {string} rank - The rank name (e.g., "Beginner").
 * @returns {string} The emoji for the rank.
 */
export const getEmojiForRank = (rank) => {
    switch (rank) {
        case "Beginner":
            return "🌱"; // Emoji for beginners
        case "Intermediate":
            return "🔥"; // Emoji for intermediate
        case "Advanced":
            return "🏆"; // Emoji for advanced
        default:
            return "❓"; // Emoji for unknown or other ranks
    }
};

/**
 * Converts a time string or Date object to 12-hour time format.
 * @param {string|Date} time - The time to format.
 * @returns {string} The formatted time in 12-hour format.
 */
export const formatTo12HourTime = (time) => {
    if (!time) return "N/A";

    // If time is a Date object, extract hours and minutes
    if (time instanceof Date) {
        return time.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    // If time is a string, parse it into a Date object
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);

    return date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};


/**
 * Calculate player stats.
 * @param {Array} players - The list of players.
 * @returns {Object} Stats including total players, teams, rank counts, and club counts.
 */
export const calculateStats = (players) => {
    const flatPlayers = Object.values(players).flat();
    const totalPlayers = flatPlayers.length;
    const totalTeams = new Set(flatPlayers.map((player) => player.teamNumber)).size;

    const rankCounts = flatPlayers.reduce(
        (acc, player) => {
            const rank = convertLevel(player.placement);
            acc[rank] = (acc[rank] || 0) + 1;
            return acc;
        },
        { Beginner: 0, Intermediate: 0, Advanced: 0, Unknown: 0 }
    );

    const clubCounts = flatPlayers.reduce((acc, player) => {
        acc[player.clubName] = (acc[player.clubName] || 0) + 1;
        return acc;
    }, {});

    return { totalPlayers, totalTeams, rankCounts, clubCounts };
};
