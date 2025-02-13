import React from "react";

const TeamsList = ({ teams }) => {
    return (
        <div className="mt-6">
            <h3 className="text-lg text-center font-semibold mb-4">Available Teams</h3>
            {teams.length > 0 ? (
                <table className="table-auto border-collapse border border-gray-300 w-full">
                    <thead>
                    <tr className="bg-emerald-500 text-white">
                        <th className="border border-emerald-700 px-4 py-2">Team Number</th>
                        <th className="border border-emerald-700 px-4 py-2">Player 1</th>
                        <th className="border border-emerald-700 px-4 py-2">Player 2</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teams.map((team, index) => (
                        <tr key={index} className="odd:bg-emerald-50 even:bg-emerald-100 hover:bg-emerald-200 transition">
                            <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                            <td className="border border-gray-300 px-4 py-2">{team[0].name}</td>
                            <td className="border border-gray-300 px-4 py-2">{team[1].name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No valid teams available. Ensure players are correctly paired in the database.</p>
            )}
        </div>
    );
};

export default TeamsList;
