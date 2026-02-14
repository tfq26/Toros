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
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const { state, dispatch } = useSetup();
    useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- MODIFIED ---
    useEffect(() => {
        // This effect runs when user info is available
        if (user && user.auth0Id) {

            // --- FIXED: Use a ternary operator for the name ---
            const organizerName = (user.firstName && user.lastName)
                ? `${user.firstName} ${user.lastName}`
                : "Organizer Name";

            // Action 1: Prefill user-friendly details like name and email
            dispatch({
                type: 'PREFILL_USER',
                payload: { name: organizerName, email: user.email },
            });

            // Action 2: Add the essential auth0UserId to the context
            dispatch({
                type: 'UPDATE_FIELD',
                payload: { field: 'auth0UserId', value: user.auth0Id }
            });
        }
    }, [user, dispatch]);

    const handleNext = () => setCurrentStep(prev => prev + 1);
    const handleBack = () => setCurrentStep(prev => prev - 1);

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        // --- CONFIRMATION ---
        // The check now uses the auth0UserId from the context state
        if (!state.auth0UserId) {
            setError("Could not identify the current user. Please log in again.");
            setIsSubmitting(false);
            return;
        }

        if (!state.startDateTime) {
            setError("Please provide a valid start date and time.");
            setCurrentStep(1);
            setIsSubmitting(false);
            return;
        }

        // --- MODIFIED ---
        // Payload creation is now cleaner. `auth0Id` is already in the state.
        const payload = {
            ...state,
            skillBased: state.tiered,
            startTime: state.startDateTime.toISOString(),
        };
        // Clean up fields not needed by the backend
        delete payload.tiered;
        delete payload.startDateTime;
        delete payload.dateRange;

        try {
            // You can check your browser's console to confirm the payload is correct
            console.log("Submitting tournament payload from context:", payload);

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

    if (isAuthLoading) {
        return <p className="text-center">Loading user information...</p>;
    }

    if (!isAuthenticated) {
        return (
            <div className="text-center">
                <h2 className="text-xl font-semibold">Authentication Required</h2>
                <p className="mt-2 text-muted-foreground">Please log in to create a tournament.</p>
            </div>
        );
    }

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