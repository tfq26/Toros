import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FaSpinner, FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

import TournamentItem from "../components/TournamentItem.jsx";
import NoTournamentsFound from "../components/NoTournamentsFound.jsx";
import useMyTournaments from "@/hooks/useMyTournaments.js";
import { useResponsive } from "@/contexts/ResponsiveContext.jsx";

export default function AllTournamentsPage() {
    const navigate = useNavigate();
    const { isMobile } = useResponsive();

    // --- FIXED: Updated the destructured props from the hook ---
    const {
        status,
        tournaments,
        error,
        refetchAll,
        handleView,
        handleRegister, // <-- ADDED the missing function
        isAuthenticated,
    } = useMyTournaments();
    // Removed unused 'handleManage' and 'handleTournamentClick'

    // On mount, fetch all tournaments
    useEffect(() => {
        document.title = "All Tournaments";
        refetchAll();
    }, [refetchAll]);

    const renderContent = () => {
        if (status === "loading") {
            return (
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                    <FaSpinner className="animate-spin text-4xl text-gray-400" />
                    <p className="text-muted-foreground">Loading all tournaments...</p>
                </div>
            );
        }

        if (status === "error") {
            return (
                <div className="text-center py-10">
                    <p className="text-lg font-semibold text-destructive">{error}</p>
                    <Button onClick={refetchAll} className="mt-4">Try Again</Button>
                </div>
            );
        }

        if (tournaments.length === 0) {
            return <NoTournamentsFound viewType="all" onRefresh={refetchAll} />;
        }

        return (
            <ul className="mt-4 space-y-4">
                {tournaments.map((t) => (
                    <TournamentItem
                        key={t.id}
                        tournament={t}
                        // This now works because handleRegister is defined
                        onRegister={() => handleRegister(t.id)}
                        // Pass onView to make the whole card clickable or for a dedicated button
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
                                All Tournaments
                            </CardTitle>
                            {isAuthenticated && (
                                <Button asChild variant="outline" size="sm">
                                    <Link to="/tournaments/my">View Mine</Link>
                                </Button>
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