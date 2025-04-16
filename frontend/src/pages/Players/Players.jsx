import  { useState, useEffect, useMemo } from "react";
import axios from "axios";
import PlayerTable from "./Tables/PlayerTable.jsx";
import TeamTable from "./Tables/TeamTable.jsx"; // <-- Import TeamTable component
import PlayerStats from "./PlayerStats";
import PlayerSettings from "./PlayerSettings.jsx";
import PlayerSearch from "./PlayerSearch.jsx";
import LoadingModal from "../Modals/LoadingModal.jsx";
import SlidingWindow from "@/components/Navbar/SlidingWindow.jsx";
import { convertLevel, calculateStats, filterPlayersBySearch } from "@/utils/functions/playerUtils.js";
import PlayerModalUpdated from "@/pages/Modals/PlayerModalUpdated.jsx";
import { Switch } from "@/components/ui/switch"; // Import your UI Switch component

const Players = () => {
    const [players, setPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedClub, setSelectedClub] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [error, setError] = useState(null);
    const [setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // New state to toggle between Players view and Teams view.
    const [isTeamView, setIsTeamView] = useState(false);

    const triggerRefresh = async () => {
        await fetchPlayers();
    };

    // States for modal & sliding window
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSlidingWindowOpen, setIsSlidingWindowOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    useEffect(() => {
        fetchPlayers();
    }, []);

    useEffect(() => {
        filterPlayers();
    }, [players, selectedClub, selectedLevel, searchQuery]);

    const fetchPlayers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/api/players/all", {
                headers: { "Content-Type": "application/json" },
            });
            setPlayers(response.data);
            setError(null);
        } catch {
            setError("Failed to load player data. Please try again later.");
            setPlayers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const filterPlayers = () => {
        let filtered = [...players];
        if (selectedClub) {
            filtered = filtered.filter((player) => player.clubName === selectedClub);
        }
        if (selectedLevel) {
            filtered = filtered.filter((player) => convertLevel(player.skillLevel) === selectedLevel);
        }
        if (searchQuery) {
            filtered = filterPlayersBySearch(filtered, searchQuery);
        }
        setFilteredPlayers(filtered);
    };

    // Group players into teams for the "Teams" view.
    // Here we group by player.team.id if available; otherwise, we group by clubName.
    const teams = useMemo(() => {
        const teamsMap = {};
        filteredPlayers.forEach((player) => {
            // Use player.team if it exists; otherwise, use clubName.
            const key = player.team ? player.team.id : player.clubName || "default";
            if (!teamsMap[key]) {
                teamsMap[key] = {
                    id: key,
                    name: player.team ? player.team.name : player.clubName || "Unknown Team",
                    placement: player.team ? player.team.placement : null,
                    players: [],
                };
            }
            teamsMap[key].players.push(player);
        });
        return Object.values(teamsMap);
    }, [filteredPlayers]);

    const stats = calculateStats(filteredPlayers);
    const clubs = [...new Set(players.map((player) => player.clubName))];
    const levels = [...new Set(players.map((player) => convertLevel(player.skillLevel)))];

    return (
        <div className="relative">
            <div className="w-full pl-20 pr-6 py-4">
                <div className="flex flex-col lg:flex-row gap-6 w-full">
                    <div className="relative flex-1 min-w-0 pr-12">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                                <LoadingModal message="Loading Player List" description="Please wait..." />
                            </div>
                        )}
                        <div className="flex items-center w-full justify-between">
                            <PlayerSearch onSearchChange={setSearchQuery} />
                            {/* Options Button (if needed) */}
                            {/* <button
                                onClick={() => setIsSlidingWindowOpen(true)}
                                className="ml-4 dark:hover:text-amber-200 dark:text-gray-100 hover:text-orange-700 text-gray-500 px-4 py-2 transition duration-200 ease-in-out z-50"
                            >
                                <IoOptionsSharp className="text-3xl" />
                            </button> */}
                        </div>

                        {/* New Switch to toggle between Players and Teams view */}
                        <div className="flex items-center pb-5 border-b-4 mb-6 gap-2">
                            <span className="text-sm">Players</span>
                            <Switch
                                checked={isTeamView}
                                onCheckedChange={(checked) => setIsTeamView(checked)}
                            />
                            <span className="text-sm">Teams</span>
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Conditionally render either the PlayerTable or the TeamTable */}
                            {isTeamView ? (
                                <TeamTable
                                    teams={teams}
                                    error={error}
                                    onEdit={(team) => {
                                        // You can handle team edits here, e.g., open a modal with team details.
                                        console.log("Team selected:", team);
                                    }}
                                />
                            ) : (
                                <PlayerTable
                                    players={filteredPlayers}
                                    error={error}
                                    onEdit={(player) => {
                                        setSelectedPlayer(player);
                                        setIsModalOpen(true);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Player Modal */}
            {isModalOpen && (
                <PlayerModalUpdated
                    isModalOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedPlayer(null);
                    }}
                    selectedPlayer={selectedPlayer}
                    refreshPlayers={fetchPlayers}
                    triggerRefresh={triggerRefresh}
                />
            )}

            {/* Sliding Window for Player Stats & Settings */}
            <SlidingWindow
                isOpen={isSlidingWindowOpen}
                onClose={() => setIsSlidingWindowOpen(false)}
                sections={[
                    {
                        id: "settings",
                        label: "Settings",
                        content: (
                            <PlayerSettings
                                isLoading={isLoading}
                                onFileSelect={(importedPlayers) => {
                                    if (!importedPlayers || importedPlayers.length === 0) {
                                        setError("⚠️ No valid player data found in the imported file.");
                                        return;
                                    }
                                    setSuccessMessage(`✅ File imported successfully! ${importedPlayers.length} players added.`);
                                    setError(null);
                                    fetchPlayers();
                                }}
                                onStatusUpdate={setSuccessMessage}
                                clubs={clubs}
                                levels={levels}
                                selectedClub={selectedClub}
                                selectedLevel={selectedLevel}
                                onFilterChange={(type, value) => {
                                    if (type === "club") setSelectedClub(value);
                                    if (type === "level") setSelectedLevel(value);
                                }}
                                onAddPlayer={() => {
                                    setSelectedPlayer(null);
                                    setIsModalOpen(true);
                                }}
                            />
                        ),
                    },
                    {
                        id: "stats",
                        label: "Stats",
                        content: <PlayerStats stats={stats} />,
                    },
                ]}
            />
        </div>
    );
};

export default Players;
