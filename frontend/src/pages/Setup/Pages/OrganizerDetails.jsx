import React from 'react';
import { useSetupContext } from '@/contexts/SetupContext.jsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea'; // Using Textarea for rules
import { CardDescription } from '@/components/ui/card';


const OrganizerDetails = () => {
    const { state, dispatch } = useSetupContext();

    const handleChange = (e) => {
        dispatch({
            type: 'UPDATE_FIELD',
            payload: { field: e.target.name, value: e.target.value },
        });
    };

    const handleCheckboxChange = (field, value) => {
        dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
    }

    return (
        <div className="space-y-6">
            <CardDescription>
                Provide details about the tournament location, organizer, and other settings.
            </CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input name="location" value={state.location} onChange={handleChange} placeholder="e.g., Central Park Courts" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="organizer">Organizer Name</Label>
                    <Input name="organizer" value={state.organizer} onChange={handleChange} placeholder="Prefilled from your profile" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contactInfo">Contact Info (Email or Phone)</Label>
                    <Input name="contactInfo" value={state.contactInfo} onChange={handleChange} placeholder="Prefilled from your profile" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="prizeDistribution">Prize Distribution</Label>
                    <Input name="prizeDistribution" value={state.prizeDistribution} onChange={handleChange} placeholder="e.g., 1st: $500, 2nd: $250" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="rules">Tournament Rules</Label>
                <Textarea name="rules" value={state.rules} onChange={handleChange} placeholder="Describe any special rules for the tournament." />
            </div>
            <div className="flex flex-col md:flex-row gap-6 pt-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="useExistingPlayers"
                        checked={state.useExistingPlayers}
                        onCheckedChange={(checked) => handleCheckboxChange('useExistingPlayers', checked)}
                    />
                    <Label htmlFor="useExistingPlayers" className="font-normal">Use Existing Player List</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="tiered"
                        checked={state.tiered}
                        onCheckedChange={(checked) => handleCheckboxChange('tiered', checked)}
                    />
                    <Label htmlFor="tiered" className="font-normal">Divide Players into Tiers</Label>
                </div>
            </div>
        </div>
    );
};

export default OrganizerDetails;