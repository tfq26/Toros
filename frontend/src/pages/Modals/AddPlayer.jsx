import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select.jsx";
import {FaChevronDown, FaPlus} from "react-icons/fa";

const DEFAULT_PLAYER = {
    name: "",
    teamName: "",
    clubName: "",
    skillLevel: "",
    status: "Registered",
};

// Helper to get descriptive labels for skill levels
const getSkillLevelLabel = (level) => {
    const numLevel = parseInt(level, 10);
    switch (numLevel) {
        case 1: return "1.0 - Beginner";
        case 2: return "2.0 - Novice";
        case 3: return "3.0 - Intermediate";
        case 4: return "4.0 - Advanced";
        case 5: return "5.0 - Expert";
        default: return `${level}.0`;
    }
};

// --- UPDATED: AddPlayer now accepts 'levels' prop ---
const AddPlayer = ({ onPlayerAdded, onStatusUpdate, players = [], clubs = [], levels = [] }) => {
    const [player, setPlayer] = useState(DEFAULT_PLAYER);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);

    // State for partner combobox
    const [isPartnerDropdownOpen, setIsPartnerDropdownOpen] = useState(false);
    const [partnerSearchQuery, setPartnerSearchQuery] = useState("");
    const partnerDropdownRef = useRef(null);

    // State for the club combobox
    const [isClubDropdownOpen, setIsClubDropdownOpen] = useState(false);
    const [clubSearchQuery, setClubSearchQuery] = useState("");
    const clubDropdownRef = useRef(null);

    // Filter logic for partners
    const filteredPartners = players.filter(p =>
        p.name.toLowerCase().includes(partnerSearchQuery.toLowerCase()) && p.name !== player.name
    );

    // Filter logic for clubs
    const filteredClubs = clubs.filter(c =>
        c.toLowerCase().includes(clubSearchQuery.toLowerCase())
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPlayer((prev) => ({ ...prev, [name]: value }));
    };

    // Handlers for Partner Combobox
    const handlePartnerSearchChange = (e) => {
        const { value } = e.target;
        setPartnerSearchQuery(value);
        setPlayer(prev => ({ ...prev, teamName: value }));
        if (!isPartnerDropdownOpen) setIsPartnerDropdownOpen(true);
    };

    const handleSelectPartner = (partner) => {
        setPlayer(prev => ({ ...prev, teamName: partner.name }));
        setPartnerSearchQuery(partner.name);
        setIsPartnerDropdownOpen(false);
    };

    // Handlers for Club Combobox
    const handleClubSearchChange = (e) => {
        const { value } = e.target;
        setClubSearchQuery(value);
        setPlayer(prev => ({ ...prev, clubName: value }));
        if (!isClubDropdownOpen) setIsClubDropdownOpen(true);
    };

    const handleSelectClub = (clubName) => {
        setPlayer(prev => ({ ...prev, clubName: clubName }));
        setClubSearchQuery(clubName);
        setIsClubDropdownOpen(false);
    };


    // Effect to handle clicking outside dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (partnerDropdownRef.current && !partnerDropdownRef.current.contains(event.target)) {
                setIsPartnerDropdownOpen(false);
            }
            if (clubDropdownRef.current && !clubDropdownRef.current.contains(event.target)) {
                setIsClubDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleSubmit = async () => {
        setIsSubmitting(true);
        onStatusUpdate && onStatusUpdate("Adding player...");

        const payload = {
            ...player,
            skillLevel: parseInt(player.skillLevel, 10) || 0,
        };

        try {
            const response = await axios.post("http://localhost:8080/api/players/add", payload);
            if (response.status === 200) {
                onStatusUpdate && onStatusUpdate("✅ Player added successfully!");
                onPlayerAdded && onPlayerAdded(response.data);
                setPlayer(DEFAULT_PLAYER);
                setPartnerSearchQuery("");
                setClubSearchQuery("");
                setOpen(false);
            } else {
                onStatusUpdate && onStatusUpdate("⚠️ Error adding player. Please try again.");
            }
        } catch (error) {
            console.error("❌ Error adding player:", error);
            onStatusUpdate && onStatusUpdate("❌ Failed to add player. Check the server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-700 text-white px-3 py-1 rounded hover:bg-emerald-600 transition">
                    <FaPlus className="mr-2" />
                    Add Player
                </Button>
            </DialogTrigger>
            <DialogContent className="p-4">
                <DialogHeader>
                    <DialogTitle className="text-lg">Add New Player</DialogTitle>
                    <DialogDescription className="text-sm">
                        Enter the player's details below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-3 mt-3">
                    {/* Name Input */}
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="name" className="text-xs">Name</Label>
                        <Input id="name" name="name" type="text" placeholder="Player name" value={player.name} onChange={handleInputChange} className="w-full" />
                    </div>

                    {/* Partner/Team Name Combobox */}
                    <div className="flex flex-col gap-1 relative" ref={partnerDropdownRef}>
                        <Label htmlFor="teamName" className="text-xs">Team Name / Partner</Label>
                        <div className="relative">
                            <Input id="teamName" name="teamName" type="text" placeholder="Type team name or search for a partner" value={player.teamName} onChange={handlePartnerSearchChange} onFocus={() => setIsPartnerDropdownOpen(true)} className="w-full" autoComplete="off" />
                            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setIsPartnerDropdownOpen(prev => !prev)}><FaChevronDown className="h-3 w-3 text-muted-foreground" /></Button>
                        </div>
                        {isPartnerDropdownOpen && filteredPartners.length > 0 && (
                            <div className="absolute top-full mt-1 w-full bg-card border rounded-md shadow-lg z-20 max-h-40 overflow-y-auto">
                                {filteredPartners.map(p => (
                                    <div key={p.id} className="p-2 hover:bg-muted cursor-pointer" onClick={() => handleSelectPartner(p)}>
                                        <p className="font-medium">{p.name}</p>
                                        <p className="text-xs text-muted-foreground">{p.clubName || 'No club'}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Club Name Combobox */}
                    <div className="flex flex-col gap-1 relative" ref={clubDropdownRef}>
                        <Label htmlFor="clubName" className="text-xs">Club Name</Label>
                        <div className="relative">
                            <Input id="clubName" name="clubName" type="text" placeholder="Type or select a club" value={player.clubName} onChange={handleClubSearchChange} onFocus={() => setIsClubDropdownOpen(true)} className="w-full" autoComplete="off" />
                            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setIsClubDropdownOpen(prev => !prev)}><FaChevronDown className="h-3 w-3 text-muted-foreground" /></Button>
                        </div>
                        {isClubDropdownOpen && filteredClubs.length > 0 && (
                            <div className="absolute top-full mt-1 w-full bg-card border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                                {filteredClubs.map((club, index) => (
                                    <div key={index} className="p-2 hover:bg-muted cursor-pointer" onClick={() => handleSelectClub(club)}>
                                        <p className="font-medium">{club}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- UPDATED: Skill Level Select now dynamically populated --- */}
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="skillLevel" className="text-xs">Skill Level</Label>
                        <Select value={player.skillLevel} onValueChange={(value) => setPlayer((prev) => ({ ...prev, skillLevel: value }))}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select a skill level" /></SelectTrigger>
                            <SelectContent>
                                {levels.map(level => (
                                    <SelectItem key={level} value={String(level)}>
                                        {getSkillLevelLabel(level)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status Select */}
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="status" className="text-xs">Status</Label>
                        <Select value={player.status} onValueChange={(value) => setPlayer((prev) => ({ ...prev, status: value }))}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Registered">Registered</SelectItem>
                                <SelectItem value="Checked In">Checked In</SelectItem>
                                <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogClose asChild>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="mt-4 w-full text-sm px-4 py-2 hover:bg-emerald-300 bg-emerald-400">
                        {isSubmitting ? "Adding..." : "Add Player"}
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default AddPlayer;
