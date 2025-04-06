// WizardNavigation.jsx
import React from "react";
import { Button } from "@/components/ui/button";

const WizardNavigation = ({ steps, currentStep, onStepChange }) => {
    return (
        <div className="flex justify-center space-x-4 my-4">
            {steps.map((stepName, index) => (
                <Button
                    key={index}
                    onClick={() => onStepChange(index)}
                    variant={index === currentStep ? "default" : "outline"}
                    className="px-4 py-2 rounded-md transition"
                >
                    {stepName}
                </Button>
            ))}
        </div>
    );
};

export default WizardNavigation;
