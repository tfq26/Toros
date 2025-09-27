// src/Routing/PublicRoutes.jsx
import React, { Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { createAsyncComponent } from "@/utils/asyncComponent";
import { PerformanceMonitor } from "@/components/common/PerformanceMonitor";
import ErrorPage from "@/pages/Error";
import { DefaultLoading } from "@/components/common/Loading";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Create a wrapper component that includes error handling
const createRouteComponent = (name, importFn) => {
  return createAsyncComponent(
    () => importFn().then(module => {
      const Component = module.default;
      return {
        ...module,
        default: (props) => (
          <PerformanceMonitor name={name}>
            <ErrorBoundary>
              <Component {...props} />
            </ErrorBoundary>
          </PerformanceMonitor>
        )
      };
    }),
    {
      LoadingComponent: () => <DefaultLoading message={`Loading ${name}...`} />,
      ErrorComponent: ({ error, retry }) => (
        <ErrorPage error={error} onRetry={retry} />
      )
    }
  );
};

// Create route components with performance monitoring
const Home = createRouteComponent("Home", () => import("@/pages/Home"));
const Players = createRouteComponent("Players", () => import("@/pages/Players/Players"));
const Profile = createRouteComponent("Profile", () => import("@/pages/Profile/ProfilePage"));
const MatchTest = createRouteComponent("MatchTest", () => import("@/pages/Tournament/MatchTest"));
const Viewer = createRouteComponent("Viewer", () => import("@/pages/Tournament/Viewer/WindowView"));

// Track route changes and prefetch other routes
const RouteTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view
    console.log(`Navigated to: ${location.pathname}`);
    
    // Prefetch other routes when idle
    const prefetchOtherRoutes = () => {
      if (window.requestIdleCallback) {
        requestIdleCallback(() => {
          // Prefetch routes that aren't the current one
          const currentPath = location.pathname;
          if (!currentPath.includes('players')) Players.preload?.();
          if (!currentPath.includes('profile')) Profile.preload?.();
          if (!currentPath.includes('test-matches')) MatchTest.preload?.();
        });
      }
    };
    
    const timer = setTimeout(prefetchOtherRoutes, 2000);
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  return null;
};

// Simple ErrorBoundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback 
        ? this.props.fallback({ 
            error: this.state.error, 
            resetErrorBoundary: () => {
              this.setState({ hasError: false, error: null });
              this.props.onReset?.();
            }
          })
        : <ErrorPage error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default function PublicRoutes() {
  return (
    <>
      <RouteTracker />
      <Suspense fallback={<DefaultLoading fullPage />}>
        <Routes>
          <Route 
            index 
            element={<Home />} 
            errorElement={<ErrorPage />}
          />
          <Route 
            path="players/*" 
            element={<Players />} 
            errorElement={<ErrorPage />}
          />
          <Route 
            path="profile" 
            element={<Profile />} 
            errorElement={<ErrorPage />}
          />
          <Route 
            path="test-matches" 
            element={<MatchTest />} 
            errorElement={<ErrorPage />}
          />
          <Route 
            path="viewer" 
            element={<Viewer />} 
            errorElement={<ErrorPage />}
          />
          <Route
            path="*"
            element={
              <ErrorPage 
                error={{ 
                  status: 404, 
                  statusText: "Page Not Found",
                  message: "The page you're looking for doesn't exist or has been moved." 
                }} 
              />
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}
