import React from "react";
import FileUploader from "./FileUploader";
import AddPlayer from "../Modals/AddPlayer.jsx"; // Ensure correct path to AddPlayer component
import * as PropTypes from "prop-types";

class PlayerSettings extends React.Component {
    render() {
        let {
            isLoading,
            onFileSelect,
            onStatusUpdate,
            clubs,
            levels,
            selectedClub,
            selectedLevel,
            onFilterChange,
            onAddPlayer // This can now be passed as onPlayerAdded to the AddPlayer component
        } = this.props;
        return (
            <aside className="w-full bg-emerald-600 dark:bg-gray-900 p-4 rounded shadow-md h-fit border-gray-300">
                <h3 className="text-xl text-orange-200 font-bold mb-4 text-center">
                    Player List Settings
                </h3>

                {/* File Import and Add Player Section */}
                <div className="flex flex-col items-center gap-4">
                    <div>
                        <FileUploader
                            isLoading={isLoading}
                            onFileSelect={onFileSelect}
                            onStatusUpdate={onStatusUpdate}
                        />
                    </div>
                    <div>
                        <AddPlayer
                            onPlayerAdded={onAddPlayer}
                            onStatusUpdate={onStatusUpdate}
                        />
                    </div>
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
    }
}

PlayerSettings.propTypes = {
    isLoading: PropTypes.any,
    onFileSelect: PropTypes.any,
    onStatusUpdate: PropTypes.any,
    clubs: PropTypes.any,
    levels: PropTypes.any,
    selectedClub: PropTypes.any,
    selectedLevel: PropTypes.any,
    onFilterChange: PropTypes.any,
    onAddPlayer: PropTypes.any
}

export default PlayerSettings;
