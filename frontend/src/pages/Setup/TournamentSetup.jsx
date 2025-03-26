import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Checkbox } from "../../components/ui/checkbox.jsx";
import { Slider } from "../../components/ui/slider.jsx";
import { FaClock } from "react-icons/fa";
import ErrorMessage from "../Error";
import SlidingWindow from "../SlidingWindow";
import axios from "axios";
import PlayerStats from "../Players/PlayerStats.jsx";
import {PiArrowCircleLeftFill, PiArrowSquareLeftBold} from "react-icons/pi";
import { convertLevel, calculateStats } from "../utils/playerUtils.js";
// import { toast, ToastContainer } from "react-toastify"; // Old Toast import
import { toast } from "sonner"; // ✅ Fixed Toast import
import "react-toastify/dist/ReactToastify.css";
import { Label } from "@/components/ui/label.jsx";

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

    const [players, setPlayers] = useState([]);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    /** ✅ Fetch Players */
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/players/all");
                const allPlayers = response.data || [];

                const registeredPlayers = allPlayers.filter((player) => player.isRegistered);
                setPlayers(registeredPlayers);

                console.log("✅ Registered Players fetched successfully:", registeredPlayers);
            } catch (err) {
                console.error("❌ Error fetching players:", err);
                setError("Failed to fetch players.");
            }
        };
        fetchPlayers();
    }, []);

    /** ✅ Compute Player Stats */
    const playerStats = calculateStats(players);

    /** ✅ Update Config Values */
    const handleConfigChange = (field, value) => {
        setTournamentConfig((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    /** ✅ Set Start Time to Current Time */
    const handleSetCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const formattedTime = `${hours}:${minutes}`;

        handleConfigChange("startTime", formattedTime);
    };

    /** ✅ Submit Tournament Setup */
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("🚀 Submitting tournamentConfig:", tournamentConfig);

        if (!tournamentConfig.tournamentName.trim()) {
            setError("⚠️ Tournament name is required.");
            toast.error("⚠️ Tournament name is required!");
            return;
        }

        try {
            toast.info("⏳ Creating Tournament...");

            const response = await axios.post("http://localhost:8080/api/tournament/setup", tournamentConfig);

            toast.success("✅ Tournament created successfully!");
            console.log("✅ Tournament setup successful:", response.data);
            console.log("Tournament config after setup:", tournamentConfig);

            onSetupComplete();
            navigate("/tournament/list");
        } catch (err) {
            console.error("❌ Error setting up tournament:", err);
            setError(err.response?.data?.message || "Failed to set up tournament.");
            toast.error("❌ Failed to create tournament.");
        }
    };

    // Set the tab title to "Viewer" on mount.
    useEffect(() => {
        document.title = "Tournament Setup";
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
            {/*<ToastContainer position="top-right" autoClose={3000} />*/}

            <div className="w-full max-w-3xl bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg dark:shadow-none">
                {/* Header */}
                <div className="flex items-center mb-6 space-x-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center mt-2 gap-2 text-gray-700 dark:text-gray-100 hover:text-red-500 dark:hover:text-red-400 transition ease-in-out duration-75"
                    >
                        <PiArrowCircleLeftFill size={30}/>
                    </button>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        Tournament Setup
                    </h2>
                </div>

                {/* Tournament Name */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={tournamentConfig.tournamentName}
                        onChange={(e) => handleConfigChange("tournamentName", e.target.value)}
                        placeholder="Enter Tournament Name"
                        className="w-full text-3xl font-bold text-center p-2 mb-6 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring focus:ring-gray-500 focus:border-red-500"
                    />
                </div>
                <form onSubmit={handleSubmit} className="space-y-7">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-xl text-gray-700 dark:text-gray-200">Number of Courts</Label>
                            <Label className="text-xl text-gray-700 dark:text-gray-200">Number of Games per Team</Label>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Input
                                type="number"
                                value={tournamentConfig.numCourts}
                                onChange={(e) => handleConfigChange("numCourts", parseInt(e.target.value, 10))}
                                max={20}
                                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            />
                            <Input
                                type="number"
                                value={tournamentConfig.gamesPerTeam}
                                onChange={(e) => handleConfigChange("gamesPerTeam", parseInt(e.target.value, 10))}
                                max={20}
                                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            />
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="flex items-center gap-4">
                            <Label className="text-xl text-gray-700 dark:text-gray-200">Start Time</Label>
                            <Input
                                type="time"
                                value={tournamentConfig.startTime}
                                onChange={(e) => handleConfigChange("startTime", e.target.value)}
                                className="w-fit dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            />
                            <Button
                                type="button"
                                className="bg-emerald-200 hover:bg-emerald-300 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white text-emerald-500 px-4 py-2 rounded-lg transition"
                                onClick={handleSetCurrentTime}
                            >
                                <FaClock/>
                            </Button>
                        </div>

                        <div className="ml-auto flex flex-col gap-4 mr-[15%]">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={tournamentConfig.useExistingPlayers}
                                    onChange={(e) => handleConfigChange("useExistingPlayers", e.target.checked)}
                                    className="dark:border-gray-600"
                                />
                                <Label className="text-md font-medium text-gray-700 dark:text-gray-200">
                                    Use Existing Player List
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={tournamentConfig.tiered}
                                    onChange={(e) => handleConfigChange("tiered", e.target.checked)}
                                    className="dark:border-gray-600"
                                />
                                <Label className="text-md font-medium text-gray-700 dark:text-gray-200">
                                    Divide Tournament into Tiers
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label className="text-lg font-medium text-gray-700 dark:text-gray-200 pb-4">Game
                            Duration</Label>
                        <Slider
                            value={[tournamentConfig.matchDuration]}
                            max={120}
                            step={5}
                            onValueChange={(newValue) => handleConfigChange("matchDuration", newValue[0])}
                        />
                    </div>
                    <div>
                        <Label className="text-lg font-medium text-gray-700 dark:text-gray-200 pb-4">Break Time</Label>
                        <Slider
                            value={[tournamentConfig.breakTime]}
                            max={60}
                            step={5}
                            onValueChange={(newValue) => handleConfigChange("breakTime", newValue[0])}
                        />
                    </div>

                    <div className="mt-auto flex justify-end">
                        <Button
                            type="submit"
                            className="w-fit bg-amber-300 hover:bg-amber-400 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white py-3 rounded-lg text-xl font-semibold transition"
                        >
                            Start Tournament
                        </Button>
                    </div>
                </form>
            </div>

            <SlidingWindow
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                sections={[
                    {
                        id: "players",
                        label: "Registered Players",
                        content: (
                            <div className="p-4 bg-gray-100 dark:bg-gray-800">
                                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                                    📋 Registered Players
                                </h3>
                                {players.length ? (
                                    <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                                        {players.map((player) => (
                                            <li key={player.id} className="border-b border-gray-300 dark:border-gray-600 pb-2">
                                                {player.name} — {convertLevel(player.skillLevel) || "Unranked"}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-400">No registered players found.</p>
                                )}
                            </div>
                        ),
                    },
                    {
                        id: "playerStats",
                        label: "Player Stats",
                        content: <PlayerStats stats={playerStats} />,
                    },
                ]}
            />
        </div>
    );
};

export default TournamentSetup;