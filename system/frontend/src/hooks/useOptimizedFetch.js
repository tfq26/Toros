import { useCallback, useRef, useEffect } from 'react';
import { measureAsync } from '@/utils/performance';

// In-memory cache for API responses
const responseCache = new Map();
const pendingRequests = new Map();

/**
 * Custom hook for optimized data fetching with caching and request deduplication
 * @param {string} cacheKey - Unique key for caching the response
 * @param {Object} options - Configuration options
 * @param {Function} options.fetcher - Function that returns a promise with the data
 * @param {number} [options.cacheTime=300000] - Time in ms to cache the response (default: 5 minutes)
 * @param {boolean} [options.enabled=true] - Whether the fetch should be executed
 * @param {Function} [options.onSuccess] - Callback for successful fetch
 * @param {Function} [options.onError] - Callback for fetch error
 * @param {boolean} [options.refetchOnWindowFocus=false] - Whether to refetch when window regains focus
 * @param {number} [options.retry=2] - Number of retry attempts on failure
 * @param {number} [options.retryDelay=1000] - Delay between retries in ms
 * @returns {Object} - Fetch state and controls
 */
function useOptimizedFetch(cacheKey, {
  fetcher,
  cacheTime = 300000, // 5 minutes
  enabled = true,
  onSuccess,
  onError,
  refetchOnWindowFocus = false,
  retry = 2,
  retryDelay = 1000,
} = {}) {
  const isMounted = useRef(true);
  const retryCount = useRef(0);
  const retryTimeout = useRef(null);
  const lastFetchTime = useRef(0);
  const abortController = useRef(null);

  // Cleanup function
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  // Handle window focus refetch
  useEffect(() => {
    if (!refetchOnWindowFocus || !enabled) return;

    const handleFocus = () => {
      const now = Date.now();
      // Only refetch if the data is older than 1 minute
      if (now - lastFetchTime.current > 60000) {
        fetchData(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [enabled, refetchOnWindowFocus]);

  // Clear cache entry when cache time expires
  useEffect(() => {
    if (!cacheKey || cacheTime <= 0) return;

    const timer = setTimeout(() => {
      responseCache.delete(cacheKey);
    }, cacheTime);

    return () => clearTimeout(timer);
  }, [cacheKey, cacheTime]);

  // Fetch data function with retry logic
  const fetchData = useCallback(async (force = false) => {
    if (!fetcher || !enabled) return null;

    // Check if there's a pending request for this key
    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey);
    }

    // Check cache if not forcing a refetch
    if (!force && responseCache.has(cacheKey)) {
      const { data, timestamp } = responseCache.get(cacheKey);
      
      // Return cached data if it's still fresh
      if (Date.now() - timestamp < cacheTime) {
        return data;
      }
    }

    // Create a new abort controller for this request
    abortController.current = new AbortController();
    const signal = abortController.current.signal;

    const executeFetch = async () => {
      try {
        // Execute the fetcher with performance measurement
        const data = await measureAsync(
          `fetch_${cacheKey}`,
          () => fetcher({ signal })
        );

        // Only update state if component is still mounted
        if (isMounted.current) {
          // Cache the response
          if (cacheKey) {
            responseCache.set(cacheKey, {
              data,
              timestamp: Date.now(),
            });
          }

          // Call success callback
          if (onSuccess) {
            onSuccess(data);
          }

          // Reset retry count on success
          retryCount.current = 0;
          lastFetchTime.current = Date.now();
        }

        return data;
      } catch (error) {
        // Don't process aborted requests
        if (error.name === 'AbortError') {
          return null;
        }

        // Call error callback
        if (onError) {
          onError(error);
        }

        // Retry logic
        if (retryCount.current < retry) {
          retryCount.current += 1;
          
          // Wait before retrying
          await new Promise(resolve => {
            retryTimeout.current = setTimeout(resolve, retryDelay * retryCount.current);
          });
          
          // Retry the fetch
          if (isMounted.current) {
            return fetchData(force);
          }
        } else {
          // Reset retry count after all retries are exhausted
          retryCount.current = 0;
          throw error;
        }
      } finally {
        // Clean up the pending request
        if (cacheKey) {
          pendingRequests.delete(cacheKey);
        }
      }
    };

    // Store the promise to deduplicate concurrent requests
    const requestPromise = executeFetch();
    if (cacheKey) {
      pendingRequests.set(cacheKey, requestPromise);
    }

    return requestPromise;
  }, [cacheKey, enabled, fetcher, onError, onSuccess, retry, retryDelay, cacheTime]);

  // Invalidate cache for a specific key
  const invalidateCache = useCallback((key = cacheKey) => {
    if (key) {
      responseCache.delete(key);
    } else {
      responseCache.clear();
    }
  }, [cacheKey]);

  // Get cached data without making a request
  const getCachedData = useCallback((key = cacheKey) => {
    if (!key || !responseCache.has(key)) return null;
    
    const { data, timestamp } = responseCache.get(key);
    
    // Check if cache is still valid
    if (Date.now() - timestamp < cacheTime) {
      return data;
    }
    
    // Cache is stale, remove it
    responseCache.delete(key);
    return null;
  }, [cacheKey, cacheTime]);

  // Clear all pending requests
  const clearPendingRequests = useCallback(() => {
    pendingRequests.clear();
  }, []);

  // Abort the current request
  const abortRequest = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
  }, []);

  return {
    fetch: fetchData,
    invalidateCache,
    getCachedData,
    clearPendingRequests,
    abort: abortRequest,
    isPending: (key = cacheKey) => key ? pendingRequests.has(key) : false,
  };
}

export default useOptimizedFetch;

// Example usage:
/*
function UserProfile({ userId }) {
  const { 
    fetch: fetchUser, 
    getCachedData,
    invalidateCache,
    isPending 
  } = useOptimizedFetch(
    `user_${userId}`, 
    {
      fetcher: async ({ signal }) => {
        const response = await fetch(`/api/users/${userId}`, { signal });
        if (!response.ok) throw new Error('Failed to fetch user');
        return response.json();
      },
      cacheTime: 300000, // 5 minutes
      retry: 2,
      retryDelay: 1000,
      onSuccess: (data) => {
        console.log('User data loaded:', data);
      },
      onError: (error) => {
        console.error('Error loading user:', error);
      },
    }
  );

  // Initial fetch
  useEffect(() => {
    fetchUser();
  }, [userId, fetchUser]);

  // Get cached data (returns null if not in cache)
  const cachedData = getCachedData();

  if (isPending() && !cachedData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{cachedData?.name}</h1>
      <button onClick={() => invalidateCache()}>Refresh</button>
    </div>
  );
}
*/
