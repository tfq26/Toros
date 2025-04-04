import React from "react";
import { Toaster } from "sonner";
import { MenubarNav } from "@/pages/Navbar/MenubarNav.jsx";

function LayoutContent({ children }) {
    return (
        <div className="relative flex h-screen w-screen flex-col">
            {/* Header with integrated Menubar */}
            <header className="fixed top-0 left-0 w-full z-50 bg-none h-16 flex items-center">
                <div className="relative max-w-7xl mx-auto px-4 w-full">
                    <MenubarNav />
                </div>
            </header>
            {/* Main content container with top padding to account for header */}
            <main className="flex-1 overflow-auto pt-16">{children}</main>
            <Toaster />
        </div>
    );
}

const Layout = ({ children }) => <LayoutContent>{children}</LayoutContent>;

export default Layout;
