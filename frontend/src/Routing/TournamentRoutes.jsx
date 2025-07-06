// src/Routing/TournamentRoutes.jsx
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Page from '@/pages/Page';
import TournamentSetup from '@/pages/Setup/TournamentSetup';
import TournamentSetupSuccess from '@/pages/Setup/Pages/SuccessPage';
import TournamentList from '@/pages/Tournament/Lists/TournamentList';
import LiveTournament from '@/pages/Tournament/LiveTournament';
import TournamentManagementPage from "@/pages/Tournament/Management/TournamentManagement.jsx";

export default function TournamentRoutes({
                                             setTournamentSetupComplete,
                                             tournamentConfig,
                                             setTournamentConfig,
                                         }) {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route path="" element={<Page title="Tournament" />}>
                <Route
                    path="setup"
                    element={
                        <TournamentSetup
                            onSetupComplete={(config) => {
                                setTournamentSetupComplete(true);
                                setTournamentConfig(config);
                                navigate('/tournament/success', { state: { config } });
                            }}
                            setTournamentConfig={setTournamentConfig}
                        />
                    }
                />
                <Route
                    path="success"
                    element={<TournamentSetupSuccess />}
                />
                <Route
                    path="/list"
                    element={<TournamentList />}
                />
                <Route
                    path="find"
                    element={
                        <div className="p-6 text-2xl">Find Tournaments Placeholder</div>
                    }
                />
                <Route
                    path="live/:tournamentId"
                    element={
                        <LiveTournament
                            tournamentConfig={tournamentConfig}
                            setTournamentSetupComplete={setTournamentSetupComplete}
                        />
                    }
                />
                <Route
                    path="/tournament/manage/:tournamentId"
                    element={<TournamentManagementPage />}
                />
            </Route>
        </Routes>
    );
}
