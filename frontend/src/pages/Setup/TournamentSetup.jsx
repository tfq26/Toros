import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import CheckboxField from "./CheckboxField";
import SliderField from "./SliderField";
import {Input} from "../../components/ui/input.jsx"
import {Button} from "../../components/ui/button.jsx"
import {Checkbox} from "../../components/ui/checkbox.jsx"
import {Slider} from "../../components/ui/slider.jsx"
import {Toaster} from "../../components/ui/sonner.jsx"
import { FaClock } from "react-icons/fa";
import ErrorMessage from "../Error";
import SlidingWindow from "../SlidingWindow";
import axios from "axios";
import PlayerStats from "../Players/PlayerStats.jsx";
import { PiArrowSquareLeftBold } from "react-icons/pi";
import { convertLevel, calculateStats } from "../utils/playerUtils.js";
import { toast, ToastContainer } from "react-toastify"; // ✅ Fixed Toast import
import "react-toastify/dist/ReactToastify.css";
import {Label} from "@/components/ui/label.jsx";

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

                const registeredPlayers = allPlayers.filter(player => player.isRegistered);
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
            toast.error("⚠️ Tournament name is required!"); // 🔔 Show error toast
            return;
        }

        try {
            toast.info("⏳ Creating Tournament...");

            const response = await axios.post("http://localhost:8080/api/tournament/setup", tournamentConfig);

            toast.success("✅ Tournament created successfully!");
            console.log("✅ Tournament setup successful:", response.data);

            onSetupComplete();
            navigate("/tournament/list");
        } catch (err) {
            console.error("❌ Error setting up tournament:", err);
            setError(err.response?.data?.message || "Failed to set up tournament.");

            toast.error("❌ Failed to create tournament.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="w-full max-w-3xl bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                        🎾 Tournament Setup
                    </h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-700 dark:text-white hover:text-gray-500 transition"
                    >
                        <PiArrowSquareLeftBold size={24} />
                        Back
                    </button>
                </div>

                {/* Tournament Name */}
                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700 dark:text-white">
                        Tournament Name
                    </label>
                    <input
                        type="text"
                        value={tournamentConfig.tournamentName}
                        onChange={(e) => handleConfigChange("tournamentName", e.target.value)}
                        placeholder="Enter Tournament Name"
                        className="w-full text-3xl font-bold text-center text-gray-800 dark:text-gray-900 mb-6 p-2 border border-gray-300 rounded-lg dark:bg-gray-300 bg-gray-100"
                    />
                </div>

                {/* Error Message */}
                {error && <ErrorMessage message={error} />}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-7">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-xl">Number of Courts</Label>
                            <Label className="text-xl mt-4">Number of Games per Team</Label>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Input type="number" defaultValue={[0]} max={20}/>
                            <Input type="number" defaultValue={[0]} max={20}/>
                        </div>
                    </div>


                    <div className="flex items-start gap-4">
                        {/* Start Time Selection */}
                        <div className="flex items-center gap-4">
                            <Label className="text-xl">Start Time</Label>
                            <Input
                                type="time"
                                value={tournamentConfig.startTime}
                                onChange={(e) => handleConfigChange("startTime", e.target.value)}
                                className="w-fit"
                            />
                            <Button
                                type="button"
                                className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
                                onClick={handleSetCurrentTime}
                            >
                                <FaClock/>
                            </Button>
                        </div>

                        {/* Checkboxes */}
                        <div className="ml-auto flex flex-col gap-4 mr-[15%]">
                            <div className="flex items-center gap-2">
                                <Checkbox/>
                                <Label className="text-md font-medium">Use Existing Player List</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox/>
                                <Label className="text-md font-medium">Divide Tournament into Tiers</Label>
                            </div>
                        </div>
                    </div>

                    {/* Sliders */}
                    <Label className="text-lg font-medium">Game Duration</Label>
                    <Slider defaultValue={[33]} max={100} step={1}/>
                    <Label className="text-lg font-medium">Break Time</Label>
                    <Slider defaultValue={[33]} max={100} step={1}/>


                    {/* Submit Button */}
                    <Button type="submit"
                            className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition text-xl font-semibold">
                        Start Tournament 🚀
                    </Button>
                </form>
            </div>

            {/* ✅ Sliding Window for Player List & Stats */}
            <SlidingWindow
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                sections={[
                    {
                        id: "players",
                        label: "Registered Players",
                        content: (
                            <div className="p-4">
                                <h3 className="text-xl font-bold mb-3">📋 Registered Players</h3>
                                {players.length > 0 ? (
                                    <ul className="space-y-2">
                                        {players.map((player) => (
                                            <li key={player.id} className="border-b pb-2">
                                                {player.name} - {convertLevel(player.SkillLevel) ?? "Unranked"}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600">No registered players found.</p>
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
