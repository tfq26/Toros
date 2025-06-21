import React from 'react';

// ✨ NEW: Import the navigation data to display it
import { mainNavigation, siteLogo } from '@/Routing/Navigation.js';

/**
 * A simple, standalone test page to verify that the main Layout and routing Outlet are working.
 * It has high-contrast text and a clear success message to make it obvious if it's rendering.
 */
const TestPage = () => {
    return (
        <div className="container mx-auto p-8 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight mb-4">
                Test Page Works!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
                If you are seeing this, the Layout and React Router are functioning correctly.
            </p>
            <div className="max-w-md mx-auto p-6 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200">
                    Layout and Outlet are OK
                </h2>
                <p className="mt-2 text-green-700 dark:text-green-300">
                    The problem is likely within the specific component you are trying to render on your home page, not the main layout itself.
                </p>
            </div>

            {/* ✨ NEW: A section to display the imported navigation data for debugging */}
            <div className="mt-12 text-left max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-center mb-4">Loaded Navigation Data</h3>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-2">Site Logo Object:</h4>
                    <pre className="text-sm bg-gray-200 dark:bg-gray-700 p-3 rounded overflow-x-auto">
                        <code>{JSON.stringify(siteLogo, null, 2)}</code>
                    </pre>
                </div>
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-2">Main Navigation Array:</h4>
                    <pre className="text-sm bg-gray-200 dark:bg-gray-700 p-3 rounded overflow-x-auto">
                        <code>{JSON.stringify(mainNavigation, null, 2)}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default TestPage;
