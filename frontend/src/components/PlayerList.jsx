import React, { Component } from "react";
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class PlayerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [], // List of players grouped by teams
            error: null, // Error message
            successMessage: null, // Success message after file import
            sortField: "name", // Default sort field
            sortOrder: "asc", // Default sort order (ascending)
            uploadedFileName: null, // Name of the uploaded file
            isLoading: false, // Loading state
        };
    }

    // Fetch players when the component mounts
    componentDidMount() {
        this.fetchPlayers();
    }

    // Fetch players from the backend
    async fetchPlayers() {
        try {
            const response = await axios.get("http://localhost:8080/api/players/all");
            this.setState({ players: response.data, error: null });
        } catch (error) {
            console.error("Error fetching players:", error);
            this.setState({ error: "Failed to load player data. Please try again later." });
        }
    }

    // Handle Excel file upload with confirmation
    handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        confirmAlert({
            title: 'Confirm Import',
            message: 'Importing a new file will overwrite all existing player data. Do you want to proceed?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.uploadFile(file),
                },
                {
                    label: 'No',
                },
            ],
        });
    };

    // Upload file to the server
    async uploadFile(file) {
        const formData = new FormData();
        formData.append("file", file);

        this.setState({ isLoading: true }); // Set loading state

        try {
            const response = await axios.post("http://localhost:8080/api/players/import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            this.setState({
                successMessage: `Players imported successfully from file: ${file.name}`,
                error: null,
                uploadedFileName: file.name,
                isLoading: false,
            });
            this.fetchPlayers(); // Refresh the player list

            confirmAlert({
                title: 'Import Successful',
                message: `The file "${file.name}" was imported successfully.`,
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => {},
                    },
                ],
            });
        } catch (error) {
            console.error("Error uploading file:", error);
            let errorMessage = `Failed to import players from file: ${file.name}. Please try again later.`;

            if (error.response && error.response.status === 422 && error.response.data) {
                const formattedErrors = error.response.data.split("\n").map((line, index) => (
                    <li key={index} className="text-sm text-red-600">{line}</li>
                ));
                errorMessage = (
                    <div className="text-left">
                        <p className="text-red-500 font-bold">Import error:</p>
                        <ul className="list-disc pl-5">{formattedErrors}</ul>
                    </div>
                );
            }

            this.setState({
                error: errorMessage,
                successMessage: null,
                uploadedFileName: file.name,
                isLoading: false,
            });

            confirmAlert({
                title: 'Import Failed',
                message: `The file "${file.name}" could not be imported. Please check for errors.`,
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => {},
                    },
                ],
            });
        }
    }

    // Calculate stats for the sidebar
    calculateStats() {
        const { players } = this.state;
        const flatPlayers = Object.values(players).flat();

        const totalPlayers = flatPlayers.length;
        const totalTeams = new Set(flatPlayers.map((player) => player.teamNumber)).size;

        const rankCounts = flatPlayers.reduce(
            (acc, player) => {
                const rank = this.convertLevel(player.placement);
                acc[rank] = (acc[rank] || 0) + 1;
                return acc;
            },
            { Beginner: 0, Intermediate: 0, Advanced: 0, Unknown: 0 }
        );

        const getEmojiForRank = (rank) => {
            switch (rank) {
                case "Beginner":
                    return "🌱"; // Emoji for beginners
                case "Intermediate":
                    return "🔥"; // Emoji for intermediate
                case "Advanced":
                    return "🏆"; // Emoji for advanced
                default:
                    return "❓"; // Emoji for unknown or other ranks
            }
        };

        const clubCounts = flatPlayers.reduce((acc, player) => {
            acc[player.clubName] = (acc[player.clubName] || 0) + 1;
            return acc;
        }, {});

        return { totalPlayers, totalTeams, rankCounts, clubCounts, getEmojiForRank };
    }

    // Render sort indicator
    renderSortIndicator(field) {
        const { sortField, sortOrder } = this.state;
        if (sortField === field) {
            return sortOrder === "asc" ? "⬆️" : "⬇️";
        }
        return ""; // Return an empty string for unsorted fields
    }

    // Sort players based on selected field
    handleSort = (field) => {
        const { players, sortOrder } = this.state;
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        const sortedPlayers = Object.values(players)
            .flat()
            .sort((a, b) => {
                if (a[field] < b[field]) return newOrder === "asc" ? -1 : 1;
                if (a[field] > b[field]) return newOrder === "asc" ? 1 : -1;
                return 0;
            });

        this.setState({ players: { sorted: sortedPlayers }, sortField: field, sortOrder: newOrder });
    };

    render() {
        const { players, error, successMessage, isLoading } = this.state;
        const { totalPlayers, totalTeams, rankCounts, clubCounts, getEmojiForRank } = this.calculateStats();

        return (
            <div className="container mx-auto px-4 py-6">
                {/* Import Button Section */}
                <div className="mb-6">
                    <label
                        className="cursor-pointer bg-emerald-300 text-emerald-800 px-4 py-2 rounded hover:bg-emerald-600 hover:text-white transition duration-200">
                        Import Players
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={this.handleFileUpload}
                            className="hidden"
                        />
                    </label>
                    {isLoading && <p className="text-blue-500 mt-2">Importing file, please wait...</p>}
                </div>

                <div className="flex gap-4">
                    {/* Player Table Section */}
                    <table className="table-auto w-full border border-gray-300">
                        <thead>
                        <tr className="bg-emerald-500">
                            {['ID', 'Name', 'Team Number', 'Club', 'Level'].map((header) => (
                                <th
                                    key={header}
                                    className="border px-4 py-2 text-emerald-800 whitespace-nowrap"
                                >
                                    {header}
                                    <button
                                        onClick={() =>
                                            this.handleSort(header.toLowerCase().replace(' ', ''))
                                        }
                                        className="ml-2"
                                    >
                                        {this.renderSortIndicator(header.toLowerCase().replace(' ', ''))}
                                    </button>
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
                                            {this.convertLevel(player.placement)}
                                        </td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center border px-4 py-6"
                                >
                                    No players found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    {/* Stats Sidebar Section */}
                    <aside className="w-fit bg-red-500 p-4 rounded shadow-md h-fit border-gray-300">
                        <h3 className="text-xl text-orange-200 font-bold mb-4 text-center">Player Stats</h3>
                        <p className="text-orange-300"><strong>Total Players:</strong> {totalPlayers}</p>
                        <p className="text-orange-300"><strong>Total Teams:</strong> {totalTeams}</p>
                        <div className="text-gray-100">
                            <strong>Players by Rank:</strong>
                            <ul className="pl-4 list-none">
                                {Object.entries(rankCounts).map(([rank, count]) => (
                                    <li className="text-white flex items-center" key={rank}>
                                        <span className="mr-2 text-lg">{getEmojiForRank(rank)}</span> {rank}: {count}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="text-gray-100">
                            <strong>Players by Club:</strong>
                            <ul className="pl-4 list-none">
                                {Object.entries(clubCounts).map(([club, count]) => (
                                    <li className="text-white flex items-center" key={club}>
                                        <span className="mr-2 text-lg">📍</span> {club}: {count}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        );
    }

    // Convert skill placement to a readable format
    convertLevel(placement) {
        switch (placement) {
            case 1:
                return "Beginner";
            case 2:
                return "Intermediate";
            case 3:
                return "Advanced";
            default:
                return "Unknown";
        }
    }
}

export default PlayerList;
