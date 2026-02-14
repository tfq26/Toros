// RegisterModal.jsx
import  { useState } from "react";
import PropTypes from "prop-types";
import { useAuth0 } from "@auth0/auth0-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import axios from "axios";
import { useNotification } from "../../utils/NotificationProvider.jsx";


function getSkillDescription(level) {
    return level === 1
        ? "Beginner"
        : level === 2
            ? "Intermediate"
            : level === 3
                ? "Advanced"
                : "Unknown";
}

export default function RegisterModal({
                                          isOpen,
                                          tournament,
                                          onClose,
                                          onRegistered,
                                      }) {
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const [isGuest, setIsGuest] = useState(false);

    // Guest form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [skill, setSkill] = useState(1);
    const [hasPartner, setHasPartner] = useState(false);
    const [pFirst, setPFirst] = useState("");
    const [pLast, setPLast] = useState("");
    const [pEmail, setPEmail] = useState("");
    const { user, getAccessTokenSilently } = useAuth0();
    const { addNotification } = useNotification();


    const handleAuthConfirm = async () => {
        try {
            const token = await getAccessTokenSilently();
            const userId = user?.sub;

            const res = await axios.post(
                "http://localhost:8080/api/tournaments/register",
                { tournamentId: tournament.id, userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    validateStatus: () => true, // ← accept all to handle ourselves
                }
            );

            if (res.status === 409) {
                addNotification({
                    type: "warning",
                    message: "You're already registered for this tournament.",
                });
            } else if (res.status === 200) {
                addNotification({
                    type: "success",
                    message: `Successfully registered for ${tournament.name}!`,
                });
                onRegistered();
            } else {
                addNotification({
                    type: "error",
                    message: "Something went wrong during registration.",
                });
            }
        } catch (err) {
            console.error("❌ Registration failed:", err);
            addNotification({
                type: "error",
                message: "Failed to register due to a network or server error.",
            });
        }
    };

    const handleGuestSubmit = async () => {
        try {
            const payload = {
                tournamentId: tournament.id,
                guest: { firstName, lastName, email, phone, skill },
                partner: hasPartner
                    ? { firstName: pFirst, lastName: pLast, email: pEmail }
                    : null,
            };
            await axios.post(
                "http://localhost:8080/api/tournaments/register/guest",
                payload
            );
            onRegistered();
        } catch (err) {
            console.error(err);
        }
    };

    // Determine content
    let title, description, onConfirm, confirmText, onCancel, cancelText, body;

    if (!isAuthenticated && !isGuest) {
        title = "Sign in or Register as Guest";
        description =
            "You need an account to register. Sign in, or continue as a guest.";
        confirmText = "Sign In";
        cancelText = "Guest";
        onConfirm = () => loginWithRedirect();
        onCancel = () => setIsGuest(true);
        body = null;
    } else if (isAuthenticated && !isGuest) {
        title = `Register for "${tournament.name}"`;
        description = "Click Confirm to complete your registration.";
        confirmText = "Confirm";
        cancelText = "Cancel";
        onConfirm = handleAuthConfirm;
        onCancel = onClose;
        body = null;
    } else {
        title = `Guest Registration: "${tournament.name}"`;
        description = "Please fill in your details below.";
        confirmText = "Submit";
        cancelText = "Cancel";
        onConfirm = handleGuestSubmit;
        onCancel = onClose;
        body = (
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleGuestSubmit();
                }}
                className="space-y-4 pt-2"
            >
                <div>
                    <Label>First Name</Label>
                    <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <Label>Last Name</Label>
                    <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <Label>Phone</Label>
                    <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div>
                    <Label>Skill Level: {getSkillDescription(skill)}</Label>
                    <Input
                        type="range"
                        min="1"
                        max="3"
                        step="1"
                        value={skill}
                        onChange={(e) => setSkill(Number(e.target.value))}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch checked={hasPartner} onCheckedChange={setHasPartner} />
                    <Label>Register with a teammate?</Label>
                </div>
                {hasPartner && (
                    <>
                        <div>
                            <Label>Partner First Name</Label>
                            <Input
                                value={pFirst}
                                onChange={(e) => setPFirst(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Partner Last Name</Label>
                            <Input
                                value={pLast}
                                onChange={(e) => setPLast(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Partner Email</Label>
                            <Input
                                type="email"
                                value={pEmail}
                                onChange={(e) => setPEmail(e.target.value)}
                            />
                        </div>
                    </>
                )}
            </form>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                {body}

                <div className="mt-6 flex justify-end space-x-2">
                    <Button variant="outline" onClick={onCancel}>
                        {cancelText}
                    </Button>
                    <Button onClick={onConfirm}>{confirmText}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

RegisterModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    tournament: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onRegistered: PropTypes.func.isRequired,
};
