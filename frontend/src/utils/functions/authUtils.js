// ─────────────────────────────────────────────────────────────
//  src/utils/authUtils.js  – central helpers for Auth0 + custom auth
// ─────────────────────────────────────────────────────────────
import axios from "axios";

/* ------------------------------------------------------------------
 *  ENDPOINTS – adjust to your backend
 * ---------------------------------------------------------------- */
const AUTH_API_URL  = "http://localhost:8080/api/auth";   // your optional /login /signup
const USER_API_URL  = "http://localhost:8080/api/users";  // protected by Spring Security

/* ══════════════════════════════════════════════════════════════════
 *  SECTION 1 – Helpers for *your own* JWT that you may store in LS
 * ══════════════════════════════════════════════════════════════════ */
export const getLocalToken   = ()                 => localStorage.getItem("authToken");
export const saveLocalToken  = (token)            => token && localStorage.setItem("authToken", token);
export const clearLocalToken = ()                 => localStorage.removeItem("authToken");

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

/* ══════════════════════════════════════════════════════════════════
 *  SECTION 2 – Auth0 helpers
 * ══════════════════════════════════════════════════════════════════ */

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

/* ══════════════════════════════════════════════════════════════════
 *  SECTION 3 – Fetch current user from your Spring Boot backend
 * ══════════════════════════════════════════════════════════════════ */

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

/* ══════════════════════════════════════════════════════════════════
 *  SECTION 4 – Optional: Axios instance that auto‑injects Auth0 token
 *              (uncomment if you prefer this pattern)
 * ══════════════════════════════════════════════════════════════════ */

// import { getAuth0AccessToken as getToken } from "./authUtils"; // self‑import is fine
// export const api = axios.create({ baseURL: "http://localhost:8080" });
//
// api.interceptors.request.use(async (config) => {
//   if (config.url?.startsWith("/api")) {
//     const token = await getToken(getAccessTokenSilentlyGlobal);
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

