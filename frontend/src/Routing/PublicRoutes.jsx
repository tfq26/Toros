// src/Routing/PublicRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LazyPage from "@/components/layout/LazyPage";

// Lazy‐loaded pages — each one guaranteed to export a `.default`
const Home      = lazy(() => import("../pages/Home").then(mod => ({ default: mod.default })));
const Players   = lazy(() => import("../pages/Players/Players").then(mod => ({ default: mod.default })));
const Profile   = lazy(() => import("../pages/Profile/ProfilePage").then(mod => ({ default: mod.default })));
const MatchTest = lazy(() => import("../pages/Tournament/MatchTest").then(mod => ({ default: mod.default })));
const Viewer    = lazy(() => import("../pages/Tournament/Viewer/WindowView").then(mod => ({ default: mod.default })));

export default function PublicRoutes() {
    return (
        <Suspense fallback={<div className="p-6 text-center">Loading page…</div>}>
            <Routes>
                <Route
                    index
                    element={
                        <LazyPage title="Home" fallback="Loading Home…" Component={Home} />
                    }
                />
                <Route
                    path="players"
                    element={
                        <LazyPage
                            title="Players"
                            fallback="Loading Players…"
                            Component={Players}
                        />
                    }
                />
                <Route
                    path="profile"
                    element={
                        <LazyPage
                            title="My Profile"
                            fallback="Loading Profile…"
                            Component={Profile}
                        />
                    }
                />
                <Route
                    path="test-matches"
                    element={
                        <LazyPage
                            title="Test Matches"
                            fallback="Loading Matches…"
                            Component={MatchTest}
                        />
                    }
                />
                <Route
                    path="viewer"
                    element={
                        <LazyPage
                            title="Viewer"
                            fallback="Loading Viewer…"
                            Component={Viewer}
                        />
                    }
                />
                <Route
                    path="explore/*"
                    element={
                        <LazyPage title="Explore" fallback="Loading Explore…">
                            <div className="p-6 text-2xl">Explore Placeholder</div>
                        </LazyPage>
                    }
                />
            </Routes>
        </Suspense>
    );
}
