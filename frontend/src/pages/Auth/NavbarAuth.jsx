import React, { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaRegUserCircle } from "react-icons/fa";
import { cn } from "@/lib/utils";

export function NavbarAuth() {
    const {
        isAuthenticated,
        isLoading,
        user,
        loginWithRedirect,
        logout,
    } = useAuth0();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);
    const contentRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isOpen &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target) &&
                contentRef.current &&
                !contentRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);


    if (isLoading) return null;

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    ref={triggerRef}
                    onClick={() => setIsOpen(!isOpen)} // Toggle on click
                >
                    <FaRegUserCircle size={24} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                ref={contentRef}
                align="end"
                className={cn(
                    "min-w-[200px] bg-popover text-popover-foreground",
                    "border border-border rounded-md shadow-lg",
                    "motion-safe:transition-all motion-safe:duration-200",
                    "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top",
                    "focus:outline-none",
                )}
            >
                {isAuthenticated ? (
                    <>
                        <div className="text-sm font-medium px-2 py-1">
                            {user?.name || user?.email || "User"}
                        </div>
                        <DropdownMenuItem
                            onClick={() => {
                                setIsOpen(false);
                                navigate("/profile");
                            }}
                            className="px-2 rounded-md hover:bg-accent
                            hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                            View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setIsOpen(false);
                                logout({ returnTo: window.location.origin });
                            }}
                            className="px-2 py-1 rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                            Logout
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuItem
                            onClick={() => {
                                setIsOpen(false);
                                loginWithRedirect({ screen_hint: "login" });
                            }}
                            className="p-4 rounded-md hover:bg-accent
                            hover:text-accent-foreground focus:bg-accent
                            focus:text-accent-foreground"
                        >
                            Login
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setIsOpen(false);
                                loginWithRedirect({ screen_hint: "signup" });
                            }}
                            className="p-4 rounded-md hover:bg-accent
                            hover:text-accent-foreground focus:bg-accent
                            focus:text-accent-foreground"
                        >
                            Sign Up
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default NavbarAuth;

