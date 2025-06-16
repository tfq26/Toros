import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink } from 'react-router-dom';

// Custom hook for scroll detection
import { useScrollPosition } from "@/hooks/useScrollPosition.js";

// UI and Custom Components/Hooks
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.jsx";
import { Button } from "@/components/ui/button.jsx";
// ✨ NEW: Imported SheetDescription
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet.jsx";
import { useTheme } from "@/contexts/ThemeContext.jsx";
import { ActionButtons } from "./ActionButtons.jsx";

// Animation Variants
const navVariants = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 },
};

const dropdownVariants = {
    hidden: { opacity: 0, y: 5, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: "easeInOut" } },
    exit: { opacity: 0, y: 5, scale: 0.98, transition: { duration: 0.1, ease: "easeIn" } },
};


// Default prop values for robustness
const defaultLogo = {
    url: "/",
    src: "svgs/bull-svgrepo-com_black.svg",
    darkSrc: "svgs/bull-svgrepo-com.svg",
    alt: "Default Logo",
    title: "Site",
};

export function NavbarEnhanced({ logo = defaultLogo, menu = [] }) {
    const { theme } = useTheme();
    const scrolled = useScrollPosition();
    const [openDropdown, setOpenDropdown] = useState(null);
    const navRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [navRef]);


    const isDarkMode = theme === 'dark';
    const logoSrc = isDarkMode && logo?.darkSrc ? logo.darkSrc : logo?.src;

    // Simpler desktop menu with useState
    const renderDesktopMenuItem = (item, idx) => (
        <div
            key={`${item.title}-${idx}`}
            className="relative"
            onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.title)}
            onMouseLeave={() => item.hasDropdown && setOpenDropdown(null)}
        >
            {item.hasDropdown ? (
                <button
                    aria-haspopup="true"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4"
                >
                    {item.title}
                </button>
            ) : (
                <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                        `inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4
                        ${isActive ? 'bg-accent text-accent-foreground' : 'bg-transparent hover:bg-accent hover:text-accent-foreground'}`
                    }
                >
                    {item.title}
                </NavLink>
            )}

            <AnimatePresence>
                {openDropdown === item.title && item.hasDropdown && (
                    <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                    >
                        <ul className="grid gap-1 p-2 rounded-md shadow-lg bg-popover text-popover-foreground w-[280px]">
                            {item.items && item.items.map((sub, i) => (
                                <li key={i}>
                                    <Link
                                        to={sub.url}
                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                        onClick={() => setOpenDropdown(null)}
                                    >
                                        <div className="text-sm font-medium leading-none">{sub.title}</div>
                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                            {sub.description}
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    const renderMobileMenuItem = (item, idx) =>
        item.hasDropdown ? (
            <AccordionItem key={`${item.title}-${idx}`} value={item.title}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent className="pl-4">
                    {item.items && item.items.map((sub, i) => (
                        <Link key={i} to={sub.url} className="block py-2 text-muted-foreground hover:text-foreground">
                            {sub.title}
                        </Link>
                    ))}
                </AccordionContent>
            </AccordionItem>
        ) : (
            <Link key={`${item.title}-${idx}`} to={item.url} className="block py-3 font-medium text-lg">
                {item.title}
            </Link>
        );

    return (
        <motion.header
            variants={navVariants}
            initial="hidden"
            animate="show"
            className={`sticky top-0 z-50 w-full transition-all duration-300
                ${scrolled ? 'border-b bg-background/80 backdrop-blur-sm' : 'bg-transparent'}`
            }
            ref={navRef}
        >
            <nav className="container flex items-center justify-between px-4 py-3 mx-auto">
                <div className="flex items-center gap-6">
                    <motion.div variants={itemVariants}>
                        <Link to={logo.url} className="flex items-center gap-2" aria-label={logo.title}>
                            <img src={logoSrc} alt={logo.alt} className="h-12" />
                        </Link>
                    </motion.div>

                    <div className="hidden md:flex items-center">
                        {menu.map(renderDesktopMenuItem)}
                    </div>
                </div>

                <motion.div variants={itemVariants} className="hidden md:flex items-center gap-4">
                    <ActionButtons />
                </motion.div>

                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu size={24} />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>{logo.title}</SheetTitle>
                                {/* ✨ FIXED: Added SheetDescription for accessibility */}
                                <SheetDescription className="sr-only">
                                    Main navigation menu and site actions.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 flex flex-col gap-2">
                                {menu.filter(item => !item.hasDropdown).map(renderMobileMenuItem)}
                                <Accordion type="single" collapsible className="w-full">
                                    {menu.filter(item => item.hasDropdown).map(renderMobileMenuItem)}
                                </Accordion>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
            <motion.div layout
                        className={`h-0.5 ${isDarkMode ? 'bg-emerald-700' : 'bg-black'}`}
                        style={{ width: scrolled ? '100%' : '50%', transition: 'width 0.5s ease-in-out' }}
            />
        </motion.header>
    );
}

NavbarEnhanced.propTypes = {
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
            url: PropTypes.string,
            hasDropdown: PropTypes.bool,
            items: PropTypes.arrayOf(
                PropTypes.shape({
                    title: PropTypes.string.isRequired,
                    url: `string`.isRequired,
                    description: PropTypes.string,
                })
            ),
        })
    ),
};
