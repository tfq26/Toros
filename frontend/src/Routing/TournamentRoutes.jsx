// src/pages/TournamentRoutes.jsx
import React, { Suspense } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Page from '../pages/Page.jsx'
import TournamentSetup        from '../pages/Setup/TournamentSetup.jsx'
import TournamentSetupSuccess from '../pages/Setup/Pages/SuccessPage.jsx'
import TournamentList         from '../pages/Tournament/Lists/TournamentList.jsx'
import LiveTournament         from '../pages/Tournament/LiveTournament.jsx'

export default function TournamentRoutes({
                                             setTournamentSetupComplete,
                                             tournamentConfig,
                                             setTournamentConfig,
                                         }) {
    const navigate = useNavigate()

    return (
        <Suspense fallback={null}>
            <Routes>
                <Route
                    path="setup"
                    element={
                        <Page title="Tournament Setup">
                            <TournamentSetup
                                onSetupComplete={(config) => {
                                    setTournamentSetupComplete(true)
                                    setTournamentConfig(config)
                                    navigate('/tournament/success', { state: { config } })
                                }}
                                setTournamentConfig={setTournamentConfig}
                            />
                        </Page>
                    }
                />

                <Route
                    path="success"
                    element={
                        <Page title="Setup Success">
                            <TournamentSetupSuccess />
                        </Page>
                    }
                />

                <Route
                    path="my"
                    element={
                        <Page title="My Tournaments">
                            <TournamentList />
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
                            <LiveTournament
                                tournamentConfig={tournamentConfig}
                                setTournamentSetupComplete={setTournamentSetupComplete}
                            />
                        </Page>
                    }
                />
            </Routes>
        </Suspense>
    )
}
