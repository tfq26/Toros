// src/pages/Setup/Pages/OptionsReview.jsx
import  { useEffect } from "react";
import { useTournament } from "@/contexts/TournamentContext.jsx";
import PropTypes from "prop-types";
const OptionsReviewStep = ({ tournamentConfig }) => {
    const { setTournamentConfig } = useTournament();

    // When this step mounts (or tournamentConfig changes), store it in context
    useEffect(() => {
        if (tournamentConfig) {
            setTournamentConfig(tournamentConfig);
        }
    }, [tournamentConfig, setTournamentConfig]);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold mb-2">Review Your Tournament Configuration</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm overflow-auto">
        {JSON.stringify(tournamentConfig, null, 2)}
      </pre>
        </div>
    );
};

OptionsReviewStep.propTypes = {
    tournamentConfig: PropTypes.object.isRequired, // Adjust the type and requirement as needed
};
export default OptionsReviewStep;
