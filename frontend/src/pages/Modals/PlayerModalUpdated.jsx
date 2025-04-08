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
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select.jsx";
import { savePlayerData, convertLevel } from "../utils/playerUtils.js";

const getSkillDescription = (skillLevel) => {
    switch (skillLevel) {
        case 1:
            return "Beginner";
        case 2:
            return "Intermediate";
        case 3:
            return "Advanced";
        default:
            return "Unknown";
    }
};

const PlayerModalUpdated = ({ isModalOpen, onClose, selectedPlayer, refreshPlayers, onSubmit }) => {
    const [playerName, setPlayerName] = useState("");
    const [playerSkill, setPlayerSkill] = useState(1);
    // Use a string for the status instead of a boolean for registered
    const [status, setStatus] = useState("Registered");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedPlayer) {
            setPlayerName(selectedPlayer.name || "");
            setPlayerSkill(selectedPlayer.skillLevel != null ? selectedPlayer.skillLevel : 1);
            // Assume the selectedPlayer object now contains a "status" property.
            setStatus(selectedPlayer.status || "Registered");
        }
    }, [selectedPlayer]);

    const handleSave = async () => {
        try {
            const formData = {
                name: playerName,
                age: selectedPlayer.age,
                email: selectedPlayer.email,
                phone: selectedPlayer.phone,
                teamNumber: selectedPlayer.teamNumber,
                clubName: selectedPlayer.clubName,
                skillLevel: playerSkill,
                // Send the status in place of the registered boolean
                status: status,
            };
            await savePlayerData({
                formData,
                player: selectedPlayer,
                refreshPlayers,
                setIsDirty: () => {},
                setShowCheckmark: () => {},
            });
            onClose();
        } catch (err) {
            console.error("Error saving player data:", err);
            setError("Error saving player data.");
        }
    };

    if (!isModalOpen || !selectedPlayer) return null;

    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className={"sm:max-w-[500px] w-full p-4 mx-auto rounded-lg top-1/3 transform -translate-x-1/2 -translate-y-1/2"}>
                <DialogHeader>
                    <DialogTitle>Edit Player Information</DialogTitle>
                    <DialogDescription>
                        <p className={"text-sm text-gray-500 dark:text-gray-400 italic"}>
                            Changes will be saved for this tournament only.
                        </p>
                    </DialogDescription>
                    <div className="grid flex-1 gap-4 w-full">
                        <div className="mx-auto flex items-center gap-2 my-3">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="mx-auto w-full flex flex-col items-center gap-2 my-3">
                            <Label htmlFor="skillLevel" className="text-sm font-medium">
                                Skill Level
                            </Label>
                            <Input
                                type="range"
                                min="1"
                                max="3"
                                step="1"
                                value={playerSkill}
                                onChange={(e) => setPlayerSkill(parseInt(e.target.value, 10))}
                                list="steplist"
                                className="px-0 w-full mx-auto"
                            />
                            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                                {getSkillDescription(playerSkill)} ({playerSkill})
                            </p>
                        </div>
                        {/* Replace checkbox with select for status */}
                        <div className="mx-auto flex flex-col items-center gap-2 my-3">
                            <Label htmlFor="status" className="text-sm font-medium">
                                Status
                            </Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Registered">Registered</SelectItem>
                                    <SelectItem value="Checked In">Checked In</SelectItem>
                                    <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* Extra information for mobile view */}
                    <div className="block md:hidden mt-4">
                        <div className="flex flex-col gap-5">
                            <div className="w-full flex items-center gap-5 my-3">
                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Club Name
                                </Label>
                                <p className="text-base text-gray-800 dark:text-gray-100">
                                    {selectedPlayer.clubName || "N/A"}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="w-full flex items-center gap-15 my-3">
                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Rank
                                </Label>
                                <p className="text-base text-gray-800 dark:text-gray-100">
                                    {convertLevel(selectedPlayer.skillLevel)}
                                </p>
                            </div>
                        </div>
                    </div>
                    {error && <p className="text-center text-red-500 text-sm">{error}</p>}
                    <DialogClose asChild>
                        <Button
                            type="button"
                            onClick={handleSave}
                            variant="secondary"
                            className="text-xl px-7 mx-auto hover:bg-emerald-600 bg-emerald-400 dark:hover:bg-emerald-600 dark:bg-emerald-800 w-fit"
                        >
                            Save
                        </Button>
                    </DialogClose>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default PlayerModalUpdated;
