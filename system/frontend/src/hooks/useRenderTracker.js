import { useEffect, useRef } from 'react';
import { measureSync } from '@/utils/performance';

/**
 * Tracks component renders and helps identify unnecessary re-renders
 * @param {string} componentName - Name of the component being tracked
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.logOnMount=true] - Whether to log on component mount
 * @param {boolean} [options.logOnUpdate=true] - Whether to log on component updates
 * @param {number} [options.warnThreshold=16] - Threshold in ms to warn about slow renders
 * @param {boolean} [options.trackProps=true] - Whether to track prop changes
 * @returns {Object} - Render tracking information
 */
function useRenderTracker(componentName, options = {}) {
  const {
    logOnMount = true,
    logOnUpdate = true,
    warnThreshold = 16, // ~60fps threshold
    trackProps = true,
  } = options;

  const renderCount = useRef(0);
  const lastProps = useRef(null);
  const lastRenderTime = useRef(0);
  const mountTime = useRef(0);
  const isFirstRender = useRef(true);

  // Track render time and count
  const trackRender = () => {
    const now = performance.now();
    const renderTime = now - lastRenderTime.current;
    
    renderCount.current += 1;
    
    if (isFirstRender.current) {
      isFirstRender.current = false;
      mountTime.current = now;
      if (logOnMount) {
        console.log(`[Render] ${componentName} mounted`);
      }
    } else if (logOnUpdate) {
      const logData = {
        renderCount: renderCount.current,
        timeSinceLastRender: renderTime.toFixed(2) + 'ms',
        timeSinceMount: (now - mountTime.current).toFixed(2) + 'ms',
      };

      if (renderTime > warnThreshold) {
        console.warn(`[Render] Slow render in ${componentName}:`, logData);
      } else if (process.env.NODE_ENV === 'development') {
        console.log(`[Render] ${componentName} updated:`, logData);
      }
    }

    lastRenderTime.current = now;
    return renderTime;
  };

  // Track prop changes
  const trackPropsChange = (nextProps) => {
    if (!trackProps || !lastProps.current) {
      lastProps.current = nextProps;
      return [];
    }

    const changedProps = [];
    const allKeys = new Set([
      ...Object.keys(lastProps.current || {}),
      ...Object.keys(nextProps || {}),
    ]);

    for (const key of allKeys) {
      if (lastProps.current[key] !== nextProps[key]) {
        changedProps.push({
          prop: key,
          from: lastProps.current[key],
          to: nextProps[key],
          changed: true,
        });
      }
    }

    if (changedProps.length > 0 && process.env.NODE_ENV === 'development') {
      console.log(`[Render] ${componentName} props changed:`, changedProps);
    }

    lastProps.current = nextProps;
    return changedProps;
  };

  // Track effect dependencies
  const trackEffect = (effectName, deps) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Effect] ${componentName}.${effectName}`, { deps });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Render] ${componentName} unmounted`, {
          totalRenders: renderCount.current,
          mountDuration: (performance.now() - mountTime.current).toFixed(2) + 'ms',
        });
      }
    };
  }, []);

  return {
    // Track a render cycle
    trackRender: () => measureSync(`${componentName}_render`, trackRender),
    
    // Track prop changes
    trackProps: trackPropsChange,
    
    // Track effect dependencies
    trackEffect,
    
    // Get current render count
    getRenderCount: () => renderCount.current,
    
    // Get time since mount
    getTimeSinceMount: () => performance.now() - mountTime.current,
    
    // Get time since last render
    getTimeSinceLastRender: () => performance.now() - lastRenderTime.current,
  };
}

// Higher-order component for class components
function withRenderTracker(Component, options = {}) {
  const displayName = Component.displayName || Component.name || 'Component';
  
  return function WithRenderTracker(props) {
    const { trackRender, trackProps } = useRenderTracker(displayName, options);
    
    // Track prop changes
    trackProps(props);
    
    // Track render
    trackRender();
    
    return <Component {...props} />;
  };
}

export { useRenderTracker, withRenderTracker };

// Example usage with functional component:
/*
function MyComponent(props) {
  const { trackRender, trackProps } = useRenderTracker('MyComponent', {
    logOnMount: true,
    warnThreshold: 16,
  });
  
  // Track prop changes
  trackProps(props);
  
  // Track render time
  trackRender();
  
  return <div>My Component</div>;
}
*/

// Example usage with class component:
/*
class MyComponent extends React.Component {
  render() {
    return <div>My Class Component</div>;
  }
}

export default withRenderTracker(MyComponent, { logOnMount: true });
*/
