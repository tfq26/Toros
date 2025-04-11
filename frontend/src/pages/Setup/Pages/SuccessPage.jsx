import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TournamentSetupSuccess = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-green-100 dark:bg-green-900 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-4xl font-bold text-green-600 dark:text-green-300 mb-4">
                    Tournament Setup Complete!
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    Your tournament has been successfully configured.
                </p>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition">
                    <Link to="/tournament/list" className="flex items-center justify-center">
                        Go to Tournament List
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default TournamentSetupSuccess;
