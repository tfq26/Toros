import  { useState } from "react";
import { usePlayers } from "@/hooks/usePlayers.js"; // Import the new hook

// UI Components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FaPlus, FaSync } from "react-icons/fa";

// Child Components
import PlayerTable from "./Tables/PlayerTable.jsx";
import TeamTable from "./Tables/TeamTable.jsx";
import PlayerStats from "./Components/PlayerStats.jsx";
import PlayerSearch from "./Components/PlayerSearch.jsx";
import PlayerFilters from "./Components/PlayerFilters.jsx"; // A new component for filters
import PlayerModalUpdated from "@/pages/Modals/PlayerModalUpdated.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";

const PlayersPage = () => {
    const {
        status,
        error,
        players,
        stats,
        clubs,
        levels,
        filters,
        actions,
    } = usePlayers();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const handleEditPlayer = (player) => {
        setSelectedPlayer(player);
        setIsModalOpen(true);
    };

    const handleAddPlayer = () => {
        setSelectedPlayer(null); // Ensure modal opens in 'add' mode
        setIsModalOpen(true);
    };

    const renderContent = () => {
        if (status === 'loading') {
            return <TableSkeleton />;
        }
        if (status === 'error') {
            return (
                <div className="text-center py-10">
                    <p className="text-destructive font-semibold">{error}</p>
                    <Button onClick={actions.refresh} variant="outline" className="mt-4">
                        <FaSync className="mr-2" />
                        Try Again
                    </Button>
                </div>
            );
        }
        return (
            <TabsContent value="players" className="mt-0">
                <PlayerTable players={players} onEdit={handleEditPlayer} />
            </TabsContent>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 md:p-6">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
                <Card>
                    <CardHeader>
                        {/* Header with Search, Filters, and Actions */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <PlayerSearch onSearchChange={actions.setSearchQuery} />
                            <PlayerFilters
                                clubs={clubs}
                                levels={levels}
                                selectedClub={filters.selectedClub}
                                selectedLevel={filters.selectedLevel}
                                onClubChange={actions.setSelectedClub}
                                onLevelChange={actions.setSelectedLevel}
                            />
                            <Button onClick={handleAddPlayer}>
                                <FaPlus className="mr-2" /> Add Player
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="players" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="players">Players</TabsTrigger>
                                <TabsTrigger value="teams">Teams</TabsTrigger>
                            </TabsList>
                            {renderContent()}
                            <TabsContent value="teams">
                                <TeamTable />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar / Stats Area */}
            <div className="lg:col-span-1">
                <PlayerStats stats={stats} />
            </div>

            {/* Player Modal for Add/Edit */}
            {isModalOpen && (
                <PlayerModalUpdated
                    isModalOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    selectedPlayer={selectedPlayer}
                    refreshPlayers={actions.refresh}
                />
            )}
        </div>
    );
};

// A simple skeleton component for the loading state
const TableSkeleton = () => (
    <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
    </div>
);

export default PlayersPage;
