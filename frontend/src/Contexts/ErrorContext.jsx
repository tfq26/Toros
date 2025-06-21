// src/contexts/ErrorContext.jsx (AFTER - THE FIX)

import React, { useState, useContext, useCallback } from 'react';

// 1. Create the context
const ErrorContext = React.createContext();

// 2. Create the provider component (NO HOOKS)
export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState(null);

    // The value just provides state and a way to set it
    const contextValue = {
        error,
        setError, // We'll handle navigation separately
    };

    return (
        <ErrorContext.Provider value={contextValue}>
            {children}
        </ErrorContext.Provider>
    );
};

// 3. Create a custom hook to consume the context
export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
};