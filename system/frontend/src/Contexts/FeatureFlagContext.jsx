// src/contexts/FeatureFlagContext.jsx

import  { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

// 1. Create the context (private to this file, not exported)
//    We set the default to null. The safety check in our custom hook will handle it.
const FeatureFlagContext = createContext(null);

// 2. Create and export the Provider component (your existing logic is perfect)
export function FeatureFlagProvider({ children }) {
    const [flags, setFlags] = useState({});

    useEffect(() => {
        async function fetchFlags() {
            // In a real app, this would load from an API, database, or localStorage
            // For now, we'll keep the mock data.
            setFlags({ newNavbar: true, betaFeature: false, devDebugPanel: true });
        }
        fetchFlags();
    }, []);

    const isEnabled = (key) => Boolean(flags[key]);

    return (
        <FeatureFlagContext.Provider value={{ flags, isEnabled }}>
            {children}
        </FeatureFlagContext.Provider>
    );
}

FeatureFlagProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// 3. Create and export the custom hook for consuming the context
export const useFeatureFlag = () => {
    const context = useContext(FeatureFlagContext);

    // Safety check to ensure the hook is used within a provider
    if (context === null) {
        throw new Error('useFeatureFlag must be used within a FeatureFlagProvider');
    }

    return context;
};