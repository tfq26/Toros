import React, { useState } from "react";
import axios from "axios";
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
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);

                console.log("🔍 Extracted JSON Data from Excel:", jsonData); // ✅ Check Excel to JSON conversion

                if (jsonData.length === 0) {
                    onStatusUpdate("Error: No data found in the file.");
                    setIsLoading(false);
                    return;
                }

                await uploadPlayersToBackend(jsonData);
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error("Error processing file:", error);
            onStatusUpdate("Error importing file. Please check the format.");
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Upload processed players to backend
    const uploadPlayersToBackend = async (players) => {
        try {
            const response = await axios.post("http://localhost:8080/api/players/import", players, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                onStatusUpdate(`✅ Players uploaded successfully! (${players.length} players added)`);
                onFileSelect(players); // Notify PlayerList of new players
            } else {
                onStatusUpdate("⚠️ Error uploading players. Please try again.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            onStatusUpdate("❌ Failed to upload players. Check the server.");
        }
    };

    return (
        <div className="mb-6">
            <label className="cursor-pointer bg-emerald-300 text-emerald-800 px-4 py-2 rounded hover:bg-emerald-600 hover:text-white transition duration-200">
                Import Players
                <input type="file" accept=".xlsx, .xls" onChange={handleFileSelection} className="hidden" />
            </label>

            {isLoading && <p className="text-blue-500 mt-2">Importing file, please wait...</p>}
        </div>
    );
};

export default FileUploader;
