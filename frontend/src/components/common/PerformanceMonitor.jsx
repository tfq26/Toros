import React, { useEffect, useRef, useState } from 'react';
import { useMeasure } from 'react-use';
import { measureSync } from '@/utils/performance';

/**
 * PerformanceMonitor component to track and display performance metrics
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to monitor
 * @param {string} [props.name] - Name for this performance monitor
 * @param {boolean} [props.logOnMount] - Whether to log metrics on mount
 * @param {boolean} [props.measureRender] - Whether to measure render performance
 * @param {Object} [props.metadata] - Additional metadata to include in logs
 */
const PerformanceMonitor = ({
  children,
  name = 'Component',
  logOnMount = true,
  measureRender = true,
  metadata = {},
}) => {
  const [metrics, setMetrics] = useState({
    mountTime: 0,
    updateTime: 0,
    renderCount: 0,
    lastRender: null,
  });
  
  const renderStartRef = useRef(0);
  const mountTimeRef = useRef(0);
  const updateCountRef = useRef(0);
  const [ref, { width, height }] = useMeasure();
  
  // Measure render time
  if (measureRender && typeof performance !== 'undefined') {
    const now = performance.now();
    if (renderStartRef.current) {
      const renderTime = now - renderStartRef.current;
      setMetrics(prev => ({
        ...prev,
        updateTime: renderTime,
        renderCount: prev.renderCount + 1,
        lastRender: new Date().toISOString(),
      }));
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${name} updated in ${renderTime.toFixed(2)}ms`, {
          ...metrics,
          width,
          height,
          ...metadata,
        });
      }
    }
    renderStartRef.current = now;
  }
  
  // Log mount time
  useEffect(() => {
    if (logOnMount) {
      const mountTime = performance.now() - renderStartRef.current;
      mountTimeRef.current = mountTime;
      
      setMetrics(prev => ({
        ...prev,
        mountTime,
        renderCount: 1,
        lastRender: new Date().toISOString(),
      }));
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${name} mounted in ${mountTime.toFixed(2)}ms`, {
          width,
          height,
          ...metadata,
        });
      }
    }
    
    // Cleanup
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${name} unmounted`, {
          mountTime: mountTimeRef.current,
          updateCount: updateCountRef.current,
          lastRender: metrics.lastRender,
          ...metadata,
        });
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Measure render performance of children
  const measuredChildren = measureRender
    ? React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        // Wrap the child's render function to measure its execution time
        const originalRender = child.type.render || child.type;
        
        const WrappedComponent = (props) => {
          const renderTime = measureSync(`${name}_render`, () => {
            return originalRender(props);
          });
          
          if (process.env.NODE_ENV === 'development' && renderTime > 16) {
            console.warn(
              `[Performance] Slow render in ${name}: ${renderTime.toFixed(2)}ms`,
              { props }
            );
          }
          
          return originalRender(props);
        };
        
        return React.cloneElement(child, {
          ...child.props,
          ref: (node) => {
            if (child.ref) {
              if (typeof child.ref === 'function') {
                child.ref(node);
              } else if (child.ref.hasOwnProperty('current')) {
                child.ref.current = node;
              }
            }
            ref(node);
          },
        });
      })
    : children;
  
  // In production, just render children without any monitoring
  if (process.env.NODE_ENV === 'production') {
    return children;
  }
  
  // In development, wrap with a performance monitor overlay
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          fontSize: '10px',
          padding: '2px 4px',
          zIndex: 9999,
          pointerEvents: 'none',
          fontFamily: 'monospace',
        }}
      >
        {name} | {metrics.updateTime.toFixed(1)}ms
      </div>
      {measuredChildren}
    </div>
  );
};

export default React.memo(PerformanceMonitor);

// Example usage:
/*
<PerformanceMonitor name="MyComponent">
  <MyComponent />
</PerformanceMonitor>
*/

// Or as a higher-order component:
/*
const withPerformanceMonitor = (WrappedComponent, options = {}) => {
  return (props) => (
    <PerformanceMonitor name={options.name || WrappedComponent.name} {...options}>
      <WrappedComponent {...props} />
    </PerformanceMonitor>
  );
};

export default withPerformanceMonitor(MyComponent, { logOnMount: true });
*/
