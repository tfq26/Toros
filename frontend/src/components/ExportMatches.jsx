import React from "react";
import { Button } from "@/components/ui/button";

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
            <Button variant="outline" className="w-full" onClick={exportMatchesAsPDF}>
                Export Matches as PDF
            </Button>
            <Button variant="outline" className="w-full" onClick={exportMatchesAsExcel}>
                Export Matches as Excel
            </Button>
        </div>
    );
};

export default ExportMatches;
