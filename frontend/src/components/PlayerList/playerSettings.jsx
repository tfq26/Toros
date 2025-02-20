import React from "react";
import FileUploader from "./FileUploader";

const PlayerListSettings = ({
                                isLoading,
                                onFileSelect,
                                onStatusUpdate,
                                clubs,
                                levels,
                                selectedClub,
                                selectedLevel,
                                onFilterChange,
                                onAddPlayer // New prop to handle adding a player
                            }) => {
    return (
        <aside className="w-full bg-red-600 dark:bg-gray-900 p-4 rounded shadow-md h-fit border-gray-300">
            <h3 className="text-xl text-orange-200 font-bold mb-4 text-center">
                Player List Settings
            </h3>

            {/* File Import Button */}
            <div className="flex items-center gap-4">
                <FileUploader
                    isLoading={isLoading}
                    onFileSelect={onFileSelect}
                    onStatusUpdate={onStatusUpdate}
                />
                <button
                    className="cursor-pointer bg-amber-300 text-amber-800 px-4 py-2 rounded hover:bg-amber-600 hover:text-white transition duration-200"
                    onClick={onAddPlayer}
                >
                    Add Player
                </button>
            </div>

            {/* Club Filter */}
            <div className="my-4">
                <label className="block text-orange-300 font-semibold mb-2">
                    Filter by Club:
                </label>
                <select
                    className="w-full p-2 rounded bg-white text-gray-800"
                    value={selectedClub}
                    onChange={(e) => onFilterChange("club", e.target.value)}
                >
                    <option value="">All Clubs</option>
                    {clubs.map((club) => (
                        <option key={club} value={club}>
                            {club}
                        </option>
                    ))}
                </select>
            </div>

            {/* Level Filter */}
            <div>
                <label className="block text-orange-300 font-semibold mb-2">
                    Filter by Level:
                </label>
                <select
                    className="w-full p-2 rounded bg-white text-gray-800"
                    value={selectedLevel}
                    onChange={(e) => onFilterChange("level", e.target.value)}
                >
                    <option value="">All Levels</option>
                    {levels.map((level) => (
                        <option key={level} value={level}>
                            {level}
                        </option>
                    ))}
                </select>
            </div>
        </aside>
    );
};

export default PlayerListSettings;
