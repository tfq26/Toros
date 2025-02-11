import React, { useState, useEffect } from "react";
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

    const handleFileUpload = async (file) => {
        if (!file) return;

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            await axios.post("http://localhost:8080/api/players/import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSuccessMessage(`File "${file.name}" imported successfully!`);
            setError(null);
            fetchPlayers(); // Refresh player list
        } catch (err) {
            console.error("Error uploading file:", err);
            setSuccessMessage(null);
            setError(`Failed to import file: ${file.name}. Please try again.`);
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

        setFilteredPlayers(filtered);
    };

    const stats = calculateStats(filteredPlayers);

    const clubs = [...new Set(players.map((player) => player.clubName))];
    const levels = [...new Set(players.map((player) => convertLevel(player.placement)))];

    return (
        <div className="bg-orange-50 h-screen">
            <div className="w-full px-6 py-6"> {/* ✅ Ensures full width */}
                {/* ✅ Display Success/Error Messages */}
                {error && <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-400 rounded">{error}</div>}

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-400 rounded">
                        {successMessage}
                    </div>
                )}

                {/* 📌 Layout: Settings (Left) - Table (Center) - Stats (Right) */}
                <div className="flex flex-col lg:flex-row gap-6 w-full"> {/* ✅ Ensures child components take full width */}
                    {/* 📌 PlayerList Settings (Left Side) */}
                    <div className="w-full lg:w-2/12">
                        <PlayerListSettings
                            isLoading={isLoading}
                            onFileSelect={handleFileUpload}
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
                    <div className="relative flex-1 min-w-0"> {/* ✅ Ensures the table takes available space */}
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
