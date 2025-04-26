import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar.jsx";
import Home from "./Home.jsx";
import Players from "./Players/Players.jsx";
import ProfilePage from "./Profile/ProfilePage.jsx";
import TournamentSetup from "./Setup/TournamentSetup.jsx";
import TournamentSetupSuccess from "./Setup/Pages/SuccessPage.jsx";
import TournamentList from "./Tournament/Lists/TournamentList.jsx";
import LiveTournament from "./Tournament/LiveTournament.jsx";
import ErrorPage from "./Error.jsx";
import LoginPage from "./Auth/LoginUpdated.jsx";
import SignupPage from "./Older Components/SignUp.jsx";
import MatchTest from "./Tournament/MatchTest.jsx";
import WindowView from "./Tournament/Viewer/WindowView.jsx";
import Page from "./Page.jsx";

// ← Import your real NewsPage
import NewsPage from "./News/NewsPage.jsx";

const Explore = () => <div className="p-6 text-2xl">Explore Placeholder</div>;
const FindTournaments = () => <div className="p-6 text-2xl">Find Tournaments Placeholder</div>;

function AppRoutes() {
    const [tournamentSetupComplete, setTournamentSetupComplete] = useState(false);
    const [tournamentConfig, setTournamentConfig] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (tournamentSetupComplete) {
            const timer = setTimeout(() => {
                navigate("/tournament/my");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [tournamentSetupComplete, navigate]);

    return (
        <SidebarProvider>
            <div className="flex h-screen w-screen">
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

                        {/* ← Updated News route */}
                        <Route
                            path="/news"
                            element={
                                <Page title="News">
                                    <NewsPage />
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
                            path="/profile"
                            element={
                                <Page title="My Profile">
                                    <ProfilePage />
                                </Page>
                            }
                        />

                        <Route
                            path="/explore/*"
                            element={
                                <Page title="Explore">
                                    <Explore />
                                </Page>
                            }
                        />

                        {/* Tournament Section */}
                        <Route
                            path="/tournament/setup"
                            element={
                                <Page title="Tournament Setup">
                                    <TournamentSetup
                                        onSetupComplete={(config) => {
                                            setTournamentSetupComplete(true);
                                            setTournamentConfig(config);
                                        }}
                                        setTournamentConfig={setTournamentConfig}
                                    />
                                </Page>
                            }
                        />

                        <Route
                            path="/tournament/success"
                            element={
                                <Page title="Setup Success">
                                    <TournamentSetupSuccess />
                                </Page>
                            }
                        />

                        <Route
                            path="/tournament/my"
                            element={
                                <Page title="My Tournaments">
                                    <TournamentList />
                                </Page>
                            }
                        />

                        <Route
                            path="/tournament/find"
                            element={
                                <Page title="Find Tournaments">
                                    <FindTournaments />
                                </Page>
                            }
                        />

                        <Route
                            path="/bracket"
                            element={
                                <Page title="Bracket">
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
                            path="/test-matches"
                            element={
                                <Page title="Test Matches">
                                    <MatchTest />
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
}

export default AppRoutes;
