import { useState, useEffect } from "react";
import axios from "axios";
import PlayerTable from "./PlayerTable";
import PlayerStats from "./PlayerStats";
import PlayerListSettings from "./PlayerSettings";
import LoadingModal from "../LoadingModal";
import { convertLevel, calculateStats, filterPlayersBySearch } from "../utils/playerUtils.js"; // Import the filter function
import PlayerSearch from "./PlayerSearch.jsx"; // Import the SearchPlayer component

const PlayerList = () => {
    const [players, setPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedClub, setSelectedClub] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // Track the search query

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
            filtered = filterPlayersBySearch(filtered, searchQuery); // Apply search filter
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
        <div>
            <div className="w-full px-6 py-6">
                {error && <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-400 rounded">{error}</div>}
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-400 rounded">
                        {successMessage}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6 w-full">
                    <div className="w-2/12 lg:w-fit h-fit bg-white p-4 rounded-lg shadow-md">
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
                        />
                    </div>

                    <div className="relative flex-1 min-w-0">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                                <LoadingModal message="Loading Player List" description="Please wait..." />
                            </div>
                        )}

                        {/* Add SearchPlayer Component */}
                        <PlayerSearch onSearchChange={setSearchQuery} />
                        <div className="min-w-full lg:w-full h-fit bg-white p-4 rounded-lg shadow-md">
                            <PlayerTable players={filteredPlayers} error={error} convertLevel={convertLevel} />
                        </div>
                    </div>

                    {filteredPlayers.length > 0 && !error && (
                        <div className="min-w-fit lg:w-fit h-fit bg-white p-4 rounded-lg shadow-md">
                            <PlayerStats stats={stats} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayerList;
