import axios from 'axios';

/**
 * Creates a secure Axios API client.
 * This client automatically adds the JWT Authorization header to every request.
 * @param {() => Promise<string>} getToken - The function to get the access token from the AuthContext.
 * @returns {import('axios').AxiosInstance} - A configured instance of Axios.
 */
export const createApiClient = (getToken) => {
    // Create a new Axios instance with a base URL if you have one
    const apiClient = axios.create({
        baseURL: 'http://localhost:8080/api', // Your backend's base URL
    });

    // Use an interceptor to add the token to every request
    apiClient.interceptors.request.use(async (config) => {
        try {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Could not get access token for request", error);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    return apiClient;
};
