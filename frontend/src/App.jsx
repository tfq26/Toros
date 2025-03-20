import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./pages/Navbar.jsx";
import AppRoutes from "./pages/AppRouting.jsx";
import DevTools from "./pages/DevTools/DevTools.jsx"; // ✅ DevTools integration
import "./index.css";

const App = () => {
    const [tournamentSetupComplete, setTournamentSetupComplete] = useState(
        JSON.parse(localStorage.getItem("tournamentSetupComplete")) || false
    );
    const [tournamentConfig, setTournamentConfig] = useState(null);
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);

    /** ✅ Sync state with localStorage */
    useEffect(() => {
        localStorage.setItem("tournamentSetupComplete", JSON.stringify(tournamentSetupComplete));
    }, [tournamentSetupComplete]);

    /** ✅ Detect system dark mode */
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => setIsDarkMode(mediaQuery.matches);

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    /** ✅ Fetch Active Tournaments */
    useEffect(() => {
        const fetchTournamentStatus = async () => {
            try {
                const response = await fetch("/api/tournament/activeTournament", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                const data = await response.json();

                if (response.ok && data.length > 0) {
                    console.log("✅ Active tournaments found:", data);
                    setTournamentSetupComplete(true);
                } else {
                    console.log("⚠️ No active tournaments.");
                    setTournamentSetupComplete(false);
                }
            } catch (error) {
                console.error("❌ Error fetching active tournaments:", error);
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
                <div className="flex-1 pl-20 overflow-y-auto min-h-screen bg-orange-50 dark:bg-gray-800 dark:text-gray-200">
                    <AppRoutes
                        setAuthToken={setAuthToken}
                        authToken={authToken}
                        setTournamentSetupComplete={setTournamentSetupComplete}
                        tournamentConfig={tournamentConfig}
                        setTournamentConfig={setTournamentConfig}
                    />
                </div>

                {/* ✅ Development Tools (Floating Window) */}
                <div className="fixed bottom-4 right-4">
                    <DevTools />
                </div>
            </div>
        </Router>
    );
};

export default App;
