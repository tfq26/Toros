// TournamentSetup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../Error";
import SlidingWindow from "@/components/Navbar/SlidingWindow.jsx";
import PlayerStats from "../Players/PlayerStats.jsx";
import { convertLevel, calculateStats } from "@/utils/functions/HelperFunctions.js";
import {
    fetchPlayersAndGenerateTeams,
    handleSubmit,
    handleSetCurrentTime,
} from "@/utils/functions/setupFunctions.js";

// Import step components
import BasicInfoStep from "./Pages/BasicInfo.jsx";
import DateTimeStep from "./Pages/DateTimeStep.jsx";
import ExtendedDetailsStep from "./Pages/OrganizerDetails.jsx";
import OptionsReviewStep from "./Pages/OptionsReview.jsx";
import WizardNavigation from "./Components/WizardNavigation.jsx";
import SuccessPage from "@/pages/Setup/Pages/SuccessPage.jsx";
import OrganizerDetails from "./Pages/OrganizerDetails.jsx";
import TournamentDetails from "@/pages/Setup/Pages/TournamentDetails.jsx";
import TournamentSetupSuccess from "@/pages/Setup/Pages/SuccessPage.jsx"; // Import the newly created Wizard component

const TournamentSetup = ({ onSetupComplete }) => {
    const navigate = useNavigate();

    const [tournamentConfig, setTournamentConfig] = useState({
        tournamentName: "",
        numCourts: 1,
        gamesPerTeam: 1,
        startDate: "",
        startTime: "",
        matchDuration: 15,
        breakTime: 5,
        useExistingPlayers: false, // retained for backend, not rendered
        tiered: false,             // retained for backend, not rendered
        // Extended fields
        location: "",
        organizer: "",
        contactInfo: "",
        tournamentType: "",
        scoringSystem: "",
        rules: "",
        prizeDistribution: "",
        format: "",
        ageGroup: "",
        skillLevel: "",
    });

    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Fetch teams on mount.
    useEffect(() => {
        fetchPlayersAndGenerateTeams(setTeams, setError).then((r) => {
            console.log("Teams fetched:", r);
        });
    }, []);

    // Log tournamentConfig whenever it changes.
    useEffect(() => {
        console.log("TournamentConfig updated:", tournamentConfig);
    }, [tournamentConfig]);

    const playerStats = calculateStats(teams.flat());

    useEffect(() => {
        document.title = "Tournament Setup";
    }, []);

    // Local change handler to update configuration.
    const localHandleConfigChange = (prop, value) => {
        setTournamentConfig((prev) => ({ ...prev, [prop]: value }));
    };

    // Wrap handleSetCurrentTime to use our setter.
    const localHandleSetCurrentTime = () => {
        handleSetCurrentTime(setTournamentConfig);
    };

    // Final submission handler for the wizard.
    const handleFinalSubmit = (e) => {
        e.preventDefault();
        const { startDate, startTime, ...rest } = tournamentConfig;
        if (!startDate || !startTime) {
            setError("Please provide both a start date and a start time.");
            return;
        }
        const combinedDateTime = new Date(`${startDate}T${startTime}`);

        // Create payload and log it.
        const payload = {
            ...rest,
            startTime: combinedDateTime.toISOString(),
        };
        console.log("Submitting tournament setup with payload:", payload);

        // Call your submit handler which is expected to trigger onSetupComplete.
        handleSubmit(e, payload, teams, setError, onSetupComplete, navigate);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-900 sm:p-8 rounded-xl shadow-2xl">
                {error && <ErrorMessage message={error} />}
                <WizardNavigation
                    onSubmit={handleFinalSubmit}
                    error={error}
                    stepNames={[
                        "Tournament Name & Details",
                        "Date & Time",
                        "Extended Details (Basic)",
                        "Extended Details (Advanced)",
                        "Options & Review"
                    ]}
                    navigationConfig={[
                        { showBack: true, showNext: true },  // Step 1
                        { showBack: true, showNext: true },  // Step 2
                        { showBack: true, showNext: true },  // Step 3
                        { showBack: true, showNext: true },  // Step 4
                        { showBack: true, showNext: true }, // Step 5 (Review page: hide nav buttons)
                        { showBack: false, showNext: true }// Final Step (Success page: hide nav buttons)
                    ]}
                >
                    {/* Wizard steps here */}
                    <BasicInfoStep tournamentConfig={tournamentConfig} handleConfigChange={localHandleConfigChange} />
                    <DateTimeStep tournamentConfig={tournamentConfig} handleConfigChange={localHandleConfigChange} handleSetCurrentTime={localHandleSetCurrentTime} />
                    <OrganizerDetails tournamentConfig={tournamentConfig} handleConfigChange={localHandleConfigChange} />
                    <TournamentDetails tournamentConfig={tournamentConfig} handleConfigChange={localHandleConfigChange} />
                    <OptionsReviewStep tournamentConfig={tournamentConfig} />
                    <TournamentSetupSuccess />
                </WizardNavigation>
            </div>

            <SlidingWindow
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                sections={[
                    {
                        id: "players",
                        label: "Registered Players",
                        content: (
                            <div className="p-4 bg-gray-100 dark:bg-gray-800">
                                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                                    📋 Registered Players
                                </h3>
                                {teams.length ? (
                                    <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                                        {teams.flat().map((player) => (
                                            <li key={player.id} className="border-b border-gray-300 dark:border-gray-600 pb-2">
                                                {player.name} — {convertLevel(player.skillLevel) || "Unranked"}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-400">
                                        No registered players found.
                                    </p>
                                )}
                            </div>
                        ),
                    },
                    {
                        id: "playerStats",
                        label: "Player Stats",
                        content: <PlayerStats stats={playerStats} />,
                    },
                ]}
            />
        </div>
    );
};

export default TournamentSetup;
