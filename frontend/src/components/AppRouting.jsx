import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import PlayerList from "./PlayerList/PlayerList.jsx";
import TournamentSetup from "./Setup/TournamentSetup.jsx";
import TournamentBracket from "./Standings/TeamStandings.jsx";
import LiveTournament from "./Live/LiveTournament.jsx";
import ErrorPage from "./Error.jsx";
import LoginPage from "./Auth/Login.jsx";
import SignupPage from "./Auth/Signup.jsx";
import MatchTest from "./Live/MatchTest.jsx"; // ✅ Import Signup component

const AppRoutes = ({ setAuthToken, authToken, setTournamentSetupComplete, tournamentConfig, setTournamentConfig }) => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/players" element={<PlayerList />} />
            <Route
                path="/tournament/setup"
                element={
                    <TournamentSetup
                        onSetupComplete={() => setTournamentSetupComplete(true)}
                        setTournamentConfig={setTournamentConfig}
                    />
                }
            />
            <Route path="/bracket" element={<TournamentBracket />} />
            <Route path="/test-matches" element={<MatchTest />} />
            <Route
                path="/tournament/live"
                element={
                    <LiveTournament
                        setTournamentSetupComplete={setTournamentSetupComplete}
                        tournamentConfig={tournamentConfig}
                    />
                }
            />
            {/* Authentication Routes */}
            <Route
                path="/auth/login"
                element={
                    <LoginPage
                        onLogin={(token) => {
                            setAuthToken(token);
                            localStorage.setItem("authToken", token);
                        }}
                    />
                }
            />
            <Route path="/auth/signup" element={<SignupPage />} /> {/* ✅ Add signup route */}
            <Route path="*" element={<ErrorPage statusCode={404} />} />
        </Routes>
    );
};

export default AppRoutes;
