import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import PlayerList from "./Players/PlayerList.jsx";
import TournamentList from "./Tournament/TournamentList.jsx"; // ✅ New Tournament Selection View
import TournamentSetup from "./Setup/TournamentSetup.jsx";
import TournamentBracket from "./Standings/TeamStandings.jsx";
import LiveTournament from "./Tournament/LiveTournament.jsx";
import ErrorPage from "./Error.jsx";
import LoginPage from "./Auth/Login.jsx";
import SignupPage from "./Auth/Signup.jsx";
import MatchTest from "./Tournament/MatchTest.jsx";

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

            {/* ✅ Tournament Selection Step */}
            <Route path="/tournament/list" element={<TournamentList />} />
            <Route
                path="/tournament/live/:tournamentId"
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
            <Route path="/auth/signup" element={<SignupPage />} />

            {/* Error Handling */}
            <Route path="*" element={<ErrorPage statusCode={404} />} />
        </Routes>
    );
};

export default AppRoutes;
