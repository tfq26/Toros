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
        console.log("Fetching players and generating teams...");
        fetchPlayersAndGenerateTeams(setTeams, setError)
            .then(() => console.log("✅ Players and teams fetched successfully"))
            .catch((err) => console.error("❌ Error fetching players:", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("🔍 Submitting tournament with configuration:", tournamentConfig);
        console.log("📊 Total teams available:", teams.length);

        const { tournamentName, numCourts, gamesPerTeam, startTime, matchDuration, breakTime } = tournamentConfig;

        // Check for empty required fields
        if (!tournamentName || !numCourts || !gamesPerTeam || !startTime || !matchDuration || !breakTime) {
            setError("Please fill in all fields.");
            console.error("❌ Missing required fields:", { tournamentName, numCourts, gamesPerTeam, startTime, matchDuration, breakTime });
            return;
        }

        // Ensure teams exist before submission
        if (teams.length === 0) {
            setError("No valid teams available. Please ensure players are correctly paired.");
            console.error("❌ No teams generated.");
            return;
        }

        const formData = { ...tournamentConfig, teams };

        try {
            console.log("🚀 Sending tournament data to backend:", formData);
            await handleTournamentSetup(
                formData,
                (errorMsg) => {
                    setError(errorMsg);
                    console.error("❌ Tournament setup failed:", errorMsg);
                },
                () => {
                    console.log("✅ Tournament setup successful!");
                    onSetupComplete(formData);
                },
                navigate
            );
        } catch (err) {
            console.error("❌ Error during tournament setup:", err);
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
        console.log("🕒 Start time set to:", formattedTime);
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

                        {/* Start Time Input + Auto-Fill Button */}
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col w-full">
                                <InputField
                                    label="Start Time"
                                    type="time"
                                    value={tournamentConfig.startTime}
                                    onChange={(e) =>
                                        setTournamentConfig({ ...tournamentConfig, startTime: e.target.value })
                                    }
                                />
                            </div>
                            <button
                                type="button"
                                className="bg-emerald-500 text-gray-100 py-2 px-4 rounded-lg hover:bg-emerald-600 transition"
                                onClick={handleSetCurrentTime}
                            >
                                Use Current Time
                            </button>
                        </div>

                        {/* Checkbox Fields */}
                        <div className="flex gap-6 items-center">
                            <CheckboxField
                                label="Use Existing Player List"
                                checked={tournamentConfig.useExistingPlayers}
                                onChange={(e) =>
                                    setTournamentConfig({ ...tournamentConfig, useExistingPlayers: e.target.checked })
                                }
                                className="text-gray-700 dark:text-white"
                            />
                            <CheckboxField
                                label="Divide Tournament into Tiers"
                                checked={tournamentConfig.tiered}
                                onChange={(e) =>
                                    setTournamentConfig({ ...tournamentConfig, tiered: e.target.checked })
                                }
                                className="text-gray-700 dark:text-white"
                            />
                        </div>

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
                        onClick={() => {
                            setIsWindowOpen(!isWindowOpen);
                            console.log(isWindowOpen ? "Closing window" : "Opening window");
                        }}
                        className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition z-50"
                    >
                        {isWindowOpen ? "❌ Close" : "←"}
                    </button>
                </div>
            </div>

            {/* Sliding Window Component */}
            <SlidingWindow
                isOpen={isWindowOpen}
                onClose={() => {
                    setIsWindowOpen(false);
                    console.log("Sliding window closed");
                }}
                sections={[
                    { id: "teams", label: "Teams", content: <TeamsList teams={teams} /> },
                    { id: "stats", label: "Stats", content: <PlayerStats stats={stats} /> },
                ]}
            />
        </div>
    );
};

export default TournamentSetup;
