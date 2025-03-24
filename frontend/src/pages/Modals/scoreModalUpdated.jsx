import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import {Select, SelectContent, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {SelectItem} from "@radix-ui/react-select";

const ScoreModalUpdated = ({ isOpen, onClose, match, onSubmit }) => {
    if (!isOpen || !match) return null;

    const [team1Score, setTeam1Score] = useState(match.team1Score || 0);
    const [team2Score, setTeam2Score] = useState(match.team2Score || 0);
    const [status, setStatus] = useState(match.status || "Scheduled");

    // Ensure scores update when a new match is passed in
    useEffect(() => {
        setTeam1Score(match.team1Score || 0);
        setTeam2Score(match.team2Score || 0);
        setStatus(match.status || "Scheduled");
    }, [match]);

    // Handle score validation and update
    const handleScoreChange = (team, value) => {
        let newValue = parseInt(value, 10);
        if (isNaN(newValue)) newValue = 0;
        if (newValue < 0) newValue = 0;
        if (newValue > 21) newValue = 21;

        if (team === "team1") {
            setTeam1Score(newValue);
        } else if (team === "team2") {
            setTeam2Score(newValue);
        }
    };

    // Handle submission with error logging
    const handleSubmit = () => {
        try {
            if (!onSubmit) {
                console.error("❌ `onSubmit` function is undefined in ScoreModal!");
                return;
            }
            console.log("✅ Submitting Match Update from ScoreModal", match);
            onSubmit({
                ...match,
                team1Score,
                team2Score,
                status,
            });
            onClose();
        } catch (error) {
            console.error("Error in handleSubmit of ScoreModal:", error);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Match Score</DialogTitle>
                    <DialogDescription>
                        {match.team1?.name} vs {match.team2?.name}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="team1Score" className={"pb-4"}>{match.team1?.name} Score</Label>
                        <Input
                            id="team1Score"
                            type="number"
                            min="0"
                            max="21"
                            value={team1Score}
                            onChange={(e) => handleScoreChange("team1", e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="team2Score" className={"pb-4"}>{match.team2?.name} Score</Label>
                        <Input
                            id="team2Score"
                            type="number"
                            min="0"
                            max="21"
                            value={team2Score}
                            onChange={(e) => handleScoreChange("team2", e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="matchStatus" className={"pb-4"}>Match Status</Label>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Scheduled">Scheduled</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Complete">Complete</SelectItem>
                            </SelectContent>
                            <SelectValue/>
                        </Select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <DialogClose asChild>
                        <Button variant="destructive" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSubmit}>Save Score</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ScoreModalUpdated;
