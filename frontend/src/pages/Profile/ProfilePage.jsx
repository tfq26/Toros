import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoadingModal from "@/pages/Modals/LoadingModal.jsx";
import { useNotification } from "@/utils/NotificationProvider.jsx";
import { motion } from "framer-motion";
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
    FormMessage,
} from "@/components/ui/form.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Copy } from "lucide-react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

import { updateCurrentUserWithToken, getCurrentUser } from "@/utils/functions/authUtils.js";

const skillOptions = ["Beginner", "Intermediate", "Advanced"];

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            staggerChildren: 0.1,
            when: "beforeChildren",
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100 },
    },
};

//  Extracted fetchProfileData function
const fetchProfileData = async (isAuthenticated, auth0User, getAccessTokenSilently, setUserData, form, addNotification, setLoadingProfile) => {
    if (isAuthenticated && auth0User) {
        setLoadingProfile(true);
        try {
            const token = await getAccessTokenSilently();
            const user = await getCurrentUser(token, getAccessTokenSilently);
            setUserData(user);
            form.reset({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                skillLevel:
                    user.playerProfile?.skillLevel || skillOptions[0],
                bio: user.bio || "",
            });
        } catch (error) {
            console.error("Error fetching profile data:", error);
            addNotification({
                message: "Failed to load profile data.",
                type: "error",
            });
            setUserData(null);
        } finally {
            setLoadingProfile(false);
        }
    } else {
        setLoadingProfile(false);
        setUserData(null);
    }
};


export default function ProfilePage() {
    const {
        isAuthenticated,
        user: auth0User,
        getAccessTokenSilently,
        logout
    } = useAuth0();
    const { addNotification } = useNotification();
    const [isEditing, setIsEditing] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [userData, setUserData] = useState(null);

    const form = useForm({
        defaultValues: {
            firstName: userData?.firstName ?? "",
            lastName: userData?.lastName ?? "",
            email: userData?.email ?? "",
            phone: userData?.phone ?? "",
            skillLevel: skillOptions[0],
            bio: userData?.bio ?? "",
        },
    });



    // Fetch user data on component mount and when auth0User changes
    useEffect(() => {
        fetchProfileData(isAuthenticated, auth0User, getAccessTokenSilently, setUserData, form, addNotification, setLoadingProfile);
    }, [isAuthenticated, auth0User, getAccessTokenSilently, form.reset, addNotification]);


    // Warn on unload
    useEffect(() => {
        const handler = (e) => {
            if (form.formState.isDirty) {
                e.preventDefault();
                e.returnValue = "";
                addNotification({
                    message: "You have unsaved changes!",
                    type: "warning",
                });
            }
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [form.formState.isDirty, addNotification]);

    if (loadingProfile) {
        return <LoadingModal message="Loading profile…" />;
    }
    if (!isAuthenticated) {
        return (
            <motion.div
                className="p-6 text-center text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                You must be logged in to see your profile.
            </motion.div>
        );
    }
    if (!userData) {
        return (
            <motion.div
                className="p-6 text-center text-red-500 dark:text-red-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                Oops, we couldn’t load your profile. <br />
                <button
                    className="mt-2 text-blue-500 dark:text-blue-400 underline"
                    onClick={() => window.location.reload()}
                >
                    Try again
                </button>
            </motion.div>
        );
    }

    const copyToClipboard = (text) =>
        navigator.clipboard
            .writeText(text)
            .then(() =>
                addNotification({
                    message: "Copied to clipboard!",
                    type: "success",
                })
            )
            .catch(() =>
                addNotification({ message: "Copy failed.", type: "error" })
            );

    const toggleEdit = (next) => {
        if (!next && form.formState.isDirty) {
            addNotification({
                message: "You have unsaved changes!",
                type: "warning",
            });
            return;
        }
        setIsEditing(next);
    };

    const onSubmit = async (data) => {
        try {
            const token = await getAccessTokenSilently();
            // Include the picture URL from userData
            const updateData = {
                ...data,
                picture: userData.picture,  //  Include the picture URL
            };
            const updatedUser = await updateCurrentUserWithToken(token, updateData);
            setUserData(updatedUser); // Update the local state
            setIsEditing(false);
            addNotification({ message: "Profile saved!", type: "success" });
        } catch (err) {
            console.error("❌ Failed to save profile:", err);
            addNotification({ message: "Failed to save profile.", type: "error" });
        }
    };

    return (
        <motion.div
            className="max-w-2xl mx-auto p-6 bg-card dark:bg-card-dark rounded-xl shadow-lg"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Avatar and Name Section */}
            <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8"
            >
                <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                        <AvatarImage
                            src={userData.picture}
                            alt={userData.username}
                        />
                        <AvatarFallback>
                            {userData.username[0]}
                        </AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {!isEditing
                            ? `${userData.firstName || ""} ${
                                userData.lastName || ""
                            }`.trim()
                            : "Edit Profile"}
                    </h1>
                </div>
                <div className="flex gap-2">

                    <Button
                        variant="outline"
                        onClick={() => toggleEdit(!isEditing)}
                        className="self-start"
                    >
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => logout({ returnTo: window.location.origin })}
                        className="self-start"
                    >
                        Logout
                    </Button>
                </div>
            </motion.div>

            {/* Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {["firstName", "lastName", "email", "phone"].map(
                        (name) => (
                            <motion.div variants={itemVariants} key={name}>
                                <FormField
                                    control={form.control}
                                    name={name}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {name}
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        disabled={!isEditing}
                                                        className="w-full"
                                                    />
                                                    {name !== "bio" && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    field.value
                                                                )
                                                            }
                                                            aria-label="Copy"
                                                        >
                                                            <Copy size={16} />
                                                        </Button>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>
                        )
                    )}

                    <motion.div variants={itemVariants}>
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            disabled={!isEditing}
                                            className="w-full min-h-[100px]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
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
                                            className={cn(
                                                "w-full border rounded-md p-3",
                                                "bg-background text-foreground",
                                                "focus:outline-none focus:ring-2 focus:ring-ring",
                                                "disabled:opacity-50 disabled:cursor-not-allowed"
                                            )}
                                        >
                                            {skillOptions.map((lvl) => (
                                                <option key={lvl} value={lvl}>
                                                    {lvl}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    {isEditing && (
                        <motion.div variants={itemVariants}>
                            <Button
                                type="submit"
                                className="w-full mt-6"
                                disabled={!form.formState.isDirty}
                            >
                                Save Profile
                            </Button>
                        </motion.div>
                    )}
                </form>
            </Form>
        </motion.div>
    );
}

