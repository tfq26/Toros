import React from "react";
import * as PropTypes from "prop-types";

class PlayerTable extends React.Component {
    render() {
        let { players, error, convertLevel } = this.props;
        return (
            <div className="w-full">
                {/*<h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Player List</h2>*/}

                {/* ✅ Responsive Table Wrapper (Now Bigger) */}
                <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-300 flex-grow min-h-[600px]">
                    <table className="table-auto w-full min-w-full text-md text-gray-700">
                        {/* ✅ Bigger Table Headers */}
                        <thead>
                        <tr className="bg-emerald-600 text-white uppercase text-lg font-semibold">
                            {["Name", "Team Number", "Club", "Level"].map((header) => (
                                <th key={header} className="border px-8 py-4 text-center">
                                    {header}
                                </th>
                            ))}
                        </tr>
                        </thead>

                        {/* ✅ Table Body with Bigger Cells */}
                        {!error && players && Object.values(players).flat().length > 0 ? (
                            <tbody>
                            {Object.values(players)
                                .flat()
                                .map((player, index) => (
                                    <tr
                                        key={`player-${index}`}
                                        className="odd:bg-gray-100 even:bg-white hover:bg-gray-200 transition"
                                    >
                                        <td className="border px-8 py-4 text-center">
                                            {player.name || "N/A"}
                                        </td>
                                        <td className="border px-8 py-4 text-center">
                                            {player.teamNumber || "N/A"}
                                        </td>
                                        <td className="border px-8 py-4 text-center">
                                            {player.clubName || "N/A"}
                                        </td>
                                        <td className="border px-8 py-4 text-center font-semibold">
                                            {convertLevel(player.placement)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            <tbody>
                            <tr>
                                <td colSpan="4" className="text-center text-gray-600 py-6">
                                    No players found.
                                </td>
                            </tr>
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        );
    }
}

PlayerTable.propTypes = {
    players: PropTypes.any,
    error: PropTypes.any,
    convertLevel: PropTypes.func.isRequired
};

export default PlayerTable;
