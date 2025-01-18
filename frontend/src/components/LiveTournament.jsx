import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorPage from "./Error";

const LiveTournament = ({ setTournamentSetupComplete }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detailedError, setDetailedError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/tournament/live");
                if (Array.isArray(response.data)) {
                    setMatches(response.data);
                } else {
                    console.error("Expected an array but got:", response.data);
                    setMatches([]);
                }
                setLoading(false);
            } catch (err) {
                const errorMessage =
                    err.response?.data?.message || "Failed to fetch live matches. Please try again.";
                const detailedMessage = err.response?.data?.detailedMessage || null;
                setError(errorMessage);
                setDetailedError(detailedMessage);
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const getSkillLevel = (placement) => {
        switch (placement) {
            case 1:
                return "Beginner";
            case 2:
                return "Intermediate";
            case 3:
                return "Advanced";
            default:
                return "Unranked";
        }
    };

    const endTournament = async () => {
        if (window.confirm("Are you sure you want to end the tournament? This action cannot be undone.")) {
            try {
                const response = await axios.post("http://localhost:8080/api/tournament/live/end");
                if (response.status === 200) {
                    alert("Tournament ended successfully!");
                    setTournamentSetupComplete(false); // Reset the tournament setup state
                    navigate("/"); // Redirect to the home page
                } else {
                    alert("Failed to end the tournament. Please try again.");
                }
            } catch (error) {
                console.error("Error ending tournament:", error.message);
                alert("An error occurred while ending the tournament. Please try again.");
            }
        }
    };

    const updateMatch = async (matchId, team1Score, team2Score, status) => {
        try {
            const updatedMatch = { team1Score, team2Score, status };
            const response = await axios.patch(
                `http://localhost:8080/api/tournament/live/${matchId}`,
                updatedMatch
            );

            if (response.status === 200) {
                setMatches((prevMatches) =>
                    prevMatches.map((match) =>
                        match.id === matchId ? { ...match, ...updatedMatch } : match
                    )
                );

                // Only advance winners if explicitly required
                if (status === "Complete" && matches.some(m => m.round)) {
                    const winner = team1Score > team2Score ? "team1" : "team2";
                    advanceWinner(matchId, winner);
                }
            }
        } catch (error) {
            console.error("Error updating match:", error.message);
        }
    };

    const advanceWinner = async (matchId, winner) => {
        try {
            const match = matches.find((m) => m.id === matchId);
            if (!match) {
                console.error("Match not found for advancing winner.");
                return;
            }

            const winnerTeamId = winner === "team1" ? match.team1.id : match.team2.id;

            const response = await axios.post("http://localhost:8080/api/tournament/advanceWinner", null, {
                params: { matchId, winnerTeamId },
            });

            if (response.status === 200) {
                console.log("Winner advanced successfully.");
            }
        } catch (error) {
            console.error("Error advancing winner:", error.message);
        }
    };

    const handleStatusChange = (matchId, newStatus) => {
        const match = matches.find((m) => m.id === matchId);
        if (!match) {
            alert("Match not found.");
            return;
        }

        updateMatch(matchId, match.team1Score || 0, match.team2Score || 0, newStatus);
    };

    const formatTime = (time) => {
        if (!time) return "N/A";
        const [hours, minutes] = time.split(":");
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const matchStats = matches.reduce(
        (stats, match) => {
            if (match.status === "Complete") {
                stats.complete++;
            } else if (match.status === "In Progress") {
                stats.inProgress++;
            } else if (match.status === "Scheduled") {
                stats.notStarted++;
            }
            return stats;
        },
        { complete: 0, inProgress: 0, notStarted: 0 }
    );

    const groupedMatches = matches.reduce((acc, match) => {
        const round = match.round || 1;
        if (!acc[round]) acc[round] = [];
        acc[round].push(match);
        return acc;
    }, {});

    if (loading) return <div>Loading matches...</div>;
    if (error) return <ErrorPage statusCode={500} message={error} detailedMessage={detailedError} />;

    return (
        <div className="container mx-auto px-4 py-6 flex gap-6">
            {/* Main Matches Section */}
            <div className="flex-grow">
                <h1 className="text-2xl font-bold mb-4">Live Tournament Matches</h1>
                {Object.keys(groupedMatches).length > 0 ? (
                    Object.keys(groupedMatches).map((courtNumber) => (
                        <div key={courtNumber} className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Court {courtNumber}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groupedMatches[courtNumber].map((match, index) => (
                                    <div key={match.id} className="border p-4 rounded shadow space-y-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-lg font-bold">Match {index + 1} - Status:</p>
                                            <select
                                                value={match.status}
                                                onChange={(e) => {
                                                    const newStatus = e.target.value;

                                                    if (newStatus === "Complete") {
                                                        // Prompt for scores when the status is set to Complete
                                                        const team1Score = parseInt(prompt(`Enter score for ${match.team1?.name || "Team 1"}:`), 10);
                                                        const team2Score = parseInt(prompt(`Enter score for ${match.team2?.name || "Team 2"}:`), 10);

                                                        if (!isNaN(team1Score) && !isNaN(team2Score)) {
                                                            updateMatch(match.id, team1Score, team2Score, newStatus);
                                                        } else {
                                                            alert("Invalid input. Please enter numeric values for the scores.");
                                                        }
                                                    } else {
                                                        // For other statuses, just update the status
                                                        updateMatch(match.id, match.team1Score || 0, match.team2Score || 0, newStatus);
                                                    }
                                                }}
                                                className="border rounded px-2 py-1"
                                            >
                                                <option value="Scheduled">Scheduled</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Complete">Complete</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <p className="font-bold">Team 1</p>
                                                <p>{match.team1?.name || "N/A"}</p>
                                                <p>{getSkillLevel(match.team1?.placement) || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="font-bold">Team 2</p>
                                                <p>{match.team2?.name || "N/A"}</p>
                                                <p>{getSkillLevel(match.team2?.placement) || "N/A"}</p>
                                            </div>
                                        </div>

                                        <p>
                                            <strong>Start Time:</strong> {formatTime(match.startTime)}
                                        </p>
                                        <p>
                                            <strong>End Time:</strong> {formatTime(match.endTime)}
                                        </p>

                                        <p
                                            className="text-lg font-bold text-gray-700 cursor-pointer text-center mt-4"
                                            onClick={() => {
                                                const team1Score = parseInt(prompt(`Enter new score for ${match.team1?.name || "Team 1"}:`), 10);
                                                const team2Score = parseInt(prompt(`Enter new score for ${match.team2?.name || "Team 2"}:`), 10);

                                                if (!isNaN(team1Score) && !isNaN(team2Score)) {
                                                    updateMatch(match.id, team1Score, team2Score, match.status);
                                                } else {
                                                    alert("Invalid input. Please enter numeric values for the scores.");
                                                }
                                            }}
                                        >
                                            {match.team1Score || 0}-{match.team2Score || 0}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No matches available.</p>
                )}
            </div>

            {/* Sticky Stats Section */}
            <div className="w-64 mt-[5.7rem]">
                <div className="sticky top-4 border p-4 rounded shadow bg-white flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4 text-center">Match Statistics</h2>
                    <p>
                        <strong>Completed:</strong> {matchStats.complete}
                    </p>
                    <p>
                        <strong>In Progress:</strong> {matchStats.inProgress}
                    </p>
                    <p>
                        <strong>Not Started:</strong> {matchStats.notStarted}
                    </p>

                    {/* Buttons Section */}
                    <div className="mt-6 flex flex-col gap-4 w-full">
                        <button
                            onClick={() => endTournament()}
                            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition w-full"
                        >
                            End Tournament
                        </button>
                        {matchStats.complete === matches.length && matches.length > 0 && (
                            <button
                                onClick={() => navigate("/knockout/setup")}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full"
                            >
                                Start Knockout Setup
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveTournament;
