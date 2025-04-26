import axios from "axios";

const AUTH_API_URL  = "http://localhost:8080/api/auth";   // your optional /login /signup
const USER_API_URL  = "http://localhost:8080/api/users";  // protected by Spring Security

export const getLocalToken   = ()=> localStorage.getItem("authToken");
export const saveLocalToken  = (token)=> token && localStorage.setItem("authToken", token);
export const clearLocalToken = ()=> localStorage.removeItem("authToken");

/* Optional custom login / signup (only if your API exposes them) */
export const login = async (username, password) => {
    const { data } = await axios.post(`${AUTH_API_URL}/login`, { username, password });
    saveLocalToken(data.token);      // backend should return { token: "<jwt>" }
    return data.token;
};

export const signup = async (userData) => {
    const { data } = await axios.post(`${AUTH_API_URL}/signup`, userData);
    return data;                     // created user / success message
};

/** Get Auth0 access‑token using the React SDK helper */
export const getAuth0AccessToken = async (getAccessTokenSilently) => {
    if (typeof getAccessTokenSilently !== "function") {
        throw new Error("getAccessTokenSilently was not provided.");
    }
    try {
        // add { audience: "https://Toros/api" } here if you configured one
        return await getAccessTokenSilently();
    } catch (err) {
        console.error("❌ Unable to retrieve Auth0 access token:", err);
        throw new Error("Auth0 authentication failed.");
    }
};

/**
 *  (a)  Call when you ALREADY have the JWT string.
 *       Adds Authorization header → /api/users/me
 */
export const getCurrentUserWithToken = async (token) => {
    if (!token) throw new Error("Auth0 token missing.");

    try {
        const { data } = await axios.get(`${USER_API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;                  // full User document
    } catch (err) {
        console.error("❌ Error fetching current user:", err);
        throw new Error("Failed to fetch user profile.");
    }
};

/**
 *  (b)  Convenience when you only have Auth0’s getAccessTokenSilently()
 *       Calls (a) under the hood.
 */
export const getCurrentUser = async (getAccessTokenSilently) => {
    const token = await getAuth0AccessToken(getAccessTokenSilently);
    return getCurrentUserWithToken(token);
};

/**
 * (c) Call when you ALREADY have the JWT string.
 *     Sends a PATCH to /api/users/me with the profile fields.
 *
 * @param {string} token       – Auth0 access token
 * @param {object} profileData – { firstName, lastName, email, phone, bio, skillLevel }
 * @returns {Promise<object>}  – the updated User document
 */
export const updateCurrentUserWithToken = async (token, profileData) => {
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
};

/**
 * (d) Convenience when you only have Auth0’s getAccessTokenSilently():
 *     fetches the token then calls the patch.
 *
 * @param {function} getAccessTokenSilently
 * @param {object}   profileData
 */
export const updateCurrentUser = async (getAccessTokenSilently, profileData) => {
    const token = await getAuth0AccessToken(getAccessTokenSilently);
    return updateCurrentUserWithToken(token, profileData);
};