import React from "react";
import PropTypes from "prop-types";
import { convertLevel } from "../utils/playerUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";

const PlayerTable = ({ players, error, onEdit }) => {
    const flatPlayers = Object.values(players).flat();

    return (
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="overflow-x-auto rounded-lg w-full flex-grow min-h-[600px]">
                <Table className="w-full">
                    <TableHeader className="flex text-center font-medium bg-white dark:bg-emerald-950">
                        <TableRow className="flex py-5 text-center font-medium w-full bg-transparent hover:bg-muted/0">
                            <TableHead className="flex-1 font-bold text-center text-4xl bg-transparent text-gray-800 dark:text-gray-100">
                                Name
                            </TableHead>
                            <TableHead className="flex-1 font-bold text-center text-4xl bg-transparent text-gray-800 dark:text-gray-100">
                                Placement
                            </TableHead>
                            <TableHead className="flex-1 font-bold text-center text-4xl bg-transparent text-gray-800 dark:text-gray-100">
                                ClubName
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!error && flatPlayers.length > 0 ? (
                            flatPlayers.map((player, index) => (
                                <TableRow
                                    key={`player-${index}`}
                                    className="flex w-full odd:bg-emerald-50 even:bg-emerald-100 hover:bg-emerald-200 transition dark:odd:bg-emerald-800 dark:even:bg-emerald-900 dark:hover:bg-emerald-600"
                                >
                                    <TableCell
                                        className="flex-1 text-center font-medium cursor-pointer hover:underline text-2xl text-gray-800 dark:text-gray-100"
                                        onClick={() => onEdit(player)}
                                    >
                                        {player.name || "N/A"}
                                    </TableCell>
                                    <TableCell className="flex-1 text-center text-xl text-gray-800 dark:text-gray-100">
                                        {convertLevel(player.skillLevel)}
                                    </TableCell>
                                    <TableCell className="flex-1 text-center text-xl text-gray-800 dark:text-gray-100">
                                        {player.clubName || "N/A"}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="flex w-full">
                                <TableCell colSpan={3} className="text-center py-6 text-gray-600 dark:text-gray-300">
                                    No players found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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
