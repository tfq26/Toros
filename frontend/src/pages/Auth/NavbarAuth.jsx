import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaRegUserCircle } from "react-icons/fa";

export function AccountDropdown() {
    const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0();

    if (isLoading) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <FaRegUserCircle />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {isAuthenticated ? (
                    <>
                        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => logout({ returnTo: window.location.origin })}
                        >
                            Logout
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => loginWithRedirect({ screen_hint: "login" })}
                        >
                            Login
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => loginWithRedirect({ screen_hint: "signup" })}
                        >
                            Sign Up
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
