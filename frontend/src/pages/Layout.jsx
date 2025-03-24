import React from "react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar.jsx";
import { NavbarUpdated } from "@/pages/NavbarUpdated.jsx";

function LayoutContent({ children }) {
    const { open } = useSidebar();

    return (
        <div className="relative flex h-screen w-screen">
            {/* Floating toggle button */}
            <div className="absolute top-4 left-4 z-50">
                <SidebarTrigger className={"hover:bg-muted/0"} />
            </div>

            {/* Sidebar (left) */}
            <aside className={`transition-width duration-200 ease-in-out flex-shrink-0 overflow-hidden ${open ? "w-64" : "w-0"}`}>
                {open && <NavbarUpdated />}
            </aside>

            {/* Main content (right) */}
            <main className="flex-1 overflow-auto bg-gray-800 p-6">
                {children}
            </main>
        </div>
    );
}

const Layout = ({ children }) => (
    <SidebarProvider>
        <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
);

export default Layout;
