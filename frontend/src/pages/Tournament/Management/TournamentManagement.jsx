import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// UI Components
import { TooltipProvider } from "@/components/ui/tooltip.jsx";

// Context & Hooks
import { useResponsive } from "@/Contexts/ResponsiveContext.jsx";
import { useNotification } from "@/Contexts/NotificationContext.jsx";

// Child Components
import ManagementHeader from "./Components/ManagementHeader.jsx";
import ManagementTabs from "./Components/ManagementTabs.jsx";
import LoadingModal from "@/pages/Modals/LoadingModal.jsx"; // ✨ 1. IMPORT the new modal

export default function TournamentManagementPage() {
    const { tournamentId } = useParams();
    const navigate = useNavigate();
    const { isMobile } = useResponsive();
    const { addNotification } = useNotification();

    const [tournament, setTournament] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("dashboard");

    // ✨ THE FIX: The `tournament` state is removed from this dependency array.
    // The function is now "stable" and will not be recreated on every state update.
    const fetchTournamentData = useCallback(async () => {
        setIsLoading(true); // Always set loading to true for feedback
        setError(null);
        try {
            const response = await axios.get(`/api/tournaments/${tournamentId}`);
            const fetchedTournament = response.data; // Store in a local const

            setTournament(fetchedTournament);
            // Use the local const to set the title, avoiding dependency on the state variable
            document.title = `Manage: ${fetchedTournament.name}`;
        } catch (err) {
            console.error("Failed to fetch tournament data:", err);
            setError("Could not load tournament data. Please try again.");
            addNotification({ type: 'error', message: 'Failed to load tournament data.' });
        } finally {
            setIsLoading(false);
        }
    }, [tournamentId, addNotification]); // Only stable dependencies are needed.

    // This useEffect now correctly runs only once when the page loads (or if tournamentId changes).
    useEffect(() => {
        fetchTournamentData();
    }, [fetchTournamentData]);

    // --- API Handler Functions for Children ---

    const handleAddParticipant = async (teamData) => {
        try {
            await axios.post(`/api/tournaments/${tournamentId}/teams`, teamData);
            await fetchTournamentData(); // Refresh data
            // ✨ Add success notification
            addNotification({
                type: 'success',
                message: 'Participant added successfully!'
            });
        } catch (err) {
            console.error("Failed to add participant:", err);
            // ✨ Add error notification
            addNotification({
                type: 'error',
                message: 'Failed to add participant. Please try again.'
            });
        }
    };

    const handleUpdateParticipant = async (teamData) => {
        try {
            await axios.put(`/api/teams/${teamData.id}`, teamData);
            await fetchTournamentData();
            addNotification({ type: 'success', message: 'Participant updated successfully!' });
        } catch (err) {
            console.error("Failed to update participant:", err);
            addNotification({ type: 'error', message: 'Failed to update participant.' });
        }
    };

    const handleRemoveParticipant = async (teamId) => {
        try {
            await axios.delete(`/api/teams/${teamId}`);
            await fetchTournamentData();
            addNotification({ type: 'success', message: 'Participant removed.' });
        } catch (err) {
            console.error("Failed to remove participant:", err);
            addNotification({ type: 'error', message: 'Failed to remove participant.' });
        }
    };

    const updateMatch = async (updatedMatch) => {
        try {
            await axios.put(`/api/matches/${updatedMatch.id}`, updatedMatch);
            await fetchTournamentData();
            addNotification({ type: 'success', message: 'Match score updated!' });
        } catch (err) {
            console.error("Failed to update match:", err);
            addNotification({ type: 'error', message: 'Failed to update score.' });
            throw err;
        }
    };

    // ✨ FIX #2: Added the two missing handler functions for the SettingsTab.
    const handleUpdateTournament = async (tournamentData) => {
        try {
            await axios.put(`/api/tournaments/${tournamentId}`, tournamentData);
            await fetchTournamentData();
            addNotification({ type: 'success', message: 'Tournament settings saved!' });
        } catch (err) {
            console.error("Failed to update tournament settings:", err);
            addNotification({ type: 'error', message: 'Failed to save settings.' });
        }
    };

    const handleDeleteTournament = async () => {
        try {
            await axios.delete(`/api/tournaments/${tournamentId}`);
            addNotification({ type: 'success', message: 'Tournament deleted.' });
            navigate('/tournaments/my');
        } catch (err) {
            console.error("Failed to delete tournament:", err);
            addNotification({ type: 'error', message: 'Failed to delete tournament.' });
        }
    };

    // --- Render Logic ---
    if (error) { return <div className="p-6 text-center text-red-500">❌ {error}</div>; }
    if (!tournament) { return <div className="p-6 text-center text-gray-500">⚠️ No data found.</div>; }

    return (
        <>
            <LoadingModal
                isLoading={isLoading}
                message={tournament ? "Refreshing Data..." : "Loading Dashboard..."}
            />
        <TooltipProvider>
            <div className="flex flex-col p-2 md:p-4 gap-4">
                <ManagementHeader
                    tournament={tournament}
                    isMobile={isMobile}
                    onNavigateLive={() => navigate(`/tournament/live/${tournamentId}`)}
                    onEdit={() => setActiveTab('settings')}
                />
                <ManagementTabs
                    tournament={tournament}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onAddParticipant={handleAddParticipant}
                    onUpdateParticipant={handleUpdateParticipant}
                    onRemoveParticipant={handleRemoveParticipant}
                    onUpdateMatch={updateMatch}
                    onRefreshMatches={fetchTournamentData}
                    onUpdateTournament={handleUpdateTournament}
                    onDeleteTournament={handleDeleteTournament}
                />
            </div>
        </TooltipProvider>
        </>
    );
}