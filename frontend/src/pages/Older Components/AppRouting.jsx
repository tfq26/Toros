import { Routes, Route } from "react-router-dom";
import Home from "../Home.jsx";
import Players from "../Players/Players.jsx";
import TournamentList from "../Tournament/Lists/TournamentList.jsx"; // ✅ New Tournament Selection View
import TournamentSetup from "../Setup/TournamentSetup.jsx";
import { GalleryVerticalEnd } from "lucide-react"
import TournamentBracket from "../Standings/TeamStandings.jsx";
import LiveTournament from "../Tournament/LiveTournament.jsx";
import ErrorPage from "../Error.jsx";
import LoginPage from "../Auth/LoginUpdated.jsx";
import SignupPage from "../Auth/SignUp.jsx";
import MatchTest from "../Tournament/MatchTest.jsx";
import WindowView from "../Tournament/Viewer/WindowView.jsx";
import SignupUpdated from "@/pages/Auth/SignupUpdated.jsx"; // New viewer page

const AppRoutes = ({ setAuthToken, authToken, setTournamentSetupComplete, tournamentConfig, setTournamentConfig }) => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/players" element={<Players />} />
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
            {/* Viewer Route */}
            <Route path="/viewer" element={<WindowView />} />
            {/* Authentication Routes */}
            <Route
                path="/auth/login"
                element={
                    // <LoginPage
                    //     onLogin={(token) => {
                    //         setAuthToken(token);
                    //         localStorage.setItem("authToken", token);
                    //     }}
                    // />
                    <LoginPage/>
                }
            />
            <Route path="/auth/signup" element={<SignupUpdated/>}/>
            {/* Error Handling */}
            <Route path="*" element={<ErrorPage statusCode={404}/>}/>
        </Routes>
    );
};

export default AppRoutes;
