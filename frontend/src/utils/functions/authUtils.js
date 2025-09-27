// src/utils/authUtils.js
import axios from "axios";

//
// 1) Pull your API base + Auth0 audience from Vite env
//
const API_URL        = import.meta.env.VITE_API_URL        || "http://localhost:8080/api";
const AUTH_API_URL   = `${API_URL}/auth`;   // optional custom login/signup
const USER_API_URL   = `${API_URL}/users`;  // protected by Spring Security
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

//
// 2) Grab an Auth0 access token scoped to your API
//
export async function getAuth0AccessToken(getAccessTokenSilently) {
    if (typeof getAccessTokenSilently !== "function") {
        throw new Error("getAccessTokenSilently was not provided.");
    }
    try {
        return await getAccessTokenSilently({
            audience: AUTH0_AUDIENCE,
            scope:    "openid profile email",
        });
    } catch (err) {
        console.error("❌ Unable to retrieve Auth0 access token:", err);
        throw new Error("Auth0 authentication failed.");
    }
}

//
// 3a) Fetch /users/me given a raw JWT
//
export async function getCurrentUserWithToken(token) {
    if (!token) throw new Error("Auth0 token missing.");
    try {
        const { data } = await axios.get(`${USER_API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000, // Add a 5-second timeout
        });
        return data;
    } catch (err) {
        // More detailed error logging
        if (err.code === 'ECONNABORTED') {
            console.error("❌ Request to fetch user timed out. Is the backend server running?", err.message);
        } else if (err.response) {
            console.error("❌ Server responded with an error:", err.response.status, err.response.data);
        } else if (err.request) {
            console.error("❌ No response received from server:", err.request);
        } else {
            console.error("❌ Error setting up request:", err.message);
        }
        throw new Error(`Failed to fetch user profile. ${err.message}`);
    }
}

//
// 3b) Convenience: get a token then fetch /users/me
//
export async function getCurrentUser(getAccessTokenSilently) {
    const token = await getAuth0AccessToken(getAccessTokenSilently);
    return getCurrentUserWithToken(token);
}

//
// 4a) Update /users/me given a raw JWT
//
export async function updateCurrentUserWithToken(token, profileData) {
    if (!token) throw new Error("Auth0 token missing.");
    try {
        const { data } = await axios.patch(
            `${USER_API_URL}/me`,
            profileData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return data;
    } catch (err) {
        console.error("❌ Error updating user profile:", err);
        throw new Error("Failed to update user profile.");
    }
}

//
// 4b) Convenience: get a token then PATCH /users/me
//
export async function updateCurrentUser(getAccessTokenSilently, profileData) {
    const token = await getAuth0AccessToken(getAccessTokenSilently);
    return updateCurrentUserWithToken(token, profileData);
}

//
// 5) Optional custom /auth endpoints & local-storage helpers
//
export const getLocalToken   = () => localStorage.getItem("authToken");
export const saveLocalToken  = token => token && localStorage.setItem("authToken", token);
export const clearLocalToken = () => localStorage.removeItem("authToken");

export async function login(username, password) {
    const { data } = await axios.post(`${AUTH_API_URL}/login`, { username, password });
    saveLocalToken(data.token);
    return data.token;
}

export async function signup(userData) {
    const { data } = await axios.post(`${AUTH_API_URL}/signup`, userData);
    return data;
}
