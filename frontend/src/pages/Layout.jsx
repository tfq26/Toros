import React from "react";
import { NotificationProvider } from "../utils/NotificationProvider.jsx"; // Adjust path as needed
import { MenubarNav } from "@/pages/Navbar/MenubarNav.jsx";
import {NavbarUpdated} from "@/pages/Navbar/NavbarUpdated.jsx"; // Adjust path as needed

function LayoutContent({ children }) {
    return (
        <div className="relative flex h-screen w-screen flex-col">
            {/* Header with integrated Menubar */}
            <header className="fixed top-0 left-0 w-full z-50 bg-none h-16 flex items-center">
                <div className="relative max-w-7xl mx-auto px-4 w-full">
                    <NavbarUpdated />
                </div>
            </header>
            {/* Main content container with top padding to account for header */}
            <main className="flex-1 overflow-auto pt-20 min-h-screen">{children}</main>
        </div>
    );
}

const Layout = ({ children }) => (
    <NotificationProvider>
        <LayoutContent>{children}</LayoutContent>
    </NotificationProvider>
);

export default Layout;
