import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label.jsx";
import { Checkbox } from "@/components/ui/checkbox";

const ExtendedDetailsStep = ({ tournamentConfig, handleConfigChange }) => {
    return (
        <div className="space-y-6">
            {/* Row 1: Location and Organizer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                    </Label>
                    <Input
                        type="text"
                        value={tournamentConfig.location}
                        onChange={(e) => handleConfigChange("location", e.target.value)}
                        placeholder="Enter tournament location"
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                </div>
                <div>
                    <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Organizer
                    </Label>
                    <Input
                        type="text"
                        value={tournamentConfig.organizer}
                        onChange={(e) => handleConfigChange("organizer", e.target.value)}
                        placeholder="Enter organizer name"
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                </div>
            </div>

            {/* Row 2: Contact Info and Tournament Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Info
                    </Label>
                    <Input
                        type="text"
                        value={tournamentConfig.contactInfo}
                        onChange={(e) => handleConfigChange("contactInfo", e.target.value)}
                        placeholder="Enter contact info"
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                </div>
                <div>
                    <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tournament Type
                    </Label>
                    <Input
                        type="text"
                        value={tournamentConfig.tournamentType}
                        onChange={(e) => handleConfigChange("tournamentType", e.target.value)}
                        placeholder="e.g., Singles, Doubles, Mixed"
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                </div>
            </div>

            {/* Row 3: Scoring System and Rules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Scoring System
                    </Label>
                    <Input
                        type="text"
                        value={tournamentConfig.scoringSystem}
                        onChange={(e) => handleConfigChange("scoringSystem", e.target.value)}
                        placeholder="e.g., Rally or Traditional"
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                </div>
                <div>
                    <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Rules
                    </Label>
                    <Input
                        type="text"
                        value={tournamentConfig.rules}
                        onChange={(e) => handleConfigChange("rules", e.target.value)}
                        placeholder="e.g., USAPA or Custom"
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                </div>
            </div>

            {/* Row 4: Prize Distribution and Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Prize Distribution
                    </Label>
                    <Input
                        type="text"
                        value={tournamentConfig.prizeDistribution}
                        onChange={(e) => handleConfigChange("prizeDistribution", e.target.value)}
                        placeholder="e.g., 1st: $500, 2nd: $300"
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                </div>
                <div>
                    <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Format
                    </Label>
                    <Input
                        type="text"
                        value={tournamentConfig.format}
                        onChange={(e) => handleConfigChange("format", e.target.value)}
                        placeholder="e.g., Round Robin, Elimination"
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                </div>
            </div>

            {/* Row 5: Age Group and Skill Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Age Group
                    </Label>
                    <Input
                        type="text"
                        value={tournamentConfig.ageGroup}
                        onChange={(e) => handleConfigChange("ageGroup", e.target.value)}
                        placeholder="e.g., 18+, 35+, 50+"
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                </div>
                <div>
                    <Label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Skill Level
                    </Label>
                    <Input
                        type="text"
                        value={tournamentConfig.skillLevel}
                        onChange={(e) => handleConfigChange("skillLevel", e.target.value)}
                        placeholder="e.g., Beginner, Intermediate, Advanced"
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                </div>
            </div>

            {/* New Row: Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="existingPlayers"
                        checked={tournamentConfig.useExistingPlayers}
                        onCheckedChange={(value) => handleConfigChange("useExistingPlayers", value)}
                        className="accent-emerald-400 dark:border-gray-600"
                    />
                    <Label className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        Use Existing Player List
                    </Label>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="tiered"
                        checked={tournamentConfig.tiered}
                        onCheckedChange={(value) => handleConfigChange("tiered", value)}
                        className="accent-emerald-400 dark:border-gray-600"
                    />
                    <Label className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        Divide into Tiers
                    </Label>
                </div>
            </div>
        </div>
    );
};

export default ExtendedDetailsStep;
