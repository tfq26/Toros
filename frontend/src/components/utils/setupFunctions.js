import axios from "axios";

// Fetch players and generate valid teams
export const fetchPlayersAndGenerateTeams = async (setTeams, setError) => {
    try {
        const response = await axios.get("http://localhost:8080/api/players/all");
        if (Array.isArray(response.data)) {
            const groupedPlayers = response.data.reduce((acc, player) => {
                if (player.teamNumber !== null) {
                    if (!acc[player.teamNumber]) acc[player.teamNumber] = [];
                    acc[player.teamNumber].push(player);
                }
                return acc;
            }, {});

            const validTeams = Object.values(groupedPlayers).filter(
                (team) => team.length === 2
            );
            setTeams(validTeams);
            setError(null); // Clear the error if the fetch is successful
        } else {
            console.error("Unexpected response format:", response.data);
            setTeams([]);
        }
    } catch (err) {
        console.error("Error fetching players:", err.message || err);
        setError("Failed to fetch players. Please try again.");
    }
};

// Handle tournament setup submission
export const handleTournamentSetup = async (
    formData,
    setError,
    onSetupComplete,
    navigate
) => {
    const {
        numCourts,
        gamesPerTeam,
        startTime,
        matchDuration,
        breakTime, // New breakTime parameter
        useExistingPlayers,
        tiered,
        teams,
    } = formData;

    // Check for required fields
    if (!numCourts || !gamesPerTeam || !startTime || !matchDuration || !breakTime) {
        setError("Please fill in all fields.");
        return;
    }

    // Check for valid teams
    if (teams.length === 0) {
        setError("No valid teams available. Please ensure players are correctly paired.");
        return;
    }

    try {
        const response = await axios.post("http://localhost:8080/api/tournament/setup", {
            numCourts: parseInt(numCourts, 10),
            gamesPerTeam: parseInt(gamesPerTeam, 10),
            startTime,
            matchDuration: parseInt(matchDuration, 10),
            breakTime: parseInt(breakTime, 10), // Send the break time to the backend
            useExistingPlayers,
            tiered,
        });

        if (response.status === 200) {
            setError(null); // Clear the error on successful setup
            alert("Tournament setup complete!");
            onSetupComplete();
            navigate("/tournament/live");
        }
    } catch (err) {
        console.error("Error setting up tournament:", err.response?.data || err.message);
        setError("Failed to set up tournament. Please try again.");
    }
};

// Calculate match schedule with break time
export const calculateMatchSchedule = (
    startTime,
    matchDuration,
    breakTime,
    gamesPerTeam
) => {
    const matches = [];
    const start = new Date(`1970-01-01T${startTime}:00`);
    const totalDuration = matchDuration + breakTime;

    for (let i = 0; i < gamesPerTeam; i++) {
        const matchStart = new Date(start.getTime() + i * totalDuration * 60000);
        const matchEnd = new Date(matchStart.getTime() + matchDuration * 60000);

        matches.push({
            matchNumber: i + 1,
            start: matchStart.toTimeString().slice(0, 5),
            end: matchEnd.toTimeString().slice(0, 5),
        });
    }

    return matches;
};
