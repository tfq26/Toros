import React from "react";
import { Label } from "@/components/ui/label.jsx";

const OptionsReviewStep = ({ tournamentConfig }) => {
    return (
        <div className="space-y-6">
            <div className="text-gray-700 dark:text-gray-300">
                <h3 className="text-xl font-bold mb-2">Review Your Tournament Configuration</h3>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm overflow-auto">
          {JSON.stringify(tournamentConfig, null, 2)}
        </pre>
            </div>
        </div>
    );
};

export default OptionsReviewStep;
