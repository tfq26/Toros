import { createContext, useContext, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';

// ✨ MODIFIED: Added startTime and startDateTime to the initial state
const initialState = {
    tournamentName: "",
    numCourts: 1,
    gamesPerTeam: 1,
    dateRange: null, // Holds { from: Date, to: Date }
    startTime: '09:00', // Default start time
    startDateTime: null, // Will hold the combined Date object
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
};

// The reducer function is already correct and flexible
function setupReducer(state, action) {
    // ✨ NEW: Added logging to trace state updates for debugging.
    console.log('[SetupContext] Action Dispatched:', action);

    switch (action.type) {
        case 'UPDATE_FIELD': { // Added braces to create a block scope
            const newState = { ...state, [action.payload.field]: action.payload.value };
            // ✨ NEW: Log the specific field that was updated.
            console.log(`[SetupContext] Field Updated: '${action.payload.field}'`, 'New Value:', newState[action.payload.field]);
            return newState;
        }
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

const SetupContext = createContext();

// The Provider Component
export const SetupProvider = ({ children }) => {
    const [state, dispatch] = useReducer(setupReducer, initialState);

    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({ state, dispatch }), [state]);

    return <SetupContext.Provider value={value}>{children}</SetupContext.Provider>;
};

SetupProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// The custom hook for easy access
export const useSetupContext = () => {
    const context = useContext(SetupContext);
    if (context === undefined) {
        throw new Error('useSetupContext must be used within a SetupProvider');
    }
    return context;
};
