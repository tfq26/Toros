// src/hooks/useTheme.js
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

// Core access
export const useTheme = () => useContext(ThemeContext);

// Individual helpers
export const useThemeValue = () => useTheme().theme;
export const useSetTheme = () => useTheme().setTheme;

export const useToggleTheme = () => {
    const { theme, setTheme } = useTheme();
    return () => setTheme(theme === 'dark' ? 'light' : 'dark');
};

export const useIsDarkMode = () => useTheme().theme === 'dark';
export const useIsLightMode = () => useTheme().theme === 'light';

// UI helpers
export const useThemeClass = () => (useIsDarkMode() ? 'dark' : '');
export const useThemeAttributes = () => (useIsDarkMode() ? { 'data-theme': 'dark' } : {});
