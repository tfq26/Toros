import  { useState, useEffect } from "react";
import MatchTableUpdated from "@/pages/Tournament/MatchTableUpdated.jsx";
import MatchCard from "./MatchCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button.jsx";

const MatchTabs = ({ matches, sortOrder, refreshMatches, updateMatch }) => {
    const [selectedTab, setSelectedTab] = useState("all"); // Tracks active tab
    // Toggle view: false = table view, true = card view.
    const [isCardView, setIsCardView] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Listen for window resize events to detect mobile viewports.
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        // Run once on mount to set the initial viewport flag.
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /** Filter matches based on selected tab */
    const filteredMatches = matches.filter((match) => {
        if (selectedTab === "completed") return match.status === "Complete";
        if (selectedTab === "ongoing") return match.status === "In Progress";
        return true; // "all" tab
    });

    /** Apply sorting AFTER filtering */
    const sortedMatches = [...filteredMatches].sort((a, b) => {
        if (sortOrder === "desc") {
            return new Date(b.startTime) - new Date(a.startTime);
        }
        return new Date(a.startTime) - new Date(b.startTime);
    });

    return (
        <div className="flex flex-col w-full">
            {/* Filter Controls: Use a Select on mobile; buttons on desktop */}
            {isMobile ? (
                <div className="mb-4">
                    <Select value={selectedTab} onValueChange={setSelectedTab}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Matches" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Matches</SelectItem>
                            <SelectItem value="ongoing">Ongoing Matches</SelectItem>
                            <SelectItem value="completed">Completed Matches</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            ) : (
                <div className="flex mb-4 gap-2">
                    {["all", "ongoing", "completed"].map((tab) => (
                        <Button
                            key={tab}
                            onClick={() => setSelectedTab(tab)}
                            className={`px-4 py-2 font-semibold ${
                                selectedTab === tab
                                    ? "border-b-2 dark:bg-red-700 border-orange-100 text-orange-100"
                                    : "text-emerald-400 dark:bg-gray-950"
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} Matches
                        </Button>
                    ))}
                </div>
            )}

            {/* View Mode Toggle using a Switch */}
            <div className="flex items-center pb-5 border-b-4 mb-6 gap-2">
                <span className="text-sm">Table</span>
                <Switch
                    checked={isCardView}
                    onCheckedChange={(checked) => setIsCardView(checked)}
                />
                <span className="text-sm">Card</span>
            </div>

            {/* Render matches based on the view mode */}
            {isCardView ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sortedMatches.map((match) => (
                        <MatchCard key={match.id} match={match} updateMatch={updateMatch} />
                    ))}
                </div>
            ) : (
                <MatchTableUpdated
                    matches={sortedMatches}
                    refreshMatches={refreshMatches}
                    updateMatch={updateMatch}
                    isMobile={isMobile} // Pass the detected isMobile value dynamically
                />
            )}
        </div>
    );
};

import PropTypes from "prop-types";

MatchTabs.propTypes = {
    matches: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            status: PropTypes.string.isRequired,
            startTime: PropTypes.string.isRequired,
            team1: PropTypes.object,
            team2: PropTypes.object,
        })
    ).isRequired,
    sortOrder: PropTypes.oneOf(["asc", "desc"]).isRequired,
    refreshMatches: PropTypes.func.isRequired,
    updateMatch: PropTypes.func.isRequired,
};

export default MatchTabs;
