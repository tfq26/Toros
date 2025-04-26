// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
    getCurrentUser,
    updateCurrentUser,
} from "@/utils/functions/authUtils.js";

export function useAuth() {
    const {
        isAuthenticated,
        user: auth0User,
        getAccessTokenSilently,
        loginWithRedirect,
        logout: auth0Logout,
        isLoading: auth0Loading,
    } = useAuth0();

    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [error, setError] = useState(null);

    // Fetch our own /api/users/me profile whenever auth state changes
    const refreshProfile = useCallback(async () => {
        if (!isAuthenticated) {
            setProfile(null);
            setLoadingProfile(false);
            return;
        }
        setLoadingProfile(true);
        setError(null);
        try {
            const data = await getCurrentUser(getAccessTokenSilently);
            setProfile(data);
        } catch (err) {
            console.error("Failed to fetch profile", err);
            setError(err);
            setProfile(null);
        } finally {
            setLoadingProfile(false);
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    useEffect(() => {
        refreshProfile();
    }, [refreshProfile]);

    // Push partial updates to our /api/users/me endpoint
    const updateProfile = useCallback(
        async (updates) => {
            try {
                const updated = await updateCurrentUser(
                    getAccessTokenSilently,
                    updates
                );
                setProfile(updated);
                return updated;
            } catch (err) {
                console.error("Failed to update profile", err);
                throw err;
            }
        },
        [getAccessTokenSilently]
    );

    // Helpers
    const login = () =>
        loginWithRedirect({
            // optional: you can pass screen_hint: "signup" here, or audience, scopes, etc.
        });
    const logout = () =>
        auth0Logout({
            returnTo: window.location.origin,
        });
    const getAccessToken = () => getAccessTokenSilently();

    // Check developer role
    const isDev = profile?.role?.toUpperCase() === "DEV";

    return {
        // From Auth0
        isAuthenticated,
        auth0User,
        auth0Loading,
        // Our backend profile
        profile,
        loadingProfile,
        error,
        // Permissions
        isDev,
        // Actions
        login,
        logout,
        getAccessToken,
        refreshProfile,
        updateProfile,
    };
}
