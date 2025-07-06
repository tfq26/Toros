import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// UI Components
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { FaTrash, FaSave } from "react-icons/fa";

// The SettingsTab component, now with a full form.
export default function SettingsTab({ tournament, onUpdate, onDelete }) {
    // ✨ NEW: State to manage the form data, initialized from the tournament prop.
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        rules: '',
        prizeDistribution: '',
        format: 'Singles',
    });
    const [isSaving, setIsSaving] = useState(false);

    // ✨ NEW: When the tournament data prop changes, update the form state.
    useEffect(() => {
        if (tournament) {
            setFormData({
                name: tournament.name || '',
                location: tournament.location || '',
                rules: tournament.rules || '',
                prizeDistribution: tournament.prizeDistribution || '',
                format: tournament.format || 'Singles',
            });
        }
    }, [tournament]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onUpdate(formData);
            // Optionally show a success message
        } catch (error) {
            // Optionally show an error message
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to permanently delete the tournament "${tournament.name}"? This action cannot be undone.`)) {
            onDelete();
        }
    };

    return (
        <Card>
            <form onSubmit={handleSave}>
                <CardHeader>
                    <CardTitle>Tournament Settings</CardTitle>
                    <CardDescription>Update general tournament information. Click Save Changes when you're done.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* --- Main Settings Form --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Tournament Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" name="location" value={formData.location} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="format">Format</Label>
                            <Select name="format" value={formData.format} onValueChange={(value) => handleSelectChange('format', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Singles">Singles</SelectItem>
                                    <SelectItem value="Doubles">Doubles</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="prizeDistribution">Prize Distribution</Label>
                            <Input id="prizeDistribution" name="prizeDistribution" value={formData.prizeDistribution} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rules">Tournament Rules</Label>
                        <Textarea id="rules" name="rules" value={formData.rules} onChange={handleInputChange} rows={5} />
                    </div>

                    {/* --- Save Button --- */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving}>
                            <FaSave className="mr-2" />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>

                    {/* --- Danger Zone --- */}
                    <div className="mt-8 pt-6 border-t border-destructive/20">
                        <h3 className="text-lg font-bold text-destructive">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground mb-4">This action is irreversible. Please be certain.</p>
                        <Button variant="destructive" type="button" onClick={handleDelete}>
                            <FaTrash className="mr-2" /> Delete Tournament
                        </Button>
                    </div>
                </CardContent>
            </form>
        </Card>
    );
}

SettingsTab.propTypes = {
    tournament: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};