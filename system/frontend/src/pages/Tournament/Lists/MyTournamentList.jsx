import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FaSpinner, FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link for navigation

import TournamentItem from "../components/TournamentItem.jsx";
import NoTournamentsFound from "../components/NoTournamentsFound.jsx";
import useMyTournaments from "@/hooks/useMyTournaments.js";
import { useResponsive } from "@/contexts/ResponsiveContext.jsx";

export default function MyTournamentList() {
    const navigate = useNavigate();
    const { isMobile } = useResponsive();
    const {
        status,
        tournaments,
        error,
        refetchMine, // We only need refetchMine
        handleView,
        handleManage,
        handleTournamentClick,
        isAuthenticated,
        loginWithRedirect,
    } = useMyTournaments();

    // On mount, fetch the user's tournaments
    useEffect(() => {
        document.title = "My Tournaments";
        refetchMine();
    }, [refetchMine]);

    const renderContent = () => {
        if (status === "loading") {
            return (
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                    <FaSpinner className="animate-spin text-4xl text-gray-400" />
                    <p className="text-muted-foreground">Loading your tournaments...</p>
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
                    <Button onClick={refetchMine} className="mt-4">Try Again</Button>
                </div>
            );
        }

        if (tournaments.length === 0) {
            return <NoTournamentsFound viewType="mine" onRefresh={refetchMine} />;
        }

        return (
            <ul className="mt-4 space-y-4">
                {tournaments.map((t) => (
                    <TournamentItem
                        key={t.id}
                        tournament={t}
                        // When the user owns the tournament, provide the onManage function
                        onManage={() => handleManage(t.id)}
                        // We also pass onView to make the whole card clickable
                        onView={() => handleView(t.id)}
                    />
                ))}
            </ul>
        );
    };

    return (
        <TooltipProvider>
            <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6">
                <Card className="w-full max-w-4xl">
                    <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
                            <CardTitle className="text-2xl sm:text-3xl font-bold">
                                My Tournaments
                            </CardTitle>
                            {/* Link to the other page */}
                            <Button asChild variant="outline" size="sm">
                                <Link to="/tournaments/all">View All</Link>
                            </Button>
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
                                <TooltipContent><p>Create a new tournament</p></TooltipContent>
                            </Tooltip>
                        )}
                    </CardHeader>
                    <CardContent>{renderContent()}</CardContent>
                </Card>
            </div>
        </TooltipProvider>
    );
}