import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout component that includes the Navbar
import Layout from '@/pages/Layout/Layout.jsx';

// Eagerly load the main page components
import HomePage from '@/pages/Home.jsx';
import LiveTournament from '@/pages/Tournament/LiveTournament.jsx';
import TournamentSetup from '@/pages/Setup/TournamentSetup.jsx';
import MyTournaments from '@/pages/Tournament/Lists/TournamentList.jsx';
import PlayerManagement from '@/pages/Players/Players.jsx';

// Lazy load the WindowView as it's a separate experience
const WindowView = lazy(() => import('@/pages/Tournament/Viewer/WindowView.jsx'));

// A helper component to find and redirect to the first active tournament
const LiveTournamentRedirect = () => {
    // In a real application, you would fetch the list of active tournaments
    // and redirect to the first one. For this example, we'll assume a placeholder ID.
    // const { activeTournamentId } = useSomeApiHook();
    // if (!activeTournamentId) return <div>No active tournaments found.</div>;
    // return <Navigate to={`/tournament/${activeTournamentId}`} replace />;

    // For demonstration, we'll just show a message.
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-semibold">Finding Live Tournament...</h2>
            <p className="text-muted-foreground">This page would automatically redirect you to the currently active tournament.</p>
        </div>
    );
};


const AppRoutes = () => {
    return (
        <Suspense fallback={<div className="text-center p-8">Loading Page...</div>}>
            <Routes>
                {/* --- Routes WITH Navbar --- */}
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tournament/setup" element={<TournamentSetup />} />
                    <Route path="/tournament/my" element={<MyTournaments />} />
                    <Route path="/players" element={<PlayerManagement />} />

                    {/* The main page for managing a specific live tournament */}
                    <Route path="/tournament/:tournamentId" element={<LiveTournament />} />

                    {/* The generic link from the navbar dropdown */}
                    <Route path="/tournament/live" element={<LiveTournamentRedirect />} />

                    {/* Add other standard pages here */}
                </Route>

                {/* --- Routes WITHOUT Navbar (Full-screen views) --- */}
                {/* ✨ FIXED: This route is now defined outside the Layout, so it will not have a navbar */}
                <Route
                    path="/tournament/live/window/:tournamentId"
                    element={<WindowView />}
                />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
