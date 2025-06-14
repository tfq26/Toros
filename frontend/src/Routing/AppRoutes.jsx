// src/Routing/AppRoutes.jsx
import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Page from '@/pages/Page'
import { TournamentProvider } from '@/Contexts/TournamentContext.jsx'  // ← correct path & casing

// public pages
const Home     = lazy(() => import('@/pages/Home'))
const NewsPage = lazy(() => import('@/pages/News/NewsPage'))

// tournament pages
const TournamentSetup        = lazy(() => import('@/pages/Setup/TournamentSetup'))
const TournamentSetupSuccess = lazy(() => import('@/pages/Setup/Pages/SuccessPage'))
const TournamentList         = lazy(() => import('@/pages/Tournament/Lists/TournamentList'))
const LiveTournament         = lazy(() => import('@/pages/Tournament/LiveTournament'))

export default function AppRoutes({
                                      setTournamentSetupComplete,
                                      tournamentConfig,
                                      setTournamentConfig,
                                  }) {
    return (
        // Wrap here so all children below can call useTournament()
        <TournamentProvider>
            <Suspense fallback={<div className="p-6 text-center">Loading application…</div>}>
                <Routes>

                    {/* ─── Public area ─── */}
                    <Route element={<Page title="Home" />}>
                        <Route index element={<Home />} />
                        <Route path="news" element={<NewsPage />} />
                    </Route>

                    {/* ─── Tournament area ─── */}
                    <Route element={<Page title="Tournament" />}>
                        <Route
                            path="tournament/setup"
                            element={
                                <TournamentSetup
                                    onSetupComplete={(config) => {
                                        setTournamentSetupComplete(true)
                                        setTournamentConfig(config)
                                    }}
                                    setTournamentConfig={setTournamentConfig}
                                />
                            }
                        />
                        <Route
                            path="tournament/success"
                            element={<TournamentSetupSuccess />}
                        />
                        <Route path="tournament/my" element={<TournamentList />} />
                        <Route
                            path="tournament/find"
                            element={
                                <div className="p-6 text-2xl">Find Tournaments Placeholder</div>
                            }
                        />
                        <Route
                            path="tournament/live/:tournamentId"
                            element={
                                <LiveTournament
                                    // no longer need to pass these; useTournament will supply them
                                    // tournamentConfig={tournamentConfig}
                                    // setTournamentSetupComplete={setTournamentSetupComplete}
                                />
                            }
                        />
                    </Route>

                    {/* ─── Catch-all → back to home ─── */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </TournamentProvider>
    )
}
