import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { FaRegUserCircle } from "react-icons/fa";

export function NavbarAuth() {
    const {
        isAuthenticated,
        isLoading,
        user,
        loginWithRedirect,
        logout,
    } = useAuth0();

    const navigate = useNavigate();

    if (isLoading) return null;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="lg">
                    <FaRegUserCircle size={20} />
                </Button>
            </SheetTrigger>

            <SheetContent side="right" aria-describedby="navbar-auth-sheet-desc">
                <SheetHeader>
                    <SheetTitle>My Account</SheetTitle>
                    <SheetDescription id="navbar-auth-sheet-desc">
                        {isAuthenticated
                            ? `Signed in as ${user.name}`
                            : "Sign in or sign up to access your account"}
                    </SheetDescription>
                </SheetHeader>

                <div className="p-4 space-y-4">
                    {isAuthenticated ? (
                        <>
                            <div className="text-lg font-medium">{user.name}</div>

                            {/* Profile button */}
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate("/profile")}
                            >
                                View Profile
                            </Button>

                            {/* Logout button */}
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                    logout({ returnTo: window.location.origin })
                                }
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => loginWithRedirect({ screen_hint: "login" })}
                            >
                                Login
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => loginWithRedirect({ screen_hint: "signup" })}
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
