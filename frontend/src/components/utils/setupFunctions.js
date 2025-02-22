import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Import React Router's navigation

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
export const handleTournamentSetup = async (formData, onError, onSuccess, navigate) => {
    try {
        console.log("📡 Sending tournament setup request with data:", formData);
        const response = await fetch("http://localhost:8080/api/tournament/setup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("⚠️ Backend responded with error:", errorData);
            onError(errorData.message || "Tournament setup failed.");
            return;
        }

        console.log("✅ Tournament setup completed successfully.");
        onSuccess();

        // ✅ Use navigate to go to the success page
        navigate("/tournament-success");
    } catch (error) {
        console.error("❌ Error in handleTournamentSetup:", error);
        onError(error.message || "An unexpected error occurred.");
    }
};

export const handleSubmit = (e, tournamentConfig, teams, setError, onSetupComplete) => {
    e.preventDefault();
    const navigate = useNavigate(); // ✅ Use React Router's navigate function

    console.log("🔍 Submitting tournament with configuration:", tournamentConfig);
    console.log("📊 Total teams available:", teams.length);

    const { tournamentName, numCourts, gamesPerTeam, startTime, matchDuration, breakTime } = tournamentConfig;

    if (!tournamentName || !numCourts || !gamesPerTeam || !startTime || !matchDuration || !breakTime) {
        const missingFields = { tournamentName, numCourts, gamesPerTeam, startTime, matchDuration, breakTime };
        console.error("❌ Missing required fields:", missingFields);
        setError("Please fill in all fields.");
        return;
    }

    if (teams.length === 0) {
        console.error("❌ No teams generated.");
        setError("No valid teams available. Please ensure players are correctly paired.");
        return;
    }

    const formData = { ...tournamentConfig, teams };

    try {
        console.log("🚀 Sending tournament data to backend:", formData);
        handleTournamentSetup(
            formData,
            (errorMsg) => {
                setError(errorMsg || "An unexpected error occurred.");
                console.error("❌ Tournament setup failed:", errorMsg || "Unknown error");
            },
            () => {
                console.log("✅ Tournament setup successful!");
                onSetupComplete(formData);
                navigate("/tournament-success"); // ✅ Navigate to success page after completion
            },
            navigate
        );
    } catch (err) {
        console.error("❌ Error during tournament setup:", err);

        setError(err.message || "An unknown error occurred while setting up the tournament.");

        navigate("/error", {
            state: {
                message: "Failed to setup tournament.",
                detailedMessage: err.message || "An unknown error occurred while setting up the tournament.",
                errorMessages: [err.message],
            },
        });
    }
};

export const handleSetCurrentTime = (setTournamentConfig) => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }); // 24-hour format

    setTournamentConfig((prevConfig) => ({
        ...prevConfig,
        startTime: formattedTime,
    }));

    console.log("⏰ Start Time Set to:", formattedTime);
};


export const handleConfigChange = (setTournamentConfig, field, value) => {
    setTournamentConfig((prevConfig) => {
        const updatedConfig = { ...prevConfig, [field]: value };
        console.log(`📝 Updated ${field}:`, updatedConfig);
        return updatedConfig;
    });
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
