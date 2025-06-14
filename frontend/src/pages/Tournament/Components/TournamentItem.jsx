// src/components/TournamentItem.jsx
import PropTypes from "prop-types";

// UI Components from your library (like shadcn/ui)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// A robust library for date formatting is recommended.
// If you don't have it: npm install date-fns
import { format } from "date-fns";

export default function TournamentItem({
                                           tournament,
                                           isRegistered,
                                           onView,
                                           onRegister,
                                       }) {
    // REFACTOR: Safely format dates and provide clear fallbacks if data is missing.
    const startDate = tournament.startDate
        ? format(new Date(tournament.startDate), "MMM d, yyyy")
        : "Date TBD";

    const registrationEndDate = tournament.registrationEndDate
        ? format(new Date(tournament.registrationEndDate), "MMM d, yyyy")
        : "N/A";

    return (
        // REFACTOR: Switched from <li> to <Card> for better structure and UI consistency.
        <Card className="transition-shadow hover:shadow-lg dark:bg-card">
            <CardHeader
                onClick={onView} // REFACTOR: Kept the "click header to view" functionality.
                className="cursor-pointer"
            >
                <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                        <CardTitle>{tournament.name}</CardTitle>
                        <CardDescription className="pt-1">
                            {tournament.location || "Location not specified"}
                        </CardDescription>
                    </div>
                    {/* REFACTOR: Added a Badge for a clear visual status indicator. */}
                    {isRegistered && <Badge variant="secondary">Registered</Badge>}
                </div>
            </CardHeader>

            <CardContent>
                {/* REFACTOR: Displaying more useful information in a structured way. */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-semibold text-muted-foreground">Start Date</p>
                        <p className="text-foreground">{startDate}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-muted-foreground">Registration Closes</p>
                        <p className="text-foreground">{registrationEndDate}</p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3">
                {/* REFACTOR: Buttons now have specific purposes and use variants for styling. */}
                <Button variant="outline" onClick={onView}>
                    View Details
                </Button>
                <Button
                    onClick={onRegister}
                    disabled={isRegistered}
                    aria-label={isRegistered ? "You are already registered" : "Register for this tournament"}
                >
                    {isRegistered ? "Registered" : "Register Now"}
                </Button>
            </CardFooter>
        </Card>
    );
}

// REFACTOR: Updated PropTypes to match the new, more explicit props API.
TournamentItem.propTypes = {
    tournament: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        location: PropTypes.string,
        startDate: PropTypes.string,
        registrationEndDate: PropTypes.string,
    }).isRequired,
    isRegistered: PropTypes.bool.isRequired,
    onView: PropTypes.func.isRequired,
    onRegister: PropTypes.func.isRequired,
};