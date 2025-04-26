import  { useState, useEffect } from "react";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select.jsx";
import { savePlayerData, convertLevel } from "@/utils/functions/HelperFunctions.js";
import DialogProvider from "../../utils/DialogProvider.jsx";
import PropTypes from "prop-types"; // Adjust path if needed

// Helper to return a description for a given skill level.
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

const PlayerModalUpdated = ({ isModalOpen, onClose, selectedPlayer, refreshPlayers }) => {
    const [playerName, setPlayerName] = useState("");
    const [playerSkill, setPlayerSkill] = useState(1);
    const [status, setStatus] = useState("Registered");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedPlayer) {
            setPlayerName(selectedPlayer.name || "");
            setPlayerSkill(selectedPlayer.skillLevel ?? 1);
            setStatus(selectedPlayer.status || "Registered");
        }
    }, [selectedPlayer]);

    // This function is called when the form is submitted, e.g., by pressing Enter.
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
                status,
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

    // If modal is not open or there is no selected player, render nothing.
    if (!isModalOpen || !selectedPlayer) return null;

    return (
        <DialogProvider
            isOpen={isModalOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
            title="Edit Player Information"
            description="Edit player details. Changes will be saved for this tournament only."
            onConfirm={handleSave}
            onCancel={onClose}
            confirmText="Save"
        >
            {/* Wrap everything in a form to allow Enter to submit */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                }}
                className="grid gap-4"
            >
                {/* Name Field */}
                <div className="flex items-center gap-2">
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

                {/* Skill Level Field */}
                <div className="flex flex-col items-center gap-2">
                    <Label htmlFor="skillLevel" className="text-sm font-medium">
                        Skill Level
                    </Label>
                    <Input
                        id="skillLevel"
                        type="range"
                        min="1"
                        max="3"
                        step="1"
                        value={playerSkill}
                        onChange={(e) => setPlayerSkill(Number(e.target.value))}
                        className="w-full"
                        // The arrow keys should natively adjust the range slider.
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                        {getSkillDescription(playerSkill)} ({playerSkill})
                    </p>
                </div>

                {/* Status Field */}
                <div className="flex flex-col items-center gap-2">
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

                {/* Mobile-only information */}
                <div className="md:hidden mt-4 space-y-4">
                    <div className="flex items-center gap-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Club Name
                        </Label>
                        <p className="text-base text-gray-800 dark:text-gray-100">
                            {selectedPlayer.clubName || "N/A"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Rank
                        </Label>
                        <p className="text-base text-gray-800 dark:text-gray-100">
                            {convertLevel(selectedPlayer.skillLevel)}
                        </p>
                    </div>
                </div>

                {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
            </form>
        </DialogProvider>
    );
};

PlayerModalUpdated.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    selectedPlayer: PropTypes.shape({
        name: PropTypes.string,
        age: PropTypes.number,
        email: PropTypes.string,
        phone: PropTypes.string,
        teamNumber: PropTypes.number,
        clubName: PropTypes.string,
        skillLevel: PropTypes.number,
        status: PropTypes.string,
    }),
    refreshPlayers: PropTypes.func.isRequired,
};

export default PlayerModalUpdated;
