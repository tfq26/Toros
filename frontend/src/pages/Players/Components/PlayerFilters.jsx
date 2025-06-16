import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PlayerFilters = ({ clubs, levels, selectedClub, selectedLevel, onClubChange, onLevelChange }) => {
    return (
        <div className="flex items-center gap-2">
            <Select value={selectedClub} onValueChange={onClubChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Clubs" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">All Clubs</SelectItem>
                    {clubs.map(club => <SelectItem key={club} value={club}>{club}</SelectItem>)}
                </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={onLevelChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    {levels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
    );
};

export default PlayerFilters;
