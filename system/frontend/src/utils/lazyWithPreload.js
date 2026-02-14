import { lazy, Suspense } from 'react';

// Track prefetched components to avoid duplicate prefetches
const prefetched = new Set();

// Higher-order component for lazy loading with prefetching
export function lazyWithPreload(importFn, componentName = 'default') {
  const Component = lazy(importFn);
  
  // Add prefetch method to component
  Component.prefetch = () => {
    if (prefetched.has(importFn.toString())) return Promise.resolve();
    
    prefetched.add(importFn.toString());
    return importFn().then(module => {
      // Store the component in memory for faster access
      Component._payload._result = { default: module[componentName] };
      return module;
    });
  };
  
  return Component;
}

// Prefetch on mouse enter or touch start
export const withPrefetch = (Component) => {
  return function WithPrefetch(props) {
    const handleMouseEnter = () => {
      if (Component.prefetch) {
        Component.prefetch().catch(console.error);
      }
    };

    return (
      <div 
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleMouseEnter}
        className="w-full h-full"
      >
        <Suspense fallback={props.fallback || <div>Loading...</div>}>
          <Component {...props} />
        </Suspense>
      </div>
    );
  };
};
