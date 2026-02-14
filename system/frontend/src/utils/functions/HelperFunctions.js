import axios from "axios";

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
            return "🌱";
        case "Intermediate":
            return "🔥";
        case "Advanced":
            return "🏆";
        default:
            return "❓";
    }
};

/**
 * Fetch players data from the API.
 * @returns {Promise<Array>} The players data.
 */
export const fetchPlayersData = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await axios.get("http://localhost:8080/api/players/all", {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Filters the players list based on the selected club, level and search query.
 * @param {Array} players - The list of players.
 * @param {string} selectedClub - The selected club filter.
 * @param {string} selectedLevel - The selected level filter.
 * @param {string} searchQuery - The search query.
 * @returns {Array} The filtered list of players.
 */
export const filterPlayersData = (players, selectedClub, selectedLevel, searchQuery) => {
    let filtered = [...players];
    if (selectedClub) {
        filtered = filtered.filter((player) => player.clubName === selectedClub);
    }
    if (selectedLevel) {
        filtered = filtered.filter((player) => convertLevel(player.skillLevel) === selectedLevel);
    }
    if (searchQuery) {
        filtered = filterPlayersBySearch(filtered, searchQuery);
    }
    return filtered;
};

/**
 * Converts a time string or Date object to 12-hour time format.
 * @param {string|Date} time - The time to format.
 * @returns {string} The formatted time in 12-hour format.
 */
export const formatTo12HourTime = (time) => {
    if (!time) return "N/A";

    // If time is already a Date, format it directly.
    if (time instanceof Date) {
        return time.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    if (typeof time === "string") {
        // If the string is in ISO format (contains a "T"),
        // create a Date object.
        if (time.includes("T")) {
            const date = new Date(time);
            if (!isNaN(date.getTime())) {
                return date.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                });
            }
        }

        // Fallback: if it's not in ISO format, try to split by colon.
        const parts = time.split(":").map(Number);
        if (parts.length >= 2) {
            const [hours, minutes] = parts;
            const date = new Date();
            date.setHours(hours, minutes);
            return date.toLocaleString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        }
    }

    return "N/A";
};


/**
 * Validate and transform imported player data.
 * @param {Array} data - The raw player data.
 * @returns {Object} - Contains valid status, message, and processed data.
 */
export const validateAndPreviewPlayers = (data) => {
    const requiredFields = ["Name", "Email", "Club", "Placement"];
    if (!data || data.length === 0) {
        return {
            valid: false,
            message: "Error: No valid player data found in the file.",
            data: [],
        };
    }
    const processedData = [];
    for (let i = 0; i < data.length; i++) {
        const player = data[i];
        for (let field of requiredFields) {
            if (!player[field]) {
                return {
                    valid: false,
                    message: `Error: Missing '${field}' in row ${i + 1}.`,
                    data: [],
                };
            }
        }
        processedData.push({
            name: player.Name,
            email: player.Email,
            clubName: player.Club,
            // Convert the raw placement value to a number for consistency.
            skillLevel: Number(player.Placement),
        });
    }
    return { valid: true, message: "Valid data", data: processedData };
};

/**
 * Calculate player stats.
 * @param {Array} players - The list of players.
 * @returns {Object} Stats including total players, teams, rank counts, and club counts.
 */
export const calculateStats = (players) => {
    // Flatten players array in case it's nested.
    const flatPlayers = Object.values(players).flat();
    const totalPlayers = flatPlayers.length;
    const totalTeams = new Set(flatPlayers.map((player) => player.teamNumber)).size;

    const rankCounts = flatPlayers.reduce(
        (acc, player) => {
            const rank = convertLevel(player.skillLevel);
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

/**
 * Filters the player list based on the search query.
 * @param {Array} players - The list of players.
 * @param {string} searchQuery - The search query to filter players by.
 * @returns {Array} The filtered list of players.
 */
export const filterPlayersBySearch = (players, searchQuery) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return players.filter((player) =>
        player.name && player.name.toLowerCase().includes(lowerCaseQuery)
    );
};

/**
 * Saves player data.
 *
 * @param {Object} params
 * @param {Object} params.formData - The form data from the modal.
 * @param {Object} params.player - The player being edited (if any).
 * @param {Function} params.refreshPlayers - Function to refresh the player list.
 * @param {Function} params.setIsDirty - State setter for isDirty.
 * @param {Function} params.setShowCheckmark - State setter for showing the checkmark.
 */
export const savePlayerData = async ({ formData, player, refreshPlayers, setIsDirty, setShowCheckmark }) => {
    try {
        const payload = {
            ...formData,
            age: parseInt(formData.age, 10) || 0,
            teamNumber: parseInt(formData.teamNumber, 10) || 0,
            placement: parseInt(formData.placement, 10) || 0,
        };

        if (player) {
            await axios.put(`http://localhost:8080/api/players/${player.id}`, payload);
        } else {
            await axios.post(`http://localhost:8080/api/players`, payload);
        }

        refreshPlayers();
        setIsDirty(false);
        setShowCheckmark(true);

        // Hide checkmark after 3 seconds
        setTimeout(() => setShowCheckmark(false), 3000);
    } catch (error) {
        console.error("Error saving player:", error);
        throw error;
    }
};

/**
 * Deletes a player.
 *
 * @param {Object} params
 * @param {Object} params.player - The player to delete.
 * @param {Function} params.refreshPlayers - Function to refresh the player list.
 * @param {Function} params.onClose - Function to close the modal.
 */
export const deletePlayerData = async ({ player, refreshPlayers, onClose }) => {
    if (!player) return;
    if (!window.confirm("Are you sure you want to delete this player?")) return;
    try {
        await axios.delete(`http://localhost:8080/api/players/${player.id}`);
        refreshPlayers();
        onClose();
    } catch (error) {
        console.error("Error deleting player:", error);
        throw error;
    }
};