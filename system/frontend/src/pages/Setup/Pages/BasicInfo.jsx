import React from 'react';
import { useSetup } from '@/contexts/SetupContext.jsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardDescription } from '@/components/ui/card';

const BasicInfoStep = () => {
    const { state, dispatch } = useSetup();

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        dispatch({
            type: 'UPDATE_FIELD',
            payload: { field: name, value: type === 'number' ? parseInt(value, 10) : value },
        });
    };

    return (
        // Increased vertical spacing
        <div className="space-y-8 md:space-y-8">
            <CardDescription className="text-lg md:text-xl">
                Start with the essential details for your tournament.
            </CardDescription>
            <div className="space-y-3">
                {/* Larger label and input */}
                <Label htmlFor="tournamentName" className="text-base md:text-lg">Tournament Name</Label>
                <Input
                    id="tournamentName"
                    name="tournamentName"
                    value={state.tournamentName}
                    onChange={handleChange}
                    placeholder="e.g., Summer Pickleball Classic"
                    className="h-12 md:h-14 text-lg"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <Label htmlFor="numCourts" className="text-base md:text-lg">Number of Courts</Label>
                    <Input
                        id="numCourts"
                        name="numCourts"
                        type="number"
                        value={state.numCourts}
                        onChange={handleChange}
                        min="1"
                        className="h-12 md:h-14 text-lg"
                    />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="gamesPerTeam" className="text-base md:text-lg">Guaranteed Games per Team</Label>
                    <Input
                        id="gamesPerTeam"
                        name="gamesPerTeam"
                        type="number"
                        value={state.gamesPerTeam}
                        onChange={handleChange}
                        min="1"
                        className="h-12 md:h-14 text-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicInfoStep;
