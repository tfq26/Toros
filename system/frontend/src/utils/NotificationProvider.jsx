// NotificationContext.jsx
import React, { createContext, useContext } from "react";
import { toast, Toaster } from "sonner";

// Create the notification context.
const NotificationContext = createContext({
    addNotification: () => {},
});

// Provider component that wraps your app and includes the Toaster from Sonner.
export const NotificationProvider = ({ children }) => {
    // A helper function that wraps Sonner's toast calls.
    const addNotification = ({ message, type = "info", duration = 5000 }) => {
        // You can add additional customization depending on the type.
        switch (type) {
            case "success":
                toast.success(message, { duration });
                break;
            case "error":
                toast.error(message, { duration });
                break;
            case "warning":
                toast.warning(message, { duration });
                break;
            default:
                toast(message, { duration });
        }
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            {/* The Toaster component renders toast notifications from Sonner */}
            <Toaster richColors position="top-right" />
        </NotificationContext.Provider>
    );
};

// Custom hook for easier access to the notification functions.
export const useNotification = () => useContext(NotificationContext);
