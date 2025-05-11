// src/pages/NewsRoutes.jsx
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Page from '../pages/Page.jsx';                        // same folder
const NewsPage = React.lazy(() => import('../pages/News/NewsPage'));

export default function NewsRoutes() {
    return (
        <Routes>
            <Route
                path=""
                element={
                    <Page title="News">
                        <Suspense fallback={<div>Loading news…</div>}>
                            <NewsPage />
                        </Suspense>
                    </Page>
                }
            />
        </Routes>
    );
}
