import React, { createContext, useState, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';

// 1. Create the context (private)
const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [queue, setQueue] = useState([]);

    const notify = useCallback((message, { type = 'info' } = {}) => {
        const id = Date.now().toString() + Math.random(); // Add random for rapid calls
        setQueue((q) => [...q, { id, message, type }]);

        setTimeout(() => {
            setQueue((q) => q.filter((n) => n.id !== id));
        }, 3000);
    }, []);

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}

            {/* The UI for the notifications can live here in the provider */}
            <div className="fixed bottom-4 right-4 space-y-2 z-50">
                {queue.map(({ id, message, type }) => (
                    <div
                        key={id}
                        className={`px-4 py-2 rounded shadow-lg animate-fade-in-up ${
                            type === 'error'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-800 text-white'
                        }`}
                    >
                        {message}
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

NotificationProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// 2. Create and export the custom hook
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === null) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};