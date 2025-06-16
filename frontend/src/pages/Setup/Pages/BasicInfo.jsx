import React from 'react';
import { useSetupContext } from '@/contexts/SetupContext.jsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardDescription } from '@/components/ui/card';

const BasicInfoStep = () => {
    const { state, dispatch } = useSetupContext();

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        dispatch({
            type: 'UPDATE_FIELD',
            payload: { field: name, value: type === 'number' ? parseInt(value, 10) : value },
        });
    };

    return (
        <div className="space-y-6">
            <CardDescription>Start with the essential details for your tournament.</CardDescription>
            <div className="space-y-2">
                <Label htmlFor="tournamentName">Tournament Name</Label>
                <Input
                    id="tournamentName"
                    name="tournamentName"
                    value={state.tournamentName}
                    onChange={handleChange}
                    placeholder="e.g., Summer Pickleball Classic"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="numCourts">Number of Courts</Label>
                    <Input
                        id="numCourts"
                        name="numCourts"
                        type="number"
                        value={state.numCourts}
                        onChange={handleChange}
                        min="1"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gamesPerTeam">Guaranteed Games per Team</Label>
                    <Input
                        id="gamesPerTeam"
                        name="gamesPerTeam"
                        type="number"
                        value={state.gamesPerTeam}
                        onChange={handleChange}
                        min="1"
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicInfoStep;