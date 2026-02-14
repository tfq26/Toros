import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PlayerFilters = ({ clubs, levels, selectedClub, selectedLevel, onClubChange, onLevelChange }) => {
    return (
        <div className="flex items-center gap-2">
            <Select value={selectedClub || "all"} onValueChange={value => onClubChange(value === "all" ? null : value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Clubs" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Clubs</SelectItem>
                    {clubs.map(club => (
                        <SelectItem key={club} value={club}>
                            {club}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={selectedLevel || "all"} onValueChange={value => onLevelChange(value === "all" ? null : value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {levels.map(level => (
                        <SelectItem key={level} value={level}>
                            {level}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default PlayerFilters;
