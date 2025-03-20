import { useState } from "react";
import MatchTable from "./MatchTable";
import MatchCard from "./MatchCard";

const MatchTabs = ({ matches, sortOrder, refreshMatches, updateMatch }) => {
    const [selectedTab, setSelectedTab] = useState("all"); // Tracks active tab
    const [viewMode, setViewMode] = useState("table"); // Toggle between Table and Card views

    /** ✅ Filter matches based on selected tab */
    const filteredMatches = matches.filter((match) => {
        if (selectedTab === "completed") return match.status === "Complete";
        if (selectedTab === "ongoing") return match.status === "In Progress";
        return true; // "all" tab
    });

    /** ✅ Apply sorting AFTER filtering */
    const sortedMatches = [...filteredMatches].sort((a, b) => {
        if (sortOrder === "desc") {
            return new Date(b.startTime) - new Date(a.startTime);
        }
        return new Date(a.startTime) - new Date(b.startTime);
    });

    return (
        <div className="flex flex-col w-full">
            {/* Tabs for filtering */}
            <div className="flex border-b mb-4">
                {["all", "ongoing", "completed"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-4 py-2 font-semibold ${
                            selectedTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-700 dark:text-gray-300"
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} Matches
                    </button>
                ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex gap-2">
                    <button
                        className={`px-3 py-1 rounded ${
                            viewMode === "table" ? "bg-green-500 text-white" : "bg-green-300 dark:bg-gray-700"
                        }`}
                        onClick={() => setViewMode("table")}
                    >
                        Table
                    </button>
                    <button
                        className={`px-3 py-1 rounded ${
                            viewMode === "card" ? "bg-green-500 text-white" : "bg-green-300 dark:bg-gray-700"
                        }`}
                        onClick={() => setViewMode("card")}
                    >
                        Card
                    </button>
                </div>
            </div>

            {/* Render matches based on view mode */}
            {viewMode === "table" ? (
                <MatchTable
                    matches={sortedMatches}
                    refreshMatches={refreshMatches}
                    updateMatch={updateMatch}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedMatches.map((match) => (
                        <MatchCard key={match.id} match={match} updateMatch={updateMatch} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MatchTabs;
