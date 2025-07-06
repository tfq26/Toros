import  { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button.jsx";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card.jsx";
import { FaPlus } from 'react-icons/fa';

// Import the new components
import ParticipantCard from './ParticipantCard.jsx';
import ParticipantModal from './ParticipantModal.jsx';
import useParticipants from "@/hooks/useParticipants.js";
import {Separator} from "@/components/ui/separator.jsx";

export default function ParticipantsTab({ tournament, onAdd, onUpdate, onRemove }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null); // null for new, team object for editing
    console.log("Data received by ParticipantsTab:", tournament);
    const { pairedTeams, unpairedPlayers } = useParticipants(tournament);

    const handleOpenModalForNew = () => {
        setEditingTeam(null);
        setModalOpen(true);
    };

    const handleOpenModalForEdit = (team) => {
        setEditingTeam(team);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingTeam(null);
    };

    const handleFormSubmit = (teamData) => {
        if (editingTeam) {
            onUpdate(teamData); // It's an update
        } else {
            onAdd(teamData); // It's a new addition
        }
        handleCloseModal();
    };

    const handleRemove = (teamId) => {
        if (window.confirm("Are you sure you want to remove this participant? This may affect the schedule.")) {
            onRemove(teamId); // The onRemove function just needs the ID string.
        }
    };

    const totalParticipants = (pairedTeams?.length || 0) + (unpairedPlayers?.length || 0);


    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Manage Participants</CardTitle>
                            <CardDescription>
                                {tournament.teams?.length || 0} participants registered. Add, edit, or remove them below.
                            </CardDescription>
                        </div>
                        <Button onClick={handleOpenModalForNew}>
                            <FaPlus className="mr-2" /> Add Participant
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {totalParticipants === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No participants have been added yet.</p>
                    ) : (
                        <div className="space-y-6">
                            {/* Section for Formed Teams */}
                            {pairedTeams.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Teams</h3>
                                    {pairedTeams
                                        // ✨ FIX: Filter out any null or invalid teams before mapping
                                        .filter(team => team && team._id)
                                        .map(team => (
                                            <ParticipantCard
                                                key={team._id}
                                                participant={team}
                                                type="team"
                                                onEdit={handleOpenModalForEdit}
                                                onRemove={() => handleRemove(team._id)}
                                            />
                                        ))}
                                </div>
                            )}

                            {(pairedTeams.length > 0 && unpairedPlayers.length > 0) && <Separator/>}

                            {/* Section for Unpaired Players */}
                            {unpairedPlayers.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Unpaired Players</h3>
                                    {unpairedPlayers
                                        // ✨ FIX: Filter out any null or invalid players before mapping
                                        .filter(player => player && player._id)
                                        .map(player => (
                                            <ParticipantCard
                                                key={player._id}
                                                participant={player}
                                                type="player"
                                            />
                                        ))}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* The Modal for Adding/Editing */}
            {isModalOpen && (
                <ParticipantModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleFormSubmit}
                    initialData={editingTeam}
                />
            )}
        </>
    );
};

ParticipantsTab.propTypes = {
    tournament: PropTypes.object.isRequired,
    onAdd: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
};