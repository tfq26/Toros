// src/contexts/ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

export const ThemeContext = createContext({
    theme: 'light',      // 'light' or 'dark'
    setTheme: () => {},  // call setTheme('light') or setTheme('dark')
})

export function ThemeProvider({ children }) {
    // 1️⃣ Initialize from system preference
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
        }
        return 'light'
    })

    // 2️⃣ Whenever theme changes, toggle the 'dark' class on <html>
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
    }, [theme])

    // 3️⃣ Listen to system preference changes
    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = (e) => {
            setTheme(e.matches ? 'dark' : 'light')
        }
        media.addEventListener('change', handler)
        return () => media.removeEventListener('change', handler)
    }, [])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
