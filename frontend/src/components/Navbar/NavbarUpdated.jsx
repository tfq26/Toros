// src/components/NavbarUpdated.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
import { useAuth } from "@/contexts/AuthContext.jsx";
import { NavbarAuth } from "../../pages/Auth/NavbarAuth.jsx";
import { VscTools } from "react-icons/vsc";
import { Separator } from "@/components/ui/separator.jsx";
import { useTheme } from "@/contexts/ThemeContext.jsx"; // Import useTheme

// Default menu data...
const defaultMenu = [ /* … */ ];

const SubMenuLink = React.forwardRef(({ item, ...props }, ref) => (
    <a ref={ref} href={item.url} className="block py-2 px-4 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" {...props}>
        {item.title}
    </a>
));
SubMenuLink.displayName = "SubMenuLink";

export function NavbarUpdated({
                                  logo = {
                                      url: "/",
                                      src: "/svgs/bull-svgrepo-com_black.svg",
                                      darkSrc: "/svgs/bull-svgrepo-com.svg",
                                      alt: "Logo",
                                      title: "Toros",
                                  },
                                  menu = defaultMenu,
                              }) {
    const { openDevTools } = useDevTools();
    const { isDev } = useAuth();
    const { theme, toggleDarkMode } = useTheme(); // Use the hook
    const [openDropdown, setOpenDropdown] = useState(null);

    const isDarkMode = theme === 'dark';
    const logoSrc = isDarkMode && logo.darkSrc ? logo.darkSrc : logo.src;

    // Framer variants
    const navVariants = {
        hidden: { opacity: 0, y: -20 },
        show: { opacity: 1, y: 0, transition: { when: "beforeChildren", staggerChildren: 0.1 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: -10 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    };

    // Desktop menu item with animation variants
    const renderDesktopMenuItem = (item, idx) => (
        <NavigationMenuItem
            key={`${item.title}-${idx}`}
            onMouseEnter={() => setOpenDropdown(item.title)}
            onMouseLeave={() => setOpenDropdown(null)}
        >
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
            </motion.div>

            <AnimatePresence>
                {openDropdown === item.title && item.items && (
                    <NavigationMenuContent className="absolute top-full left-0 z-50 mt-1">
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            transition={{ duration: 0.2 }}
                            className="bg-popover text-popover-foreground p-3 rounded-md shadow-lg grid gap-2"
                        >
                            {item.items.map((sub, i) => (
                                <NavigationMenuLink key={i} className="as-child">
                                    <SubMenuLink item={sub} />
                                </NavigationMenuLink>
                            ))}
                        </motion.div>
                    </NavigationMenuContent>
                )}
            </AnimatePresence>
        </NavigationMenuItem>
    );

    // Mobile menu item with motion on accordion triggers
    const renderMobileMenuItem = (item, idx) =>
        item.items ? (
            <AccordionItem key={`${item.title}-${idx}`} value={item.title}>
                <motion.div variants={itemVariants}>
                    <AccordionTrigger className="…">{item.title}</AccordionTrigger>
                </motion.div>
                <AccordionContent className="mt-4 space-y-2">
                    {item.items.map((sub, i) => (
                        <SubMenuLink key={i} item={sub} />
                    ))}
                </AccordionContent>
            </AccordionItem>
        ) : (
            <motion.a
                key={`${item.title}-${idx}`}
                href={item.url}
                variants={itemVariants}
                className="text-md font-semibold block py-1"
            >
                {item.title}
            </motion.a>
        );

    return (
        <motion.header
            variants={navVariants}
            initial="hidden"
            animate="show"
            className={`w-full top-0 z-50 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
        >
            <motion.nav className="flex items-center justify-between px-4 py-2">
                {/* Logo */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center gap-2"
                >
                    <a href={logo.url}>
                        <img src={logoSrc} alt={logo.alt} className="h-8" />
                    </a>
                </motion.div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {menu.map(renderDesktopMenuItem)}
                        </NavigationMenuList>
                    </NavigationMenu>
                    <motion.div className="flex items-center gap-2" variants={itemVariants}>
                        <NavbarAuth />
                        {isDev && (
                            <Button variant="outline" size="sm" onClick={openDevTools}>
                                <VscTools />
                            </Button>
                        )}
                    </motion.div>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <motion.div variants={itemVariants} whileTap={{ scale: 0.9 }}>
                                <Button variant="outline" size="icon">
                                    <Menu size={24} />
                                </Button>
                            </motion.div>
                        </SheetTrigger>
                        <SheetContent className={`overflow-y-auto ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
                            <SheetHeader>
                                <SheetTitle>
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-lg font-semibold">{logo.title}</span>
                                        <div className="flex items-center gap-2 mr-10">
                                            <NavbarAuth />
                                            {isDev && (
                                                <Button variant="outline" onClick={openDevTools}>
                                                    <VscTools />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </SheetTitle>
                            </SheetHeader>
                            <motion.div
                                variants={navVariants}
                                initial="hidden"
                                animate="show"
                                className="flex flex-col gap-4 px-4 py-2"
                            >
                                <Accordion type="single" collapsible className="space-y-2">
                                    {menu.map(renderMobileMenuItem)}
                                </Accordion>
                            </motion.div>
                        </SheetContent>
                    </Sheet>
                </div>
            </motion.nav>

            <Separator
                orientation="horizontal"
                className={`h-0.5 ${isDarkMode ? 'bg-emerald-700' : 'bg-black'}`}
            />
        </motion.header>
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
                    description: PropTypes.string,
                })
            ),
        })
    ),
};
