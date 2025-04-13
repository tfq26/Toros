import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User2 } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu.jsx";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet.jsx";
import useDevTools from "@/pages/DevTools/DevTools.jsx";
import { AccountDropdown } from "../../pages/Auth/NavbarAuth.jsx"; // adjust the path as needed
import { VscTools } from "react-icons/vsc";

// Default menu data
const defaultMenu = [
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
];

const NavbarUpdated = ({
                           logo = {
                               url: "/",
                               src: "/bull-svgrepo-com_black.svg",
                               darkSrc: "/bull-svgrepo-com.svg", // Provide a dark mode logo; fallback to src if not provided
                               alt: "Logo",
                           },
                           menu = defaultMenu,
                       }) => {
    const { openDevTools } = useDevTools();
    const [isDarkMode, setIsDarkMode] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e) => setIsDarkMode(e.matches);
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    // Choose logo source based on dark mode status.
    const logoSrc = isDarkMode && logo.darkSrc ? logo.darkSrc : logo.src;

    // Desktop Navigation: Renders navigation items using a dropdown NavigationMenu.
    const renderDesktopMenuItem = (item, index) => {
        if (item.items) {
            return (
                <NavigationMenuItem key={`${item.title}-${index}`}>
                    <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-popover text-popover-foreground space-y-4 p-4">
                        {item.items.map((subItem, subIndex) => (
                            <NavigationMenuLink
                                asChild
                                key={`${subItem.title}-${subIndex}`}
                                className="w-80"
                            >
                                <SubMenuLink item={subItem} />
                            </NavigationMenuLink>
                        ))}
                    </NavigationMenuContent>
                </NavigationMenuItem>
            );
        }
        return (
            <NavigationMenuItem key={`${item.title}-${index}`}>
                <NavigationMenuLink
                    href={item.url}
                    className="group inline-flex h-10 items-center
                    justify-center rounded-md bg-background px-4 py-2
                    text-sm font-medium transition-colors hover:bg-muted
                    hover:text-accent-foreground"
                >
                    {item.title}
                </NavigationMenuLink>
            </NavigationMenuItem>
        );
    };

    // Mobile Navigation: Renders items using an Accordion.
    const renderMobileMenuItem = (item, index) => {
        if (item.items) {
            return (
                <AccordionItem key={`${item.title}-${index}`} value={item.title} className="border-b-0">
                    <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
                        {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="mt-2">
                        {item.items.map((subItem, subIndex) => (
                            <SubMenuLink key={`${subItem.title}-${subIndex}`} item={subItem} />
                        ))}
                    </AccordionContent>
                </AccordionItem>
            );
        }
        return (
            <a key={`${item.title}-${index}`} href={item.url} className="text-md font-semibold">
                {item.title}
            </a>
        );
    };

    // Common sub-menu link used in both desktop and mobile menus.
    const SubMenuLink = React.forwardRef(({ item, ...props }, ref) => (
        <a
            ref={ref}
            href={item.url}
            className="flex flex-col gap-6 rounded-md w-fit
             leading-normal no-underline transition-colors
              outline-none select-none hover:bg-muted
               hover:text-accent-foreground"
            {...props}
        >
            {item.icon && <div className="text-foreground">{item.icon}</div>}
            <div>
                <div className="flex text-sm font-semibold p-2">{item.title}</div>
                {item.description && (
                    <p className="flex text-sm leading-normal text-muted-foreground">
                        {item.description}
                    </p>
                )}
            </div>
        </a>
    ));
    SubMenuLink.displayName = "SubMenuLink";

    return (
        <header className="w-full relative">
            <nav className="flex items-center justify-between px-4 py-2">
                {/* Logo with dark mode switching */}
                <div className="flex items-center gap-2">
                    <a href={logo.url} className="flex items-center gap-2">
                        <img src={logoSrc} alt={logo.alt} className="h-8" />
                        <span className="text-lg font-semibold tracking-tighter">
              {logo.title}
            </span>
                    </a>
                </div>
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {menu.map((item, index) => renderDesktopMenuItem(item, index))}
                        </NavigationMenuList>
                    </NavigationMenu>
                    <div className="flex items-center gap-2">
                        {/* Replace login/signup buttons with the unified AccountDropdown */}
                        <AccountDropdown />
                        {import.meta.env.DEV && (
                            <Button variant="outline" size="sm" onClick={openDevTools}>
                                Dev Tools
                            </Button>
                        )}
                    </div>
                </div>
                {/* Mobile Navigation using Sheet */}
                <div className="md:hidden flex items-center">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu size={24} />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>
                                    <a href={logo.url} className="flex items-center gap-2">
                                        <img src={logoSrc} alt={logo.alt} className="h-8" />
                                        <span className="text-lg font-semibold tracking-tighter">
                      {logo.title}
                    </span>
                                    </a>
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-6 p-4">
                                <Accordion type="single" collapsible className="flex w-full flex-col gap-4">
                                    {menu.map((item, index) => renderMobileMenuItem(item, index))}
                                </Accordion>
                                <div className="mt-6">
                                    {/* In mobile, also show the unified AccountDropdown */}
                                    <AccountDropdown />
                                </div>
                                {import.meta.env.DEV && (
                                    <div className="mt-4">
                                        <Button variant="outline" onClick={openDevTools}>
                                            <VscTools />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
};

export { NavbarUpdated };
