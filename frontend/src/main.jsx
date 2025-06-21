import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import your pages and layout
import Layout from '@/pages/Layout/Layout.jsx';
import Home from '@/pages/Home.jsx';
import TestPage from '@/pages/TestPage.jsx';
import TournamentList from '@/pages/Tournament/Lists/TournamentList.jsx';
import TournamentSetup from '@/pages/Setup/TournamentSetup.jsx';
import Players from '@/pages/Players/Players.jsx';
import LiveTournament from '@/pages/Tournament/LiveTournament.jsx';
import WindowView from "@/pages/Tournament/Viewer/WindowView.jsx"; // Corrected from the previous file name
import ErrorPage from '@/pages/Error.jsx';

// Import your context providers
import { ErrorProvider } from '@/contexts/ErrorContext.jsx';
import { ModalProvider } from '@/contexts/ModalContext.jsx';
import { NotificationProvider } from '@/contexts/NotificationContext.jsx';
import { NetworkProvider } from '@/contexts/NetworkContext.jsx';
import { FeatureFlagProvider } from '@/contexts/FeatureFlagContext.jsx';
import { ThemeProvider } from '@/contexts/ThemeContext.jsx';
import { LoadingProvider } from '@/contexts/LoadingContext.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { TournamentProvider } from "@/contexts/TournamentContext.jsx"; // Corrected path case for consistency
import { SetupProvider } from "@/contexts/SetupContext.jsx"; // ✨ Added missing SetupProvider

const router = createBrowserRouter([
    // Route #1: Your main application with the standard layout
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Home /> },
            { path: 'test', element: <TestPage /> },
            { path: 'tournament/my', element: <TournamentList /> },
            { path: 'tournament/setup', element: <TournamentSetup /> },
            { path: 'players', element: <Players /> },
            { path: 'tournament/live/:tournamentId', element: <LiveTournament /> },
            // ✨ REMOVED: The incorrect window view route was here
        ],
    },
    // ✨ MOVED: The WindowView route is now a top-level route.
    // This gives it a clean layout without the main Navbar/Footer.
    {
        path: 'tournament/live/window/:tournamentId', // Path is now relative at the top level
        element: <WindowView />,
        errorElement: <ErrorPage />,
    },
    // Route for the dedicated error page (if you have one)
    {
        path: '/error',
        element: <ErrorPage />,
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* All providers should wrap the RouterProvider */}
        <ErrorProvider>
            <ModalProvider>
                <NotificationProvider>
                    <NetworkProvider>
                        <FeatureFlagProvider>
                            <ThemeProvider>
                                <LoadingProvider>
                                    <AuthProvider>
                                        <TournamentProvider>
                                            <SetupProvider> {/* ✨ Added missing SetupProvider */}
                                                <RouterProvider router={router} />
                                            </SetupProvider>
                                        </TournamentProvider>
                                    </AuthProvider>
                                </LoadingProvider>
                            </ThemeProvider>
                        </FeatureFlagProvider>
                    </NetworkProvider>
                </NotificationProvider>
            </ModalProvider>
        </ErrorProvider>
    </React.StrictMode>
);