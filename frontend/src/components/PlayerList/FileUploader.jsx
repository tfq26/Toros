import React, { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import * as XLSX from "xlsx";

const FileUploader = ({ onFileSelect, onStatusUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleFileSelection = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        confirmAlert({
            title: "Confirm Import",
            message: "Importing a new file will overwrite all existing player data. Do you want to proceed?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => processFile(file),
                },
                {
                    label: "No",
                },
            ],
        });
    };

    const processFile = async (file) => {
        setIsLoading(true);
        onStatusUpdate("Processing file...");

        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });

                const sheetName = workbook.SheetNames[0]; // Read first sheet
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert to JSON

                if (jsonData.length === 0) {
                    onStatusUpdate("Error: No data found in the file.");
                    setIsLoading(false);
                    return;
                }

                // ✅ Pass processed player data to PlayerList
                onFileSelect(jsonData);
                onStatusUpdate("File imported successfully!");
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error("Error processing file:", error);
            onStatusUpdate("Error importing file. Please check the format.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-6">
            {/* Import Button */}
            <label className="cursor-pointer bg-emerald-300 text-emerald-800 px-4 py-2 rounded hover:bg-emerald-600 hover:text-white transition duration-200">
                Import Players
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileSelection}
                    className="hidden"
                />
            </label>

            {/* Loading State */}
            {isLoading && <p className="text-blue-500 mt-2">Importing file, please wait...</p>}
        </div>
    );
};

export default FileUploader;
