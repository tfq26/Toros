import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Edit, LogOut, Loader2, Upload } from "lucide-react";

import { useNotification } from "@/contexts/NotificationContext.jsx";
import { updateCurrentUser, getCurrentUser } from "@/utils/functions/authUtils.js";

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import LoadingModal from "@/pages/Modals/LoadingModal.jsx";

// --- UPDATED: Zod schema now uses 'userName' to match the backend DTO ---
const profileSchema = z.object({
    userName: z.string().min(3, "Username must be at least 3 characters."),
    firstName: z.string().min(1, "First name must not be blank."),
    lastName: z.string().min(1, "Last name must not be blank."),
    email: z.string().email("Please enter a valid email."),
    phone: z.string().optional().nullable(),
    picture: z.string().url("Please enter a valid URL.").optional().nullable().or(z.literal('')),
    bio: z.string().max(500, "Bio must not exceed 500 characters.").optional().nullable(),
    skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"], {
        required_error: "You need to select a skill level.",
    }),
});

// useUserProfile hook remains the same
const useUserProfile = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { addNotification } = useNotification();

    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState("loading");
    const [isSaving, setIsSaving] = useState(false);

    const fetchProfile = useCallback(async () => {
        setStatus("loading");
        try {
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
            // The formData will now have the correct 'userName' field
            const updatedProfile = await updateCurrentUser(getAccessTokenSilently, formData);
            setProfile(updatedProfile);
            addNotification({ message: "Profile saved successfully!", type: "success" });
            return true;
        } catch (err) {
            console.error("❌ Failed to save profile:", err);
            addNotification({ message: "Failed to save profile.", type: "error" });
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, status, isLoading: status === 'loading', isSaving, saveProfile };
};


export default function ProfilePage() {
    const { isAuthenticated, user: auth0User, logout } = useAuth0();
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const { profile, isLoading, isSaving, saveProfile } = useUserProfile();

    const form = useForm({
        resolver: zodResolver(profileSchema),
        // --- UPDATED: Default values include 'userName' ---
        defaultValues: {
            userName: "", firstName: "", lastName: "", email: "", phone: "", picture: "", bio: "", skillLevel: "Beginner",
        },
    });

    useEffect(() => {
        if (profile) {
            form.reset({
                // --- UPDATED: Reset form with 'userName' from the profile object ---
                userName: profile.userName || "",
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                email: profile.email || auth0User?.email || "",
                phone: profile.phone || "",
                picture: profile.picture || auth0User?.picture || "",
                bio: profile.bio || "",
                skillLevel: profile.skillLevel || "Beginner",
            });
        }
    }, [profile, form.reset, auth0User]);

    const handleAvatarClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const newImageUrl = URL.createObjectURL(file);
            form.setValue('picture', newImageUrl, { shouldDirty: true });
        } catch (error) {
            console.error("Failed to upload image:", error);
        } finally {
            setIsUploading(false);
        }
    };

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

    const handleCancel = () => {
        form.reset(profile);
        setIsEditing(false);
    };

    const onSubmit = async (data) => {
        const success = await saveProfile(data);
        if (success) {
            setIsEditing(false);
        }
    };

    // --- UPDATED: Watch 'userName' for display ---
    const userName = form.watch('userName');
    const fallbackInitial = userName?.[0]?.toUpperCase() || 'P';

    return (
        <motion.div
            className="max-w-6xl mx-auto p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
            />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* --- Left Column (Profile Card) --- */}
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-1">
                            <Card>
                                <CardContent className="pt-6 flex flex-col items-center text-center">
                                    <div
                                        className={`relative group ${isEditing ? 'cursor-pointer' : ''}`}
                                        onClick={handleAvatarClick}
                                    >
                                        <Avatar className="w-42 h-42 mb-4 border-4 border-primary">
                                            <AvatarImage src={form.watch('picture')} alt={userName} />
                                            <AvatarFallback>{fallbackInitial}</AvatarFallback>
                                        </Avatar>
                                        {(isEditing || isUploading) && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full transition-opacity opacity-0 group-hover:opacity-100">
                                                {isUploading ? <Loader2 className="h-8 w-8 text-white animate-spin" /> : <Upload className="h-8 w-8 text-white" />}
                                            </div>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        // --- UPDATED: FormField now uses 'userName' ---
                                        <FormField name="userName" control={form.control} render={({ field }) => (
                                            <FormItem className="w-full px-4">
                                                <FormControl><Input {...field} className="text-2xl font-bold text-center h-12" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                    ) : (
                                        <h2 className="text-2xl font-bold">{userName}</h2>
                                    )}

                                    <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
                                    <Separator className="my-4" />
                                    <p className="text-sm text-muted-foreground px-4 min-h-[40px]">
                                        {form.watch('bio') || "No bio available."}
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
                                        <CardTitle className="text-2xl text-primary">{isEditing ? "Edit Profile" : "Your Profile"}</CardTitle>
                                        <CardDescription>View and edit your personal information.</CardDescription>
                                    </div>
                                    <Button type="button" variant="outline" onClick={() => isEditing ? handleCancel() : setIsEditing(true)}>
                                        {isEditing ? "Cancel" : <><Edit className="mr-2 h-4 w-4" /> Edit</>}
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField name="firstName" control={form.control} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                        <FormField name="lastName" control={form.control} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                    </div>
                                    <FormField name="email" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl><Input type="email" {...field} disabled /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField name="picture" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Profile Picture URL</FormLabel>
                                            <FormControl><Input {...field} disabled={!isEditing} placeholder="Click the avatar to upload an image" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField name="phone" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone (Optional)</FormLabel>
                                            <FormControl><Input {...field} disabled={!isEditing} placeholder="e.g., (123) 456-7890" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField name="bio" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl><Textarea {...field} disabled={!isEditing} placeholder="Tell us a little about yourself" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField name="skillLevel" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Skill Level</FormLabel>
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
