import React, { useState } from "react";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import * as XLSX from "xlsx";

const DEFAULT_VALUES = {
    name: "Unknown Player",
    teamNumber: "N/A",
    clubName: "Unknown Club",
    placement: "N/A",
};

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
                let jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });

                if (jsonData.length === 0) {
                    onStatusUpdate("Error: No data found in the file.");
                    setIsLoading(false);
                    return;
                }

                jsonData = jsonData.map((player) => ({
                    name: player.name || DEFAULT_VALUES.name,
                    teamNumber: player.teamNumber || DEFAULT_VALUES.teamNumber,
                    clubName: player.clubName || DEFAULT_VALUES.clubName,
                    SkillLevel: player.SkillLevel || DEFAULT_VALUES.SkillLevel,
                    registered: player.registered !== undefined ? player.registered : false, // Ensure registered is included
                }));

                console.log("🔍 Processed JSON Data:", jsonData);
                await uploadPlayersToBackend(jsonData, file);
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error("Error processing file:", error);
            onStatusUpdate("Error importing file. Please check the format.");
        } finally {
            setIsLoading(false);
        }
    };

    const uploadPlayersToBackend = async (players, file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:8080/api/players/import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                onStatusUpdate(`✅ Players uploaded successfully! (${players.length} players added)`);
                onFileSelect(players);
            } else {
                onStatusUpdate("⚠️ Error uploading players. Please try again.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            onStatusUpdate("❌ Failed to upload players. Check the server.");
        }
    };

    return (
        <div>
            <label className="cursor-pointer bg-emerald-300 text-emerald-800 px-4 py-2 rounded hover:bg-emerald-600 hover:text-white transition duration-200">
                Import Players
                <input type="file" accept=".xlsx, .xls" onChange={handleFileSelection} className="hidden" />
            </label>

            {isLoading && <p className="text-blue-500 mt-2">Importing file, please wait...</p>}
        </div>
    );
};

export default FileUploader;
