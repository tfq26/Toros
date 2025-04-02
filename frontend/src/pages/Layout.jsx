import React from "react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar.jsx";
import { NavbarUpdated } from "@/pages/NavbarUpdated.jsx";
import { Toaster } from "sonner";
import { Label } from "@/components/ui/label.jsx";
import { Link } from "react-router-dom";

function LayoutContent({ children }) {
    const { open } = useSidebar();

    return (
        <div className="relative flex h-screen w-screen flex-col">
            {/* Global Navbar Trigger (fixed at the top) */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-md">
                <div className="relative max-w-7xl mx-auto px-4 py-1">
                    {/* Sidebar trigger positioned to the left */}
                    <SidebarTrigger className="absolute left-4 top-1/2 transform -translate-y-1/2 hover:bg-muted/0 hover:scale-110 transition duration-300 ease-in-out" />
                    {/* Centered Title */}
                    <div className="flex justify-center">
                        <Label htmlFor="Title" className="my-4 sm:text-lg md:text-xl lg:text-2xl">
                            <Link
                                to="/"
                                className="hover:scale-110 transition duration-300 ease-in-out"
                            >
                                Toros
                            </Link>
                        </Label>
                    </div>
                </div>
            </header>

            {/* Content Container - top padding accounts for fixed header */}
            <div className="pt-16 flex h-full">
                {/* Always render Sidebar, change its width based on `open` */}
                <aside
                    style={{ willChange: "width" }}
                    className={`bg-emerald-400 dark:bg-gray-950
                     transition-[width] duration-600 ease-in-out flex-shrink-0
                      overflow-hidden pt-20 ${
                        open ? "sm:w-12 md:w-16 lg:w-20 xl:w-24" : "w-0"
                    }`}
                >
                    <NavbarUpdated />
                </aside>

                {/* Main content */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
            <Toaster />
        </div>
    );
}

const Layout = ({ children }) => (
    <SidebarProvider>
        <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
);

export default Layout;
