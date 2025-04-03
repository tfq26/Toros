import React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar.jsx";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu.jsx";
import { ChevronRight, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label.jsx";
import useDevTools from "@/pages/DevTools/DevTools.jsx";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible.jsx";
import { LoginFooter } from "@/pages/Auth/LoginFooter.jsx";
import { motion } from "framer-motion";

// Data for the navigation groups
const data = {
    versions: ["1.0.1", "1.1.0", "2.0.0"],
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

// Variants for menu items
const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

// New component for a collapsible group
function CollapsibleGroup({ group }) {
    // Local state for the collapsible open/closed state
    const [isOpen, setIsOpen] = React.useState(true);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel asChild className="group/label text-foreground-sidebar mt-1">
                    <CollapsibleTrigger
                        as={motion.button}
                        className="flex items-center justify-between w-full p-4 text-base sm:text-lg md:text-xl lg:text-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        {group.title}
                        <motion.div
                            className="ml-auto"
                            animate={{ rotate: isOpen ? 90 : 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <ChevronRight />
                        </motion.div>
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {group.items.map((item, index) => (
                                <SidebarMenuItem key={item.title}>
                                    <motion.div
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <SidebarMenuButton
                                            asChild
                                            className="m-1 w-auto h-auto px-2 py-2 hover:scale-105 transition duration-300 ease-in-out text-base hover:bg-emerald-200 dark:hover:bg-gray-700"
                                        >
                                            <Link to={item.url} className="whitespace-normal break-words">
                                                {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    </motion.div>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}

export function NavbarUpdated(props) {
    const { openDevTools } = useSidebar();

    return (
        <Sidebar {...props} className="flex flex-col h-full">
            {/* Main content of the sidebar */}
            <div className="flex-grow">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <SidebarContent className="gap-5">
                        {data.navMain.map((group) => (
                            <CollapsibleGroup key={group.title} group={group} />
                        ))}
                    </SidebarContent>
                </motion.div>
            </div>
            {/* Footer always at the bottom */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <SidebarFooter className="w-full">
                    <SidebarMenu className="space-y-4">
                        <SidebarMenuItem>
                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ duration: 0.3 }}
                            >
                                <SidebarMenuButton
                                    onClick={(e) => {
                                        e.preventDefault();
                                        openDevTools();
                                    }}
                                    className="bg-red-600/50 w-[90%] hover:bg-red-700/50 hover:scale-105 transition duration-300 ease-in-out text-base"
                                >
                                    <span className="mx-auto">Dev Tools</span>
                                </SidebarMenuButton>
                            </motion.div>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton className="m-2 w-[90%] hover:scale-105 transition duration-300 ease-in-out text-base hover:bg-emerald-200 dark:hover:bg-gray-700 mx-auto">
                                            <User2 className="mr-2" />
                                            Username
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        side="right"
                                        className="w-[--radix-popper-anchor-width]"
                                    >
                                        <LoginFooter />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </motion.div>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </motion.div>
            <SidebarRail />
        </Sidebar>
    );
}
