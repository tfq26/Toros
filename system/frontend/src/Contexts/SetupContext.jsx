// src/contexts/SetupContext.jsx

import { createContext, useContext, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';

const initialState = {
    tournamentName: "",
    numCourts: 1,
    gamesPerTeam: 1,
    dateRange: null,
    startTime: '09:00',
    startDateTime: null,
    matchDuration: 15,
    breakTime: 5,
    useExistingPlayers: false,
    tiered: false,
    location: "",
    organizer: "",
    contactInfo: "",
    tournamentType: "Single Elimination",
    scoringSystem: "",
    rules: "",
    prizeDistribution: "",
    format: "Singles",
    ageGroup: "All Ages",
    skillLevel: "All Levels",
    auth0UserId: null,
    auth0AccessToken: null,
    authorizedUsers: [],
    privateTournament: false,
};

function setupReducer(state, action) {
    // console.log('[SetupContext] Action Dispatched:', action); // Optional: uncomment for debugging
    switch (action.type) {
        case 'UPDATE_FIELD':
            return { ...state, [action.payload.field]: action.payload.value };
        case 'PREFILL_USER':
            return {
                ...state,
                organizer: state.organizer || action.payload.name,
                contactInfo: state.contactInfo || action.payload.email,
            };
        case 'RESET':
            return initialState;
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

// 1. Create the context (private)
const SetupContext = createContext(null);

// 2. Export the Provider component
export const SetupProvider = ({ children }) => {
    const [state, dispatch] = useReducer(setupReducer, initialState);

    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({ state, dispatch }), [state]);

    return <SetupContext.Provider value={value}>{children}</SetupContext.Provider>;
};

SetupProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// 3. Export the custom hook (✨ Renamed for consistency)
export const useSetup = () => {
    const context = useContext(SetupContext);
    if (context === null) {
        throw new Error('useSetup must be used within a SetupProvider');
    }
    return context;
};