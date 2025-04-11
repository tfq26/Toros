// DialogProvider.jsx
import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog.jsx";

const DialogProvider = ({
                            isOpen,
                            onOpenChange,
                            title,
                            description,
                            onConfirm,
                            onCancel,
                            confirmText = "Proceed",
                            cancelText = "Cancel",
                            customConfirm, // Optional custom confirm button element
                            children,
                        }) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
                    {description && (
                        <AlertDialogDescription className="italic text-xs">
                            {description}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                {/* Render custom content passed as children */}
                {children}
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        {cancelText}
                    </AlertDialogCancel>
                    {customConfirm ? (
                        // Use the custom confirm button if provided
                        customConfirm
                    ) : (
                        // Otherwise, use the default confirm button
                        <AlertDialogAction onClick={onConfirm}>
                            {confirmText}
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DialogProvider;
