const ToggleViewButton = ({ viewMode, setViewMode }) => (
    <button
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        onClick={() => setViewMode(viewMode === "tile" ? "table" : "tile")}
    >
        {viewMode === "tile" ? "Switch to Table View" : "Switch to Tile View"}
    </button>
);

export default ToggleViewButton;