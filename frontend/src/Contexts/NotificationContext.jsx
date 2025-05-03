// src/contexts/NotificationContext.jsx
import React, { createContext, useState, useCallback } from 'react'
import PropTypes from 'prop-types'

export const NotificationContext = createContext({
    notify: (msg, opts) => {},
})

export function NotificationProvider({ children }) {
    const [queue, setQueue] = useState([])

    const notify = useCallback((message, { type = 'info' } = {}) => {
        const id = Date.now().toString()
        setQueue((q) => [...q, { id, message, type }])
        // auto-remove after 3s
        setTimeout(() => {
            setQueue((q) => q.filter((n) => n.id !== id))
        }, 3000)
    }, [])

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            {/* Example toast container */}
            <div className="fixed bottom-4 right-4 space-y-2">
                {queue.map(({ id, message, type }) => (
                    <div
                        key={id}
                        className={`
              px-4 py-2 rounded shadow
              ${type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-800 text-white'}
            `}
                    >
                        {message}
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    )
}

NotificationProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
