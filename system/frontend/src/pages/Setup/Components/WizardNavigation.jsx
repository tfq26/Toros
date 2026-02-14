// WizardNavigation.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const WizardNavigation = ({
                              children,
                              onSubmit,
                              error,
                              stepNames,
                              navigationConfig, // Optional array of configuration objects for each step.
                          }) => {
    // Convert children to an array for easier indexing.
    const steps = React.Children.toArray(children);
    const [currentStep, setCurrentStep] = useState(0);

    // Default navigation config: show Back if not first step, and show Next if not final step.
    const defaultConfig = {
        showBack: currentStep > 0,
        showNext: currentStep < steps.length - 1,
    };

    // Use provided configuration for this step if available, otherwise fall back to default.
    const currentNavConfig = (navigationConfig && navigationConfig[currentStep]) || defaultConfig;

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    // This function handles the form submission.
    // It checks for an event and calls preventDefault() if available.
    const handleFormSubmit = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if (currentStep < steps.length - 1) {
            handleNext();
        } else {
            // When on the final step, call onSubmit.
            onSubmit(e);
        }
    };

    // If we're on the final step, clone its element and inject the "finalize" prop.
    // This prop allows the final step (e.g., the success page) to invoke the onSubmit logic without needing an event.
    const currentContent =
        currentStep === steps.length - 1
            ? React.cloneElement(steps[currentStep], { finalize: onSubmit })
            : steps[currentStep];

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6 p-5">
            {stepNames && stepNames[currentStep] && (
                <h2 className="text-center text-2xl font-bold mb-4">
                    {stepNames[currentStep]}
                </h2>
            )}
            {currentContent}
            {error && <p className="text-center text-red-500">{error}</p>}
            {/* Render navigation buttons only if at least one is flagged to show */}
            {(currentNavConfig.showBack || currentNavConfig.showNext) && (
                <div className="flex justify-between mt-4">
                    {currentNavConfig.showBack && (
                        <Button
                            type="button"
                            onClick={handleBack}
                            className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-white py-2 px-4 rounded-md transition"
                        >
                            Back
                        </Button>
                    )}
                    <div className="flex-1" />
                    {currentNavConfig.showNext && (
                        <Button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
                        >
                            {currentStep < steps.length - 1 ? "Next" : "Submit"}
                        </Button>
                    )}
                </div>
            )}
        </form>
    );
};

export default WizardNavigation;
