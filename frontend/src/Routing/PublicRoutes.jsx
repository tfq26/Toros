// src/pages/PublicRoutes.jsx
import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Page from '../pages/Page.jsx'

// Lazy-load the components you need
const Home      = React.lazy(() => import('../pages/Home.jsx'))
const Players   = React.lazy(() => import('../pages/Players/Players.jsx'))
const Profile   = React.lazy(() => import('../pages/Profile/ProfilePage.jsx'))
const MatchTest = React.lazy(() => import('../pages/Tournament/MatchTest.jsx'))
const Viewer    = React.lazy(() => import('../pages/Tournament/Viewer/WindowView.jsx'))

export default function PublicRoutes() {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route
                    index
                    element={
                        <Page title="Home">
                            <Home />
                        </Page>
                    }
                />
                <Route
                    path="players"
                    element={
                        <Page title="Players">
                            <Players />
                        </Page>
                    }
                />
                <Route
                    path="profile"
                    element={
                        <Page title="My Profile">
                            <Profile />
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
                            <MatchTest />
                        </Page>
                    }
                />
                <Route
                    path="viewer"
                    element={
                        <Page title="Viewer">
                            <Viewer />
                        </Page>
                    }
                />
            </Routes>
        </Suspense>
    )
}
