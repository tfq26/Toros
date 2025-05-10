// src/contexts/TournamentContext.jsx
import  { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from "prop-types";
import axios from 'axios';

const TournamentContext = createContext();

export function TournamentProvider({ tournamentId: initialTournamentId, children }) { // Rename prop to avoid shadowing if you still use it internally
    const [tournamentConfig, setTournamentConfig] = useState(null);
    const [isSetupComplete, setIsSetupComplete]   = useState(false);
    const [loading, setLoading]                   = useState(false); // Initialize to false
    const [error, setError]                       = useState(null);
    const [tournamentId, setTournamentId]       = useState(initialTournamentId); // Local state for tournamentId

    useEffect(() => {
        if (!tournamentId) {
            setTournamentConfig(null); // Clear config if no ID
            return;
        }

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
                tournamentId, // Make the current tournamentId available in the context
                setTournamentId, // Provide a way to update the tournamentId from within the context consumers
            }}
        >
            {children}
        </TournamentContext.Provider>
    );
}

TournamentProvider.propTypes = {
    tournamentId: PropTypes.string, // Make it optional
    children:     PropTypes.node.isRequired,
};

export function useTournament() {
    const ctx = useContext(TournamentContext);
    if (!ctx) throw new Error("useTournament must be used within a TournamentProvider");
    return ctx;
}