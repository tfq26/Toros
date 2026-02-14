import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(() => {
        // Check for saved theme preference, fallback to system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    const [isSystemTheme, setIsSystemTheme] = useState(!localStorage.getItem('theme'));

    // Update the DOM when theme changes
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Listen for system theme changes when using system preference
    useEffect(() => {
        if (!isSystemTheme) return;
        
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => setThemeState(e.matches ? 'dark' : 'light');
        
        media.addEventListener('change', handler);
        return () => media.removeEventListener('change', handler);
    }, [isSystemTheme]);

    // Set a specific theme
    const setTheme = useCallback((newTheme) => {
        if (newTheme === 'light' || newTheme === 'dark') {
            localStorage.setItem('theme', newTheme);
            setIsSystemTheme(false);
            setThemeState(newTheme);
        }
    }, []);

    // Toggle between light/dark mode
    const toggleTheme = useCallback(() => {
        setThemeState(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            setIsSystemTheme(false);
            return newTheme;
        });
    }, []);

    // Reset to system theme
    const useSystemTheme = useCallback(() => {
        localStorage.removeItem('theme');
        setIsSystemTheme(true);
        setThemeState(
            window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        );
    }, []);

    return (
        <ThemeContext.Provider 
            value={{ 
                theme, 
                isSystemTheme,
                setTheme,
                toggleTheme,
                useSystemTheme 
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === null) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};