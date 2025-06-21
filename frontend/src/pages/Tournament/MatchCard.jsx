import React, { useState } from "react";
import PropTypes from "prop-types";
import { formatTo12HourTime, convertLevel, getEmojiForRank } from "@/utils/functions/HelperFunctions.js";
import { cn } from "@/lib/utils"; // Import the cn utility for conditional classes

// UI Components from shadcn/ui
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Separator } from "@/components/ui/separator.jsx";

// Modals
import ScoreModalUpdated from "@/pages/Modals/scoreModalUpdated.jsx";

// --- REFACTOR: Moved helper functions outside the component for efficiency ---
/**
 * Combine player names for display.
 */
const formatTeamPlayers = (team) => {
    if (!team) return "N/A";
    const player1Name = team.player1?.name || "N/A";
    const player2Name = team.player2?.name;
    return player2Name ? `${player1Name} & ${player2Name}` : player1Name;
};

/**
 * Get a display string for the team's rank.
 */
const formatTeamRank = (team) => {
    if (!team) return "N/A";
    const level = convertLevel(team.skillLevel ?? "N/A");
    const emoji = getEmojiForRank(level);
    return `${level} ${emoji}`;
};

const getCardBorderColor = (status) => {
    switch (status) {
        case "Complete":
            return "border-green-500";
        case "In Progress":
            return "border-amber-500";
        case "Scheduled":
            return "border-blue-500";
        default:
            return "border-slate-300 dark:border-slate-700"; // For any other status
    }
};

const MatchCard = ({ match, updateMatch }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isInspected, setIsInspected] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleStatusChange = (newStatus) => {
        if (newStatus === "Complete") {
            openModal(); // Open modal when marked as complete to confirm score
        } else {
            updateMatch({ ...match, status: newStatus });
        }
    };

    const handleScoreUpdate = (updatedMatch) => {
        updateMatch(updatedMatch);
        closeModal();
    };

    const handleInspect = () => {
        console.log("Inspecting match card:", match);
        setIsInspected((prev) => !prev);
    };

    return (
        <>
            {/* REFACTOR: The entire card is rebuilt with semantic components */}
            <Card
                className={cn(
                    "flex flex-col border-2 transition-all", // Base classes
                    getCardBorderColor(match.status), // Dynamic border color!
                    isInspected && "ring-4 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-900" // Inspection ring
                )}
            >
                <CardHeader>
                    <div className="flex justify-between items-center gap-4">
                        <CardTitle>Match {match.id?.slice(-4) || "N/A"}</CardTitle>
                        {/* REFACTOR: Upgraded to shadcn/ui Select component */}
                        <Select onValueChange={handleStatusChange} defaultValue={match.status || "Scheduled"}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Set Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Scheduled">Scheduled</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Complete">Complete</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <CardDescription>Court {match.courtNumber || "N/A"}</CardDescription>
                </CardHeader>

                <CardContent className="flex-grow space-y-4">
                    {/* REFACTOR: Using a grid for a cleaner side-by-side team layout */}
                    <div className="grid grid-cols-2 gap-x-4 text-center">
                        <div className="space-y-1">
                            <p className="font-semibold">{formatTeamPlayers(match.team1)}</p>
                            <p className="text-sm text-muted-foreground">{formatTeamRank(match.team1)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold">{formatTeamPlayers(match.team2)}</p>
                            <p className="text-sm text-muted-foreground">{formatTeamRank(match.team2)}</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">SCORE</p>
                        <p className="text-2xl font-bold font-mono">
                            {match.team1Score ?? "0"} - {match.team2Score ?? "0"}
                        </p>
                    </div>

                    <Separator />

                    <div className="text-md text-muted-foreground text-center space-y-1">
                        <p>
                            <strong>Start:</strong> {formatTo12HourTime(match.startTime ?? "N/A")}
                        </p>
                        <p>
                            <strong>End:</strong> {formatTo12HourTime(match.endTime ?? "N/A")}
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={handleInspect}>
                        {isInspected ? "Inspected" : "Inspect"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={openModal}>
                        Update Score
                    </Button>
                </CardFooter>
            </Card>

            {/* The modal logic remains the same */}
            <ScoreModalUpdated
                isOpen={isModalOpen}
                match={match}
                onClose={closeModal}
                onSubmit={handleScoreUpdate}
            />
        </>
    );
};

// PropTypes remain largely the same and are still a good practice
MatchCard.propTypes = {
    match: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        status: PropTypes.string,
        courtNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        team1: PropTypes.shape({
            player1: PropTypes.shape({ name: PropTypes.string }),
            player2: PropTypes.shape({ name: PropTypes.string }),
            skillLevel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
        team2: PropTypes.shape({
            player1: PropTypes.shape({ name: PropTypes.string }),
            player2: PropTypes.shape({ name: PropTypes.string }),
            skillLevel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
        team1Score: PropTypes.number,
        team2Score: PropTypes.number,
        startTime: PropTypes.string,
        endTime: PropTypes.string,
    }).isRequired,
    updateMatch: PropTypes.func.isRequired,
};

export default MatchCard;