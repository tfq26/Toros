import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { convertLevel } from "@/utils/functions/playerUtils.js";
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
                        <TableHeader className="bg-amber-500 dark:bg-gray-950 hover:bg-gray-950 ">
                            <TableRow>
                                <TableHead className="font-bold text-4xl text-gray-800 dark:text-gray-100 px-6 py-4">
                                    Name
                                </TableHead>
                                <TableHead
                                    className="font-bold text-4xl text-gray-800 dark:text-gray-100 cursor-pointer px-6"
                                    onClick={() => handleSort("placement")}
                                >
                                    Placement{getSortIndicator("placement")}
                                </TableHead>
                                <TableHead
                                    className="font-bold text-4xl text-gray-800 dark:text-gray-100 cursor-pointer px-6"
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
                                        className=" even:bg-amber-100 odd:bg-amber-200 hover:bg-amber-200 transition dark:hover:bg-emerald-700/50
                                         dark:even:bg-emerald-800 dark:odd:bg-emerald-900"
                                    >
                                        <TableCell
                                            className="px-6 py-4 font-medium cursor-pointer hover:underline text-2xl text-gray-800 dark:text-gray-100"
                                            onClick={() => onEdit(player)}
                                        >
                                            {player.name || "N/A"}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-xl text-gray-800 dark:text-gray-100">
                                            {convertLevel(player.skillLevel)}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-xl text-gray-800 dark:text-gray-100">
                                            {player.clubName || "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-6 text-gray-600 dark:text-gray-300 text-3xl">
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
