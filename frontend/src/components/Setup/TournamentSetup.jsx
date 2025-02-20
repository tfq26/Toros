import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import CheckboxField from "./CheckboxField";
import TeamsList from "./TeamsList";
import PlayerStats from "../PlayerList/PlayerStats.jsx";
import ErrorMessage from "../Error";
import { fetchPlayersAndGenerateTeams, handleTournamentSetup } from "../utils/SetupFunctions";
import { calculateStats } from "../utils/playerUtils.js";
import SliderField from "./SliderField.jsx";
import SlidingWindow from "../SlidingWindow.jsx"; // Import the new SlidingWindow component

const TournamentSetup = ({ onSetupComplete }) => {
    const [tournamentConfig, setTournamentConfig] = useState({
        tournamentName: "",
        numCourts: 1,
        gamesPerTeam: 3,
        startTime: "",
        matchDuration: 30,
        breakTime: 5,
        useExistingPlayers: false,
        tiered: false,
    });

    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);
    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlayersAndGenerateTeams(setTeams, setError).then((r) => r);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { tournamentName, numCourts, gamesPerTeam, startTime, matchDuration, breakTime } = tournamentConfig;
        if (!tournamentName || !numCourts || !gamesPerTeam || !startTime || !matchDuration || !breakTime) {
            setError("Please fill in all fields.");
            return;
        }

        if (teams.length === 0) {
            setError("No valid teams available. Please ensure players are correctly paired.");
            return;
        }

        const formData = { ...tournamentConfig, teams };

        try {
            await handleTournamentSetup(formData, setError, () => {
                onSetupComplete(formData);
            }, navigate);
        } catch (err) {
            navigate("/error", {
                state: {
                    city: "Moscow",
                    message: "Failed to setup tournament.",
                    detailedMessage: err.message || "An unknown error occurred while setting up the tournament.",
                    errorMessages: [err.message],
                },
            });
        }
    };

    const handleSetCurrentTime = () => {
        const now = new Date();
        const formattedTime = now.toTimeString().slice(0, 5);
        setTournamentConfig((prevConfig) => ({ ...prevConfig, startTime: formattedTime }));
    };

    const stats = calculateStats(teams.flat());

    return (
        <div className="relative container px-6 py-6 bg-transparent rounded-lg max-w-full">
            <div className="flex">
                {/* Tournament Setup Form */}
                <div className="w-full lg:w-[95%] bg-white dark:bg-gray-600 p-6 rounded-lg shadow-md h-fit">
                    <input
                        type="text"
                        value={tournamentConfig.tournamentName}
                        onChange={(e) =>
                            setTournamentConfig({ ...tournamentConfig, tournamentName: e.target.value })
                        }
                        placeholder="Enter Tournament Name"
                        className="w-full text-3xl font-bold text-center text-gray-800 dark:text-gray-900 mb-6 p-2 border border-gray-300 rounded-lg"
                    />

                    {error && <ErrorMessage message={error} />}

                    <form onSubmit={handleSubmit} className="space-y-2 dark:text-black placeholder:text-gray-100">
                        <InputField
                            label="Court Number"
                            type="number"
                            value={tournamentConfig.numCourts}
                            onChange={(e) =>
                                setTournamentConfig({ ...tournamentConfig, numCourts: e.target.value })
                            }
                            placeholder="Enter number of courts"
                        />
                        <InputField
                            label="Games Played"
                            type="number"
                            value={tournamentConfig.gamesPerTeam}
                            onChange={(e) =>
                                setTournamentConfig({ ...tournamentConfig, gamesPerTeam: e.target.value })
                            }
                            placeholder="Enter games per team"
                        />

                        <SliderField
                            label="Match Duration"
                            value={tournamentConfig.matchDuration}
                            min="0"
                            max="30"
                            step="5"
                            onChange={(e) =>
                                setTournamentConfig({ ...tournamentConfig, matchDuration: e.target.value })
                            }
                        />
                        <SliderField
                            label="Break Time"
                            value={tournamentConfig.breakTime}
                            min="0"
                            max="30"
                            step="5"
                            onChange={(e) =>
                                setTournamentConfig({ ...tournamentConfig, breakTime: e.target.value })
                            }
                        />

                        <button
                            type="submit"
                            className="w-full bg-yellow-400 text-gray-800 py-2 px-4 rounded-lg hover:bg-amber-500 transition text-2xl font-semibold dark:text-black"
                        >
                            Start Tournament 🚀
                        </button>
                    </form>
                </div>

                {/* Toggle Button to Open Sliding Window */}
                <div className="w-[0%] flex items-center justify-center">
                    <button
                        onClick={() => setIsWindowOpen(!isWindowOpen)}
                        className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition z-50"
                    >
                        {isWindowOpen ? "❌ Close" : "←"}
                    </button>
                </div>
            </div>

            {/* Sliding Window Component */}
            <SlidingWindow
                isOpen={isWindowOpen}
                onClose={() => setIsWindowOpen(false)}
                sections={[
                    { id: "teams", label: "Teams", content: <TeamsList teams={teams} /> },
                    { id: "stats", label: "Stats", content: <PlayerStats stats={stats} /> },
                ]}
            />
        </div>
    );
};

export default TournamentSetup;
