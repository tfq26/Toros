// src/pages/PublicRoutes.jsx
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Page from '../pages/Page.jsx';  // Page.jsx is alongside PublicRoutes.jsx

// Lazy-load your pages
const Home      = React.lazy(() => import('../pages/./Home'));
const Players   = React.lazy(() => import('../pages/./Players/Players'));
const Profile   = React.lazy(() => import('../pages/./Profile/ProfilePage'));
const MatchTest = React.lazy(() => import('../pages/./Tournament/MatchTest'));
const Viewer    = React.lazy(() => import('../pages/./Tournament/Viewer/WindowView'));

export default function PublicRoutes() {
    return (
        <Routes>
            <Route
                index
                element={
                    <Page title="Home">
                        <Suspense fallback={<div>Loading Home…</div>}>
                            <Home />
                        </Suspense>
                    </Page>
                }
            />
            <Route
                path="players"
                element={
                    <Page title="Players">
                        <Suspense fallback={<div>Loading Players…</div>}>
                            <Players />
                        </Suspense>
                    </Page>
                }
            />
            <Route
                path="profile"
                element={
                    <Page title="My Profile">
                        <Suspense fallback={<div>Loading Profile…</div>}>
                            <Profile />
                        </Suspense>
                    </Page>
                }
            />
            <Route
                path="explore/*"
                element={
                    <Page title="Explore">
                        <div className="p-6 text-2xl">Explore Placeholder</div>
                    </Page>
                }
            />
            <Route
                path="test-matches"
                element={
                    <Page title="Test Matches">
                        <Suspense fallback={<div>Loading Test Matches…</div>}>
                            <MatchTest />
                        </Suspense>
                    </Page>
                }
            />
            <Route
                path="viewer"
                element={
                    <Page title="Viewer">
                        <Suspense fallback={<div>Loading Viewer…</div>}>
                            <Viewer />
                        </Suspense>
                    </Page>
                }
            />
        </Routes>
    );
}
