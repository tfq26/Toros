import React, { memo, useState, useEffect, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

const SidebarContext = createContext();

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
    return context;
};

export const SidebarProvider = ({ children, open: openProp, setOpen: setOpenProp, animate = true }) => {
    const [openState, setOpenState] = useState(false);
    const open = openProp ?? openState;
    const setOpen = setOpenProp ?? setOpenState;
    return (
        <SidebarContext.Provider value={{ open, setOpen, animate }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const Sidebar = ({ children, open, setOpen, animate }) => (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
        {children}
    </SidebarProvider>
);

export const SidebarBody = memo(({ children }) => (
    <>
        <DesktopSidebar>{children}</DesktopSidebar>
        <MobileSidebar>{children}</MobileSidebar>
    </>
));

export const DesktopSidebar = memo(({ children }) => {
    const { open, setOpen, animate } = useSidebar();
    return (
        <motion.div
            className="h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px]"
            animate={{ width: animate ? (open ? "300px" : "60px") : "300px" }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {children}
        </motion.div>
    );
});

export const MobileSidebar = memo(({ children }) => {
    const { open, setOpen } = useSidebar();
    return (
        <div className="h-10 px-4 py-4 flex md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full">
            <IconMenu2 className="text-neutral-800" onClick={() => setOpen(!open)} />
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        className="fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col"
                    >
                        <IconX className="absolute top-4 right-4" onClick={() => setOpen(!open)} />
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

export const SidebarLink = memo(({ link }) => {
    const { open, animate } = useSidebar();
    return (
        <div className="flex items-center gap-2 py-2">
            {link.icon}
            <motion.span animate={{ opacity: open ? 1 : 0 }}>{link.label}</motion.span>
        </div>
    );
});
