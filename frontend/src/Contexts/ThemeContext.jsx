// src/contexts/ThemeContext.jsx
import  { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

export const ThemeContext = createContext({
    theme: 'light',
    setTheme: () => {},
});

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => {
            setTheme(e.matches ? 'dark' : 'light');
        };
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

// Create the custom hook
export const useTheme = () => {
    return useContext(ThemeContext);
};