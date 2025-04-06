import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label.jsx";

const BasicInfoStep = ({ tournamentConfig, handleConfigChange }) => {
    return (
        <div className="space-y-6">
            <div>
                <Input
                    type="text"
                    value={tournamentConfig.tournamentName}
                    onChange={(e) =>
                        handleConfigChange("tournamentName", e.target.value)
                    }
                    placeholder="Enter Tournament Name"
                    className="w-full text-lg p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Number of Courts
                    </Label>
                    <Input
                        type="number"
                        value={tournamentConfig.numCourts}
                        onChange={(e) =>
                            handleConfigChange("numCourts", parseInt(e.target.value, 10))
                        }
                        max={20}
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                </div>
                <div>
                    <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Games per Team
                    </Label>
                    <Input
                        type="number"
                        value={tournamentConfig.gamesPerTeam}
                        onChange={(e) =>
                            handleConfigChange("gamesPerTeam", parseInt(e.target.value, 10))
                        }
                        max={20}
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicInfoStep;
