import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label.jsx";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select.jsx";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card.jsx";

const tournamentDetails = ({ tournamentConfig, handleConfigChange }) => {
    return (
        <div className="space-y-6">
            {/* Scoring System */}
            <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Scoring System
                </Label>
                <Select
                    value={tournamentConfig.scoringSystem}
                    onValueChange={(value) => handleConfigChange("scoringSystem", value)}
                >
                    <SelectTrigger className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
                        <SelectValue placeholder="Select scoring system" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Rally">Rally Scoring</SelectItem>
                        <SelectItem value="Traditional">Traditional Scoring</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {/* Tournament Type */}
            <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tournament Type
                </Label>
                <Select
                    value={tournamentConfig.tournamentType}
                    onValueChange={(value) => handleConfigChange("tournamentType", value)}
                >
                    <SelectTrigger className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
                        <SelectValue placeholder="Select tournament type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Singles">Singles</SelectItem>
                        <SelectItem value="Doubles">Doubles</SelectItem>
                        <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {/* Format */}
            <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Format
                </Label>
                <Select
                    value={tournamentConfig.format}
                    onValueChange={(value) => handleConfigChange("format", value)}
                >
                    <SelectTrigger className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
                        <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="RoundRobin">Round Robin</SelectItem>
                        <SelectItem value="SingleElimination">Single Elimination</SelectItem>
                        <SelectItem value="DoubleElimination">Double Elimination</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {/* Rules */}
            <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
            {/* Skill Level */}
            <div>
                <HoverCard>
                    <HoverCardTrigger className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Skill Level
                    </HoverCardTrigger>
                    <HoverCardContent className="text-xs">
                        Skill level is the recommended level of play for the tournament. It does not restrict players of differing skill levels from playing together.
                    </HoverCardContent>
                </HoverCard>
                <Select
                    value={tournamentConfig.skillLevel}
                    onValueChange={(value) => handleConfigChange("skillLevel", value)}
                >
                    <SelectTrigger className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
                        <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default tournamentDetails;
