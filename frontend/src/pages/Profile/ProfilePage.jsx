import React, { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Copy, Edit, LogOut, Loader2 } from "lucide-react";

// ✨ FIX: Changed import paths to be relative to resolve compilation errors.
import { useNotification } from "../contexts/NotificationContext.jsx";
import { updateCurrentUser, getCurrentUser } from "../utils/functions/authUtils.js";

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar.jsx";
import { Button } from "../components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form.jsx";
import { Input } from "../components/ui/input.jsx";
import { Textarea } from "../components/ui/textarea.jsx";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group.jsx";
import { Separator } from "../components/ui/separator.jsx";
import LoadingModal from "./Modals/LoadingModal.jsx";

// ✨ Define a schema for form validation with Zod
const profileSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters.").max(20, "Username cannot exceed 20 characters."),
    email: z.string().email("Please enter a valid email."),
    bio: z.string().max(200, "Bio cannot exceed 200 characters.").optional().nullable(),
    skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
});

/**
 * ✨ NEW: Custom hook to manage all profile data, API calls, and state.
 * This encapsulates all the logic, keeping the main component clean.
 */
const useUserProfile = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { addNotification } = useNotification();

    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'
    const [isSaving, setIsSaving] = useState(false);

    const fetchProfile = useCallback(async () => {
        setStatus("loading");
        try {
            // FIX: This now correctly calls getCurrentUser with the function it expects
            const userProfile = await getCurrentUser(getAccessTokenSilently);
            setProfile(userProfile);
            setStatus("success");
        } catch (error) {
            console.error("Error fetching profile data:", error);
            addNotification({ message: "Failed to load profile data.", type: "error" });
            setStatus("error");
        }
    }, [getAccessTokenSilently, addNotification]);

    const saveProfile = async (formData) => {
        setIsSaving(true);
        try {
            const updatedProfile = await updateCurrentUser(getAccessTokenSilently, formData);
            setProfile(updatedProfile); // Update local state with response from server
            addNotification({ message: "Profile saved successfully!", type: "success" });
            return true; // Indicate success
        } catch (err) {
            console.error("❌ Failed to save profile:", err);
            addNotification({ message: "Failed to save profile.", type: "error" });
            return false; // Indicate failure
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, status, isLoading: status === 'loading', isSaving, saveProfile, refreshProfile: fetchProfile };
};


export default function ProfilePage() {
    const { isAuthenticated, user: auth0User, logout } = useAuth0();
    const { addNotification } = useNotification();
    const [isEditing, setIsEditing] = useState(false);

    const { profile, isLoading, isSaving, saveProfile } = useUserProfile();

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: "",
            email: "",
            bio: "",
            skillLevel: "Beginner",
        },
    });

    // When profile data loads from the API, reset the form with the new data
    useEffect(() => {
        if (profile) {
            form.reset({
                username: profile.username || "",
                email: profile.email || auth0User?.email || "",
                bio: profile.bio || "",
                skillLevel: profile.skillLevel || "Beginner",
            });
        }
    }, [profile, form.reset, auth0User]);

    if (isLoading) {
        return <LoadingModal message="Loading your profile…" />;
    }

    if (!isAuthenticated || !profile) {
        return (
            <div className="p-6 text-center text-muted-foreground">
                Oops, we couldn’t load your profile. Please try logging in again.
            </div>
        );
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            addNotification({ message: "Copied to clipboard!", type: "success" });
        });
    };

    const handleCancel = () => {
        form.reset(profile); // Revert any changes back to the original profile data
        setIsEditing(false);
    };

    const onSubmit = async (data) => {
        const success = await saveProfile(data);
        if (success) {
            setIsEditing(false);
        }
    };

    return (
        <motion.div
            className="max-w-6xl mx-auto p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {/* ✨ NEW: Two-column layout for better organization */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* --- Left Column (Profile Card) --- */}
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-1">
                            <Card>
                                <CardContent className="pt-6 flex flex-col items-center text-center">
                                    <Avatar className="w-32 h-32 mb-4 border-4 border-primary">
                                        <AvatarImage src={profile.picture || auth0User?.picture} alt={profile.username} />
                                        <AvatarFallback>{profile.username?.[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <h2 className="text-2xl font-bold">{profile.username}</h2>
                                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                                    <Separator className="my-4" />
                                    <p className="text-sm text-muted-foreground px-4 min-h-[40px]">
                                        {profile.bio || "No bio available."}
                                    </p>
                                </CardContent>
                                <CardContent>
                                    <Button variant="destructive" className="w-full" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                                        <LogOut className="mr-2 h-4 w-4" /> Logout
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* --- Right Column (Form Fields) --- */}
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl">{isEditing ? "Edit Profile" : "Your Profile"}</CardTitle>
                                        <CardDescription>View and edit your personal information.</CardDescription>
                                    </div>
                                    <Button type="button" variant="outline" onClick={() => isEditing ? handleCancel() : setIsEditing(true)}>
                                        {isEditing ? "Cancel" : <><Edit className="mr-2 h-4 w-4" /> Edit</>}
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField name="username" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl><Input type="email" {...field} disabled /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField name="bio" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl><Textarea {...field} disabled={!isEditing} placeholder="Tell us a little about yourself" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField name="skillLevel" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Skill Level</FormLabel>
                                            {/* ✨ NEW: Upgraded to a RadioGroup for better UX */}
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col sm:flex-row gap-4 pt-2" disabled={!isEditing}>
                                                {["Beginner", "Intermediate", "Advanced"].map(level => (
                                                    <FormItem key={level} className="flex items-center space-x-3 space-y-0">
                                                        <FormControl><RadioGroupItem value={level} /></FormControl>
                                                        <FormLabel className="font-normal cursor-pointer">{level}</FormLabel>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                </CardContent>
                                {isEditing && (
                                    <CardContent>
                                        <Button type="submit" className="w-full" disabled={isSaving || !form.formState.isDirty}>
                                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </CardContent>
                                )}
                            </Card>
                        </motion.div>
                    </div>
                </form>
            </Form>
        </motion.div>
    );
}
