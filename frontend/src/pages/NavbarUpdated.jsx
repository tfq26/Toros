import React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu.jsx";
import { ChevronsUpDown, ChevronRight, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label.jsx";
import useDevTools from "@/pages/DevTools/DevTools.jsx";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.jsx"; // Import our hook

const data = {
    versions: ["1.0.1", "1.1.0", "2.0.0"],
    navMain: [
        {
            title: "General",
            items: [
                { title: "Players", url: "/players" },
                { title: "Match Test", url: "/test-matches" },
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

export function NavbarUpdated(props) {
    const { openDevTools } = useDevTools();

    return (
        <Sidebar {...props} className={"bg-emerald-400 dark:bg-gray-800"}>
            <SidebarHeader className="h-24">
                <Label htmlFor="Title" className="mx-auto my-4 text-2xl">
                    <Link to="/" className="hover:scale-110 transition duration-300 ease-in-out">
                        Toros
                    </Link>
                </Label>
            </SidebarHeader>
            <SidebarContent className="gap-0">
                {data.navMain.map((group) => (
                    <Collapsible key={group.title} defaultOpen className="group/collapsible">
                        <SidebarGroup>
                            <SidebarGroupLabel
                                asChild
                                className="group/label text-sidebar-foreground text-2xl mb-2"
                            >
                                <CollapsibleTrigger>
                                    {group.title}
                                    <ChevronRight className="ml-auto hover:scale-105 duration-300 ease-in-out transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {group.items.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    className="m-4 w-[90%] hover:scale-105 transition duration-300 ease-in-out text-xl hover:bg-emerald-200 dark:hover:bg-gray-700"
                                                >
                                                    <a href={item.url}>{item.title}</a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                ))}
            </SidebarContent>
            <SidebarFooter className="w-full">
                <SidebarMenu>
                    {/* Dev Tools Button */}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={(e) => {
                                e.preventDefault();
                                openDevTools();
                            }}
                            className="m-4 w-[90%] hover:scale-105 transition duration-300 ease-in-out text-xl"
                        >
                            Dev Tools
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {/* Existing Dropdown Menu */}
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> Username
                                    <ChevronsUpDown />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="/auth/login">Login</a>
                                    </SidebarMenuButton>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

export default NavbarUpdated;