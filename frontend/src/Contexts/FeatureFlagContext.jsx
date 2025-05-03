// src/contexts/FeatureFlagContext.jsx
import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

export const FeatureFlagContext = createContext({
    flags: {},
    isEnabled: (key) => false,
})

export function FeatureFlagProvider({ children }) {
    const [flags, setFlags] = useState({})

    useEffect(() => {
        async function fetchFlags() {
            // TODO: load from API or localStorage
            setFlags({ newNavbar: true, betaFeature: false })
        }
        fetchFlags()
    }, [])

    const isEnabled = (key) => Boolean(flags[key])

    return (
        <FeatureFlagContext.Provider value={{ flags, isEnabled }}>
            {children}
        </FeatureFlagContext.Provider>
    )
}

FeatureFlagProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
