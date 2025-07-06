import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";

export default function ParticipantModal({ isOpen, onClose, onSubmit, initialData }) {
    const [teamName, setTeamName] = useState('');
    const [player1Name, setPlayer1Name] = useState('');
    // For simplicity, we'll assume doubles for now, but this could be adapted for format
    const [player2Name, setPlayer2Name] = useState('');
    const isEditing = Boolean(initialData);

    useEffect(() => {
        if (isEditing && initialData) {
            setTeamName(initialData.name || '');
            setPlayer1Name(initialData.player1?.name || '');
            setPlayer2Name(initialData.player2?.name || '');
        } else {
            // Reset form for new entry
            setTeamName('');
            setPlayer1Name('');
            setPlayer2Name('');
        }
    }, [initialData, isEditing, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = {
            id: initialData?.id, // Include ID if editing
            name: teamName,
            player1: { name: player1Name },
            player2: player2Name ? { name: player2Name } : null,
        };
        onSubmit(submissionData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Participant' : 'Add New Participant'}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the team or player below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="teamName">Team Name (Optional)</Label>
                        <Input id="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="e.g., The Paddle Masters" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="player1Name">Player 1 Name</Label>
                        <Input id="player1Name" value={player1Name} onChange={(e) => setPlayer1Name(e.target.value)} placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="player2Name">Player 2 Name (for Doubles)</Label>
                        <Input id="player2Name" value={player2Name} onChange={(e) => setPlayer2Name(e.target.value)} placeholder="Jane Smith" />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">{isEditing ? 'Save Changes' : 'Add Participant'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}