import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select.jsx";
import { Separator } from "@/components/ui/separator";

// A robust and self-contained modal for editing player details.
const PlayerModalUpdated = ({ isModalOpen, onClose, player, onSave }) => {
    // Local state for form data, initialized from the player prop.
    const [formData, setFormData] = useState({
        name: "",
        skillLevel: 1,
        status: "Registered",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    // useEffect to populate the form whenever a new player is selected.
    useEffect(() => {
        if (player) {
            setFormData({
                name: player.name || "",
                skillLevel: player.skillLevel || 1,
                status: player.status || "Registered",
            });
        }
    }, [player]);

    // Handler for text input changes.
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handler for select dropdown changes.
    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Called when the user clicks the "Save Changes" button.
    const handleConfirmSave = async () => {
        setError(null);
        setIsSaving(true);
        try {
            // The parent component's onSave function handles the API call.
            if (onSave) {
                await onSave({ ...player, ...formData });
            }
            onClose(); // Close the modal on success.
        } catch (err) {
            console.error("Error saving player data:", err);
            setError("Failed to save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    // If the modal isn't open or there's no player, render nothing.
    if (!isModalOpen || !player) return null;

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Player: {player.name}</DialogTitle>
                    <DialogDescription>
                        Make changes to the player's information below. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Name Field */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>

                    {/* Skill Level Field */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="skillLevel" className="text-right">Skill Level</Label>
                        <Select
                            value={String(formData.skillLevel)}
                            onValueChange={(value) => handleSelectChange("skillLevel", Number(value))}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select skill level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1.0 - Beginner</SelectItem>
                                <SelectItem value="2">2.0 - Novice</SelectItem>
                                <SelectItem value="3">3.0 - Intermediate</SelectItem>
                                <SelectItem value="4">4.0 - Advanced</SelectItem>
                                <SelectItem value="5">5.0 - Expert</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status Field */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => handleSelectChange("status", value)}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Registered">Registered</SelectItem>
                                <SelectItem value="Checked In">Checked In</SelectItem>
                                <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Display non-editable context info */}
                <Separator />
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between"><span>Club:</span> <span className="font-medium text-foreground">{player.clubName || "N/A"}</span></div>
                    <div className="flex justify-between"><span>Team:</span> <span className="font-medium text-foreground">{player.teamName || "N/A"}</span></div>
                </div>

                {error && <p className="text-sm text-destructive text-center">{error}</p>}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleConfirmSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

PlayerModalUpdated.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    player: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        skillLevel: PropTypes.number,
        status: PropTypes.string,
        clubName: PropTypes.string,
        teamName: PropTypes.string,
    }),
    onSave: PropTypes.func,
};

export default PlayerModalUpdated;
