import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.jsx";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
} from "@/components/ui/drawer.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx";
import { SelectItem, SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { useMediaQuery } from "react-responsive";
import { updateMatch } from "@/utils/functions/dataUtils.js";
import PropTypes from "prop-types";

const ScoreModalUpdated = ({ isOpen, onClose, match, refreshMatches }) => {
    const [team1Score, setTeam1Score] = useState(0);
    const [team2Score, setTeam2Score] = useState(0);
    const [status, setStatus] = useState("Scheduled");
    const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });

    useEffect(() => {
        setTeam1Score(match.team1Score || 0);
        setTeam2Score(match.team2Score || 0);
        setStatus(match.status || "Scheduled");
    }, [match]);

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

    const handleSubmit = async () => {
        try {
            console.log("Submitting match update", match);
            await updateMatch(match.id, {
                team1Score,
                team2Score,
                status,
            });
            onClose();
            if (typeof refreshMatches === "function") {
                refreshMatches();
            }
        } catch (error) {
            console.error("Error updating match in ScoreModal:", error);
        }
    };

    if (!isOpen || !match) return null;

    // Common form content for both dialog and drawer
    const FormContent = () => (
        <>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="team1Score" className="pb-4">
                        {match.team1?.name} Score
                    </Label>
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
                    <Label htmlFor="team2Score" className="pb-4">
                        {match.team2?.name} Score
                    </Label>
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
                    <Label htmlFor="matchStatus" className="pb-4">
                        Match Status
                    </Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue>{status || "Status"}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup className={"flex flex-col gap-4 p-3"}>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="Scheduled" className="text-blue-600">Scheduled</SelectItem>
                                <SelectItem value="In Progress" className="text-amber-600">In Progress</SelectItem>
                                <SelectItem value="Complete" className="text-emerald-600">Complete</SelectItem>
                                <SelectItem value="Incomplete" className="text-red-600">Incomplete</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    );

    // Footer with buttons for both Dialog and Drawer
    const FooterButtons = () => (
        <div className="flex justify-end gap-4 border-t pt-4">
            <DialogClose asChild>
                <Button variant="destructive" onClick={onClose}>
                    Cancel
                </Button>
            </DialogClose>
            <Button onClick={handleSubmit}>Save Score</Button>
        </div>
    );

    if (isDesktop) {
        return (
            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    if (!open) onClose();
                }}
            >
                <DialogContent forceMount={true} className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update Match Score</DialogTitle>
                        <DialogDescription>
                            {match.team1?.name} vs {match.team2?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <FormContent />
                    <FooterButtons />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DrawerContent className="p-4">
                <DrawerHeader className="text-left">
                    <DrawerTitle>Update Match Score</DrawerTitle>
                    <DrawerDescription>
                        {match.team1?.name} vs {match.team2?.name}
                    </DrawerDescription>
                </DrawerHeader>
                <FormContent />
                <DrawerFooter className="pt-10">
                    <DrawerClose asChild>
                        <Button variant="destructive" onClick={onClose}>
                            Cancel
                        </Button>
                    </DrawerClose>
                    <Button onClick={handleSubmit}>Save Score</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

ScoreModalUpdated.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    match: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        team1: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }),
        team2: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }),
        team1Score: PropTypes.number,
        team2Score: PropTypes.number,
        status: PropTypes.string,
    }).isRequired,
    refreshMatches: PropTypes.func.isRequired,
};

export default ScoreModalUpdated;
