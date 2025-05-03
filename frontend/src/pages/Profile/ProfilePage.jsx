// src/pages/Profile/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext.jsx";
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
import { Switch } from "@/components/ui/switch.jsx";
import { Copy } from "lucide-react";
import { useForm } from "react-hook-form";

import { updateCurrentUserWithToken } from "@/utils/functions/authUtils.js";

const skillOptions = ["Beginner", "Intermediate", "Advanced"];

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.1, when: "beforeChildren" },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export default function ProfilePage() {
    const {
        user: userData,
        isAuthenticated,
        loadingProfile,
        getToken,
        refreshUser,
    } = useAuth();
    const { addNotification } = useNotification();
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm({
        defaultValues: {
            firstName: userData?.firstName ?? "",
            lastName:  userData?.lastName ?? "",
            email:     userData?.email ?? "",
            phone:     userData?.phone ?? "",
            skillLevel: skillOptions[0],
            bio:        userData?.bio ?? "",
        },
    });
    const { isDirty, register } = form.formState;

    // Seed form when userData arrives
    useEffect(() => {
        if (isAuthenticated && userData) {
            form.reset({
                firstName:  userData.firstName  ?? "",
                lastName:   userData.lastName   ?? "",
                email:      userData.email      ?? "",
                phone:      userData.phone      ?? "",
                skillLevel: userData.playerProfile?.skillLevel ?? skillOptions[0],
                bio:        userData.bio        ?? "",
            });
        }
    }, [isAuthenticated, userData]);

    // Warn before unload if form is dirty
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

    // === Guards ===
    if (loadingProfile) {
        return <LoadingModal message="Loading profile…" />;
    }
    if (!isAuthenticated) {
        return (
            <motion.div
                className="p-6 text-center text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                You must be logged in to see your profile.
            </motion.div>
        );
    }
    if (userData === null) {
        return (
            <motion.div
                className="p-6 text-center text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                Oops, we couldn’t load your profile. <br />
                <button
                    className="mt-2 text-blue-500 underline"
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
                addNotification({ message: "Copied to clipboard!", type: "success" })
            )
            .catch(() =>
                addNotification({ message: "Copy failed.", type: "error" })
            );

    // Toggle edit mode
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
            const token = await getToken();
            await updateCurrentUserWithToken(token, {
                firstName:  data.firstName,
                lastName:   data.lastName,
                email:      data.email,
                phone:      data.phone,
                bio:        data.bio,
                skillLevel: data.skillLevel,
            });
            await refreshUser();
            setIsEditing(false);
            addNotification({ message: "Profile saved!", type: "success" });
        } catch (err) {
            console.error("❌ Failed to save profile:", err);
            addNotification({ message: "Failed to save profile.", type: "error" });
        }
    };

    return (
        <motion.div
            className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Avatar */}
            <motion.div variants={itemVariants} className="text-center mb-4">
                {userData.picture ? (
                    <Avatar className="inline-block h-24 w-24">
                        <AvatarImage src={userData.picture} alt={userData.username} />
                        <AvatarFallback>{userData.username[0]}</AvatarFallback>
                    </Avatar>
                ) : (
                    <div className="inline-block w-24 h-24 bg-gray-200 rounded-full">
                        <span className="text-3xl text-gray-400">?</span>
                    </div>
                )}
            </motion.div>

            {/* Edit switch + Name */}
            <motion.div
                variants={itemVariants}
                className="flex items-center justify-between mb-6"
            >
                <Switch checked={isEditing} onCheckedChange={toggleEdit} />
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {!isEditing ? (
                        `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
                    ) : (
                        <div className="flex space-x-2">
                            <Input
                                {...form.register("firstName")}
                                placeholder= {userData.firstName || "First Name"}
                                className="w-1/2"
                            />
                            <Input
                                {...form.register("lastName")}
                                placeholder= {userData.lastName || "Last Name"}
                                className="w-1/2"
                            />
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {["email", "phone"].map((name) => (
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
                                                <Input {...field} disabled={!isEditing} />
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="icon"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent"
                                                    onClick={() => copyToClipboard(field.value)}
                                                    aria-label="Copy"
                                                >
                                                    <Copy size={16} />
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>
                    ))}

                    <motion.div variants={itemVariants}>
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
                                            className="w-full border rounded-md p-2 dark:bg-gray-700 dark:text-white"
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
                            <Button type="submit" className="w-full mt-4">
                                Save Profile
                            </Button>
                        </motion.div>
                    )}
                </form>
            </Form>
        </motion.div>
    );
}
