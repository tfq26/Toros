import React, { useEffect } from 'react';
import { useSetupContext } from '@/contexts/SetupContext.jsx';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TournamentDatePicker } from "@/components/ui/date-picker/date-picker.jsx";
import { CardDescription, CardFooter } from '@/components/ui/card.jsx';
import { format } from 'date-fns';

const DateTimeStep = () => {
    const { state, dispatch } = useSetupContext();

    // A single handler to update the date range object in our state
    const handleDateRangeChange = (newDateRange) => {
        dispatch({
            type: 'UPDATE_FIELD',
            payload: { field: 'dateRange', value: newDateRange }
        });
    };

    const handleFieldChange = (field, value) => {
        dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
    };

    // ✨ NEW: Effect to combine date and time into a single value
    useEffect(() => {
        const { dateRange, startTime } = state;
        if (dateRange?.from && startTime) {
            const [hours, minutes] = startTime.split(':');
            const newStartDateTime = new Date(dateRange.from);

            newStartDateTime.setHours(parseInt(hours, 10));
            newStartDateTime.setMinutes(parseInt(minutes, 10));
            newStartDateTime.setSeconds(0);

            // Dispatch the combined value to the context
            dispatch({
                type: 'UPDATE_FIELD',
                payload: { field: 'startDateTime', value: newStartDateTime }
            });
        }
    }, [state.dateRange, state.startTime, dispatch]);

    return (
        <div className="space-y-8">
            <CardDescription>
                Select the start/end dates for your tournament and a specific start time.
            </CardDescription>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Tournament Dates</Label>
                    <TournamentDatePicker
                        value={state.dateRange}
                        onChange={handleDateRangeChange}
                        className="w-full"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                        id="start-time"
                        type="time"
                        value={state.startTime || '09:00'} // Provide a default value
                        onChange={(e) => handleFieldChange('startTime', e.target.value)}
                        className="w-full"
                    />
                </div>
            </div>

            {/* ✨ NEW: Display feedback for the combined date and time */}
            {state.startDateTime && (
                <CardFooter className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                        Tournament will start on: <strong>{format(state.startDateTime, "MMMM do, yyyy 'at' h:mm a")}</strong>
                    </p>
                </CardFooter>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                    <Label>Match Duration: {state.matchDuration} minutes</Label>
                    <Slider
                        value={[state.matchDuration]}
                        max={120}
                        step={5}
                        onValueChange={(value) => handleFieldChange('matchDuration', value[0])}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Break Time Between Matches: {state.breakTime} minutes</Label>
                    <Slider
                        value={[state.breakTime]}
                        max={60}
                        step={5}
                        onValueChange={(value) => handleFieldChange('breakTime', value[0])}
                    />
                </div>
            </div>
        </div>
    );
};

export default DateTimeStep;
