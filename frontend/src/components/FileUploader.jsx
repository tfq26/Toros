import React, { useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { toast } from "sonner"; // or remove if you later switch to a centralized notification provider
import DialogProvider from "../utils/DialogProvider.jsx"; // Adjust the path as needed

const DEFAULT_VALUES = {
    name: "Unknown Player",
    teamNumber: "N/A",
    clubName: "Unknown Club",
    placement: "N/A",
};

const FileUploader = ({ onFileSelect, onStatusUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    // importedPlayers will hold the processed player data after upload
    const [importedPlayers, setImportedPlayers] = useState(null);
    // showConfirm controls the dialog visibility (shown after a successful upload)
    const [showConfirm, setShowConfirm] = useState(false);
    const fileInputRef = useRef(null);

    // When a file is chosen, process it immediately
    const handleFileSelection = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        processFile(file);
    };

    // Process the file: read, parse, and call backend upload
    const processFile = async (file) => {
        setIsLoading(true);
        toast.info("Processing file...", { duration: 5000 });
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                let jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });

                if (jsonData.length === 0) {
                    toast.error("Error: No data found in the file.", { duration: 5000 });
                    setIsLoading(false);
                    return;
                }

                // Map and apply default values as needed
                jsonData = jsonData.map((player) => ({
                    name: player.name || DEFAULT_VALUES.name,
                    teamNumber: player.teamNumber || DEFAULT_VALUES.teamNumber,
                    clubName: player.clubName || DEFAULT_VALUES.clubName,
                    SkillLevel: player.SkillLevel || DEFAULT_VALUES.SkillLevel,
                    registered: player.registered !== undefined ? player.registered : false,
                }));

                console.log("🔍 Processed JSON Data:", jsonData);
                // Upload the file and player data to the backend
                await uploadPlayersToBackend(file, jsonData);
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error("Error processing file:", error);
            toast.error("Error importing file. Please check the format.", { duration: 5000 });
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    // Upload the file using axios and, if successful, store the player data
    // and show the confirmation dialog
    const uploadPlayersToBackend = async (file, playersData) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                "http://localhost:8080/api/players/import",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.status === 200) {
                toast.success(
                    `✅ Players uploaded successfully! (${playersData.length} players added)`,
                    { duration: 5000 }
                );
                // Instead of immediately applying the data, store it and show a confirmation dialog
                setImportedPlayers(playersData);
                setShowConfirm(true);
            } else {
                toast.error("⚠️ Error uploading players. Please try again.", { duration: 5000 });
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("❌ Failed to upload players. Check the server.", { duration: 5000 });
        }
    };

    // When the user confirms in the dialog, call onFileSelect with the imported data
    const handleConfirmProceed = () => {
        if (importedPlayers) {
            onFileSelect(importedPlayers);
        }
        setImportedPlayers(null);
        setShowConfirm(false);
    };

    // If the user cancels, just dismiss the dialog (the backend update cannot be reverted)
    const handleConfirmCancel = () => {
        setImportedPlayers(null);
        setShowConfirm(false);
    };

    return (
        <div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="excelFile" className="mb-2 text-white">
                    File
                </Label>
                <Input
                    id="excelFile"
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileSelection}
                    className="dark:bg-emerald-900 bg-emerald-200 text-emerald-900 border-emerald-900"
                />
            </div>

            {isLoading && <p className="text-blue-500 mt-2">Importing file, please wait...</p>}

            {/* Confirmation dialog shown after a successful file import */}
            <DialogProvider
                isOpen={showConfirm}
                onOpenChange={setShowConfirm}
                title="Confirm Import"
                description="The file has been successfully imported. Importing a new file will overwrite all existing player data. Do you want to proceed?"
                onConfirm={handleConfirmProceed}
                onCancel={handleConfirmCancel}
                confirmText="Proceed"
                cancelText="Cancel"
            />
        </div>
    );
};

export default FileUploader;
