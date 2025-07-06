import  { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// UI Components
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { FaTableTennis } from "react-icons/fa";

// Context & Hooks
import { useResponsive } from "@/Contexts/ResponsiveContext.jsx";

// Child Components
import MatchTableUpdated from "../../MatchCard.jsx";

// The MatchesTab component, now in its own file.
export default function MatchesTab({ tournament, refreshMatches, updateMatch }) {
    const [isRegenerating, setIsRegenerating] = useState(false);
    const { isMobile } = useResponsive();

    const handleRegenerateMatches = async () => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete all existing matches and generate a new schedule? This cannot be undone."
        );
        if (!isConfirmed) return;

        setIsRegenerating(true);
        try {
            await axios.post(`/api/tournaments/${tournament.id}/regenerate-matches`);
            await refreshMatches();
        } catch (err) {
            console.error("Failed to regenerate matches:", err);
            // TODO: Show an error notification to the user
        } finally {
            setIsRegenerating(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle>Manage Matches</CardTitle>
                        <CardDescription>View, edit, or regenerate the tournament schedule.</CardDescription>
                    </div>
                    <Button
                        variant="destructive"
                        onClick={handleRegenerateMatches}
                        disabled={isRegenerating}
                    >
                        {isRegenerating ? "Regenerating..." : <><FaTableTennis className="mr-2" /> Regenerate Schedule</>}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <MatchTableUpdated
                    matches={tournament.matches}
                    refreshMatches={refreshMatches}
                    updateMatch={updateMatch}
                    isMobile={isMobile}
                />
            </CardContent>
        </Card>
    );
};

MatchesTab.propTypes = {
    tournament: PropTypes.object.isRequired,
    refreshMatches: PropTypes.func.isRequired,
    updateMatch: PropTypes.func.isRequired,
};