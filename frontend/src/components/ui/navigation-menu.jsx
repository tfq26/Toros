import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const NavigationMenu = NavigationMenuPrimitive.Root;

export const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.List
        ref={ref}
        className={cn("flex list-none items-center space-x-2", className)}
        {...props}
    />
));
NavigationMenuList.displayName = "NavigationMenuList";

export const NavigationMenuItem = NavigationMenuPrimitive.Item;

export const NavigationMenuTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
    <NavigationMenuPrimitive.Trigger
        ref={ref}
        className={cn(
            "group inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground focus:outline-none",
            "data-[state=open]:bg-muted data-[state=open]:text-accent-foreground",
            className
        )}
        {...props}
    >
        {children}
        <ChevronDown
            className="ml-1 h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180"
            aria-hidden="true"
        />
    </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

export const NavigationMenuContent = React.forwardRef(({ className, children, ...props }, ref) => (
    <NavigationMenuPrimitive.Content asChild forceMount>
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
                "absolute left-0 top-full w-[120%] rounded-md border bg-popover p-1 z-50",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    </NavigationMenuPrimitive.Content>
));
NavigationMenuContent.displayName = "NavigationMenuContent";

export const NavigationMenuLink = NavigationMenuPrimitive.Link;
