import React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const FileUploader = ({ isLoading, onFileSelect, onStatusUpdate }) => {
    const handleFileSelection = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        confirmAlert({
            title: "Confirm Import",
            message: "Importing a new file will overwrite all existing player data. Do you want to proceed?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => onFileSelect(file), // ✅ Pass file to PlayerList.js
                },
                {
                    label: "No",
                },
            ],
        });
    };

    return (
        <div className="mb-6">
            {/* Import Button */}
            <label className="cursor-pointer bg-emerald-300 text-emerald-800 px-4 py-2 rounded hover:bg-emerald-600 hover:text-white transition duration-200">
                Import Players
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileSelection} // ✅ Triggers confirmation & sends file up
                    className="hidden"
                />
            </label>

            {/* Loading State */}
            {isLoading && <p className="text-blue-500 mt-2">Importing file, please wait...</p>}
        </div>
    );
};

export default FileUploader;
