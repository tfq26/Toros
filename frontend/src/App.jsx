import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AppRoutes from "./components/AppRouting.jsx";
import "./index.css";

const App = () => {
    const [tournamentSetupComplete, setTournamentSetupComplete] = useState(
        JSON.parse(localStorage.getItem("tournamentSetupComplete")) || false
    );
    const [tournamentConfig, setTournamentConfig] = useState(null);
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);

    // ✅ Sync state with localStorage when it changes
    useEffect(() => {
        localStorage.setItem("tournamentSetupComplete", JSON.stringify(tournamentSetupComplete));
    }, [tournamentSetupComplete]);

    // ✅ Detect system dark mode and update when it changes
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = () => setIsDarkMode(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    // ✅ Fetch active tournament from the backend on mount
    useEffect(() => {
        const fetchTournamentStatus = async () => {
            try {
                const response = await fetch("/api/tournament/active", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                const data = await response.json();

                if (response.ok && data.active) {
                    console.log("Active tournament found:", data);
                    setTournamentSetupComplete(true);
                    setTournamentConfig(data);
                } else {
                    console.log("No active tournament.");
                    setTournamentSetupComplete(false);
                }
            } catch (error) {
                console.error("Error fetching active tournament:", error);
            }
        };

        if (authToken) fetchTournamentStatus();
    }, [authToken]);

    return (
        <Router>
            <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
                {/* Sidebar Navbar */}
                <Navbar
                    tournamentSetupComplete={tournamentSetupComplete}
                    user={authToken ? { name: "John Doe" } : null}
                    onLogout={() => {
                        setAuthToken(null);
                        localStorage.removeItem("authToken");
                        localStorage.removeItem("tournamentSetupComplete");
                        setTournamentSetupComplete(false);
                    }}
                />

                {/* Main Content */}
                <div className="flex-1 pl-20 overflow-y-auto min-h-screen bg-yellow-100 dark:bg-gray-800 dark:text-gray-200">
                    <AppRoutes
                        setAuthToken={setAuthToken}
                        authToken={authToken}
                        setTournamentSetupComplete={setTournamentSetupComplete}
                        tournamentConfig={tournamentConfig}
                        setTournamentConfig={setTournamentConfig}
                    />
                </div>
            </div>
        </Router>
    );
};

export default App;
