import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { SetupProvider, useSetup } from "@/contexts/SetupContext.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import axios from 'axios';

// Import step components
import BasicInfoStep from "./Pages/BasicInfo.jsx";
import DateTimeStep from "./Pages/DateTimeStep.jsx";
import OrganizerDetails from "./Pages/OrganizerDetails.jsx";
import OptionsReviewStep from "./Pages/OptionsReview.jsx";
import SuccessPage from "./Pages/SuccessPage.jsx";

const SetupWizard = () => {
    const { user } = useAuth();
    const { state, dispatch } = useSetup();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            dispatch({
                type: 'PREFILL_USER',
                payload: { name: user.name || "Organizer Name", email: user.email },
            });
        }
    }, [user, dispatch]);

    const handleNext = () => setCurrentStep(prev => prev + 1);
    const handleBack = () => setCurrentStep(prev => prev - 1);

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!state.startDateTime) {
            setError("Please provide a valid start date and time.");
            setCurrentStep(1);
            setIsSubmitting(false);
            return;
        }

        // ✨ FIXED: Create a payload that exactly matches the backend's TournamentSetupRequest DTO.
        // This renames properties to match the Java class expectations.
        const payload = {
            ...state, // Copy all matching properties
            skillBased: state.tiered, // Rename 'tiered' to 'skillBased'
            startTime: state.startDateTime.toISOString(), // Rename 'startDateTime' to 'startTime' and format as ISO string
        };
        // Clean up the old properties that have been renamed
        delete payload.tiered;
        delete payload.startDateTime;
        delete payload.dateRange; // Also remove the raw dateRange object

        try {
            console.log("Submitting tournament payload to /api/tournaments/setup:", payload);

            // This API call now sends a correctly formatted payload to the endpoint.
            const response = await axios.post('/api/tournaments/setup', payload);

            console.log("Server response:", response.data);

            handleNext();

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create tournament. Please try again.');
            console.error("Submission Error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        { name: "Basics", component: <BasicInfoStep /> },
        { name: "Date & Time", component: <DateTimeStep /> },
        { name: "Details", component: <OrganizerDetails /> },
        { name: "Review", component: <OptionsReviewStep /> },
        { name: "Complete!", component: <SuccessPage /> },
    ];

    const progressPercentage = (currentStep / (steps.length - 2)) * 100;

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="text-2xl">Create a New Tournament</CardTitle>
                <CardDescription>Step {currentStep + 1} of {steps.length -1}: {steps[currentStep].name}</CardDescription>
                {currentStep < steps.length - 1 && <Progress value={progressPercentage} className="mt-2" />}
            </CardHeader>
            <CardContent>
                {error && <p className="text-destructive text-center mb-4">{error}</p>}

                <div className="min-h-[300px]">
                    {steps[currentStep].component}
                </div>

                <div className="mt-8 pt-6 border-t flex justify-between">
                    <div>
                        {currentStep > 0 && currentStep < steps.length - 1 && (
                            <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>Back</Button>
                        )}
                    </div>
                    <div>
                        {currentStep < steps.length - 2 && (
                            <Button onClick={handleNext}>Next</Button>
                        )}
                        {currentStep === steps.length - 2 && (
                            <Button onClick={handleFinalSubmit} disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Tournament"}
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// The main export just provides the context wrapper
export default function TournamentSetup() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <SetupProvider>
                <SetupWizard />
            </SetupProvider>
        </div>
    );
}
