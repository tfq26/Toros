// src/pages/Profile/ProfilePage.jsx
import { useState, useEffect } from "react";
import { useAuth0 }             from "@auth0/auth0-react";
import axios                    from "axios";              // ← DEBUG‑ONLY
import LoadingModal             from "../Modals/LoadingModal.jsx";

import {
    Avatar, AvatarFallback, AvatarImage,
}                               from "@/components/ui/avatar.jsx";
import {
    Form, FormField, FormItem, FormLabel,
    FormControl, FormDescription, FormMessage,
}                               from "@/components/ui/form.jsx";
import { Input }                from "@/components/ui/input.jsx";
import { Textarea }             from "@/components/ui/textarea.jsx";
import { Button }               from "@/components/ui/button.jsx";
import { Switch }               from "@/components/ui/switch";
import { Copy }                 from "lucide-react";
import { useForm }              from "react-hook-form";

import {
    getCurrentUserWithToken,
}                               from "@/utils/functions/authUtils.js";

/* ─── DEBUG‑ONLY • log every request that targets our Spring API ───────── */
if (import.meta.env.DEV) {
    axios.interceptors.request.use((cfg) => {
        if (cfg.url?.startsWith("http://localhost:8080/api")) {
            console.info(
                `%c➡ ${cfg.method?.toUpperCase()} ${cfg.url}`,
                "color:#03A9F4;font-weight:bold"
            );
            console.table(cfg.headers);
        }
        return cfg;
    });
}
/* ───────────────────────────────────────────────────────────────────────── */

const getSkillDescription = (lvl) =>
    ({ Beginner: "Beginner", Intermediate: "Intermediate", Advanced: "Advanced" }[lvl] ??
        "Unknown");

function ProfilePage() {
    const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [userData, setUserData]  = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm({
        defaultValues: {
            username  : "",
            firstName : "",
            lastName  : "",
            email     : "",
            phone     : "",
            skillLevel: "Beginner",
            bio       : "",
        },
    });

    /* ── fetch profile once we’re logged‑in ─────────────────────────────── */
    useEffect(() => {
        const loadProfile = async () => {
            try {
                /* 1️⃣ Ask Auth0 for a JWT (prints in console) */
                const token = await getAccessTokenSilently({ audience: "https://Toros/api" });
                console.debug("🔑 Auth0 token preview:", token.slice(0, 40) + "...");   // DEBUG

                /* 2️⃣ Call our Spring endpoint with that token */
                const data = await getCurrentUserWithToken(token);
                console.debug("✅ /me response:", data);                                // DEBUG

                setUserData(data);
                form.reset({
                    username   : data.username,
                    firstName  : data.firstName,
                    lastName   : data.lastName,
                    email      : data.email,
                    phone      : data.phone,
                    skillLevel : data.playerProfile?.skillLevel ?? "Beginner",
                    bio        : data.bio ?? "",
                });
            } catch (err) {
                console.error("❌ Failed to load user info:", err);
            }
        };

        if (isAuthenticated) loadProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    /* ── guards ─────────────────────────────────────────────────────────── */
    if (isLoading || (isAuthenticated && !userData))
        return <LoadingModal message="Loading profile…" />;
    if (!isAuthenticated)
        return <div className="p-6">You must be logged in to see your profile.</div>;

    /* ── handlers ───────────────────────────────────────────────────────── */
    const onSubmit = (data) => {
        console.table(data);          // DEBUG
        // TODO: send PATCH to backend, then refetch
        setIsEditing(false);
    };

    const copy = (txt) =>
        navigator.clipboard.writeText(txt).catch((e) => console.error("Copy failed:", e));

    /* ── UI ─────────────────────────────────────────────────────────────── */
    return (
        <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Avatar */}
            {userData.picture ? (
                <Avatar className="mx-auto mb-4">
                    <AvatarImage src={userData.picture} alt={userData.username} />
                    <AvatarFallback>{userData.username?.[0]}</AvatarFallback>
                </Avatar>
            ) : (
                <div className="w-24 h-24 mb-4 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl text-gray-600">?</span>
                </div>
            )}

            {/* edit toggle */}
            <div className="flex items-center gap-2 mb-6">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Edit Profile</span>
                <Switch checked={isEditing} onCheckedChange={setIsEditing} />
            </div>

            {/* Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {[
                        { name: "firstName", label: "First Name" },
                        { name: "lastName",  label: "Last Name"  },
                        { name: "email",     label: "Email"      },
                        { name: "phone",     label: "Phone"      },
                    ].map(({ name, label }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input {...field} disabled={!isEditing} />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                                onClick={() => copy(field.value)}
                                                aria-label="Copy"
                                            >
                                                <Copy size={16} />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormDescription>Your {label.toLowerCase()}.</FormDescription>
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
                                    <select {...field} disabled={!isEditing} className="w-full border rounded-md p-2">
                                        {["Beginner","Intermediate","Advanced"].map((v)=>(
                                            <option key={v} value={v}>{v}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormDescription>
                                    Current level: {getSkillDescription(field.value)}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit */}
                    {isEditing && (
                        <Button type="submit" className="w-full mt-4">Save Profile</Button>
                    )}
                </form>
            </Form>
        </div>
    );
}

export default ProfilePage;
