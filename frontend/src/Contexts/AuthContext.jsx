// src/contexts/AuthContext.jsx
import  { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { getCurrentUser } from "@/utils/functions/authUtils.js";
import { useError } from "@/contexts/ErrorContext.jsx";  // ← import throwError

// 🔍 Simple dev‐only logger helpers -----------------------------------------
const isDevMode = import.meta.env.MODE === "development";
const devLog = (...args) => {
    if (isDevMode) console.log("[AuthContext]", ...args);
};
// --------------------------------------------------------------------------

// 1️⃣ Create the context
export const AuthContext = createContext({
    user: null,            // your backend user document
    auth0User: null,       // raw Auth0 profile
    isAuthenticated: false,
    loadingProfile: true,
    isDev: false,
    login: () => {},
    signup: () => {},
    logout: () => {},
    getToken: async () => "",
    refreshUser: async () => {},
});

// 2️⃣ Wrap with Auth0Provider at the root of the app
export function AuthProvider({ children }) {
    devLog("Bootstrapping AuthProvider", {
        domain:   import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    });

    return (
        <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_DOMAIN}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience:     import.meta.env.VITE_AUTH0_AUDIENCE,  // ← ensure API audience is always used
            }}
        >
            <InnerAuthProvider>{children}</InnerAuthProvider>
        </Auth0Provider>
    );
}
AuthProvider.propTypes = { children: PropTypes.node.isRequired };

// 3️⃣ Inner provider bridging Auth0 → your backend user model
function InnerAuthProvider({ children }) {
    const {
        user: auth0User,
        isAuthenticated,
        isLoading: auth0Loading,
        loginWithRedirect,
        logout: auth0Logout,
        getAccessTokenSilently,
    } = useAuth0();

    const { throwError } = useError();  // ← grab throwError

    const [user, setUser] = useState(null);
    const [loadingProfile, setLoading] = useState(true);

    // Fetch your backend user whenever Auth0 state changes
    useEffect(() => {
        devLog("Auth0 status", { auth0Loading, isAuthenticated });

        if (auth0Loading) {
            setLoading(true);
            return;
        }

        if (isAuthenticated) {
            (async () => {
                try {
                    // 🪪 Grab a token (now automatically your API RS256 token)
                    const token = await getAccessTokenSilently();
                    devLog(
                        "Fetched access token →",
                        token ? token.substring(0, 15) + "…" : "undefined"
                    );

                    // 📨 Call your API
                    const backendUser = await getCurrentUser(getAccessTokenSilently);
                    devLog("Loaded backend user", backendUser);
                    setUser(backendUser);
                } catch (err) {
                    // Navigate to centralized error page
                    throwError(err, {
                        city:    "Rome",
                        message: "Unable to load your account",
                        detailed: err.message,
                    });
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            })();
        } else {
            devLog("User signed out / not authenticated → clearing context");
            setUser(null);
            setLoading(false);
        }
    }, [auth0Loading, isAuthenticated, getAccessTokenSilently, throwError]);

    const value = {
        user,
        auth0User,
        isAuthenticated,
        loadingProfile,
        isDev: user?.roles?.includes("dev") ?? false,

        // 🔑 Auth helpers -------------------------------------------------------
        login: (opts) =>
            loginWithRedirect({
                authorizationParams: { screen_hint: "login" },
                ...opts,
            }),
        signup: (opts) =>
            loginWithRedirect({
                authorizationParams: { screen_hint: "signup" },
                ...opts,
            }),
        logout: (opts) =>
            auth0Logout({ logoutParams: { returnTo: window.location.origin }, ...opts }),

        getToken: getAccessTokenSilently,

        refreshUser: async () => {
            devLog("Manually refreshing backend user");
            try {
                const fresh = await getCurrentUser(getAccessTokenSilently);
                devLog("Refreshed user", fresh);
                setUser(fresh);
            } catch (err) {
                throwError(err, {
                    city:    "Sicily",
                    message: "Failed to refresh your profile",
                    detailed: err.message,
                });
            }
        },
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
InnerAuthProvider.propTypes = { children: PropTypes.node.isRequired };

// 4️⃣ Convenience hook -------------------------------------------------------
export function useAuth() {
    return useContext(AuthContext);
}
