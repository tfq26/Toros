// src/pages/TournamentRoutes.jsx
import React, { Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Page from '../pages/Page.jsx';

const TournamentSetup        = React.lazy(() => import('../pages/Setup/TournamentSetup'));
const TournamentSetupSuccess = React.lazy(() => import('../pages/Setup/Pages/SuccessPage'));
const TournamentList         = React.lazy(() => import('../pages/Tournament/Lists/TournamentList'));
const LiveTournament         = React.lazy(() => import('../pages/Tournament/LiveTournament.jsx'));

export default function TournamentRoutes({
                                             setTournamentSetupComplete,
                                             tournamentConfig,
                                             setTournamentConfig,
                                         }) {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route
                path="setup"
                element={
                    <Page title="Tournament Setup">
                        <Suspense fallback={<div>Loading setup…</div>}>
                            <TournamentSetup
                                onSetupComplete={(config) => {
                                    setTournamentSetupComplete(true);
                                    setTournamentConfig(config);
                                    navigate('/tournament/success', { state: { config } });
                                }}
                                setTournamentConfig={setTournamentConfig}
                            />
                        </Suspense>
                    </Page>
                }
            />

            <Route
                path="success"
                element={
                    <Page title="Setup Success">
                        <Suspense fallback={<div>Finalizing…</div>}>
                            <TournamentSetupSuccess />
                        </Suspense>
                    </Page>
                }
            />

            <Route
                path="my"
                element={
                    <Page title="My Tournaments">
                        <Suspense fallback={<div>Loading your tournaments…</div>}>
                            <TournamentList />
                        </Suspense>
                    </Page>
                }
            />

            <Route
                path="find"
                element={
                    <Page title="Find Tournaments">
                        <div className="p-6 text-2xl">Find Tournaments Placeholder</div>
                    </Page>
                }
            />

            <Route
                path="live/:tournamentId"
                element={
                    <Page title="Live Tournament">
                        <Suspense fallback={<div>Connecting to live match…</div>}>
                            <LiveTournament
                                tournamentConfig={tournamentConfig}
                                setTournamentSetupComplete={setTournamentSetupComplete}
                            />
                        </Suspense>
                    </Page>
                }
            />
        </Routes>
    );
}
