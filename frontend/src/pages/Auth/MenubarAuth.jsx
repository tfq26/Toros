// src/components/MenubarAuth.jsx
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { MenubarItem } from "@/components/ui/menubar.jsx";

export function MenubarAuth() {
    const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0();

    // Log authentication state changes (for debugging)
    useEffect(() => {
        console.log("MenubarAuth - isAuthenticated:", isAuthenticated);
    }, [isAuthenticated]);

    if (isLoading) return null; // Optionally render a spinner

    return isAuthenticated ? (
        <MenubarItem asChild>
            <div className="flex items-center gap-2">
                {user?.picture && (
                    <img
                        src={user.picture}
                        alt="User profile"
                        className="w-8 h-8 rounded-full"
                    />
                )}
                <span>{user.name}</span>
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        logout({ returnTo: window.location.origin });
                    }}
                    className="ml-2 text-sm underline"
                >
                    Logout
                </Button>
            </div>
        </MenubarItem>
    ) : (
        <MenubarItem asChild>
            <Link
                to="/auth/login"
                onClick={(e) => {
                    e.preventDefault();
                    loginWithRedirect();
                }}
                className="text-center"
            >
                Login
            </Link>
        </MenubarItem>
    );
}
