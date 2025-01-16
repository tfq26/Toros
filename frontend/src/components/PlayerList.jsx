import React, { Component } from "react";
import axios from "axios";

class PlayerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],         // List of players grouped by teams
            error: null,         // Error message
            successMessage: null, // Success message after file import
            sortField: "name",   // Default sort field
            sortOrder: "asc",    // Default sort order (ascending)
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

    // Handle Excel file upload for importing players
    handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:8080/api/players/import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            this.setState({
                successMessage: "Players imported successfully!",
                error: null,
            });
            this.fetchPlayers();  // Refresh the player list
        } catch (error) {
            console.error("Error uploading file:", error);
            let errorMessage = "Failed to import players. Please try again later.";

            // Check if there is a custom error message from the server
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
            });
        }
    };

    // Sort players based on selected field
    handleSort = (field) => {
        const { players, sortOrder } = this.state;
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        const sortedPlayers = Object.values(players)
            .flat()
            .sort((a, b) => {
                if (a[field] < b[field]) return sortOrder === "asc" ? -1 : 1;
                if (a[field] > b[field]) return sortOrder === "asc" ? 1 : -1;
                return 0;
            });

        this.setState({ players: { sorted: sortedPlayers }, sortField: field, sortOrder: newOrder });
    };

    render() {
        const { players, error, successMessage, sortField, sortOrder } = this.state;

        return (
            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold mb-3">Player List</h2>

                {/* Success and error messages */}
                {successMessage && <p className="text-green-600 mb-2">{successMessage}</p>}
                {error && <div className="mb-4">{error}</div>}

                {/* File upload button */}
                <div className="mb-4">
                    <label className="cursor-pointer bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">
                        Import Players
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={this.handleFileUpload}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Player table */}
                <table className="table-auto w-full border border-gray-300">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">
                            ID
                            <button
                                onClick={() => this.handleSort("id")}
                                className={`ml-2 ${sortField === "id" ? "font-bold" : ""}`}
                            >
                                {sortField === "id" && sortOrder === "asc" ? "↑" : "↓"}
                            </button>
                        </th>
                        <th className="border px-4 py-2">
                            Name
                            <button
                                onClick={() => this.handleSort("name")}
                                className={`ml-2 ${sortField === "name" ? "font-bold" : ""}`}
                            >
                                {sortField === "name" && sortOrder === "asc" ? "↑" : "↓"}
                            </button>
                        </th>
                        <th className="border px-4 py-2">
                            Team Number
                            <button
                                onClick={() => this.handleSort("teamNumber")}
                                className={`ml-2 ${sortField === "teamNumber" ? "font-bold" : ""}`}
                            >
                                {sortField === "teamNumber" && sortOrder === "asc" ? "↑" : "↓"}
                            </button>
                        </th>
                        <th className="border px-4 py-2">Club</th>
                        <th className="border px-4 py-2">Level</th>
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
                                    <td className="border px-4 py-2">{player.id || index + 1}</td>
                                    <td className="border px-4 py-2">{player.name || "N/A"}</td>
                                    <td className="border px-4 py-2">{player.teamNumber || "N/A"}</td>
                                    <td className="border px-4 py-2">{player.clubName || "N/A"}</td>
                                    <td className="border px-4 py-2">{this.convertLevel(player.placement)}</td>
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
