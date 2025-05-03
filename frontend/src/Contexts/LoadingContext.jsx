// src/contexts/LoadingContext.jsx
import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'

// Create the context with default values
export const LoadingContext = createContext({
    isLoading: false,
    setLoading: () => {},
})

/**
 * LoadingProvider wraps your app (or part of it) and
 * gives access to `isLoading` and `setLoading` via context.
 */
export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}

LoadingProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
