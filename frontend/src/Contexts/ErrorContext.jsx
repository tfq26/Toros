// src/contexts/ErrorContext.jsx
import  { createContext, useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

export const ErrorContext = createContext({
    throwError: (err, opts) => {},
})

export function ErrorProvider({ children }) {
    const navigate = useNavigate()

    const throwError = useCallback(
        (error, { city = 'Unknown', message, detailed, list = [] } = {}) => {
            navigate('/error', {
                state: { city, message, detailedMessage: detailed, errorMessages: list },
            })
        },
        [navigate]
    )

    return (
        <ErrorContext.Provider value={{ throwError }}>
            {children}
        </ErrorContext.Provider>
    )
}

// 4️⃣ Convenience hook to consume the context
export function useError() {
    return useContext(ErrorContext)
}

ErrorProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
