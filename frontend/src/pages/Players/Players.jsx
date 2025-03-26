import React, { useState, useEffect } from "react";
import axios from "axios";
import PlayerTable from "./PlayerTable"; // <-- Imported PlayerTable here
import PlayerStats from "./PlayerStats";
import PlayerListSettings from "./PlayerSettings";
import PlayerSearch from "./PlayerSearch.jsx";
import LoadingModal from "../Modals/LoadingModal.jsx";
import SlidingWindow from "../SlidingWindow";
import { convertLevel, calculateStats, filterPlayersBySearch } from "../utils/playerUtils.js";
import { PiArrowSquareLeftBold } from "react-icons/pi";
import { Separator } from "@/components/ui/separator";
import { RxHamburgerMenu } from "react-icons/rx";

import PlayerModalUpdated from "@/pages/Modals/playerModalUpdated.jsx";

const Players = () => {
    const [players, setPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedClub, setSelectedClub] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
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
        } catch (err) {
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

    const handleFileImport = async (importedPlayers) => {
        if (!importedPlayers || importedPlayers.length === 0) {
            setError("⚠️ No valid player data found in the imported file.");
            return;
        }
        setSuccessMessage(`✅ File imported successfully! ${importedPlayers.length} players added.`);
        setError(null);
        await fetchPlayers();
    };

    const stats = calculateStats(filteredPlayers);
    const clubs = [...new Set(players.map((player) => player.clubName))];
    const levels = [...new Set(players.map((player) => convertLevel(player.skillLevel)))];

    // Dummy onSubmit for modal – in a real app, this would call an API to update player data.
    const handlePlayerSubmit = (updatedPlayer) => {
        console.log("Updated player:", updatedPlayer);
        // Typically, you'd call a function here (e.g., savePlayerData) to update backend data.
    };

    return (
        <div className="relative">
            <div className="w-full pl-24 pr-8 py-4">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-400 rounded w-[98%]">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-400 rounded w-[98%]">
                        {successMessage}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6 w-full">
                    <div className="relative flex-1 min-w-0 pr-12">
                        {isLoading && (
                            <div
                                className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                                <LoadingModal message="Loading Player List" description="Please wait..."/>
                            </div>
                        )}
                        <PlayerSearch onSearchChange={setSearchQuery}/>
                        <div className="flex flex-col gap-6 mt-4">
                            {/* Table Section */}
                            <div>
                                <PlayerTable
                                    players={filteredPlayers}
                                    error={error}
                                    convertLevel={convertLevel}
                                    onEdit={(player) => {
                                        setSelectedPlayer(player);
                                        setIsModalOpen(true);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Button for Sliding Window */}
            <button
                onClick={() => setIsSlidingWindowOpen(true)}
                className="fixed right-2 top-8 transform -translate-y-1/2 hover:text-amber-200 text-white px-4 py-2 transition duration-200 ease-in-out z-50"
            >
                <RxHamburgerMenu className="text-3xl"/>
            </button>

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
                            <PlayerListSettings
                                isLoading={isLoading}
                                onFileSelect={handleFileImport}
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
