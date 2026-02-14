// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getCurrentUserWithToken } from "@/utils/functions/authUtils.js";
import { useError } from "@/contexts/ErrorContext.jsx";

// 🔍 Simple dev‐only logger helpers
const isDevMode = import.meta.env.MODE === "development";
const devLog = (...args) => {
    if (isDevMode) console.log("[AuthContext]", ...args);
};

// 1️⃣ Create the context
export const AuthContext = createContext({
    user: null,            // your backend user document
    workosUser: null,      // raw WorkOS profile
    isAuthenticated: false,
    loadingProfile: true,
    isDev: false,
    login: () => { },
    signup: () => { },
    logout: () => { },
    getToken: async () => "",
    refreshUser: async () => { },
});

export function AuthProvider({ children }) {
    const { setError } = useError();
    const [user, setUser] = useState(null);
    const [workosUser, setWorkosUser] = useState(null);
    const [loadingProfile, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // TODO: Implement WorkOS logic when variables are provided
    // For now, we'll keep a skeleton that allows the app to run without Auth0 errors.

    useEffect(() => {
        devLog("Bootstrapping WorkOS AuthProvider");
        // Mocking for now to allow development to continue
        setLoading(false);
    }, []);

    const value = {
        user,
        workosUser,
        isAuthenticated,
        loadingProfile,
        isDev: user?.role === "ADMIN",
        login: () => {
            // Placeholder for WorkOS login redirect or embedded modal
            console.log("Login triggered");
        },
        signup: () => {
            console.log("Signup triggered");
        },
        logout: () => {
            console.log("Logout triggered");
            setUser(null);
            setIsAuthenticated(false);
        },
        getToken: async () => "mock-token",
        refreshUser: async () => {
            devLog("Manually refreshing backend user");
        },
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired };

// 4️⃣ Convenience hook
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
