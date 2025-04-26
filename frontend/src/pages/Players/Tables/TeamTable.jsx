import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { loadTeamDetails } from "@/utils/functions/dataUtils.js";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx";

const TeamTable = ({ tournamentId, error, onEdit }) => {
    const [teamDetails, setTeamDetails] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    useEffect(() => {
        async function fetchDetails() {
            try {
                const details = await loadTeamDetails(tournamentId);
                setTeamDetails(details);
            } catch (err) {
                console.error("Error loading team details:", err);
            }
        }

        if (tournamentId) {
            fetchDetails();
        }
    }, [tournamentId]);

    const sortedTeams = useMemo(() => {
        let sortableTeams = [...teamDetails];
        if (sortConfig.key !== null) {
            sortableTeams.sort((a, b) => {
                let aValue, bValue;
                if (sortConfig.key === "placement") {
                    aValue = a.placement || 0;
                    bValue = b.placement || 0;
                } else if (sortConfig.key === "name") {
                    aValue = a.name ? a.name.toLowerCase() : "";
                    bValue = b.name ? b.name.toLowerCase() : "";
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
        return sortableTeams;
    }, [teamDetails, sortConfig]);

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
                        <TableHeader className="bg-blue-500 dark:bg-gray-950 hover:bg-gray-950">
                            <TableRow>
                                <TableHead
                                    className="font-bold text-4xl text-gray-800 dark:text-gray-100 cursor-pointer px-6 py-4"
                                    onClick={() => handleSort("name")}
                                >
                                    Team Name{getSortIndicator("name")}
                                </TableHead>
                                <TableHead
                                    className="font-bold text-4xl text-gray-800 dark:text-gray-100 cursor-pointer px-6 py-4"
                                    onClick={() => handleSort("placement")}
                                >
                                    Placement{getSortIndicator("placement")}
                                </TableHead>
                                <TableHead className="font-bold text-4xl text-gray-800 dark:text-gray-100 px-6 py-4">
                                    Players
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!error && sortedTeams.length > 0 ? (
                                sortedTeams.map((team, index) => (
                                    <TableRow
                                        key={`team-${index}`}
                                        className="even:bg-blue-100 odd:bg-blue-200 hover:bg-blue-200 transition dark:hover:bg-blue-700/50 dark:even:bg-blue-800 dark:odd:bg-blue-900"
                                        onClick={() => onEdit(team)}
                                    >
                                        <TableCell className="px-6 py-4 text-2xl text-gray-800 dark:text-gray-100">
                                            {team.name || "N/A"}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-2xl text-gray-800 dark:text-gray-100">
                                            {team.placement != null ? team.placement : "N/A"}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-2xl text-gray-800 dark:text-gray-100">
                                            {team.players && team.players.length > 0
                                                ? team.players.map((p) => p.name).join(", ")
                                                : "No players"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-6 text-gray-600 dark:text-gray-300 text-3xl">
                                        No teams found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile List View */}
                <div className="block md:hidden">
                    <ul className="divide-y divide-gray-200">
                        {!error && sortedTeams.length > 0 ? (
                            sortedTeams.map((team, index) => (
                                <li
                                    key={`team-mobile-${index}`}
                                    className="py-4 px-6 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                    onClick={() => onEdit(team)}
                                >
                                    <span className="text-2xl text-gray-800 dark:text-gray-100">
                                        {team.name || "N/A"} - Placement: {team.placement != null ? team.placement : "N/A"}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className="py-6 text-center text-gray-600 dark:text-gray-300 text-3xl">
                                No teams found
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

TeamTable.propTypes = {
    tournamentId: PropTypes.string.isRequired,
    error: PropTypes.any,
    onEdit: PropTypes.func.isRequired,
};

export default TeamTable;
