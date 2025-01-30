import React, { useState, useEffect } from "react";
import axios from "axios";
import PlayerTable from "./PlayerTable";
import PlayerStats from "./PlayerStats";
import FileUploader from "./FileUploader";
import LoadingModal from "../LoadingModal"; // Import the LoadingModal component
import { convertLevel, calculateStats } from "../utils/playerUtils.js";

const PlayerList = () => {
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Controls loading modal

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        setIsLoading(true); // Show the loading modal
        try {
            const response = await axios.get("http://localhost:8080/api/players/all");
            setPlayers(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching players:", err);
            setError("Failed to load player data. Please try again later.");
            setPlayers([]); // Ensure players list is empty if there's an error
        } finally {
            setIsLoading(false); // Hide the loading modal
        }
    };

    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        setIsLoading(true); // Show the loading modal
        try {
            const response = await axios.post("http://localhost:8080/api/players/import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSuccessMessage(`Players imported successfully from file: ${file.name}`);
            setError(null);
            fetchPlayers();
        } catch (err) {
            console.error("Error uploading file:", err);
            setError(`Failed to import players from file: ${file.name}. Please try again later.`);
            setSuccessMessage(null);
        } finally {
            setIsLoading(false); // Hide the loading modal
        }
    };

    const stats = calculateStats(players);

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Show loading modal when loading */}
            {isLoading && (
                <LoadingModal
                    message="Loading Player List"
                    description="Please wait while we fetch the player data."
                />
            )}

            <FileUploader isLoading={isLoading} onFileUpload={handleFileUpload} />

            {/* Show message if there was an error */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <div className="flex gap-4">
                <PlayerTable players={players} error={error} convertLevel={convertLevel} />

                {/* Show PlayerStats only if players are successfully loaded */}
                {players.length > 0 && !error && <PlayerStats stats={stats} />}
            </div>
        </div>
    );
};

export default PlayerList;
