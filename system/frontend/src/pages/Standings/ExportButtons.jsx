const ExportButtons = ({ onExportExcel, onExportPDF, onClearStandings }) => {
    return (
        <div className="mb-6">
            <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                onClick={onExportExcel}
            >
                Export to Excel
            </button>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                onClick={onExportPDF}
            >
                Export to PDF
            </button>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={onClearStandings}
            >
                Clear Standings
            </button>
        </div>
    );
};

export default ExportButtons;
