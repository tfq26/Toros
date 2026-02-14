import React, { Suspense, lazy, Component } from 'react';
import PropTypes from 'prop-types';
import { measureAsync } from './performance';

// Default loading component
const DefaultLoading = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Error boundary component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Component Error Boundary:', error, errorInfo);
    
    // You can also log this to an error tracking service
    // logErrorToService(error, { componentStack: errorInfo.componentStack });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback ? (
        this.props.fallback(this.state.error, this.handleRetry)
      ) : (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
          <p className="mt-2 text-sm text-red-700">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={this.handleRetry}
            className="mt-3 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.func,
  onRetry: PropTypes.func,
};

/**
 * Creates an async component with built-in loading and error handling
 * @param {Function} importComponent - Function that returns a dynamic import()
 * @param {Object} options - Configuration options
 * @param {React.ComponentType} [options.LoadingComponent] - Loading component to display while loading
 * @param {Function} [options.ErrorComponent] - Error boundary fallback component
 * @param {boolean} [options.suspense=true] - Whether to use React.Suspense
 * @param {Object} [options.suspenseProps] - Props to pass to Suspense
 * @returns {React.ComponentType} - The async component
 */
function createAsyncComponent(importComponent, options = {}) {
  const {
    LoadingComponent = DefaultLoading,
    ErrorComponent,
    suspense = true,
    suspenseProps = { fallback: <DefaultLoading /> },
  } = options;

  // Track component load time
  const loadTimeRef = { current: null };
  
  // Track if the component has been loaded
  const isLoadedRef = { current: false };
  
  // Track if there was an error loading the component
  const errorRef = { current: null };

  // The lazy-loaded component
  const LazyComponent = lazy(async () => {
    try {
      const startTime = performance.now();
      const component = await importComponent();
      const endTime = performance.now();
      
      // Calculate and store load time
      loadTimeRef.current = endTime - startTime;
      isLoadedRef.current = true;
      
      // Log performance metrics
      if (process.env.NODE_ENV === 'development') {
        const componentName = component?.default?.name || 'UnknownComponent';
        console.log(`[Performance] ${componentName} loaded in ${loadTimeRef.current.toFixed(2)}ms`);
      }
      
      return component;
    } catch (error) {
      console.error('Error loading async component:', error);
      errorRef.current = error;
      throw error;
    }
  });

  // The wrapper component that handles loading and error states
  const AsyncComponent = React.forwardRef((props, ref) => {
    // Handle error state
    if (errorRef.current) {
      return ErrorComponent ? (
        <ErrorComponent error={errorRef.current} />
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="text-lg font-medium text-yellow-800">Error Loading Component</h3>
          <p className="mt-2 text-sm text-yellow-700">
            {errorRef.current?.message || 'Failed to load component'}
          </p>
        </div>
      );
    }

    // Handle loading state
    if (!isLoadedRef.current) {
      return <LoadingComponent {...props} />;
    }

    // Wrap with error boundary
    const wrappedComponent = (
      <ErrorBoundary>
        <LazyComponent ref={ref} {...props} />
      </ErrorBoundary>
    );

    // Wrap with suspense if enabled
    return suspense ? (
      <Suspense {...suspenseProps}>
        {wrappedComponent}
      </Suspense>
    ) : (
      wrappedComponent
    );
  });

  // Add display name for better debugging
  AsyncComponent.displayName = `AsyncComponent(${
    LazyComponent.displayName || LazyComponent.name || 'Unknown'
  })`;

  // Add a preload method to manually trigger loading
  AsyncComponent.preload = async () => {
    if (!isLoadedRef.current && !errorRef.current) {
      try {
        await importComponent();
      } catch (error) {
        console.error('Error preloading component:', error);
        errorRef.current = error;
      }
    }
  };

  // Add a way to check if the component is loaded
  AsyncComponent.isLoaded = () => isLoadedRef.current;

  // Add a way to get the load time
  AsyncComponent.getLoadTime = () => loadTimeRef.current;

  return AsyncComponent;
}

/**
 * Prefetches a component before it's needed
 * @param {Function} importFunction - The dynamic import function
 * @param {string} [name] - Optional name for the component (for debugging)
 * @returns {Promise} - A promise that resolves when the component is loaded
 */
function prefetchComponent(importFunction, name) {
  const startTime = performance.now();
  
  return importFunction().then(module => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development' && name) {
      console.log(`[Performance] Prefetched ${name} in ${loadTime.toFixed(2)}ms`);
    }
    
    return {
      module,
      loadTime,
      loadedAt: new Date().toISOString(),
    };
  }).catch(error => {
    console.error(`Error prefetching component ${name || ''}:`, error);
    throw error;
  });
}

/**
 * Creates a component that can be preloaded on hover or other events
 * @param {Function} importFunction - The dynamic import function
 * @param {Object} options - Configuration options
 * @returns {Object} - Component and preload controls
 */
function createPreloadableComponent(importFunction, options = {}) {
  const {
    LoadingComponent = DefaultLoading,
    ErrorComponent,
    suspense = true,
  } = options;
  
  let resolveComponent;
  let rejectComponent;
  let loadPromise;
  let isPreloaded = false;
  
  const loadComponent = () => {
    if (!loadPromise) {
      loadPromise = new Promise((resolve, reject) => {
        resolveComponent = resolve;
        rejectComponent = reject;
      });
      
      importFunction()
        .then(module => {
          isPreloaded = true;
          resolveComponent(module);
        })
        .catch(error => {
          console.error('Error loading component:', error);
          rejectComponent(error);
        });
    }
    
    return loadPromise;
  };
  
  const LazyComponent = lazy(() => loadComponent());
  
  const PreloadableComponent = React.forwardRef((props, ref) => {
    const wrappedComponent = (
      <ErrorBoundary fallback={ErrorComponent}>
        <LazyComponent ref={ref} {...props} />
      </ErrorBoundary>
    );
    
    return suspense ? (
      <Suspense fallback={<LoadingComponent {...props} />}>
        {wrappedComponent}
      </Suspense>
    ) : (
      wrappedComponent
    );
  });
  
  PreloadableComponent.preload = () => {
    if (!isPreloaded) {
      return loadComponent();
    }
    return Promise.resolve();
  };
  
  PreloadableComponent.isPreloaded = () => isPreloaded;
  
  return PreloadableComponent;
}

export {
  createAsyncComponent,
  prefetchComponent,
  createPreloadableComponent,
  ErrorBoundary,
  DefaultLoading,
};

// Example usage:
/*
// Basic usage
const AsyncDashboard = createAsyncComponent(
  () => import('../components/Dashboard'),
  {
    LoadingComponent: () => <div>Loading Dashboard...</div>,
    ErrorComponent: ({ error, retry }) => (
      <div>
        <p>Failed to load dashboard: {error.message}</p>
        <button onClick={retry}>Retry</button>
      </div>
    ),
  }
);

// Usage with preloading
const UserProfile = createPreloadableComponent(
  () => import('../components/UserProfile')
);

// In a parent component
function App() {
  return (
    <div>
      <Link 
        to="/profile"
        onMouseEnter={() => UserProfile.preload()}
        onFocus={() => UserProfile.preload()}
      >
        View Profile
      </Link>
      
      <Route path="/profile" component={UserProfile} />
    </div>
  );
}

// Manual prefetching
prefetchComponent(
  () => import('../components/HeavyChart'),
  'HeavyChart'
).then(() => {
  console.log('Chart component is ready to render');
});
*/
