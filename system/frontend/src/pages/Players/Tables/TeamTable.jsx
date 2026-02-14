import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// A helper function to safely extract player names from a team object
const getPlayerNames = (team) => {
    const names = [];
    if (team.player1 && team.player1.name) {
        names.push(team.player1.name);
    }
    if (team.player2 && team.player2.name) {
        names.push(team.player2.name);
    }
    return names.join(" & ");
};


// Reworked TeamTable to be a presentational component that displays team data
const TeamTable = ({ teams = [], onEdit }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    // The sorting logic now works on the 'teams' prop
    const sortedTeams = useMemo(() => {
        let sortableTeams = [...teams];
        if (sortConfig.key !== null) {
            sortableTeams.sort((a, b) => {
                const aValue = a[sortConfig.key] ? String(a[sortConfig.key]).toLowerCase() : '';
                const bValue = b[sortConfig.key] ? String(b[sortConfig.key]).toLowerCase() : '';

                if (aValue < bValue) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableTeams;
    }, [teams, sortConfig]);

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === "ascending" ? " ▲" : " ▼";
        }
        return "";
    };

    // Render a message if no teams are available
    if (teams.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                <p>No teams found.</p>
                <p className="text-sm mt-1">Teams will appear here once they are created.</p>
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
                            <TableHead
                                className="cursor-pointer"
                                onClick={() => handleSort("name")}
                            >
                                Team Name{getSortIndicator("name")}
                            </TableHead>
                            <TableHead>Players</TableHead>
                            <TableHead className="text-center">Skill Level</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedTeams.map((team) => (
                            <TableRow
                                key={team._id?.$oid || team.id} // Use MongoDB's object ID if available
                                className="hover:bg-muted/50 cursor-pointer transition-colors duration-200 bg-muted"
                                onClick={() => onEdit && onEdit(team)}
                            >
                                <TableCell className="font-medium">{team.name}</TableCell>
                                {/* --- UPDATED: Use helper to get player names --- */}
                                <TableCell>{getPlayerNames(team)}</TableCell>
                                <TableCell className="text-center">{team.skillLevel || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-3 p-2">
                {sortedTeams.map((team) => (
                    <Card
                        key={team._id?.$oid || team.id}
                        className="cursor-pointer"
                        onClick={() => onEdit && onEdit(team)}
                    >
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg">{team.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm">
                            <p className="font-medium">Players:</p>
                            {/* --- UPDATED: Use helper to get player names --- */}
                            <p className="text-muted-foreground">
                                {getPlayerNames(team)}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

TeamTable.propTypes = {
    // Expects an array of team objects from your database
    teams: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.object, // For MongoDB's {$oid: "..."}
        id: PropTypes.string, // Fallback for other ID types
        name: PropTypes.string.isRequired,
        player1: PropTypes.object,
        player2: PropTypes.object,
        skillLevel: PropTypes.number,
    })).isRequired,
    onEdit: PropTypes.func,
};

export default TeamTable;
