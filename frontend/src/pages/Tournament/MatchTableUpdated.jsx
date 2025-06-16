import { useState } from "react";
import PropTypes from "prop-types";

// UI components from shadcn/ui
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
import { Badge } from "@/components/ui/badge.jsx"; // Assuming you have this component

// Modals
import ScoreModalUpdated from "@/pages/Modals/scoreModalUpdated.jsx";
import LoadingModal from "@/pages/Modals/LoadingModal.jsx";

// A helper function to map match status to a badge variant
const getStatusBadgeVariant = (status) => {
    switch (status) {
        case "Complete":
            return "success"; // You can define a 'success' variant in your badge component
        case "In Progress":
            return "secondary";
        case "Scheduled":
            return "default";
        default:
            return "destructive";
    }
};

const MatchTableUpdated = ({ matches, refreshMatches, updateMatch, isMobile = false }) => {
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
            console.error("❌ `updateMatch` function is missing in MatchTable!");
            return;
        }
        try {
            setLoading(true);
            await updateMatch(updatedMatch);
            // The refresh can be triggered from the parent component after the update is complete.
            // Calling it here is also fine, but sometimes letting the parent handle it is cleaner.
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

    // --- REFACTORED: Mobile view now uses Card components for a cleaner look ---
    if (isMobile) {
        return (
            <>
                {loading && <LoadingModal isLoading={loading} message="Updating match..." />}
                <div className="flex flex-col gap-4 p-2">
                    {matches.length > 0 ? (
                        matches.map((match) => (
                            <Card key={match.id} className="dark:bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-center text-lg">
                                        {match.team1?.name ?? "N/A"} vs {match.team2?.name ?? "N/A"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-2">
                                    <div className="text-lg font-semibold">
                                        {match.team1Score ?? "0"} - {match.team2Score ?? "0"}
                                    </div>
                                    <Badge variant={getStatusBadgeVariant(match.status)}>
                                        {match.status}
                                    </Badge>
                                </CardContent>
                                <CardFooter className="justify-center">
                                    <Button onClick={() => openModal(match)} size="sm">
                                        Update Score
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        renderNoMatches()
                    )}
                </div>
                {isModalOpen && selectedMatch && (
                    <ScoreModalUpdated isOpen={isModalOpen} match={selectedMatch} onClose={closeModal} onSubmit={handleScoreUpdate} />
                )}
            </>
        );
    }

    // --- REFACTORED: Desktop view now uses correct shadcn/ui Table structure ---
    return (
        <>
            {loading && <LoadingModal isLoading={loading} message="Updating match..." />}
            <div className="w-full rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow className={"bg-gray-100 dark:bg-gray-700"}>
                            <TableHead className="w-[25%]">Team 1</TableHead>
                            <TableHead className="w-[25%]">Team 2</TableHead>
                            <TableHead className="text-center">Score</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {matches.length > 0 ? (
                            matches.map((match) => (
                                <TableRow key={match.id} className={"hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 bg-emerald-200 dark:bg-emerald-800"}>
                                    <TableCell className="font-medium">{match.team1?.name ?? "N/A"}</TableCell>
                                    <TableCell className="font-medium">{match.team2?.name ?? "N/A"}</TableCell>
                                    <TableCell className="text-center font-mono">
                                        {match.team1Score ?? "0"} - {match.team2Score ?? "0"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={getStatusBadgeVariant(match.status)}>
                                            {match.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button className={'cursor-pointer'} variant="outline" size="sm" onClick={() => openModal(match)}>
                                            Update
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No matches found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {isModalOpen && selectedMatch && (
                <ScoreModalUpdated isOpen={isModalOpen} match={selectedMatch} onClose={closeModal} onSubmit={handleScoreUpdate} />
            )}
        </>
    );
};

MatchTableUpdated.propTypes = {
    matches: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            team1: PropTypes.shape({ name: PropTypes.string }),
            team2: PropTypes.shape({ name: PropTypes.string }),
            team1Score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            team2Score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            status: PropTypes.string,
        })
    ).isRequired,
    refreshMatches: PropTypes.func.isRequired,
    updateMatch: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
};

export default MatchTableUpdated;