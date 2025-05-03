// src/pages/NewsRoutes.jsx
import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Page from '../pages/Page.jsx'

const NewsPage = React.lazy(() => import('../pages/News/NewsPage.jsx'))

export default function NewsRoutes() {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route
                    index
                    element={
                        <Page title="News">
                            <NewsPage />
                        </Page>
                    }
                />
            </Routes>
        </Suspense>
    )
}
