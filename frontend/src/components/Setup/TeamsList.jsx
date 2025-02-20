import React from "react";

const TeamsList = ({ teams }) => {
    return (
        <div className="mt-2">
            <h3 className="text-lg text-center font-semibold mb-4 dark:text-white">
                Available Teams
            </h3>
            {teams.length > 0 ? (
                <table className="table-auto border-collapse border border-gray-300 w-full">
                    <thead>
                    <tr className="bg-emerald-600 text-white dark:bg-emerald-950">
                        <th className="border border-emerald-800 px-4 py-2 dark:border-emerald-900">
                            TEAM NUMBER
                        </th>
                        <th className="border border-emerald-800 px-4 py-2 dark:border-emerald-900">
                            NAMES
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {teams.map((team, index) => {
                        const player1 = team[0] || {};
                        const player2 = team[1] || {};

                        const formattedName =
                            player1.name && player2.name
                                ? `${player1.name} & ${player2.name}`
                                : player1.name || "Waiting for partner";

                        return (
                            <tr
                                key={index}
                                className="odd:bg-emerald-50 even:bg-emerald-100 hover:bg-emerald-200 transition dark:odd:bg-green-800 dark:even:bg-green-700 dark:hover:bg-green-600"
                            >
                                <td className="border border-gray-300 px-4 py-2 text-center dark:border-green-700 dark:text-gray-200">
                                    {player1.teamNumber || "N/A"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-green-700 dark:text-gray-200">
                                    {formattedName}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-600 dark:text-gray-300">
                    No valid teams available. Ensure players are correctly paired in the database.
                </p>
            )}
        </div>
    );
};

export default TeamsList;
