import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs components
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FaSpinner, FaPlusCircle } from "react-icons/fa";

import TournamentItem from "../components/TournamentItem.jsx";
import NoTournamentsFound from "../components/NoTournamentsFound.jsx"; // Assuming this is now a separate component
import useMyTournaments from "@/hooks/useMyTournaments.js";
import { useResponsive } from "@/contexts/ResponsiveContext.jsx";

export default function TournamentList() {
    const navigate = useNavigate();
    const { isMobile } = useResponsive();
    const [activeTab, setActiveTab] = useState("mine"); // State to manage the active tab

    const {
        status,
        tournaments,
        error,
        refetchAll,
        refetchMine,
        handleView,
        handleManage,
        handleTournamentClick,
        isAuthenticated,
        loginWithRedirect,
    } = useMyTournaments();

    // On mount and whenever activeTab changes, call the appropriate fetch
    useEffect(() => {
        document.title = activeTab === 'all' ? "All Tournaments" : "My Tournaments";
        if (activeTab === 'all') {
            refetchAll();
        } else {
            refetchMine();
        }
    }, [activeTab, refetchAll, refetchMine]);

    const onRefresh = () => (activeTab === 'all' ? refetchAll() : refetchMine());

    const renderContent = () => {
        if (status === "loading") {
            return (
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                    <FaSpinner className="animate-spin text-4xl text-gray-400" />
                    <p className="text-muted-foreground">
                        {activeTab === 'all' ? "Loading all tournaments..." : "Loading your tournaments..."}
                    </p>
                </div>
            );
        }

        if (status === "unauthenticated" || !isAuthenticated) {
            return (
                <div className="text-center py-10">
                    <h3 className="text-xl font-semibold text-foreground">
                        Please log in to view your tournaments.
                    </h3>
                    <Button onClick={() => loginWithRedirect()} className="mt-6">
                        Log In
                    </Button>
                </div>
            );
        }

        if (status === "error") {
            return (
                <div className="text-center py-10">
                    <p className="text-lg font-semibold text-destructive">{error}</p>
                    <Button onClick={onRefresh} className="mt-4">
                        Try Again
                    </Button>
                </div>
            );
        }

        if (tournaments.length === 0) {
            // Pass the activeTab to the NoTournamentsFound component
            return <NoTournamentsFound viewType={activeTab} onRefresh={onRefresh} />;
        }

        return (
            <ul className="mt-4 space-y-4">
                {tournaments.map((t) => (
                    <TournamentItem
                        key={t.id}
                        tournament={t}
                        onView={() => handleView(t.id)}
                        onManage={() => handleManage(t.id)}
                        onClick={() => handleTournamentClick(t.id)}
                    />
                ))}
            </ul>
        );
    };

    return (
        <TooltipProvider>
            <div className="flex flex-col items-center min-h-screen rounded-lg p-4 sm:p-6">
                <Card className="w-full max-w-4xl">
                    <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 shadow-xl p-4 bg-secondary rounded-lg">
                            <CardTitle className="text-2xl sm:text-3xl font-bold">
                                Tournaments
                            </CardTitle>
                            {isAuthenticated && (
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList  className={"w-full sm:w-auto bg-accent text-muted"}>
                                        <TabsTrigger value="mine">Mine</TabsTrigger>
                                        <TabsTrigger value="all">All</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            )}
                        </div>
                        {isAuthenticated && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() => navigate("/tournament/setup")}
                                        size={isMobile ? "icon" : "default"}
                                        className="w-full sm:w-auto"
                                    >
                                        <FaPlusCircle className="h-5 w-5" />
                                        <span className="sr-only sm:not-sr-only sm:ml-2">
                                            Create Tournament
                                        </span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Create a new tournament</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </CardHeader>
                    <CardContent>{renderContent()}</CardContent>
                </Card>
            </div>
        </TooltipProvider>
    );
}