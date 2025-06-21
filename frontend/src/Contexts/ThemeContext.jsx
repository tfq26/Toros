// src/contexts/ThemeContext.jsx (Optional modification for ALWAYS syncing)

import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    // 1. MODIFIED: Always initialize state from the OS preference, ignore localStorage.
    const [theme, setTheme] = useState(
        () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    );

    // This effect to update the DOM is still needed.
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        // You could optionally remove saving to localStorage
        // localStorage.setItem('theme', theme);
    }, [theme]);

    // 2. MODIFIED: The OS change listener now ALWAYS updates the theme.
    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');

        // The handler no longer checks for a stored theme.
        const handler = (e) => setTheme(e.matches ? 'dark' : 'light');

        media.addEventListener('change', handler);
        return () => media.removeEventListener('change', handler);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// 3. Create and export the custom hook with a safety check
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === null) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};