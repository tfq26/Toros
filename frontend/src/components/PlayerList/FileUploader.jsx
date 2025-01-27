import React, { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const FileUploader = ({ isLoading, onFileUpload }) => {
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        confirmAlert({
            title: "Confirm Import",
            message: "Importing a new file will overwrite all existing player data. Do you want to proceed?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        onFileUpload(file)
                            .then(() => {
                                setSuccessMessage(`File "${file.name}" imported successfully!`);
                                setErrorMessage(null); // Clear any previous errors
                            })
                            .catch((error) => {
                                console.error("Error importing file:", error);
                                setSuccessMessage(null); // Clear any previous success message
                                setErrorMessage(`Failed to import file: ${file.name}. Please try again.`);
                            });
                    },
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
            <label
                className="cursor-pointer bg-emerald-300 text-emerald-800 px-4 py-2 rounded hover:bg-emerald-600 hover:text-white transition duration-200"
            >
                Import Players
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    className="hidden"
                />
            </label>

            {/* Loading State */}
            {isLoading && <p className="text-blue-500 mt-2">Importing file, please wait...</p>}

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
                    <p>{successMessage}</p>
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                    <p>{errorMessage}</p>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
