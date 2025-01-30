import React from "react";
import * as PropTypes from "prop-types";

class PlayerTable extends React.Component {
    render() {
        let {players, error, convertLevel} = this.props;
        return (
            <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-4">Player List</h2>
                <table className="table-auto w-full border border-gray-300">
                    <thead>
                    <tr className="bg-emerald-500">
                        {["ID", "Name", "Team Number", "Club", "Level"].map((header) => (
                            <th
                                key={header}
                                className="border px-4 py-2 text-emerald-800 whitespace-nowrap"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {Object.values(players).flat().length > 0 ? (
                        Object.values(players)
                            .flat()
                            .map((player, index) => (
                                <tr
                                    key={player.id ?? `player-${index}`}
                                    className="odd:bg-white even:bg-gray-50"
                                >
                                    <td className="border px-4 py-2 whitespace-nowrap">
                                        {player.id || index + 1}
                                    </td>
                                    <td className="border px-4 py-2 whitespace-nowrap">
                                        {player.name || "N/A"}
                                    </td>
                                    <td className="border px-4 py-2 whitespace-nowrap">
                                        {player.teamNumber || "N/A"}
                                    </td>
                                    <td className="border px-4 py-2 whitespace-nowrap">
                                        {player.clubName || "N/A"}
                                    </td>
                                    <td className="border px-4 py-2 whitespace-nowrap">
                                        {convertLevel(player.placement)}
                                    </td>
                                </tr>
                            ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center border px-4 py-6">
                                No players found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

        );
    }
}

PlayerTable.propTypes = {
    players: PropTypes.any,
    error: PropTypes.any,
    convertLevel: PropTypes.any
}

export default PlayerTable;
