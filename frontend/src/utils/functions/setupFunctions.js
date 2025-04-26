import axios from "axios";

/**
 * Fetch players from the backend and generate valid teams.
 * A valid team is defined as a team with exactly 2 players.
 */
export const fetchPlayersAndGenerateTeams = async (setTeams, setError) => {
    try {
        const response = await axios.get("http://localhost:8080/api/players/all");
        if (Array.isArray(response.data)) {
            // Group players by teamNumber
            const groupedPlayers = response.data.reduce((acc, player) => {
                if (player.teamNumber !== null) {
                    if (!acc[player.teamNumber]) acc[player.teamNumber] = [];
                    acc[player.teamNumber].push(player);
                }
                return acc;
            }, {});

            // Filter teams with exactly 2 players
            const validTeams = Object.values(groupedPlayers).filter(
                (team) => team.length === 2
            );
            setTeams(validTeams);
            setError(null);
        } else {
            console.error("Unexpected response format:", response.data);
            setTeams([]);
        }
    } catch (err) {
        console.error("Error fetching players:", err.message || err);
        setError("Failed to fetch players. Please try again.");
    }
};

/**
 * Send tournament setup data to the backend.
 * Calls onSuccess if the setup is successful, or onError with an error message otherwise.
 */
export const handleTournamentSetup = async (formData, onError, onSuccess) => {
    try {
        console.log("Sending tournament setup request with data:", formData);
        const response = await fetch("http://localhost:8080/api/tournament/setup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            // Check if the response is JSON; if not, read as text.
            const contentType = response.headers.get("content-type");
            let errorData;
            if (contentType && contentType.includes("application/json")) {
                errorData = await response.json();
            } else {
                const text = await response.text();
                errorData = { message: text };
            }
            console.error("Backend responded with error:", errorData);
            onError(errorData.message || "Tournament setup failed.");
            return;
        }

        console.log("Tournament setup completed successfully.");
        onSuccess();
        // Routing is handled elsewhere (in AppRoutes), so no navigate call here.
    } catch (error) {
        console.error("Error in handleTournamentSetup:", error);
        onError(error.message || "An unexpected error occurred.");
    }
};

/**
 * Handle form submission for tournament setup.
 * Validates required fields and teams, then calls handleTournamentSetup.
 */
export const handleSubmit = (
    e,
    tournamentConfig,
    teams,
    setError,
    onSetupComplete
) => {
    e.preventDefault();

    console.log("Submitting tournament with configuration:", tournamentConfig);
    console.log("Total teams available:", teams.length);

    const { tournamentName, numCourts, gamesPerTeam, startTime, matchDuration, breakTime } = tournamentConfig;

    if (!tournamentName || !numCourts || !gamesPerTeam || !startTime || !matchDuration || !breakTime) {
        console.error("Missing required fields:", { tournamentName, numCourts, gamesPerTeam, startTime, matchDuration, breakTime });
        setError("Please fill in all fields.");
        return;
    }

    if (teams.length === 0) {
        console.error("No teams generated.");
        setError("No valid teams available. Please ensure players are correctly paired.");
        return;
    }

    const formData = { ...tournamentConfig, teams };

    try {
        console.log("Sending tournament data to backend:", formData);
        handleTournamentSetup(
            formData,
            (errorMsg) => {
                setError(errorMsg || "An unexpected error occurred.");
                console.error("Tournament setup failed:", errorMsg || "Unknown error");
            },
            () => {
                console.log("Tournament setup successful!");
                onSetupComplete(formData);
            }
        );
    } catch (err) {
        console.error("Error during tournament setup:", err);
        setError(err.message || "An unknown error occurred while setting up the tournament.");
    }
};

/**
 * Sets the current date and time into the tournament configuration.
 * Updates both startDate and startTime fields.
 */
export const handleSetCurrentTime = (setTournamentConfig) => {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    setTournamentConfig((prevConfig) => ({
        ...prevConfig,
        startDate: formattedDate,
        startTime: `${hours}:${minutes}`,
    }));
    console.log("Start Time Set to:", `${hours}:${minutes} on ${formattedDate}`);
};

/**
 * Updates a given field in the tournament configuration state.
 */
export const handleConfigChange = (setTournamentConfig, field, value) => {
    setTournamentConfig((prevConfig) => {
        const updatedConfig = { ...prevConfig, [field]: value };
        console.log(`Updated ${field}:`, updatedConfig);
        return updatedConfig;
    });
};
