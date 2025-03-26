import * as React from "react";
import {ChevronsUpDown , ChevronRight , User2} from "lucide-react";
import { Link } from "react-router-dom";
import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail, SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Label} from "@/components/ui/label.jsx";

// Navigation data updated to match AppRoutes
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
                { title: "Tournament List", url: "/tournament/list" },
                { title: "Bracket", url: "/bracket" },
                // Note: The live tournament route includes a dynamic parameter.
                // You might need to adjust this if you want a specific live tournament link.
            ],
        },
        // {
        //     title: "Authentication",
        //     items: [
        //         { title: "Login", url: "/auth/login" },
        //         { title: "Signup", url: "/auth/signup" },
        //     ],
        // },
    ],
};

export function NavbarUpdated(props) {
    return (
        <Sidebar {...props}>
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
                                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-2xl m-4"
                            >
                                <CollapsibleTrigger>
                                    {group.title}
                                    <ChevronRight className="ml-auto hover:scale-105 transition duration-300 ease-in-out transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {group.items.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild className={"m-4 text-xl w-[90%] hover:scale-105 transition duration-300 ease-in-out fade-in-5"}>
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
            <SidebarFooter className={"w-full"}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className={"m-4 text-xl w-[90%] hover:scale-105 transition duration-300 ease-in-out fade-in-5"}>
                                    <User2 /> Username
                                    <ChevronsUpDown/>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="/auth/Login">Login</a>
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
