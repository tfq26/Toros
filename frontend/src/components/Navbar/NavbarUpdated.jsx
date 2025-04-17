import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Menu } from "lucide-react";
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
import { NavbarAuth } from "../../pages/Auth/NavbarAuth.jsx"; // adjust path as needed
import { VscTools } from "react-icons/vsc";

// Default menu data
const defaultMenu = [
    {
        title: "News",
        items: [{ title: "Latest News", url: "/news" }],
    },
    {
        title: "Tournaments",
        items: [
            { title: "Tournament Setup", url: "/tournament/setup" },
            { title: "My Tournaments", url: "/tournament/my" },
            { title: "Find Tournaments", url: "/tournament/find" },
        ],
    },
    {
        title: "Explore",
        items: [
            { title: "Explore Players", url: "/explore/players" },
            { title: "Explore Teams", url: "/explore/teams" },
        ],
    },
];

export function NavbarUpdated({
                                  logo = {
                                      url: "/",
                                      src: "/bull-svgrepo-com_black.svg",
                                      darkSrc: "/bull-svgrepo-com.svg",
                                      alt: "Logo",
                                      title: "Toros",
                                  },
                                  menu = defaultMenu,
                              }) {
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

    const logoSrc = isDarkMode && logo.darkSrc ? logo.darkSrc : logo.src;

    const SubMenuLink = React.forwardRef(({ item, ...props }, ref) => (
        <a
            ref={ref}
            href={item.url}
            className="flex flex-col gap-6 rounded-md w-fit leading-normal no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
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
    SubMenuLink.propTypes = {
        item: PropTypes.shape({
            title: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
            icon: PropTypes.node,
            description: PropTypes.string,
        }).isRequired,
    };

    const renderDesktopMenuItem = (item, index) =>
        item.items ? (
            <NavigationMenuItem key={`${item.title}-${index}`}>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-popover text-popover-foreground space-y-4 p-4">
                    {item.items.map((sub, i) => (
                        <NavigationMenuLink asChild key={i} className="w-80">
                            <SubMenuLink item={sub} />
                        </NavigationMenuLink>
                    ))}
                </NavigationMenuContent>
            </NavigationMenuItem>
        ) : (
            <NavigationMenuItem key={`${item.title}-${index}`}>
                <NavigationMenuLink
                    href={item.url}
                    className="group inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
                >
                    {item.title}
                </NavigationMenuLink>
            </NavigationMenuItem>
        );

    const renderMobileMenuItem = (item, index) =>
        item.items ? (
            <AccordionItem key={`${item.title}-${index}`} value={item.title} className="border-b-0">
                <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
                    {item.title}
                </AccordionTrigger>
                <AccordionContent className="mt-4">
                    {item.items.map((sub, i) => (
                        <SubMenuLink key={i} item={sub} />
                    ))}
                </AccordionContent>
            </AccordionItem>
        ) : (
            <a key={`${item.title}-${index}`} href={item.url} className="text-md font-semibold">
                {item.title}
            </a>
        );

    return (
        <header className="w-full top-0 z-50">
            <nav className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                    <a href={logo.url} className="flex items-center gap-2">
                        <img src={logoSrc} alt={logo.alt} className="h-8" />
                    </a>
                </div>
                <div className="hidden md:flex items-center gap-6">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {menu.map(renderDesktopMenuItem)}
                        </NavigationMenuList>
                    </NavigationMenu>
                    <div className="flex items-center gap-2">
                        <NavbarAuth />
                        {import.meta.env.DEV && (
                            <Button variant="outline" size="sm" onClick={openDevTools}>
                                <VscTools />
                            </Button>
                        )}
                    </div>
                </div>
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
                                    <div className="flex w-full items-center gap-5">
                                        <a href={logo.url} className="flex items-center">
                      <span className="text-lg font-semibold tracking-tighter">
                        {logo.title}
                      </span>
                                        </a>
                                        <NavbarAuth />
                                        {import.meta.env.DEV && (
                                            <Button variant="outline" onClick={openDevTools}>
                                                <VscTools />
                                            </Button>
                                        )}
                                    </div>
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-10 p-4">
                                <Accordion type="single" collapsible className="flex w-auto my-8 flex-col gap-4">
                                    {menu.map(renderMobileMenuItem)}
                                </Accordion>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}

NavbarUpdated.propTypes = {
    logo: PropTypes.shape({
        url: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
        darkSrc: PropTypes.string,
        alt: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }),
    menu: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            items: PropTypes.arrayOf(
                PropTypes.shape({
                    title: PropTypes.string.isRequired,
                    url: PropTypes.string.isRequired,
                    icon: PropTypes.node,
                    description: PropTypes.string,
                })
            ).isRequired,
        })
    ),
};
