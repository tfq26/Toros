import { useState } from "react";
import PropTypes from "prop-types";

// --- UTILITY IMPORTS ---
// Assuming these functions are in your specified helper file
import { formatTo12HourTime, convertLevel, getEmojiForRank } from "@/utils/functions/HelperFunctions.js";

// --- UI COMPONENT IMPORTS ---
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Separator } from "@/components/ui/separator.jsx";

// --- MODAL IMPORTS ---
import ScoreModalUpdated from "@/pages/Modals/scoreModalUpdated.jsx";
import LoadingModal from "@/pages/Modals/LoadingModal.jsx";

// --- HELPER FUNCTIONS (Consolidated from both files) ---

const getStatusBadgeVariant = (status) => {
    switch (status) {
        case "Complete":
            return "success";
        case "In Progress":
            return "secondary";
        case "Scheduled":
            return "default";
        default:
            return "destructive";
    }
};

/**
 * Combine player names for display.
 * (From MatchCard)
 */
const formatTeamPlayers = (team) => {
    if (!team) return "N/A";
    const player1Name = team.player1?.name || "Team N/A";
    const player2Name = team.player2?.name;
    return player2Name ? `${player1Name} & ${player2Name}` : player1Name;
};

const formatTeamRank = (team) => {
    if (!team || team.skillLevel == null) return "Unranked";
    const level = convertLevel(team.skillLevel);
    const emoji = getEmojiForRank(level);
    return `${level} ${emoji}`;
};


// ✨ FIX: Provide a default empty array for `matches` to prevent the crash.
const MatchTableUpdated = ({ matches = [], refreshMatches, updateMatch, isMobile = false }) => {
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const openModal = (match) => {
        setSelectedMatch(match);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedMatch(null);
        setModalOpen(false);
    };

    const handleScoreUpdate = async (updatedMatch) => {
        if (!updateMatch) {
            console.error("❌ `updateMatch` function is missing!");
            return;
        }
        try {
            setLoading(true);
            await updateMatch(updatedMatch);
            await refreshMatches();
        } catch (error) {
            console.error("❌ Error updating match:", error);
        } finally {
            setLoading(false);
            closeModal();
        }
    };

    const renderNoMatches = () => (
        <div className="text-center py-10 text-muted-foreground">
            No matches found.
        </div>
    );

    // ✨ REFACTOR: Use a guard clause to handle the empty state once at the top.
    if (matches.length === 0) {
        return renderNoMatches();
    }

    if (isMobile) {
        return (
            <>
                {loading && <LoadingModal isLoading={loading} message="Updating match..." />}
                <div className="flex flex-col gap-4 p-2">
                    {/* ✨ REFACTOR: No longer need to check for length here, can just map directly. */}
                    {matches.map((match) => (
                        <Card key={match.id} className="dark:bg-gray-800 border">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">Court {match.courtNumber || "TBD"}</CardTitle>
                                    <Badge variant={getStatusBadgeVariant(match.status)}>{match.status}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                                <div className="text-sm text-muted-foreground text-center space-y-1">
                                    <p><strong>Start:</strong> {formatTo12HourTime(match.startTime)}</p>
                                    <p><strong>End:</strong> {formatTo12HourTime(match.endTime)}</p>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end">
                                <Button onClick={() => openModal(match)} size="sm">Update Score</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                {isModalOpen && selectedMatch && (
                    <ScoreModalUpdated isOpen={isModalOpen} match={selectedMatch} onClose={closeModal} onSubmit={handleScoreUpdate} />
                )}
            </>
        );
    }

    return (
        <>
            {loading && <LoadingModal isLoading={loading} message="Updating match..." />}
            <div className="w-full rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow className={"bg-gray-100 dark:bg-gray-700"}>
                            <TableHead className="w-[25%]">Team 1</TableHead>
                            <TableHead className="w-[25%]">Team 2</TableHead>
                            <TableHead className="w-[20%] text-center">Time</TableHead>
                            <TableHead className="text-center">Score</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* ✨ REFACTOR: No longer need to check for length here. */}
                        {matches.map((match) => (
                            <TableRow key={match.id} className={"hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"}>
                                <TableCell>
                                    <div className="font-medium">{formatTeamPlayers(match.team1)}</div>
                                    <div className="text-xs text-muted-foreground">{formatTeamRank(match.team1)}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{formatTeamPlayers(match.team2)}</div>
                                    <div className="text-xs text-muted-foreground">{formatTeamRank(match.team2)}</div>
                                </TableCell>
                                <TableCell className="text-center text-sm">
                                    <div>{formatTo12HourTime(match.startTime)} - {formatTo12HourTime(match.endTime)}</div>
                                    <div className="text-xs text-muted-foreground">Court {match.courtNumber || 'N/A'}</div>
                                </TableCell>
                                <TableCell className="text-center font-mono font-semibold">
                                    {match.team1Score ?? "0"} - {match.team2Score ?? "0"}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={getStatusBadgeVariant(match.status)}>{match.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" onClick={() => openModal(match)}>Update</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {isModalOpen && selectedMatch && (
                <ScoreModalUpdated isOpen={isModalOpen} match={selectedMatch} onClose={closeModal} onSubmit={handleScoreUpdate} />
            )}
        </>
    );
};

// --- REFACTORED: PropTypes now reflect the richer data structure from MatchCard ---
MatchTableUpdated.propTypes = {
    matches: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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
            startTime: PropTypes.string, // e.g., an ISO string
            endTime: PropTypes.string,   // e.g., an ISO string
        })
    ).isRequired,
    refreshMatches: PropTypes.func.isRequired,
    updateMatch: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
};

export default MatchTableUpdated;