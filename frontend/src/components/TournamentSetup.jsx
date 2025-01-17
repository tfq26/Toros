import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TournamentSetup = ({ onSetupComplete }) => {
    const [numCourts, setNumCourts] = useState("");
    const [gamesPerTeam, setGamesPerTeam] = useState("");
    const [useExistingPlayers, setUseExistingPlayers] = useState(false);
    const [tiered, setTiered] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!numCourts || !gamesPerTeam) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/tournament/setup", {
                numCourts: parseInt(numCourts, 10),
                gamesPerTeam: parseInt(gamesPerTeam, 10),
                useExistingPlayers,
                tiered,
            });

            if (response.status === 200) {
                alert("Tournament setup complete!");
                onSetupComplete(); // Notify parent component
                navigate("/tournament/live");
            }
        } catch (err) {
            console.error("Error setting up tournament:", err);
            setError("Failed to set up tournament. Please try again.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">Tournament Setup</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Number of Courts</label>
                    <input
                        type="number"
                        value={numCourts}
                        onChange={(e) => setNumCourts(e.target.value)}
                        className="border rounded w-full py-2 px-3"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Games Per Team</label>
                    <input
                        type="number"
                        value={gamesPerTeam}
                        onChange={(e) => setGamesPerTeam(e.target.value)}
                        className="border rounded w-full py-2 px-3"
                    />
                </div>
                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={useExistingPlayers}
                            onChange={(e) => setUseExistingPlayers(e.target.checked)}
                            className="mr-2"
                        />
                        Use Existing Player List
                    </label>
                </div>
                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={tiered}
                            onChange={(e) => setTiered(e.target.checked)}
                            className="mr-2"
                        />
                        Divide Tournament into Tiers
                    </label>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Start Tournament
                </button>
            </form>
        </div>
    );
};

export default TournamentSetup;
