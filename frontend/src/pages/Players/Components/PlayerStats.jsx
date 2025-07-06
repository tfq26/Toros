import React from "react";
import PropTypes from "prop-types";
import { getEmojiForRank } from "@/utils/functions/HelperFunctions.js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// A reusable component for creating simple bar charts
const StatBar = ({ label, value, maxValue, emoji }) => {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-medium text-card-foreground">
                    {emoji && <span className="mr-2">{emoji}</span>}
                    {label}
                </span>
                <span className="font-bold text-foreground">{value}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
                <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${percentage}%`, transition: 'width 0.5s ease-in-out' }}
                ></div>
            </div>
        </div>
    );
};

StatBar.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
    emoji: PropTypes.string,
};

const PlayerStats = ({ stats = {} }) => {
    // Safely destructure stats with default values to prevent errors
    const {
        totalPlayers = 0,
        totalTeams = 0,
        statusCounts = {},
        rankCounts = {},
        clubCounts = {},
    } = stats;

    // Sort clubs by count to show the most popular ones
    const topClubs = Object.entries(clubCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5); // Show top 5 clubs

    return (
        <Card className="w-full h-fit">
            <CardHeader>
                <CardTitle>Player Statistics</CardTitle>
                <CardDescription>An overview of the player pool.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Key Metrics Section */}
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-muted p-4 rounded-lg">
                        <p className="text-2xl font-bold text-foreground">{totalPlayers}</p>
                        <p className="text-sm text-muted-foreground">Total Players</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                        <p className="text-2xl font-bold text-foreground">{totalTeams}</p>
                        <p className="text-sm text-muted-foreground">Total Teams</p>
                    </div>
                </div>

                <Separator />

                {/* Status Breakdown Section */}
                <div>
                    <h4 className="font-semibold mb-3 text-card-foreground">Status Breakdown</h4>
                    <div className="space-y-3">
                        {Object.entries(statusCounts).length > 0 ? (
                            Object.entries(statusCounts).map(([status, count]) => (
                                <StatBar key={status} label={status} value={count} maxValue={totalPlayers} />
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No status data available.</p>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Skill Level Distribution Section */}
                <div>
                    <h4 className="font-semibold mb-3 text-card-foreground">Skill Distribution</h4>
                    <div className="space-y-3">
                        {Object.entries(rankCounts).length > 0 ? (
                            Object.entries(rankCounts).map(([rank, count]) => (
                                <StatBar key={rank} label={rank} value={count} maxValue={totalPlayers} emoji={getEmojiForRank(rank)} />
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No ranking data available.</p>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Top Clubs Section */}
                <div>
                    <h4 className="font-semibold mb-3 text-card-foreground">Top Clubs</h4>
                    <div className="space-y-3">
                        {topClubs.length > 0 ? (
                            topClubs.map(([club, count]) => (
                                <StatBar key={club} label={club} value={count} maxValue={totalPlayers} emoji="📍" />
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No club data available.</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

PlayerStats.propTypes = {
    stats: PropTypes.shape({
        totalPlayers: PropTypes.number,
        totalTeams: PropTypes.number,
        statusCounts: PropTypes.object,
        rankCounts: PropTypes.object,
        clubCounts: PropTypes.object,
    }),
};

export default PlayerStats;
