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
    SidebarRail, useSidebar,
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
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.jsx";
import {cn} from "@/lib/utils.js";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.jsx";
import {LoginFooter} from "@/pages/Auth/LoginFooter.jsx"; // Import our hook

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
        <Sidebar {...props} className={"bg-emerald-400 dark:bg-gray-950"}>
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
                            className="mx-4 mb-10 w-[90%] hover:scale-105 transition duration-300 ease-in-out text-xl"
                        >
                            Dev Tools
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {/* Existing Dropdown Menu */}
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    className="m-4 w-[90%] hover:scale-105 transition duration-300 ease-in-out
                                     text-xl hover:bg-emerald-200 dark:hover:bg-gray-700 mx-auto"
                                >
                                    <User2 /> Username
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" className="w-[--radix-popper-anchor-width]">
                                <LoginFooter/>
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


// function Sidebar({
//                      side = "left",
//                      variant = "sidebar",
//                      collapsible = "offcanvas",
//                      className,
//                      children,
//                      ...props
//                  }) {
//     const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
//
//     if (collapsible === "none") {
//         return (
//             (<div
//                 data-slot="sidebar"
//                 className={cn(
//                     "dark:bg-gray-800 text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
//                     className
//                 )}
//                 {...props}>
//                 {children}
//             </div>)
//         );
//     }
//
//     if (isMobile) {
//         return (
//             (<Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
//                 <SheetContent
//                     data-sidebar="sidebar"
//                     data-slot="sidebar"
//                     data-mobile="true"
//                     className="dark:bg-gray-800 text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
//                     style={
//                         {
//                             "--sidebar-width": SIDEBAR_WIDTH_MOBILE
//                         }
//                     }
//                     side={side}>
//                     <SheetHeader className="sr-only">
//                         <SheetTitle>Sidebar</SheetTitle>
//                         <SheetDescription>Displays the mobile sidebar.</SheetDescription>
//                     </SheetHeader>
//                     <div className="flex h-full w-full flex-col">{children}</div>
//                 </SheetContent>
//             </Sheet>)
//         );
//     }
//
//     return (
//         (<div
//             className="group peer text-sidebar-foreground hidden md:block "
//             data-state={state}
//             data-collapsible={state === "collapsed" ? collapsible : ""}
//             data-variant={variant}
//             data-side={side}
//             data-slot="sidebar">
//             {/* This is what handles the sidebar gap on desktop */}
//             <div
//                 data-slot="sidebar-gap"
//                 className={cn(
//                     "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
//                     "group-data-[collapsible=offcanvas]:w-0",
//                     "group-data-[side=right]:rotate-180",
//                     variant === "floating" || variant === "inset"
//                         ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
//                         : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
//                 )} />
//             <div
//                 data-slot="sidebar-container"
//                 className={cn(
//                     "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-500 ease-linear md:flex",
//                     side === "left"
//                         ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
//                         : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
//                     // Adjust the padding for floating and inset variants.
//                     variant === "floating" || variant === "inset"
//                         ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
//                         : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
//                     className
//                 )}
//                 {...props}>
//                 <div
//                     data-sidebar="sidebar"
//                     data-slot="sidebar-inner"
//                     className="dark:bg-gray-800 group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm">
//                     {children}
//                 </div>
//             </div>
//         </div>)
//     );
// }