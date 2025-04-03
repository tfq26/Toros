import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"; // adjust the import based on your project structure
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { MenubarItem } from "@/components/ui/menubar.jsx";
import { Button } from "@/components/ui/button.jsx"; // adjust the import based on your project structure

export function LoginFooter() {
    const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0();

    // Log isAuthenticated whenever it changes
    useEffect(() => {
        console.log("LoginFooter - isAuthenticated:", isAuthenticated);
    }, [isAuthenticated]);

    if (isLoading) return null; // Optionally show a loading spinner

    if (isAuthenticated) {
        return (
            <DropdownMenuItem>
                <SidebarMenuButton asChild>
                    <div className="flex items-center gap-2">
                        {user?.picture && (
                            <img
                                src={user.picture}
                                alt="User profile"
                                className="w-8 h-8 rounded-full"
                            />
                        )}
                        <span>{user.name}</span>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                logout({ returnTo: window.location.origin });
                            }}
                            className="ml-2 text-sm underline"
                        >
                            Logout
                        </button>
                    </div>
                </SidebarMenuButton>
            </DropdownMenuItem>
        );
    } else {
        return (
            <DropdownMenuItem>
                <SidebarMenuButton asChild className="text-center mx-auto">
                    <a
                        href="/auth/login"
                        onClick={(e) => {
                            e.preventDefault();
                            loginWithRedirect();
                        }}
                    >
                        Login
                    </a>
                </SidebarMenuButton>
            </DropdownMenuItem>
        );
    }
}

export function LoginMenuItem() {
    const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0();

    // Log isAuthenticated whenever it changes
    useEffect(() => {
        console.log("LoginMenuItem - isAuthenticated:", isAuthenticated);
    }, [isAuthenticated]);

    if (isLoading) return null; // Optionally show a loading spinner

    if (isAuthenticated) {
        return (
            <MenubarItem>
                <Button asChild>
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
                </Button>
            </MenubarItem>
        );
    } else {
        return (
            <MenubarItem>
                <Button asChild className="text-center mx-auto w-full">
                    <a
                        href="/auth/login"
                        onClick={(e) => {
                            e.preventDefault();
                            loginWithRedirect();
                        }}
                    >
                        Login
                    </a>
                </Button>
            </MenubarItem>
        );
    }
}
