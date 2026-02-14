import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

// 1. Create the context (private)
const NetworkContext = createContext(null);

export function NetworkProvider({ children }) {
    const [online, setOnline] = useState(navigator.onLine);

    useEffect(() => {
        const onOnline = () => setOnline(true);
        const onOffline = () => setOnline(false);

        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);

        return () => {
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
        };
    }, []);

    return (
        <NetworkContext.Provider value={{ online }}>
            {children}
        </NetworkContext.Provider>
    );
}

NetworkProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// 2. Create and export the custom hook
export const useNetwork = () => {
    const context = useContext(NetworkContext);
    if (context === null) {
        throw new Error('useNetwork must be used within a NetworkProvider');
    }
    return context;
};