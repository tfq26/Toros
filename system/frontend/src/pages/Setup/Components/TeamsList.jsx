import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const TeamsList = ({ teams }) => {
    return (
        <div className="mt-6 border rounded-lg">
            <h3 className="text-lg text-center font-semibold p-4 bg-muted/40 dark:text-white">
                Available Teams
            </h3>
            {teams.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Team #</TableHead>
                            <TableHead>Players</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teams.map((team, index) => {
                            const player1 = team[0] || {};
                            const player2 = team[1] || {};
                            const formattedName = player1.name && player2.name
                                ? `${player1.name} & ${player2.name}`
                                : player1.name || "Waiting for partner";

                            return (
                                <TableRow key={index}>
                                    <TableCell className="font-medium text-center">
                                        {player1.teamNumber || index + 1}
                                    </TableCell>
                                    <TableCell>{formattedName}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            ) : (
                <p className="p-8 text-center text-muted-foreground">
                    No valid teams available.
                </p>
            )}
        </div>
    );
};

export default TeamsList;