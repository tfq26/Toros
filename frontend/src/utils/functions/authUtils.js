// src/utils/authUtils.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        return response.data; // usually a token
    } catch (error) {
        throw new Error(error.response?.data || "Login failed. Please try again.");
    }
};

export const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, userData);
        return response.data; // e.g., success message or created user info
    } catch (error) {
        throw new Error(error.response?.data || "Signup failed. Please try again.");
    }
};

export const logout = () => {
    localStorage.removeItem("authToken");
};

export const getAuthToken = () => {
    return localStorage.getItem("authToken");
};

export const getCurrentUser = async (accessToken) => {
    if (!accessToken) {
        throw new Error("No authentication token found.");
    }

    try {
        const response = await axios.get(`${API_URL}/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data; // full user profile
    } catch (error) {
        console.error("Error fetching current user:", error);
        throw new Error("Failed to fetch user profile.");
    }
};
