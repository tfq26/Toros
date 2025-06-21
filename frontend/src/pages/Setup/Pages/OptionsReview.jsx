import 'react';
import { useSetup } from "@/contexts/SetupContext.jsx";
import { CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from "date-fns"; // A great library for formatting dates

/**
 * A small, reusable component to display each review item cleanly.
 */
// eslint-disable-next-line react/prop-types
const ReviewItem = ({ label, value, isBoolean = false }) => {
    let displayValue = value;

    if (isBoolean) {
        displayValue = value ? 'Yes' : 'No';
    } else if (value === null || value === undefined || value === '') {
        displayValue = <span className="text-muted-foreground/70">Not set</span>;
    }

    return (
        <div className="flex justify-between items-start py-3">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="font-medium text-right text-wrap ml-4">{displayValue}</dd>
        </div>
    );
};

/**
 * Helper function to format the date range object into a readable string.
 * @param {{from: Date, to: Date} | null} range - The date range object from the context.
 */
const formatDateRange = (range) => {
    if (!range?.from) {
        return null; // The ReviewItem will handle displaying "Not set"
    }
    const fromDate = format(new Date(range.from), "MMM d, yyyy");

    if (!range.to) {
        return fromDate; // Handle case where only a start date is selected
    }
    const toDate = format(new Date(range.to), "MMM d, yyyy");

    if (fromDate === toDate) {
        return fromDate; // If it's a single-day event
    }

    return `${fromDate} - ${toDate}`;
};


const OptionsReviewStep = () => {
    const { state } = useSetup(); // Get the final state from the context

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold">Review Your Configuration</h3>
                <CardDescription>
                    Please review all the tournament details below. Click "Create Tournament" if everything is correct.
                </CardDescription>
            </div>

            <div className="space-y-4 rounded-lg border p-4 md:p-6">

                <h4 className="font-semibold text-lg">Tournament Details</h4>
                <dl className="divide-y divide-border">
                    <ReviewItem label="Tournament Name" value={state.tournamentName} />
                    <ReviewItem label="Location" value={state.location} />
                </dl>

                <Separator className="my-4" />

                <h4 className="font-semibold text-lg">Schedule & Pacing</h4>
                <dl className="divide-y divide-border">
                    <ReviewItem label="Tournament Dates" value={formatDateRange(state.dateRange)}/>
                    {/* ✨ NEW: Added the start time review item */}
                    <ReviewItem label="Start Time" value={state.startDateTime ? format(state.startDateTime, 'h:mm a') : state.startTime} />
                    <ReviewItem label="Match Duration" value={`${state.matchDuration} min`}/>
                    <ReviewItem label="Break Time" value={`${state.breakTime} min`}/>
                </dl>

                <Separator className="my-4"/>

                <h4 className="font-semibold text-lg">Player & Match Settings</h4>
                <dl className="divide-y divide-border">
                    <ReviewItem label="Number of Courts" value={state.numCourts} />
                    <ReviewItem label="Guaranteed Games" value={state.gamesPerTeam} />
                    <ReviewItem label="Use Existing Player List" value={state.useExistingPlayers} isBoolean />
                    <ReviewItem label="Divide into Tiers" value={state.tiered} isBoolean />
                </dl>

                <Separator className="my-4" />

                <h4 className="font-semibold text-lg">Organizer Info</h4>
                <dl className="divide-y divide-border">
                    <ReviewItem label="Organizer" value={state.organizer} />
                    <ReviewItem label="Contact Info" value={state.contactInfo} />
                    <ReviewItem label="Prizes" value={state.prizeDistribution} />
                </dl>
            </div>
        </div>
    );
};

export default OptionsReviewStep;
