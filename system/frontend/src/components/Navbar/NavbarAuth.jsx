import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { LogOut, User, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// A helper to get initials from a name
const getInitials = (name = "") => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

export function NavbarAuth({ mobile = false }) {
    const { isAuthenticated, login, signup, logout, user } = useAuth();
    const { theme, setTheme } = useTheme();

    // If the user is authenticated, show their profile picture in a dropdown menu.
    if (isAuthenticated && user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user.picture} alt={user.name || "User"} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link to="/profile">
                            <User className="mr-2 h-4 w-4" />
                            <span>View Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                        {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                        <span>Toggle Theme</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    // If not authenticated, show Login and Sign Up buttons.
    // The 'mobile' prop can be used to adjust styles for the mobile sheet.
    return (
        <div className={`flex items-center gap-2 ${mobile ? 'flex-col w-full' : ''}`}>
            <Button variant="ghost" onClick={() => login()} className={mobile ? 'w-full' : ''}>
                Log In
            </Button>
            <Button onClick={() => signup()} className={mobile ? 'w-full' : ''}>
                Sign Up
            </Button>
        </div>
    );
}

NavbarAuth.propTypes = {
    mobile: PropTypes.bool,
};
