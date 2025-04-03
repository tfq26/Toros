import React from "react";
import { Link } from "react-router-dom";
import { User2 } from "lucide-react";
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem
} from "@/components/ui/menubar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {LoginFooter, LoginMenuItem} from "@/pages/Auth/LoginFooter.jsx";
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
        <Menubar>
            {data.navMain.map((group) => (
                <MenubarMenu key={group.title}>
                    <MenubarTrigger>{group.title}</MenubarTrigger>
                    <MenubarContent>
                        {group.items.map((item) => (
                            <MenubarItem key={item.title}>
                                <Link to={item.url} className={'w-full'}>{item.title}</Link>
                            </MenubarItem>
                        ))}
                    </MenubarContent>
                </MenubarMenu>
            ))}

            <MenubarMenu>
                <MenubarTrigger>Dev Tools</MenubarTrigger>
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

            <MenubarMenu>
                <MenubarTrigger>
                    <User2 className="mr-2" />
                    Username
                </MenubarTrigger>
                <MenubarContent>
                    {/* Wrap the LoginFooter in a DropdownMenu so that its internal MenuItems have context */}
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
