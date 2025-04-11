import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label.jsx";
import { Checkbox } from "@/components/ui/checkbox";

 const OrganizerDetails = ({ tournamentConfig, handleConfigChange }) => {
    return (
        <div className="space-y-6">
            {/* Location, Organizer, Contact Info */}
            <div className="space-y-4">
                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
            </div>
            {/* Prize Distribution and Age Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
            </div>
            {/* Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="existingPlayers"
                        checked={tournamentConfig.useExistingPlayers}
                        onCheckedChange={(value) => handleConfigChange("useExistingPlayers", value)}
                        className="accent-emerald-400 dark:border-gray-600"
                    />
                    <Label className="text-sm text-gray-700 dark:text-gray-300">
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
                    <Label className="text-sm text-gray-700 dark:text-gray-300">
                        Divide into Tiers
                    </Label>
                </div>
            </div>
        </div>
    );
};

export default OrganizerDetails;
