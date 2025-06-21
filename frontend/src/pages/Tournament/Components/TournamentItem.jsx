import PropTypes from "prop-types";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// A robust library for date formatting
import { format } from "date-fns";

// ✨ NEW: A helper to map tournament status to badge colors for a better UI
const statusBadgeMap = {
    SETUP: { text: "Setup", className: "bg-yellow-500 hover:bg-yellow-500" },
    ACTIVE: { text: "Live", className: "bg-green-500 hover:bg-green-500 animate-pulse" },
    COMPLETED: { text: "Completed", className: "bg-gray-500 hover:bg-gray-500" },
    DEFAULT: { text: "Unknown", className: "bg-gray-400 hover:bg-gray-400" },
};


// ✨ MODIFIED: The component now takes an `onManage` prop instead of registration props.
export default function TournamentItem({ tournament, onView, onManage }) {

    const startDate = tournament.startDate
        ? format(new Date(tournament.startDate), "MMM d, yyyy")
        : "Date TBD";

    // ✨ NEW: Get the status information for the badge
    const statusInfo = statusBadgeMap[tournament.status?.toUpperCase()] || statusBadgeMap.DEFAULT;

    return (
        <Card className="transition-shadow hover:shadow-lg dark:bg-card">
            <CardHeader>
                <div className="flex flex-wrap justify-between items-start gap-2">
                    {/* The title and description remain the same */}
                    <div>
                        <CardTitle>{tournament.name}</CardTitle>
                        <CardDescription className="pt-1">
                            {tournament.location || "Location not specified"}
                        </CardDescription>
                    </div>
                    {/* ✨ REPLACED: The "Registered" badge is now a dynamic "Status" badge. */}
                    <Badge className={statusInfo.className}>{statusInfo.text}</Badge>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-semibold text-muted-foreground">Start Date</p>
                        <p className="text-foreground">{startDate}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-muted-foreground">Format</p>
                        <p className="text-foreground">{tournament.format || 'N/A'}</p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3">
                {/* ✨ REPLACED: The button actions are now relevant for a tournament owner. */}
                <Button variant="outline" onClick={onView}>
                    View Live
                </Button>
                <Button onClick={onManage}>
                    Manage
                </Button>
            </CardFooter>
        </Card>
    );
}

// ✨ MODIFIED: PropTypes are updated to match the new component signature.
TournamentItem.propTypes = {
    tournament: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        location: PropTypes.string,
        startDate: PropTypes.string,
        format: PropTypes.string,
        status: PropTypes.string, // Added status for the badge
    }).isRequired,
    onView: PropTypes.func.isRequired,
    onManage: PropTypes.func.isRequired, // Replaced onRegister with onManage
};