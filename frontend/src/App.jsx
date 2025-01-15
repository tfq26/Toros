import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import PlayerList from "./components/PlayerList.jsx";
import TournamentBracket from "./components/TournamentBracket.jsx";
import ErrorPage from "./components/Error.jsx";

const Dashboard = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8080/api/players/all")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const groupedTeams = data.reduce((acc, player) => {
                    if (!acc[player.teamNumber]) {
                        acc[player.teamNumber] = {
                            teamNumber: player.teamNumber,
                            clubName: player.clubName,
                            players: []
                        };
                    }
                    acc[player.teamNumber].players.push(player);
                    return acc;
                }, {});

                setPlayers(Object.values(groupedTeams));
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching players:", error);
                setError("Failed to load players. Please try again.");
                setLoading(false);
                navigate("/error", {
                    state: { statusCode: 500, message: error.message || "An unexpected error occurred." },
                });
            });
    }, [navigate]);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/players" element={<PlayerList />} />
            <Route
                path="/bracket"
                element={
                    loading ? (
                        <div className="text-center py-10">
                            <p className="text-blue-500">Loading teams...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <TournamentBracket teams={players.map(team => ({
                            name: `Team ${team.teamNumber} (${team.clubName})`,
                            players: team.players.map((p) => `${p.name} - ${p.getSkillLevel ? p.getSkillLevel() : 'Unknown'}`)
                        }))} />
                    )
                }
            />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage statusCode={404} message="Page not found!" />} />
        </Routes>
    );
};

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Dashboard />
            </div>
        </Router>
    );
}

export default App;
