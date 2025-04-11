import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const WizardNavigation = ({ children, onSubmit, error, stepNames }) => {
    // Convert children to an array for easier indexing.
    const steps = React.Children.toArray(children);
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // If not on the final step, advance to the next step
        if (currentStep < steps.length - 1) {
            handleNext();
        } else {
            // Otherwise, call the provided onSubmit callback for final submission
            onSubmit(e);
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            {stepNames && stepNames[currentStep] && (
                <h2 className="text-center text-2xl font-bold mb-4">
                    {stepNames[currentStep]}
                </h2>
            )}
            {steps[currentStep]}
            {error && <p className="text-center text-red-500">{error}</p>}
            <div className="flex justify-between mt-4">
                {currentStep > 0 && (
                    <Button
                        type="button"
                        onClick={handleBack}
                        className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-white py-2 px-4 rounded-md transition"
                    >
                        Back
                    </Button>
                )}
                <div className="flex-1" />
                <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
                >
                    {currentStep < steps.length - 1 ? "Next" : "Submit"}
                </Button>
            </div>
        </form>
    );
};

export default WizardNavigation;
