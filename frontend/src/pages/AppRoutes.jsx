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
import { NavbarUpdated } from "@/pages/Navbar/NavbarUpdated.jsx";
import Page from "./Page.jsx";

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
                {/* Persistent TournamentSidebar */}
                <NavbarUpdated />
                {/* Main Content Area for Routing */}
                <main className="flex-1 overflow-y-auto">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Page title="Home">
                                    <Home />
                                </Page>
                            }
                        />
                        <Route
                            path="/players"
                            element={
                                <Page title="Players">
                                    <Players />
                                </Page>
                            }
                        />
                        <Route
                            path="/tournament/setup"
                            element={
                                <Page title="Tournament Setup">
                                    <TournamentSetup
                                        onSetupComplete={() => setTournamentSetupComplete(true)}
                                        setTournamentConfig={setTournamentConfig}
                                    />
                                </Page>
                            }
                        />
                        <Route
                            path="/bracket"
                            element={
                                <Page title="Bracket">
                                    <TournamentBracket />
                                </Page>
                            }
                        />
                        <Route
                            path="/test-matches"
                            element={
                                <Page title="Test Matches">
                                    <MatchTest />
                                </Page>
                            }
                        />
                        <Route
                            path="/tournament/list"
                            element={
                                <Page title="Tournament List">
                                    <TournamentList />
                                </Page>
                            }
                        />
                        <Route
                            path="/tournament/live/:tournamentId"
                            element={
                                <Page title="Live Tournament">
                                    <LiveTournament
                                        setTournamentSetupComplete={setTournamentSetupComplete}
                                        tournamentConfig={tournamentConfig}
                                    />
                                </Page>
                            }
                        />
                        <Route
                            path="/viewer"
                            element={
                                <Page title="Viewer">
                                    <WindowView />
                                </Page>
                            }
                        />
                        <Route
                            path="/auth/login"
                            element={
                                <Page title="Login">
                                    <LoginPage />
                                </Page>
                            }
                        />
                        <Route
                            path="/auth/signup"
                            element={
                                <Page title="Signup">
                                    <SignupPage />
                                </Page>
                            }
                        />
                        <Route
                            path="*"
                            element={
                                <Page title="Error">
                                    <ErrorPage statusCode={404} />
                                </Page>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default AppRoutes;
