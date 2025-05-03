// src/contexts/TournamentContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from "prop-types";
import axios from 'axios';

const TournamentContext = createContext();

export function TournamentProvider({ tournamentId, children }) {
    const [tournamentConfig, setTournamentConfig] = useState(null);
    const [isSetupComplete, setIsSetupComplete]   = useState(false);
    const [loading, setLoading]                   = useState(true);
    const [error, setError]                       = useState(null);

    useEffect(() => {
        if (!tournamentId) return;

        setLoading(true);
        axios
            .get(`/api/tournaments/${tournamentId}`)
            .then(({ data }) => {
                setTournamentConfig(data);
            })
            .catch(err => {
                console.error("Failed to load tournament:", err);
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [tournamentId]);

    return (
        <TournamentContext.Provider
            value={{
                tournamentConfig,
                setTournamentConfig,
                isSetupComplete,
                setIsSetupComplete,
                loading,
                error,
            }}
        >
            {children}
        </TournamentContext.Provider>
    );
}

TournamentProvider.propTypes = {
    tournamentId: PropTypes.string.isRequired,
    children:     PropTypes.node.isRequired,
};

export function useTournament() {
    const ctx = useContext(TournamentContext);
    if (!ctx) throw new Error("useTournament must be used within a TournamentProvider");
    return ctx;
}
