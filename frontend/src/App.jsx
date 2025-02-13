import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AppRoutes from "./components/AppRouting.jsx"; // Import the new routing component
import './index.css';

const App = () => {
    const [tournamentSetupComplete, setTournamentSetupComplete] = useState(false);
    const [tournamentConfig, setTournamentConfig] = useState(null);
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

    return (
        <Router>
            <div className="flex h-screen">
                {/* Sidebar Navbar */}
                <Navbar
                    tournamentSetupComplete={tournamentSetupComplete}
                    user={authToken ? { name: "John Doe" } : null}
                    onLogout={() => {
                        setAuthToken(null);
                        localStorage.removeItem("authToken");
                    }}
                />

                {/* Main Content */}
                <div className="flex-1 pl-20 overflow-y-auto min-h-screen bg-orange-100">
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
