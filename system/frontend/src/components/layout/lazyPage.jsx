// src/components/layout/LazyPageDebug.jsx
import React, { lazy, Suspense } from "react";

// Lazy‐load *only* the real Page component, and force a `.default`
// so React.lazy never complains.
const InnerPage = lazy(() =>
    import("../../pages/Page.jsx").then((mod) => ({
        default: mod.default, // Page.jsx *does* have a default export
    }))
);

export default function LazyPageDebug({ title, children }) {
    return (
        <Suspense fallback={<div className="p-6 text-center">Loading page…</div>}>
            <InnerPage title={title}>{children}</InnerPage>
        </Suspense>
    );
}
