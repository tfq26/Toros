import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label.jsx";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.jsx";

const ExtendedDetailsStep = ({ tournamentConfig, handleConfigChange }) => {
    return (
        <div className="space-y-6">
            {/* Two Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Left Column: Text Inputs and Checkboxes */}
                <div className="space-y-4">
                    {/* Row: Location */}
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
                    {/* Row: Organizer */}
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
                    {/* Row: Contact Info */}
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
                    {/* Row: Rules */}
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
                    {/* Row: Prize Distribution */}
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
                    {/* Row: Age Group */}
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
                    {/* Row: Checkboxes */}
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
                {/* Right Column: Select Components Arranged Vertically */}
                <div className="space-y-4">
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
                    {/* Skill Level */}
                    <div>
                        {/*<Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">*/}
                        {/*    Skill Level*/}
                        {/*</Label>*/}
                        <HoverCard>
                            <HoverCardTrigger
                                className={"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"}>
                                Skill Level
                            </HoverCardTrigger>
                            <HoverCardContent className={"text-xs"}>
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
            </div>
        </div>
    );
};

export default ExtendedDetailsStep;
