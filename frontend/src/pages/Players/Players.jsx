import React, { useState, useMemo } from "react";
import { usePlayers } from "@/hooks/usePlayers.js";
import { useResponsive } from "@/contexts/ResponsiveContext.jsx"; // Import the responsive hook

// UI Components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FaFileImport, FaSync, FaFilter } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton.jsx";

// Child Components
import PlayerTable from "./Tables/PlayerTable.jsx";
import TeamTable from "./Tables/TeamTable.jsx";
import PlayerStats from "./Components/PlayerStats.jsx";
import PlayerSearch from "./Components/PlayerSearch.jsx";
import PlayerFilters from "./Components/PlayerFilters.jsx";
import PlayerModalUpdated from "@/pages/Modals/PlayerModalUpdated.jsx";
import FileUploader from "@/components/FileUploader.jsx";
import AddPlayer from "../Modals/AddPlayer.jsx";
import {useAuth} from "@/Contexts/AuthContext.jsx";

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

    const { isMobile } = useResponsive(); // Get responsive state

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const isAdmin = isAuthenticated && user?.role === 'ADMIN';

    const teams = useMemo(() => {
        const teamsMap = new Map();
        players.forEach(player => {
            const teamName = player.teamName || `Single - ${player.name}`;

            if (!teamsMap.has(teamName)) {
                teamsMap.set(teamName, {
                    id: teamName,
                    name: teamName,
                    players: []
                });
            }
            teamsMap.get(teamName).players.push(player);
        });
        return Array.from(teamsMap.values());
    }, [players]);


    const handleEditPlayer = (player) => {
        setSelectedPlayer(player);
        setIsEditModalOpen(true);
    };

    const handleImportConfirm = (importedPlayers) => {
        actions.importPlayers(importedPlayers);
        setIsImportModalOpen(false);
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

    const renderFilters = () => (
        <PlayerFilters
            clubs={clubs}
            levels={levels}
            selectedClub={filters.selectedClub}
            selectedLevel={filters.selectedLevel}
            onClubChange={actions.setSelectedClub}
            onLevelChange={actions.setSelectedLevel}
        />
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 md:p-6">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
                <Card>
                    <CardHeader>
                        {/* --- RESPONSIVE HEADER --- */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <PlayerSearch onSearchChange={actions.setSearchQuery}/>

                            {isMobile ? (
                                <div className="w-full flex gap-2">
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="outline" className="flex-1">
                                                <FaFilter className="mr-2"/> Filter
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent>
                                            <SheetHeader>
                                                <SheetTitle>Filter Players</SheetTitle>
                                            </SheetHeader>
                                            <div className="py-4">{renderFilters()}</div>
                                        </SheetContent>
                                    </Sheet>
                                    {isAdmin && (
                                        <AddPlayer
                                            onPlayerAdded={actions.refresh}
                                            players={players}
                                            clubs={clubs}
                                            levels={levels}
                                        />
                                    )}
                                </div>
                            ) : (
                                <>
                                    {renderFilters()}
                                    {isAdmin && (
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
                                                <FaFileImport className="mr-2"/> Import
                                            </Button>
                                            <AddPlayer
                                                onPlayerAdded={actions.refresh}
                                                players={players}
                                                clubs={clubs}
                                                levels={levels}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="players" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-muted-foreground text-popover my-4">
                                <TabsTrigger value="players">Players</TabsTrigger>
                                <TabsTrigger value="teams">Teams</TabsTrigger>
                            </TabsList>
                            {renderContent()}
                            <TabsContent value="teams">
                                <TeamTable teams={teams} onEdit={handleEditPlayer} />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar / Stats Area */}
            <div className="lg:col-span-1">
                <PlayerStats stats={stats} />
            </div>

            {/* Player Modal for EDIT ONLY */}
            {isEditModalOpen && (
                <PlayerModalUpdated
                    isModalOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    player={selectedPlayer}
                    onSave={actions.updatePlayer}
                />
            )}

            {/* Import Modal */}
            <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Players from File</DialogTitle>
                        <DialogDescription>
                            Upload an Excel file (.xlsx, .xls) with player data.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <FileUploader onFileSelect={handleImportConfirm} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const TableSkeleton = () => (
    <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
    </div>
);

export default PlayersPage;
