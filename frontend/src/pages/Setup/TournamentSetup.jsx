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
import { PiArrowCircleLeftFill } from "react-icons/pi";
import { convertLevel, calculateStats } from "../utils/playerUtils.js";
import { toast } from "sonner";
import { Label } from "@/components/ui/label.jsx";
import { DatePicker } from "@/components/ui/date-picker.jsx";

const TournamentSetup = ({ onSetupComplete }) => {
    const [tournamentConfig, setTournamentConfig] = useState({
        tournamentName: "",
        numCourts: 1,
        gamesPerTeam: 3,
        startDate: "",
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

    // Fetch registered players
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/players/all");
                const allPlayers = response.data || [];
                const registeredPlayers = allPlayers.filter((player) => player.isRegistered);
                setPlayers(registeredPlayers);
            } catch (err) {
                console.error("Error fetching players:", err);
                setError("Failed to fetch players.");
            }
        };
        fetchPlayers();
    }, []);

    const playerStats = calculateStats(players);

    const handleConfigChange = (field, value) => {
        setTournamentConfig((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Set the current date and time
    const handleSetCurrentTime = () => {
        const now = new Date();
        const formattedDate = now.toISOString().split("T")[0];
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        handleConfigChange("startDate", formattedDate);
        handleConfigChange("startTime", `${hours}:${minutes}`);
    };

    // Submit tournament configuration
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tournamentConfig.tournamentName.trim()) {
            setError("Tournament name is required.");
            toast.error("Tournament name is required!");
            return;
        }

        const combinedStartTime =
            tournamentConfig.startDate && tournamentConfig.startTime
                ? `${tournamentConfig.startDate}T${tournamentConfig.startTime}:00`
                : "";

        const submissionConfig = {
            ...tournamentConfig,
            startTime: combinedStartTime,
        };

        try {
            toast.info("Creating Tournament...");
            const response = await axios.post("http://localhost:8080/api/tournament/setup", submissionConfig);
            toast.success("Tournament created successfully!");
            onSetupComplete();
            navigate("/tournament/list");
        } catch (err) {
            console.error("Error setting up tournament:", err);
            setError(err.response?.data?.message || "Failed to set up tournament.");
            toast.error("Failed to create tournament.");
        }
    };

    useEffect(() => {
        document.title = "Tournament Setup";
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-800">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-700 dark:text-gray-100">
                        <PiArrowCircleLeftFill size={28} />
                    </Button>
                    <div className="flex-grow text-center">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100">
                            Tournament Setup
                        </h2>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                            Configure your tournament details below
                        </p>
                    </div>
                    <div className="w-10" />
                </div>

                {error && <ErrorMessage message={error} />}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tournament Name */}
                    <div>
                        <Input
                            type="text"
                            value={tournamentConfig.tournamentName}
                            onChange={(e) => handleConfigChange("tournamentName", e.target.value)}
                            placeholder="Enter Tournament Name"
                            className="w-full text-lg p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Courts and Games */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Number of Courts
                            </Label>
                            <Input
                                type="number"
                                value={tournamentConfig.numCourts}
                                onChange={(e) => handleConfigChange("numCourts", parseInt(e.target.value, 10))}
                                max={20}
                                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Games per Team
                            </Label>
                            <Input
                                type="number"
                                value={tournamentConfig.gamesPerTeam}
                                onChange={(e) => handleConfigChange("gamesPerTeam", parseInt(e.target.value, 10))}
                                max={20}
                                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                            />
                        </div>
                    </div>

                    {/* Start Date & Time */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                            <Label className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Start Date</Label>
                            <DatePicker
                                value={tournamentConfig.startDate}
                                onChange={(value) => handleConfigChange("startDate", value)}
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                            <Label className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Start Time</Label>
                            <Input
                                type="time"
                                value={tournamentConfig.startTime}
                                onChange={(e) => handleConfigChange("startTime", e.target.value)}
                                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                            />
                        </div>
                        <Button
                            type="button"
                            onClick={handleSetCurrentTime}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-2 rounded-md transition"
                        >
                            <FaClock size={16} />
                            Now
                        </Button>
                    </div>

                    {/* Match Duration & Break Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Match Duration (min)
                            </Label>
                            <Slider
                                value={[tournamentConfig.matchDuration]}
                                max={120}
                                step={5}
                                onValueChange={(newValue) => handleConfigChange("matchDuration", newValue[0])}
                            />
                            <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                                {tournamentConfig.matchDuration} minutes
                            </p>
                        </div>
                        <div>
                            <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Break Time (min)
                            </Label>
                            <Slider
                                value={[tournamentConfig.breakTime]}
                                max={60}
                                step={5}
                                onValueChange={(newValue) => handleConfigChange("breakTime", newValue[0])}
                            />
                            <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                                {tournamentConfig.breakTime} minutes
                            </p>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={tournamentConfig.useExistingPlayers}
                                onChange={(e) => handleConfigChange("useExistingPlayers", e.target.checked)}
                                className="dark:border-gray-600"
                            />
                            <Label className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                Use Existing Player List
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={tournamentConfig.tiered}
                                onChange={(e) => handleConfigChange("tiered", e.target.checked)}
                                className="dark:border-gray-600"
                            />
                            <Label className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                Divide into Tiers
                            </Label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 dark:bg-green-900 dark:hover:bg-green-700 text-white py-3 px-6 rounded-md text-lg transition"
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
