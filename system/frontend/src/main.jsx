import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { register } from '@/utils/registerServiceWorker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/Contexts/ThemeContext';

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      useErrorBoundary: true, // Enable error boundaries for queries
    },
  },
});

// Register service worker in production
if (process.env.NODE_ENV === 'production') {
  register();
}

// Import your pages and layout
import Layout from '@/pages/Layout/Layout.jsx';
import Home from '@/pages/Home.jsx';
import TestPage from '@/pages/TestPage.jsx';
import TournamentList from '@/pages/Tournament/Lists/TournamentList.jsx';
import TournamentSetup from '@/pages/Setup/TournamentSetup.jsx';
import Players from '@/pages/Players/Players.jsx';
import LiveTournament from '@/pages/Tournament/LiveTournament.jsx';
import WindowView from "@/pages/Tournament/Viewer/WindowView.jsx"; // Corrected from the previous file name

// Import your context providers
import { ErrorProvider } from '@/contexts/ErrorContext.jsx';
import { ModalProvider } from '@/contexts/ModalContext.jsx';
import { NotificationProvider } from '@/contexts/NotificationContext.jsx';
import { NetworkProvider } from '@/contexts/NetworkContext.jsx';
import { FeatureFlagProvider } from '@/contexts/FeatureFlagContext.jsx';
import { LoadingProvider } from '@/contexts/LoadingContext.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { TournamentProvider } from "@/contexts/TournamentContext.jsx"; // Corrected path case for consistency
import { SetupProvider } from "@/contexts/SetupContext.jsx";
import ProfilePage from "@/pages/Profile/ProfilePage.jsx";
import { ResponsiveProvider } from "@/Contexts/ResponsiveContext.jsx";
import TournamentManagementPage from "@/pages/Tournament/Management/TournamentManagement.jsx"; // ✨ Added missing SetupProvider

// Import the ErrorPage component
import ErrorPage from '@/pages/Error';

// Simple error fallback for the root error boundary
function RootErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
        <p className="text-gray-700 mb-6">{error?.message || 'An unexpected error occurred'}</p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  // Route #1: Your main application with the standard layout
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'test', element: <TestPage /> },
      { path: 'tournament/list', element: <TournamentList /> },
      { path: 'tournament/setup', element: <TournamentSetup /> },
      { path: 'players', element: <Players /> },
      { path: 'tournament/live/:tournamentId', element: <LiveTournament /> },
      { path: "profile", element: <ProfilePage /> },
      { path: 'tournament/manage/:tournamentId', element: <TournamentManagementPage /> },

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

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <ErrorBoundary>
      <ErrorProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <NetworkProvider>
              <FeatureFlagProvider>
                <LoadingProvider>
                  <AuthProvider>
                    <TournamentProvider>
                      <SetupProvider>
                        <NotificationProvider>
                          <ModalProvider>
                            <ResponsiveProvider>
                              <Suspense fallback={
                                <div className="flex items-center justify-center min-h-screen">
                                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                              }>
                                <RouterProvider
                                  router={router}
                                  fallbackElement={
                                    <div className="flex items-center justify-center min-h-screen">
                                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                  }
                                />
                              </Suspense>
                            </ResponsiveProvider>
                          </ModalProvider>
                        </NotificationProvider>
                      </SetupProvider>
                    </TournamentProvider>
                  </AuthProvider>
                </LoadingProvider>
              </FeatureFlagProvider>
            </NetworkProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorProvider>
    </ErrorBoundary>
  </StrictMode>
);