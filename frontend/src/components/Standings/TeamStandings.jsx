import React, { useState, useEffect } from "react";
import TeamList from './TeamList';
import MatchList from './MatchList';
import ExportButtons from './ExportButtons';
import ErrorAlert from '../Error';
import LoadingModal from '../LoadingModal'; // Import LoadingModal
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
    fetchStandings,
    fetchAllMatches,
    clearStandings,
    exportToExcel,
    exportToPDF,
    fetchTeamMatches
} from '../utils/standingsUtils.js';

function TeamStandings() {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamMatches, setTeamMatches] = useState([]);
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState(null);
    const [loadingMatches, setLoadingMatches] = useState(false);
    const [loadingStandings, setLoadingStandings] = useState(true); // Add loading state for standings
    const navigate = useNavigate(); // Initialize navigate

    const loadStandings = async () => {
        try {
            const data = await fetchStandings();
            setTeams(data);
            setLoadingStandings(false); // Set loading to false after fetching data
        } catch (error) {
            setError(error.message);
            setLoadingStandings(false); // Ensure loading is stopped on error
            // Navigate to the ErrorPage with detailed error message
            navigate("/error", {
                state: {
                    city: "Tokyo",
                    message: "Failed to load standings.",
                    detailedMessage: error.message || "An unknown error occurred while fetching standings.",
                    errorMessages: [error.message] // Pass the error messages array
                }
            });
        }
    };

    const loadMatches = async () => {
        try {
            const data = await fetchAllMatches();
            setMatches(data);
        } catch (error) {
            setError(error.message);
            // Navigate to the ErrorPage with detailed error message
            navigate("/error", {
                state: {
                    statusCode: 500,
                    message: "Failed to load matches.",
                    detailedMessage: error.message || "An unknown error occurred while fetching matches.",
                    errorMessages: [error.message] // Pass the error messages array
                }
            });
        }
    };

    const handleClearStandings = async () => {
        try {
            const message = await clearStandings();
            alert(message);
            setTeams([]);
        } catch (error) {
            setError(error.message);
            // Navigate to the ErrorPage with detailed error message
            navigate("/error", {
                state: {
                    statusCode: 500,
                    message: "Failed to clear standings.",
                    detailedMessage: error.message || "An unknown error occurred while clearing standings.",
                    errorMessages: [error.message] // Pass the error messages array
                }
            });
        }
    };

    const handleExportToExcel = () => {
        exportToExcel(teams);
    };

    const handleExportToPDF = () => {
        exportToPDF(teams);
    };

    const handleTeamClick = async (team) => {
        setSelectedTeam(team);
        setLoadingMatches(true);
        try {
            const matchesData = await fetchTeamMatches(team.name);
            setTeamMatches(matchesData);
        } catch (error) {
            setError(error.message);
            // Navigate to the ErrorPage with detailed error message
            navigate("/error", {
                state: {
                    statusCode: 500,
                    message: "Failed to load team matches.",
                    detailedMessage: error.message || "An unknown error occurred while fetching team matches.",
                    errorMessages: [error.message] // Pass the error messages array
                }
            });
        } finally {
            setLoadingMatches(false);
        }
    };

    useEffect(() => {
        loadStandings();
        loadMatches();
    }, []);

    if (loadingStandings) {
        return <LoadingModal message="Loading Team Standings" description="Please wait while we fetch the latest team standings." />;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Team Standings</h1>
            <ErrorAlert message={error} />

            {/* Display the LoadingModal when matches are loading */}
            {loadingMatches && <LoadingModal message="Loading Team Matches" description="Please wait while we fetch the matches for the selected team." />}

            <ExportButtons
                onExportExcel={handleExportToExcel}
                onExportPDF={handleExportToPDF}
                onClearStandings={handleClearStandings}
            />

            <TeamList teams={teams} onTeamClick={handleTeamClick} />

            {selectedTeam && (
                <div className="mt-6">
                    <h2 className="text-xl font-bold">Matches for {selectedTeam.name}</h2>
                    <MatchList teamMatches={teamMatches} loadingMatches={loadingMatches} />
                </div>
            )}
        </div>
    );
}

export default TeamStandings;
