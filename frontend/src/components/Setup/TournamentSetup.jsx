import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import CheckboxField from "./CheckboxField";
import TeamsList from "./TeamsList";
import ErrorMessage from "../Error";
import { fetchPlayersAndGenerateTeams, handleTournamentSetup } from "../utils/SetupFunctions";

// eslint-disable-next-line react/prop-types
const TournamentSetup = ({ onSetupComplete }) => {
    const [tournamentConfig, setTournamentConfig] = useState({
        numCourts: "",
        gamesPerTeam: "",
        startTime: "",
        matchDuration: "",
        breakTime: "",
        useExistingPlayers: false,
        tiered: false,
    });
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlayersAndGenerateTeams(setTeams, setError);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields
        const { numCourts, gamesPerTeam, startTime, matchDuration, breakTime } = tournamentConfig;
        if (!numCourts || !gamesPerTeam || !startTime || !matchDuration || !breakTime) {
            setError("Please fill in all fields.");
            return;
        }

        // Validate teams
        if (teams.length === 0) {
            setError("No valid teams available. Please ensure players are correctly paired.");
            return;
        }

        const formData = { ...tournamentConfig, teams };
        handleTournamentSetup(formData, setError, () => {
            onSetupComplete(formData); // Pass tournamentConfig to the parent
        }, navigate);

        handleTournamentSetup({ ...tournamentConfig, teams }, setError, onSetupComplete, navigate);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">Tournament Setup</h2>

            {/* Error Message */}
            {error && <ErrorMessage message={error} />}

            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                    label="Number of Courts"
                    type="number"
                    value={tournamentConfig.numCourts}
                    onChange={(e) =>
                        setTournamentConfig({ ...tournamentConfig, numCourts: e.target.value })
                    }
                    placeholder="Enter number of courts"
                />
                <InputField
                    label="Games Per Team"
                    type="number"
                    value={tournamentConfig.gamesPerTeam}
                    onChange={(e) =>
                        setTournamentConfig({ ...tournamentConfig, gamesPerTeam: e.target.value })
                    }
                    placeholder="Enter games per team"
                />
                <InputField
                    label="Start Time"
                    type="time"
                    value={tournamentConfig.startTime}
                    onChange={(e) =>
                        setTournamentConfig({ ...tournamentConfig, startTime: e.target.value })
                    }
                />
                <InputField
                    label="Match Duration (minutes)"
                    type="number"
                    value={tournamentConfig.matchDuration}
                    onChange={(e) =>
                        setTournamentConfig({ ...tournamentConfig, matchDuration: e.target.value })
                    }
                    placeholder="Enter match duration"
                />
                <InputField
                    label="Break Time Between Matches (minutes)"
                    type="number"
                    value={tournamentConfig.breakTime}
                    onChange={(e) =>
                        setTournamentConfig({ ...tournamentConfig, breakTime: e.target.value })
                    }
                    placeholder="Enter break time in minutes"
                />
                <CheckboxField
                    label="Use Existing Player List"
                    checked={tournamentConfig.useExistingPlayers}
                    onChange={(e) =>
                        setTournamentConfig({ ...tournamentConfig, useExistingPlayers: e.target.checked })
                    }
                />
                <CheckboxField
                    label="Divide Tournament into Tiers"
                    checked={tournamentConfig.tiered}
                    onChange={(e) =>
                        setTournamentConfig({ ...tournamentConfig, tiered: e.target.checked })
                    }
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    Start Tournament
                </button>
            </form>

            {/* Teams List */}
            <TeamsList teams={teams} />
        </div>
    );
};

export default TournamentSetup;
