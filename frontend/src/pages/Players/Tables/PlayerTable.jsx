import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { convertLevel } from "@/utils/functions/HelperFunctions.js";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge.jsx";
import { cn } from "@/lib/utils";

// Helper to determine badge color based on status
const getStatusVariant = (status) => {
    switch (status) {
        case "Checked In":
            return "success"; // Assumes you have a 'success' variant in your Badge component
        case "Withdrawn":
            return "destructive";
        case "Registered":
        default:
            return "default";
    }
};

// Reworked PlayerTable to be a simpler, presentational component
const PlayerTable = ({ players = [], onEdit }) => {
    // State for sort configuration
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    // Handler to update sort configuration
    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    // Memoized sorted players based on sortConfig
    const sortedPlayers = useMemo(() => {
        let sortablePlayers = [...players];
        if (sortConfig.key !== null) {
            sortablePlayers.sort((a, b) => {
                // Ensure 'a' and 'b' are valid objects before accessing properties
                const aSafe = a || {};
                const bSafe = b || {};

                const aValue = aSafe[sortConfig.key] ? String(aSafe[sortConfig.key]).toLowerCase() : '';
                const bValue = bSafe[sortConfig.key] ? String(bSafe[sortConfig.key]).toLowerCase() : '';

                if (aValue < bValue) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortablePlayers;
    }, [players, sortConfig]);

    // Utility to display an arrow for sorted columns
    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === "ascending" ? " ▲" : " ▼";
        }
        return "";
    };

    // Render a message if no players are available
    if (players.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                <p>No players found.</p>
                <p className="text-sm mt-1">Try adjusting your filters or add a new player.</p>
            </div>
        );
    }

    return (
        <div className="w-full rounded-lg border">
            {/* Desktop Table View */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                                Name{getSortIndicator("name")}
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("skillLevel")}>
                                Skill Level{getSortIndicator("skillLevel")}
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("clubName")}>
                                Club Name{getSortIndicator("clubName")}
                            </TableHead>
                            <TableHead className="text-center cursor-pointer" onClick={() => handleSort("status")}>
                                Status{getSortIndicator("status")}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedPlayers.map((player) => (
                            <TableRow
                                key={player.id}
                                className="hover:bg-muted/50 cursor-pointer transition-colors duration-200 bg-muted"
                                onClick={() => onEdit && onEdit(player)}
                            >
                                <TableCell className="font-medium">{player.name || "N/A"}</TableCell>
                                <TableCell>{convertLevel(player.skillLevel)}</TableCell>
                                <TableCell>{player.clubName || "N/A"}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={getStatusVariant(player.status)}>
                                        {player.status || "N/A"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-3 p-2">
                {sortedPlayers.map((player) => (
                    <Card
                        key={player.id}
                        className="cursor-pointer"
                        onClick={() => onEdit && onEdit(player)}
                    >
                        <CardHeader className="flex flex-row items-center justify-between p-4">
                            <CardTitle className="text-lg">{player.name}</CardTitle>
                            <Badge variant={getStatusVariant(player.status)}>
                                {player.status}
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                            <p><strong>Skill:</strong> {convertLevel(player.skillLevel)}</p>
                            <p><strong>Club:</strong> {player.clubName || "N/A"}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

PlayerTable.propTypes = {
    // Expects a simple array of player objects
    players: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string,
        skillLevel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        clubName: PropTypes.string,
        status: PropTypes.string,
    })).isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default PlayerTable;
