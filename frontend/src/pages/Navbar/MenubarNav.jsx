// src/components/MenubarNav.jsx
import React from "react";
import { Link } from "react-router-dom";
import { User2 } from "lucide-react";
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { MenubarAuth } from "@/pages/Auth/MenubarAuth.jsx";

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
    const [isDarkMode, setIsDarkMode] = React.useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    React.useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (event) => setIsDarkMode(event.matches);
        mediaQuery.addEventListener("change", handleChange);
        setIsDarkMode(mediaQuery.matches);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const imgSrc = isDarkMode ? "/bull-svgrepo-com.svg" : "/bull-svgrepo-com_black.svg";

    return (
        <Menubar className="flex items-center w-full h-18 dark:bg-gray-900 mt-8 bg-gray-100 shadow-md rounded-lg">
            {/* Brand Logo */}
            <MenubarMenu>
                <Button className="bg-transparent dark:bg-gray-900 hover:bg-transparent shadow-none w-fit p-0 ml-8 text-gray-100">
                    <Link to="/" className="text-gray-950 text-lg md:text-xl lg:text-2xl font-bold px-4">
                        <img
                            src={imgSrc}
                            alt="Brand Logo"
                            className="cursor-pointer transition-transform duration-200 ease-in-out size-10"
                        />
                    </Link>
                </Button>
            </MenubarMenu>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Navigation Menus */}
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

            {/* Auth Section in Menubar */}
            <MenubarMenu>
                <MenubarTrigger className="px-4 flex items-center">
                    <User2 className="mr-2" />
                    <span>Account</span>
                </MenubarTrigger>
                <MenubarContent>
                    <MenubarAuth />
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}
