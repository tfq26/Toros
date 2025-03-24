import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import AppRoutes from "./pages/AppRouting.jsx";
import DevTools from "./pages/DevTools/DevTools.jsx";
import "./index.css";

const App = () => {
    const [tournamentSetupComplete, setTournamentSetupComplete] = useState(
        JSON.parse(localStorage.getItem("tournamentSetupComplete")) || false
    );
    const [tournamentConfig, setTournamentConfig] = useState(null);
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

    useEffect(() => {
        localStorage.setItem("tournamentSetupComplete", JSON.stringify(tournamentSetupComplete));
    }, [tournamentSetupComplete]);

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
            <div className="flex h-screen dark:bg-gray-800">
                <Layout>
                    <AppRoutes
                        setAuthToken={setAuthToken}
                        authToken={authToken}
                        setTournamentSetupComplete={setTournamentSetupComplete}
                        tournamentConfig={tournamentConfig}
                        setTournamentConfig={setTournamentConfig}
                    />
                </Layout>
                <div className="fixed bottom-4 right-4">
                    <DevTools />
                </div>
            </div>
        </Router>
    );
};

export default App;
