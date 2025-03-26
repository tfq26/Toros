import React, { useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog.jsx";

const DEFAULT_VALUES = {
    name: "Unknown Player",
    teamNumber: "N/A",
    clubName: "Unknown Club",
    placement: "N/A",
};

const FileUploader = ({ onFileSelect, onStatusUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelection = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setShowConfirm(true);
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
                    registered: player.registered !== undefined ? player.registered : false,
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
            // Reset the file input value so the same file can be uploaded again.
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
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
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogTrigger asChild>
                    <label className="cursor-pointer bg-emerald-300 text-emerald-800 px-4 py-2 rounded hover:bg-emerald-600 hover:text-white transition duration-200">
                        Import Players
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileSelection}
                            className="hidden"
                        />
                    </label>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Import</AlertDialogTitle>
                        <AlertDialogDescription>
                            Importing a new file will <strong>overwrite all existing player data</strong>.
                            Do you want to proceed?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (selectedFile) processFile(selectedFile);
                                setShowConfirm(false);
                            }}
                        >
                            Proceed
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {isLoading && <p className="text-blue-500 mt-2">Importing file, please wait...</p>}
        </div>
    );
};

export default FileUploader;
