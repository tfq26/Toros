import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import LoadingModal from "../Modals/LoadingModal.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
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
import { Button } from "@/components/ui/button.jsx";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { Copy } from "lucide-react";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Label } from "@/components/ui/label.jsx";

const getSkillDescription = (level) => {
    switch (level) {
        case "Beginner":
            return "Beginner";
        case "Intermediate":
            return "Intermediate";
        case "Advanced":
            return "Advanced";
        default:
            return "Unknown";
    }
};

function ProfilePage() {
    const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(null);

    const form = useForm({
        defaultValues: {
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            skillLevel: "Beginner",
            bio: "",
        },
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await axios.get("http://localhost:8080/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = response.data;
                setUserData(data);
                form.reset({
                    username: data.username,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    skillLevel: data.playerProfile?.skillLevel || "Beginner",
                    bio: data.bio || "",
                });
            } catch (err) {
                console.error("Failed to load user info:", err);
            }
        };
        fetchUser();
    }, [form, getAccessTokenSilently]);

    if (isLoading || !userData) return <LoadingModal message="Loading profile…" />;
    if (!isAuthenticated) return <div className="p-6">You must be logged in to see your profile.</div>;

    const onSubmit = (data) => {
        console.log("Form submitted:", data);
        // TODO: persist changes
        setIsEditing(false);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => console.log(`📋 Copied to clipboard: ${text}`))
            .catch((err) => console.error("❌ Copy failed", err));
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            {userData.picture ? (
                <Avatar className="mx-auto mb-4">
                    <AvatarImage src={userData.picture} alt={userData.name} />
                    <AvatarFallback>{userData.name?.[0]}</AvatarFallback>
                </Avatar>
            ) : (
                <div className="w-24 h-24 rounded-full mb-4 bg-gray-300 flex items-center justify-center mx-auto">
                    <span className="text-2xl text-gray-600">?</span>
                </div>
            )}

            <div className="flex items-center gap-2 mb-6">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Edit Profile</span>
                <Switch checked={isEditing} onCheckedChange={setIsEditing} />
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input {...field} disabled={!isEditing} />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => copyToClipboard(field.value)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                            aria-label="Copy first name"
                                        >
                                            <Copy size={16} />
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormDescription>Your first name.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormDescription>Your last name.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input {...field} disabled={!isEditing} />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => copyToClipboard(field.value)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                            aria-label="Copy email"
                                        >
                                            <Copy size={16} />
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormDescription>Your contact email.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormDescription>Your phone number.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Tell us about yourself…" {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="skillLevel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Skill Level</FormLabel>
                                <FormControl>
                                    <select {...field} disabled={!isEditing} className="w-full rounded-md border p-2">
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </FormControl>
                                <FormDescription>Your current pickleball skill level.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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

export default ProfilePage;
