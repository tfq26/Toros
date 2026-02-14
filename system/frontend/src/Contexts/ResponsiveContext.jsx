import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// The query we'll use to determine if the screen is "mobile"
// Corresponds to Tailwind's `md` breakpoint
const MOBILE_QUERY = "(max-width: 768px)";

// 1. Create the context with a default value
const ResponsiveContext = createContext(null);

// 2. Create the Provider component
export const ResponsiveProvider = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // We use window.matchMedia to check the screen size
        const mediaQuery = window.matchMedia(MOBILE_QUERY);

        // Set the initial state
        setIsMobile(mediaQuery.matches);

        // Create a listener to update the state when the screen size changes
        const listener = (event) => {
            setIsMobile(event.matches);
        };

        mediaQuery.addEventListener('change', listener);

        // Cleanup the listener when the component unmounts
        return () => {
            mediaQuery.removeEventListener('change', listener);
        };
    }, []);

    // The value that will be available to all consumer components
    const value = { isMobile };

    return (
        <ResponsiveContext.Provider value={value}>
            {children}
        </ResponsiveContext.Provider>
    );
};

ResponsiveProvider.propTypes = {
    children: PropTypes.node.isRequired,
};


// 3. Create a custom hook for consuming the context easily
export const useResponsive = () => {
    const context = useContext(ResponsiveContext);
    if (context === null) {
        throw new Error('useResponsive must be used within a ResponsiveProvider');
    }
    return context;
};