import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PlayerTable from "./Tables/PlayerTable.jsx";
import TeamTable from "./Tables/TeamTable.jsx";
import PlayerStats from "./Components/PlayerStats.jsx";
import PlayerSettings from "./Components/PlayerSettings.jsx";
import PlayerSearch from "./Components/PlayerSearch.jsx";
import LoadingModal from "@/pages/Modals/LoadingModal.jsx";
import PlayerSidebar from "@/pages/Players/Components/PlayerSidebar.jsx";
import PlayerModalUpdated from "@/pages/Modals/PlayerModalUpdated.jsx";
import { Switch } from "@/components/ui/switch";
import {
    fetchPlayersData,
    filterPlayersData,
    convertLevel,
    calculateStats,
} from "@/utils/functions/HelperFunctions.js";
import {useParams} from "react-router";

const Players = () => {
    const [players, setPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedClub, setSelectedClub] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [error, setError] = useState(null);
    const [setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isTeamView, setIsTeamView] = useState(false);
    const { tournamentId } = useParams();
    const triggerRefresh = async () => {
        await fetchPlayers();
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSlidingWindowOpen, setIsSlidingWindowOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    // Fetch players using the helper function.
    const fetchPlayers = async () => {
        setIsLoading(true);
        try {
            const data = await fetchPlayersData();
            setPlayers(data);
            setError(null);
        } catch {
            setError("Failed to load player data. Please try again later.");
            setPlayers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    // Filter players based on club, level, and search query using helper function.
    useEffect(() => {
        setFilteredPlayers(filterPlayersData(players, selectedClub, selectedLevel, searchQuery));
    }, [players, selectedClub, selectedLevel, searchQuery]);

    const stats = calculateStats(filteredPlayers);
    const clubs = [...new Set(players.map((player) => player.clubName))];
    const levels = [...new Set(players.map((player) => convertLevel(player.skillLevel)))];

    const handleEditTeam = (team) => {
        console.log("Edit Team clicked:", team);
        // Additional logic for team editing can be added here.
    };

    return (
        <div className="relative">
            <div className="w-full pl-20 pr-6 py-4">
                <div className="flex flex-col lg:flex-row gap-6 w-full">
                    <div className="relative flex-1 min-w-0 pr-12">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                                <LoadingModal message="Loading Player List" description="Please wait..." />
                            </div>
                        )}

                        <div className="flex items-center w-full justify-between">
                            <PlayerSearch onSearchChange={setSearchQuery} />
                        </div>

                        {/* Switch to toggle between Players and Teams */}
                        <div className="flex items-center pb-5 border-b-4 mb-6 gap-2">
                            <span className="text-sm">Players</span>
                            <Switch
                                checked={isTeamView}
                                onCheckedChange={(checked) => setIsTeamView(checked)}
                            />
                            <span className="text-sm">Teams</span>
                        </div>

                        <div className="flex flex-col gap-6">
                            {isTeamView ? (
                                <TeamTable
                                    tournamentId={tournamentId}
                                    onEdit={handleEditTeam}
                                    error={error}
                                />
                            ) : (
                                <PlayerTable
                                    players={filteredPlayers}
                                    error={error}
                                    onEdit={(player) => {
                                        setSelectedPlayer(player);
                                        setIsModalOpen(true);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Player Modal */}
            {isModalOpen && (
                <PlayerModalUpdated
                    isModalOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedPlayer(null);
                    }}
                    selectedPlayer={selectedPlayer}
                    refreshPlayers={fetchPlayers}
                    triggerRefresh={triggerRefresh}
                />
            )}

            {/* Sliding Window */}
            <PlayerSidebar
                isOpen={isSlidingWindowOpen}
                onClose={() => setIsSlidingWindowOpen(false)}
                sections={[
                    {
                        id: "settings",
                        label: "Settings",
                        content: (
                            <PlayerSettings
                                isLoading={isLoading}
                                onFileSelect={(importedPlayers) => {
                                    if (!importedPlayers || importedPlayers.length === 0) {
                                        setError("⚠️ No valid player data found in the imported file.");
                                        return;
                                    }
                                    setSuccessMessage(
                                        `✅ File imported successfully! ${importedPlayers.length} players added.`
                                    );
                                    setError(null);
                                    fetchPlayers();
                                }}
                                onStatusUpdate={setSuccessMessage}
                                clubs={clubs}
                                levels={levels}
                                selectedClub={selectedClub}
                                selectedLevel={selectedLevel}
                                onFilterChange={(type, value) => {
                                    if (type === "club") setSelectedClub(value);
                                    if (type === "level") setSelectedLevel(value);
                                }}
                                onAddPlayer={() => {
                                    setSelectedPlayer(null);
                                    setIsModalOpen(true);
                                }}
                            />
                        ),
                    },
                    {
                        id: "stats",
                        label: "Stats",
                        content: <PlayerStats stats={stats} />,
                    },
                ]}
            />
        </div>
    );
};

Players.propTypes = {
    players: PropTypes.array,
    error: PropTypes.string,
    isLoading: PropTypes.bool,
    setSuccessMessage: PropTypes.func,
    setError: PropTypes.func,
    selectedPlayer: PropTypes.object,
    setSelectedPlayer: PropTypes.func,
    isModalOpen: PropTypes.bool,
    setIsModalOpen: PropTypes.func,
    isSlidingWindowOpen: PropTypes.bool,
    setIsSlidingWindowOpen: PropTypes.func,
    fetchPlayers: PropTypes.func,
    triggerRefresh: PropTypes.func,
    selectedClub: PropTypes.string,
    setSelectedClub: PropTypes.func,
};

export default Players;
