import React from "react";
import { Button } from "@/components/ui/button";
import {FaFileExcel, FaFilePdf} from "react-icons/fa6";

const ExportMatches = () => {
    // Opens a backend endpoint that returns a PDF of matches.
    const exportMatchesAsPDF = () => {
        // Update the URL to your actual export endpoint.
        window.open("http://localhost:8080/api/matches/export/pdf", "_blank");
    };

    // Opens a backend endpoint that returns an Excel file of matches.
    const exportMatchesAsExcel = () => {
        // Update the URL to your actual export endpoint.
        window.open("http://localhost:8080/api/matches/export/excel", "_blank");
    };

    return (
        <div className="flex flex-col gap-2 mt-4">
            <div className="flex gap-4 mt-4">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={exportMatchesAsPDF}
                    title="Export Matches as PDF"
                >
                    <FaFilePdf size={20}/>
                </Button>
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={exportMatchesAsExcel}
                    title="Export Matches as Excel"
                >
                    <FaFileExcel size={20}/>
                </Button>
            </div>
        </div>
    );
};

export default ExportMatches;
