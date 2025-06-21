import React, { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

// 1. Create the context (private), with a null default value
const TournamentContext = createContext(null);

// 2. Export the Provider component
export const TournamentProvider = ({ children }) => {
    const [tournamentConfig, setTournamentConfig] = useState(null);
    const [isSetupComplete, setIsSetupComplete] = useState(false);

    // useMemo prevents unnecessary re-renders of consuming components.
    const value = useMemo(() => ({
        tournamentConfig,
        setTournamentConfig,
        isSetupComplete,
        setIsSetupComplete
    }), [tournamentConfig, isSetupComplete]);

    return (
        <TournamentContext.Provider value={value}>
            {children}
        </TournamentContext.Provider>
    );
};

TournamentProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// 3. Export the custom hook with a safety check
export const useTournament = () => {
    const context = useContext(TournamentContext);

    // ✨ This check is the key fix. It ensures the hook is used correctly.
    if (context === null) {
        throw new Error('useTournament must be used within a TournamentProvider');
    }

    return context;
};