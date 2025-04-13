import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { FaRegUserCircle } from "react-icons/fa";

export function NavbarAuth() {
    const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0();

    if (isLoading) return null;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="lg">
                    <FaRegUserCircle size={20} />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="md:hidden">
                <SheetHeader>
                    <SheetTitle>My Account</SheetTitle>
                </SheetHeader>
                <div className="p-4 space-y-4">
                    {isAuthenticated ? (
                        <>
                            <div className="text-lg font-medium">{user.name}</div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => logout({ returnTo: window.location.origin })}
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
