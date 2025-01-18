import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import PlayerList from "./components/PlayerList.jsx";
import TournamentSetup from "./components/TournamentSetup.jsx";
import TournamentBracket from "./components/TournamentBracket.jsx";
import LiveTournament from "./components/LiveTournament.jsx";
import ErrorPage from "./components/Error.jsx";
import './index.css'; // Ensure this matches the actual file structure

const App = () => {
    const [tournamentSetupComplete, setTournamentSetupComplete] = useState(false);

    return (
        <Router>
            <div className="flex flex-col h-screen">
                {/* Pass tournamentSetupComplete to Navbar */}
                <Navbar tournamentSetupComplete={tournamentSetupComplete} />

                {/* Main Content */}
                <div className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/players" element={<PlayerList />} />
                        <Route
                            path="/tournament/setup"
                            element={
                                <TournamentSetup
                                    onSetupComplete={() => setTournamentSetupComplete(true)}
                                />
                            }
                        />
                        <Route path="/bracket" element={<TournamentBracket />} />
                        {/* Removed the check for tournamentSetupComplete */}
                        <Route
                            path="/tournament/live"
                            element={
                                <LiveTournament setTournamentSetupComplete={setTournamentSetupComplete} />
                            }
                        />
                        <Route path="*" element={<ErrorPage statusCode={404} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
