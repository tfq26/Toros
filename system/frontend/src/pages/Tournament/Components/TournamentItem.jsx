import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, isToday, isTomorrow } from "date-fns";
import { FaRegCalendar, FaSitemap } from "react-icons/fa6";
import {FaUserCog} from "react-icons/fa";

// Helper for status badges
const statusBadgeMap = {
    SETUP: { text: "Setup", className: "bg-yellow-500 hover:bg-yellow-500" },
    LIVE: { text: "Live", className: "bg-green-500 hover:bg-green-500 animate-pulse" },
    COMPLETED: { text: "Completed", className: "bg-gray-500 hover:bg-gray-500" },
    DEFAULT: { text: "Unknown", className: "bg-gray-400 hover:bg-gray-400" },
};

// Helper for smart date formatting
const formatTournamentDate = (dateString) => {
    if (!dateString) return { relative: "Date TBD", full: "No date provided" };
    const date = new Date(dateString);
    if (isNaN(date)) return { relative: "Invalid Date", full: "The provided date was invalid" };

    const time = format(date, "p"); // e.g., "9:00 AM"
    let relativeDate;

    if (isToday(date)) {
        relativeDate = `Today at ${time}`;
    } else if (isTomorrow(date)) {
        relativeDate = `Tomorrow at ${time}`;
    } else {
        relativeDate = format(date, `MMM d, yyyy 'at' p`);
    }
    return { relative: relativeDate, full: format(date, "PPPPp") };
};

// ✨ The definitive, flexible component
export default function TournamentItem({ tournament, onView, onManage, onRegister }) {
    const { relative: relativeStartDate, full: fullStartDate } = formatTournamentDate(tournament.startDate);
    const statusInfo = statusBadgeMap[tournament.status?.toUpperCase()] || statusBadgeMap.DEFAULT;

    // Stop event propagation for button clicks
    const handleActionClick = (e, action) => {
        e.stopPropagation();
        action();
    };

    return (
        <TooltipProvider>
            {/* The main card is now clickable for a default "view" action, if provided */}
            <Card
                className="transition-shadow hover:shadow-lg dark:bg-background cursor-pointer"
                onClick={onView}
            >
                <CardHeader>
                    <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                            <CardTitle>{tournament.name}</CardTitle>
                            <CardDescription className="pt-1">
                                {tournament.location || "Location not specified"}
                            </CardDescription>
                        </div>
                        <Badge className={statusInfo.className}>{statusInfo.text}</Badge>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
                        <div className="flex items-start gap-3">
                            <FaRegCalendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="font-semibold text-muted-foreground">Start Time</p>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <p className="text-foreground cursor-help">{relativeStartDate}</p>
                                    </TooltipTrigger>
                                    <TooltipContent><p>{fullStartDate}</p></TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <FaSitemap className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="font-semibold text-muted-foreground">Format</p>
                                <p className="text-foreground">{tournament.format || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <FaUserCog className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="font-semibold text-muted-foreground">Organizer</p>
                                <p className="text-foreground">{tournament.organizer || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-3">
                    {/* ✨ This is the key: Conditionally render buttons based on props */}
                    {onView && <Button variant="outline" onClick={(e) => handleActionClick(e, onView)}>View Details</Button>}
                    {onManage && <Button variant="secondary" onClick={(e) => handleActionClick(e, onManage)}>Manage</Button>}
                    {onRegister && <Button variant="default" onClick={(e) => handleActionClick(e, onRegister)}>Register</Button>}
                </CardFooter>
            </Card>
        </TooltipProvider>
    );
}

// ✨ PropTypes now define onManage and onRegister as optional
TournamentItem.propTypes = {
    tournament: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        location: PropTypes.string,
        startDate: PropTypes.string,
        format: PropTypes.string,
        status: PropTypes.string,
        organizer: PropTypes.string,
    }).isRequired,
    onView: PropTypes.func, // The whole card is clickable, so this can be a dedicated button too
    onManage: PropTypes.func, // Optional manage function
    onRegister: PropTypes.func, // Optional register function
};