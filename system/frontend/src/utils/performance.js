// Performance monitoring and metrics collection

// Store performance marks and measures
const performanceMetrics = {
  marks: new Map(),
  measures: new Map(),
};

/**
 * Start a performance measurement
 * @param {string} name - The name of the measurement
 */
export function startMeasure(name) {
  if (!window.performance || !window.performance.mark) {
    console.warn('Performance API not supported');
    return;
  }
  
  // Clear any existing marks with the same name
  if (performanceMetrics.marks.has(name)) {
    performance.clearMarks(name);
  }
  
  performance.mark(`${name}-start`);
  performanceMetrics.marks.set(name, true);
}

/**
 * End a performance measurement and log the result
 * @param {string} name - The name of the measurement
 * @param {Object} [metadata] - Additional metadata to log with the measurement
 * @returns {number} - The duration in milliseconds
 */
export function endMeasure(name, metadata = {}) {
  if (!window.performance || !window.performance.measure) {
    console.warn('Performance API not supported');
    return 0;
  }
  
  if (!performanceMetrics.marks.has(name)) {
    console.warn(`No measurement started with name: ${name}`);
    return 0;
  }
  
  performance.mark(`${name}-end`);
  
  try {
    // Create a measure for the duration
    performance.measure(
      name,
      `${name}-start`,
      `${name}-end`
    );
    
    // Get all measures with this name
    const measures = performance.getEntriesByName(name);
    const lastMeasure = measures[measures.length - 1];
    
    // Log the measurement
    const duration = lastMeasure.duration;
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`, metadata);
    }
    
    // You can also send this to your analytics service in production
    // sendToAnalytics(name, duration, metadata);
    
    // Clean up
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
    performanceMetrics.marks.delete(name);
    
    return duration;
  } catch (error) {
    console.error('Error measuring performance:', error);
    return 0;
  }
}

/**
 * Measure the execution time of an async function
 * @param {string} name - The name of the measurement
 * @param {Function} fn - The async function to measure
 * @param {Object} [metadata] - Additional metadata to log with the measurement
 * @returns {Promise<*>} - The result of the function
 */
export async function measureAsync(name, fn, metadata = {}) {
  startMeasure(name);
  try {
    const result = await fn();
    endMeasure(name, metadata);
    return result;
  } catch (error) {
    endMeasure(name, { ...metadata, error: error.message });
    throw error;
  }
}

/**
 * Measure the execution time of a synchronous function
 * @param {string} name - The name of the measurement
 * @param {Function} fn - The function to measure
 * @param {Object} [metadata] - Additional metadata to log with the measurement
 * @returns {*} - The result of the function
 */
export function measureSync(name, fn, metadata = {}) {
  startMeasure(name);
  try {
    const result = fn();
    endMeasure(name, metadata);
    return result;
  } catch (error) {
    endMeasure(name, { ...metadata, error: error.message });
    throw error;
  }
}

/**
 * Track page load performance
 */
export function trackPageLoad() {
  if (document.readyState === 'complete') {
    const timing = window.performance.timing;
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`[Performance] Page loaded in ${pageLoadTime}ms`);
    
    // Log important metrics
    const metrics = {
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      tcp: timing.connectEnd - timing.connectStart,
      ttfb: timing.responseStart - timing.requestStart,
      domLoad: timing.domComplete - timing.domLoading,
      pageLoad: pageLoadTime,
    };
    
    console.log('[Performance] Metrics:', metrics);
    
    // You can send these metrics to your analytics service
    // sendToAnalytics('page_load', metrics);
  }
}

// Track initial page load
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    trackPageLoad();
  } else {
    window.addEventListener('load', trackPageLoad);
  }
}

// Example usage:
/*
async function fetchData() {
  // This will be measured
  const data = await measureAsync('fetchData', () => 
    fetch('/api/data').then(res => res.json())
  );
  
  // This will also be measured
  const processed = measureSync('processData', () => {
    return processData(data);
  });
  
  return processed;
}
*/

// You can also use it as a wrapper:
/*
const fetchData = measureAsync.wrap('fetchData', async () => {
  const response = await fetch('/api/data');
  return response.json();
});
*/
