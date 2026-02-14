import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ScoreModalUpdated = React.forwardRef(({ isOpen, onClose, match, onSubmit }, ref) => {
    // Local state to manage scores within the modal
    const [team1Score, setTeam1Score] = useState(match.team1Score ?? 0);
    const [team2Score, setTeam2Score] = useState(match.team2Score ?? 0);

    // Update local state if the selected match prop changes
    useEffect(() => {
        setTeam1Score(match.team1Score ?? 0);
        setTeam2Score(match.team2Score ?? 0);
    }, [match]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call the parent's onSubmit function with the updated match data
        onSubmit({
            ...match,
            team1Score: parseInt(team1Score, 10) || 0, // Ensure it's a number
            team2Score: parseInt(team2Score, 10) || 0, // Ensure it's a number
            status: "Complete", // Submitting a final score marks the match as complete
        });
    };

    // Don't render the modal if it's not open
    if (!isOpen) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent ref={ref} className="sm:max-w-[425px]">
                {/* --- FIX: Added the Title and Description back to the header --- */}
                <DialogHeader>
                    <DialogTitle>Update Score for Match {match.id?.slice(-4)}</DialogTitle>
                    <DialogDescription>
                        {match.team1?.name ?? "Team 1"} vs {match.team2?.name ?? "Team 2"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="team1-score" className="col-span-3">
                                {match.team1?.name ?? "Team 1"}
                            </Label>
                            <Input
                                id="team1-score"
                                type="number"
                                value={team1Score}
                                onChange={(e) => setTeam1Score(e.target.value)}
                                className="col-span-1"
                                min="0"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="team2-score" className="col-span-3">
                                {match.team2?.name ?? "Team 2"}
                            </Label>
                            <Input
                                id="team2-score"
                                type="number"
                                value={team2Score}
                                onChange={(e) => setTeam2Score(e.target.value)}
                                className="col-span-1"
                                min="0"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Save Score</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
});

// Add a display name for better debugging
ScoreModalUpdated.displayName = "ScoreModalUpdated";

ScoreModalUpdated.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    match: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        team1: PropTypes.shape({ name: PropTypes.string }),
        team2: PropTypes.shape({ name: PropTypes.string }),
        team1Score: PropTypes.number,
        team2Score: PropTypes.number,
    }).isRequired,
};

export default ScoreModalUpdated;