import React from "react";
import { Routes, Route } from "react-router-dom";
import LazyPage from "@/components/layout/LazyPage"; // ✅ Ensure correct casing

const NewsPage = React.lazy(() => import("../pages/News/NewsPage"));

export default function NewsRoutes() {
    return (
        <Routes>
            <Route
                index
                element={
                    <LazyPage title="News" fallback="Loading News…" Component={NewsPage} />
                }
            />
        </Routes>
    );
}
