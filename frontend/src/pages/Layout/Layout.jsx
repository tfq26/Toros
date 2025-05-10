// src/components/Layout.jsx
import React from "react";
import { NotificationProvider } from "../../utils/NotificationProvider.jsx"; // Adjust path as needed
import { NavbarUpdated } from "@/components/Navbar/NavbarUpdated.jsx";
import PropTypes from "prop-types"; // Adjust path as needed
import { ThemeProvider } from "@/contexts/ThemeContext.jsx"; // Import the ThemeProvider
import { mainNavigation } from "@/Routing/Navigation.js"; // Import the navigation data

export default function Layout({ children }) {
    return (
        <ThemeProvider>
            <NotificationProvider>
                <div className="flex flex-col min-h-screen overflow-hidden">
                    <header className="sticky top-0 z-50 bg-transparent px-4 py-2 shadow-md">
                        <NavbarUpdated menu={mainNavigation} /> {/* Pass the menu prop */}
                    </header>

                    <main className="flex-grow overflow-hidden px-4 py-6">
                        {children}
                    </main>
                </div>
            </NotificationProvider>
        </ThemeProvider>
    );
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};