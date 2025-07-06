import 'react';
import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button.jsx";
import { Card } from "@/components/ui/card.jsx";
import { FaUser, FaUserFriends, FaPen, FaTrash, FaUserClock } from 'react-icons/fa';

export default function ParticipantCard({ participant, type, onEdit, onRemove }) {
    // A safeguard for unexpected data shapes.
    if (typeof participant !== 'object' || participant === null) {
        return <Card className="p-4 text-destructive-foreground bg-destructive">Invalid Participant Data</Card>;
    }

    // --- Conditional Logic based on the 'type' prop ---
    let isDoubles, title, subtitle, Icon, cardStyle;

    if (type === 'team') {
        // ✨ FIX: Use optional chaining (?.) for robust property access
        isDoubles = participant.player2 && participant.player2?.name;
        title = participant.name || (isDoubles
                ? `${participant.player1?.name} & ${participant.player2?.name}`
                : participant.player1?.name
        );
        subtitle = isDoubles
            ? `${participant.player1?.name} & ${participant.player2?.name}`
            : "Singles Player";
        Icon = isDoubles ? FaUserFriends : FaUser;
        cardStyle = "flex items-center justify-between p-4";

    } else { // type === 'player'
        // ✨ FIX: Ensured 'participant.name' is spelled correctly.
        title = participant.name || 'Unnamed Player';
        subtitle = "Waiting for a team";
        Icon = FaUserClock;
        cardStyle = "flex items-center justify-between p-4 bg-secondary/30 border-dashed";
    }

    return (
        <Card className={cardStyle}>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-full">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                    <p className="font-semibold text-card-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
            </div>

            {type === 'team' && (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => onEdit(participant)}>
                        <FaPen className="h-4 w-4" />
                    </Button>
                    {/* Use the correct _id for the remove function */}
                    <Button variant="destructive" size="icon" onClick={() => onRemove(participant._id)}>
                        <FaTrash className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </Card>
    );
}

// ✨ FIX: Updated PropTypes to use '_id' to match the database object.
ParticipantCard.propTypes = {
    participant: PropTypes.oneOfType([
        PropTypes.shape({ // Team shape
            _id: PropTypes.string.isRequired,
            name: PropTypes.string,
            player1: PropTypes.object,
            player2: PropTypes.object,
        }),
        PropTypes.shape({ // Player shape
            _id: PropTypes.string.isRequired,
            name: PropTypes.string,
        }),
    ]).isRequired,
    type: PropTypes.oneOf(['team', 'player']).isRequired,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
};