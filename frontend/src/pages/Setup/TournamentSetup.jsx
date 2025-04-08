import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../Error";
import SlidingWindow from "../Navbar/SlidingWindow.jsx";
import PlayerStats from "../Players/PlayerStats.jsx";
import { TbArrowBigLeftLineFilled } from "react-icons/tb";
import { convertLevel, calculateStats } from "../utils/playerUtils.js";
import { Button } from "@/components/ui/button";
import {
    fetchPlayersAndGenerateTeams,
    handleSubmit,
    handleSetCurrentTime,
    calculateMatchSchedule,
} from "../utils/setupFunctions.js";

// Import step components
import BasicInfoStep from "./Pages/BasicInfo.jsx";
import DateTimeStep from "./Pages/DateTime.jsx";
import ExtendedDetailsStep from "./Pages/ExtendedDetails";
import OptionsReviewStep from "./Pages/OptionsReview.jsx";
import WizardNavigation from "./components/WizardNavigation.jsx";

const TournamentSetup = ({ onSetupComplete }) => {
    const navigate = useNavigate();

    // Current wizard step state (0-based)
    const [step, setStep] = useState(0);

    const [tournamentConfig, setTournamentConfig] = useState({
        tournamentName: "",
        numCourts: 1,
        gamesPerTeam: 1,
        startDate: "",
        startTime: "",
        matchDuration: 15,
        breakTime: 5,
        useExistingPlayers: false, // state remains, but not rendered
        tiered: false,             // state remains, but not rendered
        // Extended fields – these must be filled to allow Options & Review
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

    // Fetch teams on mount
    useEffect(() => {
        fetchPlayersAndGenerateTeams(setTeams, setError).then((r) =>
            console.log("Teams fetched:", r)
        );
    }, []);

    const playerStats = calculateStats(teams.flat());

    useEffect(() => {
        document.title = "Tournament Setup";
    }, []);

    // Determine if extended details are complete
    const extendedComplete =
        tournamentConfig.location &&
        tournamentConfig.organizer &&
        tournamentConfig.contactInfo &&
        tournamentConfig.tournamentType &&
        tournamentConfig.scoringSystem &&
        tournamentConfig.rules &&
        tournamentConfig.prizeDistribution &&
        tournamentConfig.format &&
        tournamentConfig.ageGroup &&
        tournamentConfig.skillLevel;

    // Build the steps array dynamically.
    const baseSteps = ["Basic Info", "Date & Time", "Extended Details"];
    const steps = extendedComplete ? [...baseSteps, "Options & Review"] : baseSteps;

    // Ensure current step index is valid if extended details become incomplete.
    useEffect(() => {
        if (!extendedComplete && step === 3) {
            setStep(2);
        }
    }, [extendedComplete, step]);

    const handleNext = () => {
        // If we're at the Extended Details step and details aren't complete, show an error.
        if (step === 2 && !extendedComplete) {
            setError("Please complete all extended details before proceeding.");
            return;
        }
        setError(null);
        setStep((prev) => prev + 1);
    };

    const handleBack = () => setStep((prev) => prev - 1);

    // Local change handler to update configuration
    const localHandleConfigChange = (prop, value) => {
        setTournamentConfig((prev) => ({ ...prev, [prop]: value }));
    };

    // Wrap handleSetCurrentTime to use our setter
    const localHandleSetCurrentTime = () => {
        handleSetCurrentTime(setTournamentConfig);
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <BasicInfoStep
                        tournamentConfig={tournamentConfig}
                        handleConfigChange={localHandleConfigChange}
                    />
                );
            case 1:
                return (
                    <DateTimeStep
                        tournamentConfig={tournamentConfig}
                        handleConfigChange={localHandleConfigChange}
                        handleSetCurrentTime={localHandleSetCurrentTime}
                    />
                );
            case 2:
                return (
                    <ExtendedDetailsStep
                        tournamentConfig={tournamentConfig}
                        handleConfigChange={localHandleConfigChange}
                    />
                );
            case 3:
                return (
                    <OptionsReviewStep
                        tournamentConfig={tournamentConfig}
                    />
                );
            default:
                return null;
        }
    };

    const onFormSubmit = (e) => {
        // On final submission, combine date and time fields.
        if (step === steps.length - 1) {
            e.preventDefault();
            const { startDate, startTime, ...rest } = tournamentConfig;
            if (!startDate || !startTime) {
                setError("Please provide both a start date and a start time.");
                return;
            }
            const combinedDateTime = new Date(`${startDate}T${startTime}`);
            const payload = {
                ...rest,
                startTime: combinedDateTime.toISOString(),
            };
            handleSubmit(e, payload, teams, setError, onSetupComplete, navigate);
        } else {
            e.preventDefault();
            handleNext();
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-900 sm:p-8 rounded-xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex-row w-16 flex justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full p-2 transition duration-200"
                        >
                            <TbArrowBigLeftLineFilled className="text-5xl" />
                        </Button>
                    </div>
                    <div className="flex-grow text-center px-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100">
                            Tournament Setup
                        </h2>
                        <h3 className="mt-2 text-md sm:text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300">
                            {steps[step]}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                            Configure your tournament details below
                        </p>
                    </div>
                    <div className="flex-none w-16" />
                </div>

                {/* Wizard Navigation */}
                <WizardNavigation steps={steps} currentStep={step} onStepChange={setStep} />

                {error && <ErrorMessage message={error} />}

                <form onSubmit={onFormSubmit} className="space-y-6">
                    {renderStep()}
                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-4">
                        {step > 0 && (
                            <Button
                                type="button"
                                onClick={handleBack}
                                className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-white py-2 px-4 rounded-md transition"
                            >
                                Back
                            </Button>
                        )}
                        <div className="flex-1" />
                        {step < steps.length - 1 ? (
                            <Button
                                type="button"
                                onClick={handleNext}
                                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 dark:bg-green-900 dark:hover:bg-green-700 text-white py-2 px-4 rounded-md transition"
                            >
                                Submit
                            </Button>
                        )}
                    </div>
                </form>
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
