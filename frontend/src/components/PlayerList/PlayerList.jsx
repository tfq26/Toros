import { useState, useEffect } from "react";
import axios from "axios";
import PlayerTable from "./PlayerTable";
import PlayerStats from "./PlayerStats";
import PlayerListSettings from "./PlayerSettings";
import LoadingModal from "../LoadingModal";
import { convertLevel, calculateStats } from "../utils/playerUtils.js";

const PlayerList = () => {
    const [players, setPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedClub, setSelectedClub] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchPlayers();
    }, []);

    useEffect(() => {
        filterPlayers();
    }, [players, selectedClub, selectedLevel]);

    const fetchPlayers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/api/players/all", {
                headers: { "Content-Type": "application/json" },
            });
            console.log("Fetched players:", response.data); // <-- Log here
            setPlayers(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching players:", err);
            setError("Failed to load player data. Please try again later.");
            setPlayers([]);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ This function is passed to PlayerListSettings to handle imports
    const handleFileImport = async (importedPlayers) => {
        if (!importedPlayers || importedPlayers.length === 0) {
            setError("⚠️ No valid player data found in the imported file.");
            return;
        }

        setSuccessMessage(`✅ File imported successfully! ${importedPlayers.length} players added.`);
        setError(null);

        // ✅ Re-fetch updated player list from MongoDB
        await fetchPlayers();
    };

    const filterPlayers = () => {
        let filtered = [...players];

        if (selectedClub) {
            filtered = filtered.filter((player) => player.clubName === selectedClub);
        }

        if (selectedLevel) {
            filtered = filtered.filter((player) => convertLevel(player.placement) === selectedLevel);
        }

        setFilteredPlayers(filtered);
    };

    const stats = calculateStats(filteredPlayers);
    const clubs = [...new Set(players.map((player) => player.clubName))];
    const levels = [...new Set(players.map((player) => convertLevel(player.placement)))];

    return (
        <div className="bg-orange-100 h-screen">
            <div className="w-full px-6 py-6">
                {/* ✅ Display Success/Error Messages */}
                {error && <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-400 rounded">{error}</div>}
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-400 rounded">
                        {successMessage}
                    </div>
                )}

                {/* 📌 Layout: Settings (Left) - Table (Center) - Stats (Right) */}
                <div className="flex flex-col lg:flex-row gap-6 w-full">
                    {/* 📌 PlayerList Settings (Left Side) */}
                    <div>
                        <PlayerListSettings
                            isLoading={isLoading}
                            onFileSelect={handleFileImport} // ✅ Correctly passing function
                            onStatusUpdate={setSuccessMessage} // ✅ Ensure this is passed
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

                    {/* 📌 Player Table (Center) */}
                    <div className="relative flex-1 min-w-0">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                                <LoadingModal message="Loading Player List" description="Please wait..." />
                            </div>
                        )}
                        <PlayerTable players={filteredPlayers} error={error} convertLevel={convertLevel} />
                    </div>

                    {/* 📌 Player Stats (Right Side) */}
                    {filteredPlayers.length > 0 && !error && (
                        <div className="w-full lg:w-1/5">
                            <PlayerStats stats={stats} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayerList;
