import React from "react";
import * as PropTypes from "prop-types";

class PlayerTable extends React.Component {
    render() {
        const { players, error, convertLevel, onEdit } = this.props;
        return (
            <div className="w-full">
                <div className="overflow-x-auto rounded-lg w-full flex-grow min-h-[600px]">
                    <table className="table-auto border-collapse border border-gray-300 w-full dark:border-gray-600">
                        <thead>
                        <tr className="bg-emerald-600 dark:bg-emerald-950 text-white uppercase text-lg font-semibold">
                            {["Name", "Club", "Level", "Actions"].map((header) => (
                                <th key={header} className="border border-emerald-800 px-8 py-4 text-center dark:border-emerald-900">
                                    {header}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        {!error && players && Object.values(players).flat().length > 0 ? (
                            <tbody>
                            {Object.values(players)
                                .flat()
                                .map((player, index) => (
                                    <tr
                                        key={`player-${index}`}
                                        className="odd:bg-emerald-50 even:bg-emerald-100 hover:bg-emerald-200 transition
                                                       dark:odd:bg-green-800 dark:even:bg-green-700 dark:hover:bg-green-600"
                                    >
                                        <td className="border border-gray-300 px-8 py-4 text-center dark:border-green-900 dark:text-gray-200">
                                            {player.name || "N/A"}
                                        </td>
                                        <td className="border border-gray-300 px-8 py-4 text-center dark:border-green-900 dark:text-gray-200">
                                            {player.clubName || "N/A"}
                                        </td>
                                        <td className="border border-gray-300 px-8 py-4 text-center font-semibold dark:border-green-900 dark:text-gray-200">
                                            {convertLevel(player.placement)}
                                        </td>
                                        <td className="border border-gray-300 px-8 py-4 text-center dark:border-green-900">
                                            <button
                                                onClick={() => onEdit(player)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            <tbody>
                            <tr>
                                <td colSpan="4" className="text-center text-gray-600 dark:text-gray-300 py-6">
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
    convertLevel: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired, // onEdit function to open the modal for editing
};

export default PlayerTable;
