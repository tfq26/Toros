import React, { useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
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

const DEFAULT_PLAYER = {
    name: "",
    teamNumber: "",
    clubName: "",
    skillLevel: "",
    status: "Registered",
};

const AddPlayer = ({ onPlayerAdded, onStatusUpdate }) => {
    const [player, setPlayer] = useState(DEFAULT_PLAYER);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPlayer((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        onStatusUpdate && onStatusUpdate("Adding player...");
        try {
            const response = await axios.post("http://localhost:8080/api/players/add", player);
            if (response.status === 200) {
                onStatusUpdate && onStatusUpdate("✅ Player added successfully!");
                onPlayerAdded && onPlayerAdded(response.data);
                setPlayer(DEFAULT_PLAYER);
                setOpen(false);
            } else {
                onStatusUpdate && onStatusUpdate("⚠️ Error adding player. Please try again.");
            }
        } catch (error) {
            console.error("❌ Error adding player:", error);
            onStatusUpdate && onStatusUpdate("❌ Failed to add player. Check the server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                    Add Player
                </Button>
            </DialogTrigger>
            <DialogContent className="p-4">
                <DialogHeader>
                    <DialogTitle className="text-lg">Add New Player</DialogTitle>
                    <DialogDescription className="text-sm">
                        Enter the player's details below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-2 mt-3">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="name" className="text-xs">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Player name"
                            value={player.name}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="teamNumber" className="text-xs">
                            Team Number
                        </Label>
                        <Input
                            id="teamNumber"
                            name="teamNumber"
                            type="text"
                            placeholder="Team number"
                            value={player.teamNumber}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="clubName" className="text-xs">
                            Club Name
                        </Label>
                        <Input
                            id="clubName"
                            name="clubName"
                            type="text"
                            placeholder="Club name"
                            value={player.clubName}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="skillLevel" className="text-xs">
                            Skill Level
                        </Label>
                        <Input
                            id="skillLevel"
                            name="skillLevel"
                            type="text"
                            placeholder="Skill level"
                            value={player.skillLevel}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="status" className="text-xs">
                            Status
                        </Label>
                        <Select
                            value={player.status}
                            onValueChange={(value) =>
                                setPlayer((prev) => ({ ...prev, status: value }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Registered">Registered</SelectItem>
                                <SelectItem value="Checked In">Checked In</SelectItem>
                                <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogClose asChild>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="mt-4 w-full text-sm px-4 py-2 hover:bg-emerald-300 bg-emerald-400"
                    >
                        {isSubmitting ? "Adding..." : "Add Player"}
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default AddPlayer;
