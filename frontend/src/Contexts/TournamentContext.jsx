// src/contexts/TournamentContext.jsx (Recommended Version)
import React, { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const TournamentContext = createContext();

export const useTournament = () => useContext(TournamentContext);

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