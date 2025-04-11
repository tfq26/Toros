import axios from "axios";

const API_URL = "http://localhost:8080/api/auth"; // ✅ Updated to match backend changes

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        return response.data; // Returns the token
    } catch (error) {
        throw new Error(error.response?.data || "Login failed. Please try again.");
    }
};

export const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, userData);
        return response.data; // Success message
    } catch (error) {
        throw new Error(error.response?.data || "Signup failed. Please try again.");
    }
};

export const logout = () => {
    localStorage.removeItem("authToken"); // ✅ Clear the token
};

export const getAuthToken = () => {
    return localStorage.getItem("authToken"); // ✅ Retrieve token
};
