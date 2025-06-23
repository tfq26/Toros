// src/pages/MyTournamentsPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FaSpinner, FaPlusCircle } from "react-icons/fa";

import TournamentItem from "../components/TournamentItem.jsx";
import useMyTournaments from "../../../hooks/useMyTournaments.js";

export default function MyTournamentsPage() {
    const navigate = useNavigate();
    const {
        status,
        tournaments,
        error,
        refetch,
        handleView,
        handleManage,
        handleTournamentClick,
        isAuthenticated,
        loginWithRedirect,
    } = useMyTournaments();

    useEffect(() => {
        document.title = "My Tournaments";
    }, []);

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
                    <Button onClick={refetch} className="mt-4">
                        Try Again
                    </Button>
                </div>
            );
        }

        if (tournaments.length === 0) {
            return <NoTournamentsFound onRefresh={refetch} />;
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
        <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6">
            <Card className="w-full max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-3xl font-bold">My Tournaments</CardTitle>
                    <Button onClick={() => navigate("/tournament/setup")}>
                        <FaPlusCircle className="mr-2" /> Create New
                    </Button>
                </CardHeader>
                <CardContent>{renderContent()}</CardContent>
            </Card>
        </div>
    );
}

// eslint-disable-next-line react/prop-types
function NoTournamentsFound({ onRefresh }) {
    const navigate = useNavigate();
    return (
        <div className="text-center py-10">
            <h3 className="text-xl font-semibold text-foreground">
                You haven&rsquo;t created any tournaments yet.
            </h3>
            <p className="text-muted-foreground mt-2">
                Get started by setting up your first one!
            </p>
            <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline" onClick={onRefresh}>
                    Refresh List
                </Button>
                <Button onClick={() => navigate("/tournament/setup")}>
                    Setup a Tournament
                </Button>
            </div>
        </div>
    );
}
