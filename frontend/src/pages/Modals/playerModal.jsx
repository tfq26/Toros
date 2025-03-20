import { useState, useEffect } from "react";
import axios from "axios";

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
            [name]: type === "checkbox" ? checked : value, // ✅ Handles checkbox properly
        });
        setIsDirty(true);
    };

    const handleSave = async () => {
        try {
            const payload = {
                ...formData,
                age: parseInt(formData.age, 10) || 0,
                teamNumber: parseInt(formData.teamNumber, 10) || 0,
                placement: parseInt(formData.placement, 10) || 0,
            };

            if (player) {
                await axios.put(`http://localhost:8080/api/players/${player.id}`, payload);
            } else {
                await axios.post(`http://localhost:8080/api/players`, payload);
            }

            refreshPlayers();
            setIsDirty(false);
            setShowCheckmark(true);

            // Hide checkmark after 3 seconds
            setTimeout(() => setShowCheckmark(false), 3000);
        } catch (error) {
            console.error("Error saving player:", error);
        }
    };

    const handleDelete = async () => {
        if (!player) return;
        if (!window.confirm("Are you sure you want to delete this player?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/players/${player.id}`);
            refreshPlayers();
            onClose();
        } catch (error) {
            console.error("Error deleting player:", error);
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

                <h2 className="text-xl font-bold mb-4 dark:text-gray-800">{player ? "Edit Player" : "Add Player"}</h2>
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

                    {/* ✅ Registered Checkbox */}
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
