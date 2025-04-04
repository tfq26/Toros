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
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoginMenuItem } from "@/pages/Auth/LoginFooter.jsx";
import useDevTools from "@/pages/DevTools/DevTools.jsx";

// Navigation data
const data = {
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
    const { openDevTools } = useDevTools();

    return (
        <Menubar className="flex items-center w-full h-18 dark:bg-gray-900">
            {/* Brand: Toros */}
            <MenubarMenu>
                <MenubarTrigger className="px-4 flex items-center hover:bg-none">
                    <Link
                        to="/"
                        className="text-lg md:text-xl lg:text-2xl font-bold px-4"
                    >
                        Toros
                    </Link>
                </MenubarTrigger>
            </MenubarMenu>

            {/* Spacer between brand and nav items */}
            <div className="flex-1" />

            {/* Navigation Menus */}
            {data.navMain.map((group) => (
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

            {/* Dev Tools Menu */}
            <MenubarMenu>
                <MenubarTrigger className="px-4">Dev Tools</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem
                        onClick={(e) => {
                            e.preventDefault();
                            openDevTools();
                        }}
                    >
                        Open Dev Tools
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            {/* User Menu */}
            <MenubarMenu>
                <MenubarTrigger className="px-4 flex items-center">
                    <User2 className="mr-2" />
                    Username
                </MenubarTrigger>
                <MenubarContent>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <LoginMenuItem />
                        </DropdownMenuTrigger>
                    </DropdownMenu>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}
