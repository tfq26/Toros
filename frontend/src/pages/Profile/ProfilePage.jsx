// src/pages/Profile/ProfilePage.jsx
import  { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";              // ← DEBUG‑ONLY
import LoadingModal from "@/pages/Modals/LoadingModal.jsx";
import { useNotification } from "@/utils/NotificationProvider.jsx";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar.jsx";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Switch } from "@/components/ui/switch";
import { Copy } from "lucide-react";
import { useForm } from "react-hook-form";

import {
    getCurrentUserWithToken,
    updateCurrentUser,
} from "@/utils/functions/authUtils.js";

const getSkillDescription = (lvl) =>
    ({
        Beginner: "Beginner",
        Intermediate: "Intermediate",
        Advanced: "Advanced",
    }[lvl] ?? "Unknown");

export default function ProfilePage() {
    const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const { addNotification } = useNotification();

    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            skillLevel: "Beginner",
            bio: "",
        },
    });
    const { isDirty } = form.formState;

    // Load profile and reset form
    const loadProfile = async () => {
        try {
            const token = await getAccessTokenSilently({ audience: "https://Toros/api" });
            const data = await getCurrentUserWithToken(token);
            setUserData(data);
            form.reset({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                skillLevel: data.playerProfile?.skillLevel ?? "Beginner",
                bio: data.bio ?? "",
            });
        } catch (err) {
            console.error("❌ Failed to load user info:", err);
            addNotification({ message: "Failed to load profile.", type: "error" });
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadProfile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    // Warn on page unload if form is dirty
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "";
                addNotification({
                    message: "You have unsaved changes!",
                    type: "warning",
                });
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty, addNotification]);

    if (isLoading || (isAuthenticated && !userData)) {
        return <LoadingModal message="Loading profile…" />;
    }
    if (!isAuthenticated) {
        return <div className="p-6">You must be logged in to see your profile.</div>;
    }

    const onSubmit = async (data) => {
        try {
            await updateCurrentUser(getAccessTokenSilently, {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                bio: data.bio,
                skillLevel: data.skillLevel,
            });
            await loadProfile();
            setIsEditing(false);
            addNotification({ message: "Profile saved!", type: "success" });
        } catch (err) {
            console.error("❌ Failed to save profile:", err);
            addNotification({ message: "Failed to save profile.", type: "error" });
        }
    };

    const copy = (txt) =>
        navigator.clipboard
            .writeText(txt)
            .then(() =>
                addNotification({ message: "Copied to clipboard!", type: "success" })
            )
            .catch(() =>
                addNotification({ message: "Copy failed.", type: "error" })
            );

    const toggleEdit = (next) => {
        if (!next && isDirty) {
            addNotification({
                message: "You have unsaved changes!",
                type: "warning",
            });
        }
        setIsEditing(next);
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Avatar */}
            {userData.picture ? (
                <Avatar className="mb-4 size-30">
                    <AvatarImage src={userData.picture} alt={userData.username} />
                    <AvatarFallback>{userData.username?.[0]}</AvatarFallback>
                </Avatar>
            ) : (
                <div className="w-24 h-24 mb-4 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl text-gray-600">?</span>
                </div>
            )}

            {/* Edit toggle */}
            <div className="flex items-center gap-2 mb-6">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Edit Profile
        </span>
                <Switch checked={isEditing} onCheckedChange={toggleEdit} />
            </div>

            {/* Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {["firstName", "lastName", "email", "phone"].map((name) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {name.replace(/([A-Z])/g, " $1").replace(/^./, (s) =>
                                            s.toUpperCase()
                                        )}
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input {...field} disabled={!isEditing} />
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="icon"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent hover:dark:bg-transparent"
                                                onClick={() => copy(field.value)}
                                                aria-label="Copy"
                                            >
                                                <Copy size={16} />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormDescription>Your {name.toLowerCase()}.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                    {/* Bio */}
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Skill level */}
                    <FormField
                        control={form.control}
                        name="skillLevel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Skill Level</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        disabled={!isEditing}
                                        className="w-full border rounded-md p-2 dark:bg-gray-700 dark:text-white"
                                    >
                                        {["Beginner", "Intermediate", "Advanced"].map((v) => (
                                            <option key={v} value={v}>
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit */}
                    {isEditing && (
                        <Button type="submit" className="w-full mt-4">
                            Save Profile
                        </Button>
                    )}
                </form>
            </Form>
        </div>
    );
}
