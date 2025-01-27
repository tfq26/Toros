import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import PlayerList from "./components/PlayerList/PlayerList.jsx";
import TournamentSetup from "./components/Setup/TournamentSetup.jsx";
import TournamentBracket from "./components/Standings/TeamStandings.jsx";
import LiveTournament from "./components/Live/LiveTournament.jsx";
import ErrorPage from "./components/Error.jsx";
import LoginPage from "./components/Login/Login.jsx"; // Import the Login page
import './index.css'; // Ensure this matches the actual file structure

const App = () => {
    const [tournamentSetupComplete, setTournamentSetupComplete] = useState(false);
    const [tournamentConfig, setTournamentConfig] = useState(null); // State to store tournament configuration
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken")); // Manage authentication state

    return (
        <Router>
            <div className="flex flex-col h-screen">
                {/* Pass props to Navbar */}
                <Navbar
                    tournamentSetupComplete={tournamentSetupComplete}
                    user={authToken ? { name: "John Doe" } : null} // Replace with actual user data
                    onLogout={() => {
                        setAuthToken(null); // Clear the auth token
                        localStorage.removeItem("authToken"); // Clear the token from localStorage
                    }}
                />

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
                                    setTournamentConfig={setTournamentConfig} // Pass setter for tournamentConfig
                                />
                            }
                        />
                        <Route path="/bracket" element={<TournamentBracket />} />
                        <Route
                            path="/tournament/live"
                            element={
                                <LiveTournament
                                    setTournamentSetupComplete={setTournamentSetupComplete}
                                    tournamentConfig={tournamentConfig} // Pass tournamentConfig to LiveTournament
                                />
                            }
                        />
                        {/* Authentication Routes */}
                        <Route
                            path="/auth"
                            element={
                                <LoginPage
                                    onLogin={(token) => {
                                        setAuthToken(token); // Set the auth token
                                        localStorage.setItem("authToken", token); // Persist the token in localStorage
                                    }}
                                />
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
