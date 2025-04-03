import React from "react";
import { Toaster } from "sonner";
import { Label } from "@/components/ui/label.jsx";
import { Link } from "react-router-dom";
import { MenubarNav } from "@/pages/Navbar/MenubarNav.jsx"; // Adjust path as needed

function LayoutContent({ children }) {
    return (
        <div className="relative flex h-screen w-screen flex-col">
            {/* Combined header with title and menubar nav */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-md h-16 flex items-center">
                <div className="relative max-w-7xl mx-auto px-4 w-full flex items-center">
                    {/* Title */}
                    <Label htmlFor="Title" className="text-lg md:text-xl lg:text-2xl mr-8">
                        <Link
                            to="/"
                            className="hover:scale-110 transition duration-300 ease-in-out"
                        >
                            Toros
                        </Link>
                    </Label>
                    {/* Menubar navigation */}
                    <MenubarNav />
                </div>
            </header>
            {/* Main content container with top padding to account for header */}
            <main className="flex-1 overflow-auto pt-16">
                {children}
            </main>
            <Toaster />
        </div>
    );
}

const Layout = ({ children }) => <LayoutContent>{children}</LayoutContent>;

export default Layout;
