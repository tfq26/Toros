import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";

const EndTournamentModalUpdated = ({ isOpen, onClose, endTournament }) => {
    const navigate = useNavigate();

    const handleConfirm = async () => {
        try {
            await endTournament();
            onClose();
            navigate("/tournament/my");
        } catch (error) {
            console.error("Error ending tournament:", error);
            alert("An error occurred while ending the tournament.");
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
                    <DialogTitle>End Tournament?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to end the tournament? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-6 flex justify-end gap-4">
                    <DialogClose asChild>
                        <Button variant="destructive" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={handleConfirm}>Yes, End Tournament</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EndTournamentModalUpdated;
