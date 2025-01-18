import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TournamentSetup = ({ onSetupComplete }) => {
    const [teams, setTeams] = useState([]);
    const [numCourts, setNumCourts] = useState("");
    const [gamesPerTeam, setGamesPerTeam] = useState("");
    const [useExistingPlayers, setUseExistingPlayers] = useState(false);
    const [tiered, setTiered] = useState(false);
    const [startTime, setStartTime] = useState("");
    const [matchDuration, setMatchDuration] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlayersAndGenerateTeams = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/players/all");
                if (Array.isArray(response.data)) {
                    // Group players by teamNumber
                    const groupedPlayers = response.data.reduce((acc, player) => {
                        if (player.teamNumber !== null) {
                            if (!acc[player.teamNumber]) {
                                acc[player.teamNumber] = [];
                            }
                            acc[player.teamNumber].push(player);
                        }
                        return acc;
                    }, {});

                    // Filter valid teams (only pairs of two players)
                    const validTeams = Object.values(groupedPlayers).filter(
                        (team) => team.length === 2
                    );
                    setTeams(validTeams);
                } else {
                    console.error("Unexpected response format:", response.data);
                    setTeams([]);
                }
            } catch (err) {
                console.error("Error fetching players:", err.message || err);
                setError("Failed to fetch players. Please try again.");
            }
        };

        fetchPlayersAndGenerateTeams();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!numCourts || !gamesPerTeam || !startTime || !matchDuration) {
            setError("Please fill in all fields.");
            return;
        }

        if (teams.length === 0) {
            setError("No valid teams available. Please ensure players are correctly paired.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/tournament/setup", {
                numCourts: parseInt(numCourts, 10),
                gamesPerTeam: parseInt(gamesPerTeam, 10),
                startTime,
                matchDuration: parseInt(matchDuration, 10),
                useExistingPlayers,
                tiered,
            });

            if (response.status === 200) {
                alert("Tournament setup complete!");
                onSetupComplete();
                navigate("/tournament/live");
            }
        } catch (err) {
            console.error("Error setting up tournament:", err.response?.data || err.message);
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
                        placeholder="Enter number of courts"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Games Per Team</label>
                    <input
                        type="number"
                        value={gamesPerTeam}
                        onChange={(e) => setGamesPerTeam(e.target.value)}
                        className="border rounded w-full py-2 px-3"
                        placeholder="Enter games per team"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Start Time</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="border rounded w-full py-2 px-3"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Match Duration (minutes)</label>
                    <input
                        type="number"
                        value={matchDuration}
                        onChange={(e) => setMatchDuration(e.target.value)}
                        className="border rounded w-full py-2 px-3"
                        placeholder="Enter match duration"
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

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Available Teams</h3>
                {teams.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {teams.map((team, index) => (
                            <li key={index}>
                                <strong>
                                    {team[0].name} & {team[1].name}
                                </strong>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No valid teams available. Ensure players are correctly paired in the database.</p>
                )}
            </div>
        </div>
    );
};

export default TournamentSetup;
