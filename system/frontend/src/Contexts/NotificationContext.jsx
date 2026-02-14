// src/contexts/NotificationContext.jsx
import React, { createContext, useContext } from "react";
import { toast, Toaster } from "sonner";

const NotificationContext = createContext({
    addNotification: () => {}
});

export const NotificationProvider = ({ children }) => {
    const addNotification = ({ message, type = "info", duration = 5000 }) => {
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
            <Toaster richColors position="top-right" />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
