import React, { useState, useEffect } from "react";
import TeamList from './TeamList';
import MatchList from './MatchList';
import ExportButtons from './ExportButtons';
import ErrorAlert from '../Error';
import LoadingModal from '@/pages/Modals/LoadingModal.jsx';
import { useNavigate } from 'react-router-dom';
import {
    fetchStandings,
    fetchAllMatches,
    clearStandings,
    exportToExcel,
    exportToPDF,
    fetchTeamMatches,
    //fetchBracket
} from '@/utils/functions/standingsUtils.js';

function TeamStandings() {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamMatches, setTeamMatches] = useState([]);
    const [matches, setMatches] = useState([]);
    const [bracketData, setBracketData] = useState([]); // Added bracket state
    const [error, setError] = useState(null);
    const [loadingMatches, setLoadingMatches] = useState(false);
    const [loadingStandings, setLoadingStandings] = useState(true);
    const [loadingBracket, setLoadingBracket] = useState(true); // Added loading for bracket
    const navigate = useNavigate();

    const loadStandings = async () => {
        try {
            const data = await fetchStandings();
            setTeams(data);
        } catch (error) {
            setError(error.message);
            navigate("/error", {
                state: {
                    city: "Tokyo",
                    message: "Failed to load standings.",
                    detailedMessage: error.message || "An unknown error occurred while fetching standings.",
                    errorMessages: [error.message]
                }
            });
        } finally {
            setLoadingStandings(false);
        }
    };

    const loadMatches = async () => {
        try {
            const data = await fetchAllMatches();
            setMatches(data);
        } catch (error) {
            setError(error.message);
            navigate("/error", {
                state: {
                    city: "Tokyo",
                    message: "Failed to load standings.",
                    detailedMessage: error.message || "An unknown error occurred while fetching standings.",
                    errorMessages: [error.message]
                }
            });
        }
    };

    // const loadBracket = async () => {
    //     try {
    //         const data = await fetchBracket();
    //         setBracketData(data); // Store bracket data
    //     } catch (error) {
    //         setError(error.message);
    //     } finally {
    //         setLoadingBracket(false);
    //     }
    // };

    const handleClearStandings = async () => {
        try {
            const message = await clearStandings();
            alert(message);
            setTeams([]);
        } catch (error) {
            setError(error.message);
            navigate("/error", {
                state: {
                    city: "Tokyo",
                    message: "Failed to load standings.",
                    detailedMessage: error.message || "An unknown error occurred while fetching standings.",
                    errorMessages: [error.message]
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
            navigate("/error", {
                state: {
                    city: "Tokyo",
                    message: "Failed to load standings.",
                    detailedMessage: error.message || "An unknown error occurred while fetching standings.",
                    errorMessages: [error.message]
                }
            });
        } finally {
            setLoadingMatches(false);
        }
    };

    useEffect(() => {
        loadStandings();
        loadMatches();
        //loadBracket(); // Load bracket data
    }, []);

    if (loadingStandings || loadingBracket) {
        return <LoadingModal message="Loading Data" description="Please wait while we fetch the latest data." />;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Team Standings</h1>
            <ErrorAlert message={error} />

            {loadingMatches && <LoadingModal message="Loading Team Matches" description="Fetching matches for the selected team." />}

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

            {/* Display bracket data if available */}
            {bracketData.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-xl font-bold">Bracket Standings</h2>
                    <ul className="list-disc pl-5">
                        {bracketData.map((team, index) => (
                            <li key={index} className="text-lg">{team}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default TeamStandings;
