import { useState, useEffect } from "react";
import axios from "axios";
import PlayerTable from "./PlayerTable";
import PlayerStats from "./PlayerStats";
import PlayerListSettings from "./PlayerSettings";
import PlayerSearch from "./PlayerSearch.jsx";
import LoadingModal from "../LoadingModal";
import PlayerModal from "./PlayerModal";
import SlidingWindow from "../SlidingWindow";
import { convertLevel, calculateStats, filterPlayersBySearch } from "../utils/playerUtils.js";

const PlayerList = () => {
    const [players, setPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedClub, setSelectedClub] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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
            filtered = filtered.filter((player) => convertLevel(player.placement) === selectedLevel);
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
    const levels = [...new Set(players.map((player) => convertLevel(player.placement)))];

    return (
        <div className="relative">
            <div className="w-full px-6 py-6">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-400 rounded">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-400 rounded">
                        {successMessage}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6 w-full">
                    <div className="relative flex-1 min-w-0 pr-16"> {/* Added `pr-16` to shrink the table width */}
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                                <LoadingModal message="Loading Player List" description="Please wait..." />
                            </div>
                        )}

                        <PlayerSearch onSearchChange={setSearchQuery} />
                        <div className="min-w-full lg:w-[85%] h-fit bg-white dark:bg-gray-500 p-4 rounded-lg shadow-md border-gray-500">
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

            {/* Floating Button for Sliding Window (Ensures it stays above everything) */}
            <button
                onClick={() => setIsSlidingWindowOpen(true)}
                className="fixed right-4 top-1/2 transform -translate-y-1/2 text-center bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition z-50"
            >
                ←
            </button>

            {/* Player Modal */}
            {isModalOpen && (
                <PlayerModal
                    player={selectedPlayer}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedPlayer(null);
                    }}
                    refreshPlayers={fetchPlayers}
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

export default PlayerList;
