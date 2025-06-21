import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KnockoutSetup = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [maxTeams, setMaxTeams] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/teams/standings");
                setTeams(response.data);
            } catch (error) {
                console.error("Error fetching teams:", error.message);
            }
        };
        fetchTeams();
    }, []);

    const handleTeamSelection = (team) => {
        if (selectedTeams.length < maxTeams) {
            setSelectedTeams((prev) => [...prev, team]);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8080/api/tournaments/knockout/setup",
                { selectedTeams }
            );
            if (response.status === 200) {
                navigate("/knockout/bracket");
            }
        } catch (error) {
            console.error("Error setting up knockout matches:", error.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Knockout Setup</h1>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                    Number of Teams to Qualify
                </label>
                <input
                    type="number"
                    value={maxTeams}
                    onChange={(e) => setMaxTeams(parseInt(e.target.value, 10))}
                    className="border rounded w-full py-2 px-3"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team) => (
                    <div
                        key={team.id}
                        className={`p-4 border rounded shadow hover:bg-gray-100 cursor-pointer ${
                            selectedTeams.includes(team) ? "bg-green-100" : ""
                        }`}
                        onClick={() => handleTeamSelection(team)}
                    >
                        <h2 className="font-bold">{team.name}</h2>
                        <p>Wins: {team.wins}</p>
                        <p>Losses: {team.losses}</p>
                        <p>Placement: {team.placement}</p>
                    </div>
                ))}
            </div>

            <div className="mt-4">
                <button
                    onClick={handleSubmit}
                    disabled={selectedTeams.length !== maxTeams}
                    className={`px-6 py-2 rounded ${
                        selectedTeams.length === maxTeams
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                >
                    Generate Knockout Bracket
                </button>
            </div>
        </div>
    );
};

export default KnockoutSetup;
