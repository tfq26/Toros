import { useState, useEffect } from "react";
import { savePlayerData, deletePlayerData } from "@/utils/functions/playerUtils.js";

const PlayerModal = ({ player, onClose, refreshPlayers }) => {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        email: "",
        phone: "",
        teamNumber: "",
        clubName: "",
        placement: "",
        registered: false, // ✅ Added registered field
    });
    const [isDirty, setIsDirty] = useState(false);
    const [showCheckmark, setShowCheckmark] = useState(false);

    useEffect(() => {
        if (player) {
            setFormData({
                name: player.name || "",
                age: player.age || "",
                email: player.email || "",
                phone: player.phone || "",
                teamNumber: player.teamNumber || "",
                clubName: player.clubName || "",
                placement: player.SkillLevel || "",
                registered: player.registered || false, // ✅ Load registered status
            });
        } else {
            setFormData({
                name: "",
                age: "",
                email: "",
                phone: "",
                teamNumber: "",
                clubName: "",
                placement: "",
                registered: false, // ✅ Default to false for new players
            });
        }
        setIsDirty(false);
    }, [player]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
        setIsDirty(true);
    };

    const handleSave = async () => {
        try {
            await savePlayerData({
                formData,
                player,
                refreshPlayers,
                setIsDirty,
                setShowCheckmark,
            });
        } catch (error) {
            // Optional: set error state or notify user
        }
    };

    const handleDelete = async () => {
        try {
            await deletePlayerData({ player, refreshPlayers, onClose });
        } catch (error) {
            // Optional: handle error
        }
    };

    const handleExit = () => {
        if (isDirty && !window.confirm("You have unsaved changes. Exit without saving?")) {
            return;
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-lg flex justify-center items-center z-50 transition">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full animate__animated animate__fadeIn relative">
                {/* Close Button */}
                <button
                    onClick={handleExit}
                    className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-xl font-bold"
                >
                    ❌
                </button>

                <h2 className="text-xl font-bold mb-4 dark:text-gray-800">
                    {player ? "Edit Player" : "Add Player"}
                </h2>

                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:text-gray-800"
                        />
                    </div>

                    {/* Age */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:text-gray-800"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:text-gray-800"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:text-gray-800"
                        />
                    </div>

                    {/* Team Number */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Team Number</label>
                        <input
                            type="number"
                            name="teamNumber"
                            value={formData.teamNumber}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:text-gray-800"
                        />
                    </div>

                    {/* Club Name */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Club Name</label>
                        <input
                            type="text"
                            name="clubName"
                            value={formData.clubName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:text-gray-800"
                        />
                    </div>

                    {/* Placement */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Placement</label>
                        <input
                            type="number"
                            name="placement"
                            value={formData.placement}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:text-gray-800"
                        />
                    </div>

                    {/* Registered Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="registered"
                            checked={formData.registered}
                            onChange={handleChange}
                            className="h-5 w-5 text-emerald-600 focus:ring-0"
                        />
                        <label className="ml-2 text-gray-700 font-semibold">Registered</label>
                    </div>
                </div>

                {/* Buttons with Checkmark */}
                <div className="mt-6 flex justify-between items-center">
                    <button onClick={handleSave} className="px-4 py-2 bg-emerald-500 text-white rounded">
                        Save Changes
                    </button>

                    {showCheckmark && <span className="text-green-500 text-xl">✅</span>}

                    {player && (
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayerModal;
