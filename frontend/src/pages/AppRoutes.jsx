import React from "react";
import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar.jsx";
import Home from "./Home.jsx";
import Players from "./Players/Players.jsx";
import TournamentList from "./Tournament/TournamentList.jsx";
import TournamentSetup from "./Setup/TournamentSetup.jsx";
import TournamentBracket from "./Standings/TeamStandings.jsx";
import LiveTournament from "./Tournament/LiveTournament.jsx";
import ErrorPage from "./Error.jsx";
import LoginPage from "./Auth/beta_login.jsx";
import SignupPage from "./Auth/Signup.jsx";
import MatchTest from "./Tournament/MatchTest.jsx";
import WindowView from "./Tournament/Viewer/WindowView.jsx";
import {NavbarUpdated} from "@/pages/NavbarUpdated.jsx";

const AppRoutes = ({
                       setAuthToken,
                       authToken,
                       setTournamentSetupComplete,
                       tournamentConfig,
                       setTournamentConfig,
                   }) => {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-screen">
                {/* Sidebar will persist on the left */}
                <NavbarUpdated />
                {/* Main content area for routing */}
                <main className="flex-1 overflow-y-auto">
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
                        <Route path="/viewer" element={<WindowView />} />
                        <Route path="/auth/login" element={<LoginPage />} />
                        <Route path="/auth/signup" element={<SignupPage />} />
                        <Route path="*" element={<ErrorPage statusCode={404} />} />
                    </Routes>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default AppRoutes;
