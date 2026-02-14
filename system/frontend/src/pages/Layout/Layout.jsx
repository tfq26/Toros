// src/pages/Layout/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { NavbarEnhanced } from "@/components/Navbar/NavbarUpdated.jsx";
import { mainNavigation, siteLogo } from "@/Routing/Navigation.js";
import Footer from "./Footer.jsx";
import { useTheme } from '@/contexts/ThemeContext.jsx';
import ErrorHandler from "@/Contexts/Handlers/ErrorHandler.js"; // ✨ NEW: Import the theme hook

export default function Layout() {
    const themeClass = useTheme(); // ✨ NEW: Get the theme class

    return (
        // ✨ UPDATED: The theme class is now applied here
        <div className={`${themeClass} min-h-screen w-full flex flex-col`}>
            <ErrorHandler /> {/* ✨ ADD IT HERE (position doesn't matter much) */}
            <header className="sticky top-0 z-50">
                <NavbarEnhanced menu={mainNavigation} logo={siteLogo} />
            </header>

            <main className="flex-1 w-full overflow-y-auto text-white p-6">
                {/* You can remove this h1, it was likely for testing.
                  <h1>This is from Layout directly</h1>
                */}
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}