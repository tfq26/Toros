import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import CheckboxField from "./CheckboxField";
import TeamsList from "./TeamsList";
import PlayerStats from "../PlayerList/PlayerStats.jsx"; // ✅ Imported PlayerStats
import ErrorMessage from "../Error";
import { fetchPlayersAndGenerateTeams, handleTournamentSetup } from "../utils/SetupFunctions";
import { calculateStats } from "../utils/playerUtils.js"; // ✅ For player statistics calculation

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
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlayersAndGenerateTeams(setTeams, setError);
    }, []);

    const handleSubmit = (e) => {
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
        handleTournamentSetup(formData, setError, () => {
            onSetupComplete(formData);
        }, navigate);
    };

    const handleSetCurrentTime = () => {
        const now = new Date();
        const formattedTime = now.toTimeString().slice(0, 5);
        setTournamentConfig((prevConfig) => ({ ...prevConfig, startTime: formattedTime }));
    };

    // ✅ Calculate Player Stats
    const stats = calculateStats(teams.flat()); // Convert teams into a flat list of players

    return (
        <div>
            <div className="container mx-5 py-8 bg-transparent rounded-lg max-w-full">
                <div className="flex flex-col lg:flex-row gap-6 w-full">
                    {/* 📌 Player Stats (Left Side) */}
                    <div className="w-full lg:w-2/12 h-fit bg-white p-4 rounded-lg shadow-md">
                        <PlayerStats stats={stats} />
                    </div>

                    {/* 📌 Tournament Setup Form (Right Side) */}
                    <div className="w-full lg:w-3/5 bg-white p-6 rounded-lg shadow-md h-fit">
                        {/* Tournament Name Input */}
                        <input
                            type="text"
                            value={tournamentConfig.tournamentName}
                            onChange={(e) =>
                                setTournamentConfig({ ...tournamentConfig, tournamentName: e.target.value })
                            }
                            placeholder="Enter Tournament Name"
                            className="w-full text-3xl font-bold text-center text-gray-800 mb-6 p-2 border border-gray-300 rounded-lg"
                        />

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
                                    className="bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition"
                                    onClick={handleSetCurrentTime}
                                >
                                    Use Current Time
                                </button>
                            </div>

                            {/* Sliders for Match Duration & Break Time */}
                            <div>
                                <label className="block text-lg font-medium text-gray-700">
                                    Match Duration: {tournamentConfig.matchDuration} minutes
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="30"
                                    step="5"
                                    value={tournamentConfig.matchDuration}
                                    onChange={(e) =>
                                        setTournamentConfig({ ...tournamentConfig, matchDuration: e.target.value })
                                    }
                                    className="w-full mt-2 cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700">
                                    Break Time: {tournamentConfig.breakTime} minutes
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="30"
                                    step="5"
                                    value={tournamentConfig.breakTime}
                                    onChange={(e) =>
                                        setTournamentConfig({ ...tournamentConfig, breakTime: e.target.value })
                                    }
                                    className="w-full mt-2 cursor-pointer"
                                />
                            </div>

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
                                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition text-lg font-semibold"
                            >
                                Start Tournament 🚀
                            </button>
                        </form>
                    </div>

                    {/* 📌 Teams List (Right Side on Larger Screens) */}
                    <div className="w-full lg:w-fit bg-white p-4 rounded-lg shadow-md mt-6 lg:mt-0">
                        <TeamsList teams={teams} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TournamentSetup;