import React, { useState } from "react";
import axios from "axios";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Button } from "@/components/ui/button.jsx";

const DEFAULT_PLAYER = {
    name: "",
    teamNumber: "",
    clubName: "",
    skillLevel: "",
    registered: false,
};

const AddPlayer = ({ onPlayerAdded, onStatusUpdate }) => {
    const [player, setPlayer] = useState(DEFAULT_PLAYER);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPlayer((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
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
                // Reset form
                setPlayer(DEFAULT_PLAYER);
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
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                    Add Player
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Add New Player</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please enter the player's details below.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={player.name}
                            onChange={handleInputChange}
                            className="border rounded px-2 py-1 w-full"
                            placeholder="Enter player name"
                        />
                    </div>
                    <div>
                        <Label htmlFor="teamNumber">Team Number</Label>
                        <input
                            type="text"
                            id="teamNumber"
                            name="teamNumber"
                            value={player.teamNumber}
                            onChange={handleInputChange}
                            className="border rounded px-2 py-1 w-full"
                            placeholder="Enter team number"
                        />
                    </div>
                    <div>
                        <Label htmlFor="clubName">Club Name</Label>
                        <input
                            type="text"
                            id="clubName"
                            name="clubName"
                            value={player.clubName}
                            onChange={handleInputChange}
                            className="border rounded px-2 py-1 w-full"
                            placeholder="Enter club name"
                        />
                    </div>
                    <div>
                        <Label htmlFor="skillLevel">Skill Level</Label>
                        <input
                            type="text"
                            id="skillLevel"
                            name="skillLevel"
                            value={player.skillLevel}
                            onChange={handleInputChange}
                            className="border rounded px-2 py-1 w-full"
                            placeholder="Enter skill level"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="registered"
                            name="registered"
                            checked={player.registered}
                            onChange={handleInputChange}
                        />
                        <Label htmlFor="registered">Registered</Label>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Player"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AddPlayer;
