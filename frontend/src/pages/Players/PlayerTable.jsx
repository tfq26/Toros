import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { convertLevel } from "../utils/playerUtils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx";

const PlayerTable = ({ players, error, onEdit }) => {
    const flatPlayers = Object.values(players).flat();

    // State for sort configuration
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

    // Handler to update sort configuration based on header clicks
    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    // Memoized sorted players based on sortConfig
    const sortedPlayers = useMemo(() => {
        let sortablePlayers = [...flatPlayers];
        if (sortConfig.key !== null) {
            sortablePlayers.sort((a, b) => {
                let aValue, bValue;
                if (sortConfig.key === "placement") {
                    aValue = a.skillLevel;
                    bValue = b.skillLevel;
                } else if (sortConfig.key === "clubName") {
                    aValue = a.clubName ? a.clubName.toLowerCase() : "";
                    bValue = b.clubName ? b.clubName.toLowerCase() : "";
                }
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
    }, [flatPlayers, sortConfig]);

    // Utility to display an arrow for sorted columns
    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === "ascending" ? " ▲" : " ▼";
        }
        return "";
    };

    return (
        <div className="w-full rounded-lg">
            <div className="overflow-x-auto rounded-lg w-full flex-grow min-h-[600px]">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                    <Table className="w-full">
                        <TableHeader className="flex text-center font-medium bg-white dark:bg-emerald-950/50">
                            <TableRow className="flex py-5 ml-10 font-medium w-full bg-transparent hover:bg-muted/0">
                                <TableHead className="flex-1 font-bold text-4xl bg-transparent text-gray-800 dark:text-gray-100">
                                    Name
                                </TableHead>
                                <TableHead
                                    className="flex-1 font-bold text-4xl bg-transparent text-gray-800 dark:text-gray-100 cursor-pointer"
                                    onClick={() => handleSort("placement")}
                                >
                                    Placement{getSortIndicator("placement")}
                                </TableHead>
                                <TableHead
                                    className="flex-1 font-bold text-4xl bg-transparent text-gray-800 dark:text-gray-100 cursor-pointer"
                                    onClick={() => handleSort("clubName")}
                                >
                                    ClubName{getSortIndicator("clubName")}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!error && sortedPlayers.length > 0 ? (
                                sortedPlayers.map((player, index) => (
                                    <TableRow
                                        key={`player-${index}`}
                                        className="flex w-full odd:bg-emerald-50 even:bg-emerald-100/20 hover:bg-emerald-200 transition dark:odd:bg-emerald-800/30 dark:even:bg-emerald-900/30 dark:hover:bg-emerald-600/50"
                                    >
                                        <TableCell
                                            className="flex-1 ml-10 font-medium cursor-pointer hover:underline text-2xl text-gray-800 dark:text-gray-100"
                                            onClick={() => onEdit(player)}
                                        >
                                            {player.name || "N/A"}
                                        </TableCell>
                                        <TableCell className="flex-1 text-xl text-gray-800 dark:text-gray-100">
                                            {convertLevel(player.skillLevel)}
                                        </TableCell>
                                        <TableCell className="flex-1 text-xl text-gray-800 dark:text-gray-100">
                                            {player.clubName || "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="flex w-full">
                                    <TableCell colSpan={3} className="mx-auto py-6 text-gray-600 dark:text-gray-300 text-3xl">
                                        No players found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile List View */}
                <div className="block md:hidden">
                    <ul className="divide-y divide-gray-200">
                        {!error && sortedPlayers.length > 0 ? (
                            sortedPlayers.map((player, index) => (
                                <li
                                    key={`player-mobile-${index}`}
                                    className="py-4 px-6 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                    onClick={() => onEdit(player)}
                                >
                  <span className="text-2xl text-gray-800 dark:text-gray-100">
                    {player.name || "N/A"}
                  </span>
                                </li>
                            ))
                        ) : (
                            <li className="py-6 text-center text-gray-600 dark:text-gray-300 text-3xl">
                                No players found
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

PlayerTable.propTypes = {
    players: PropTypes.any,
    error: PropTypes.any,
    onEdit: PropTypes.func.isRequired,
};

export default PlayerTable;
