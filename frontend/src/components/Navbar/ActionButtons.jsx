// src/components/layout/ActionButtons.jsx
import "react";
import { Button } from "@/components/ui/button.jsx";
import { VscTools } from "react-icons/vsc";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useTheme } from '@/contexts/ThemeContext.jsx';
import useDevTools from "@/pages/DevTools/DevTools.jsx";
import { NavbarAuth } from "./NavbarAuth.jsx";
import { Sun, Moon } from "lucide-react"; // More semantic icons

export function ActionButtons() {
    const { isDev } = useAuth();
    const { openDevTools } = useDevTools();
    const { theme, toggleDarkMode } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <div className="flex items-center gap-2">
            <NavbarAuth />
            {isDev && (
                <Button variant="outline" size="icon" onClick={openDevTools} aria-label="Open DevTools">
                    <VscTools className="h-4 w-4" />
                </Button>
            )}
            <Button variant="outline" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode">
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
        </div>
    );
}