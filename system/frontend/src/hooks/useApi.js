import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Create a custom axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally (e.g., show notifications)
    const message = error.response?.data?.message || error.message;
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// Custom hook for GET requests
export function useFetch(queryKey, url, options = {}) {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data } = await api.get(url);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}

// Custom hook for POST, PUT, DELETE requests
export function useApiMutation(method, url, options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api({
        method,
        url,
        data,
      });
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch relevant queries
      if (options.invalidateQueries) {
        queryClient.invalidateQueries(options.invalidateQueries);
      }
      
      // Call the success callback if provided
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      console.error('Mutation error:', error);
      
      // Call the error callback if provided
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
}

// Example usage in a component:
/*
// For fetching data
const { data, isLoading, error } = useFetch('tournaments', '/tournaments');

// For mutations
const { mutate: createTournament, isLoading: isCreating } = useApiMutation('post', '/tournaments', {
  onSuccess: () => {
    // Handle success (e.g., show notification, redirect)
  },
  invalidateQueries: ['tournaments'] // Refetch tournaments after mutation
});

// Then call it: createTournament(tournamentData);
*/
