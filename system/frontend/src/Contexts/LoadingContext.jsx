import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

// 1. Create the context (private)
const LoadingContext = createContext(null);

/**
 * LoadingProvider wraps your app and gives access to
 * `isLoading` and `setLoading` via the useLoading hook.
 */
export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

LoadingProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// 2. Create and export the custom hook
export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (context === null) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};