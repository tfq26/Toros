import React from "react";
import FileUploader from "./FileUploader";

const PlayerListSettings = ({
                                isLoading,
                                onFileUpload,
                                clubs,
                                levels,
                                selectedClub,
                                selectedLevel,
                                onFilterChange
                            }) => {
    return (
        <aside className="w-fit bg-red-900 p-4 rounded shadow-md h-fit border-gray-300">
            <h3 className="text-xl text-orange-200 font-bold mb-4 text-center">Player List Settings</h3>

            {/* 📌 File Import Button */}
            <div className="mb-6">
                <FileUploader isLoading={isLoading} onFileUpload={onFileUpload} />
            </div>

            {/* 📌 Club Filter */}
            <div className="mb-4">
                <label className="block text-orange-300 font-semibold mb-2">Filter by Club:</label>
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

            {/* 📌 Level Filter */}
            <div>
                <label className="block text-orange-300 font-semibold mb-2">Filter by Level:</label>
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
