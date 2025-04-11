// src/components/MenubarNav.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User2, Menu, X } from "lucide-react";
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { MenubarAuth } from "@/pages/Auth/MenubarAuth.jsx";
import useDevTools from "@/pages/DevTools/DevTools.jsx"; // Adjust the path as needed

const navData = {
    navMain: [
        {
            title: "General",
            items: [
                { title: "Players", url: "/players" },
                { title: "Viewer", url: "/viewer" },
            ],
        },
        {
            title: "Tournament",
            items: [
                { title: "Setup", url: "/tournament/setup" },
                { title: "My Tournaments", url: "/tournament/list" },
                { title: "Bracket", url: "/bracket" },
            ],
        },
    ],
};

export function MenubarNav() {
    const [isDarkMode, setIsDarkMode] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { openDevTools } = useDevTools();

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (event) => setIsDarkMode(event.matches);
        mediaQuery.addEventListener("change", handleChange);
        // Set initial theme
        setIsDarkMode(mediaQuery.matches);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const imgSrc = isDarkMode
        ? "/bull-svgrepo-com.svg"
        : "/bull-svgrepo-com_black.svg";

    return (
        <>
            <Menubar className="flex items-center justify-between w-full h-18 dark:bg-gray-900 mt-8 bg-gray-100 shadow-md rounded-lg px-4">
                {/* Brand Logo */}
                <div className="flex items-center">
                    <Button className="bg-transparent dark:bg-gray-900 hover:bg-transparent shadow-none w-fit p-0 ml-8">
                        <Link
                            to="/"
                            className="text-gray-950 text-lg md:text-xl lg:text-2xl font-bold px-4"
                        >
                            <img
                                src={imgSrc}
                                alt="Brand Logo"
                                className="cursor-pointer transition-transform duration-200 ease-in-out w-10 h-10"
                            />
                        </Link>
                    </Button>
                </div>

                {/* Desktop Navigation: Visible on md and up */}
                <div className="hidden md:flex items-center space-x-4">
                    {navData.navMain.map((group) => (
                        <MenubarMenu key={group.title}>
                            <MenubarTrigger className="px-4">{group.title}</MenubarTrigger>
                            <MenubarContent>
                                {group.items.map((item) => (
                                    <MenubarItem key={item.title}>
                                        <Link to={item.url} className="w-full">
                                            {item.title}
                                        </Link>
                                    </MenubarItem>
                                ))}
                            </MenubarContent>
                        </MenubarMenu>
                    ))}

                    {/* Auth Section */}
                    <MenubarMenu>
                        <MenubarTrigger className="px-4 flex items-center">
                            <User2 className="mr-2" />
                            <span>Account</span>
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarAuth />
                        </MenubarContent>
                    </MenubarMenu>

                    {/* Dev Tools Menu: Only visible in development mode */}
                    {import.meta.env.DEV && (
                        <MenubarMenu>
                            <MenubarTrigger className="px-4">Dev Tools</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem onClick={openDevTools}>
                                    Open DevTools
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    )}
                </div>

                {/* Mobile Navigation: Hamburger Button visible below md */}
                <div className="md:hidden flex items-center">
                    <Button
                        variant="outline"
                        className="mr-4"
                        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu size={24} />
                    </Button>
                </div>
            </Menubar>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-20 inset-x-0 bg-gray-100 dark:bg-gray-900 shadow-md p-4 z-50">
                    <div className="flex justify-end mb-4">
                        <Button variant="outline" onClick={() => setMobileMenuOpen(false)}>
                            <X size={24} />
                        </Button>
                    </div>
                    <nav className="space-y-6">
                        {/* Navigation Groups */}
                        {navData.navMain.map((group) => (
                            <div key={group.title}>
                                <h3 className="font-bold mb-2 text-gray-950 dark:text-gray-100">
                                    {group.title}
                                </h3>
                                <ul className="space-y-2">
                                    {group.items.map((item) => (
                                        <li key={item.title}>
                                            <Link
                                                to={item.url}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block text-gray-700 dark:text-gray-300 hover:underline"
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Auth Section: Wrapped in Menubar for proper context */}
                        <Menubar>
                            <MenubarMenu>
                                <MenubarTrigger className="w-full text-left font-bold text-gray-950 dark:text-gray-100">
                                    Account
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarAuth />
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>

                        {/* Dev Tools: Only visible in development mode */}
                        {import.meta.env.DEV && (
                            <div className="mt-4">
                                <Button
                                    onClick={() => {
                                        openDevTools();
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Open DevTools
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </>
    );
}
