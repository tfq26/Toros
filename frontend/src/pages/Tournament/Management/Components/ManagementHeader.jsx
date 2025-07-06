import 'react';
import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button.jsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.jsx";
import { FaBroadcastTower, FaPen } from "react-icons/fa";

// This component is only responsible for displaying the header.
export default function ManagementHeader({ tournament, isMobile, onNavigateLive, onEdit }) {
    return (
        <header className="flex flex-col md:flex-row md:items-center md:justify-between bg-card text-card-foreground p-4 rounded-lg shadow gap-4">
            <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">{tournament.name}</h1>
                <p className="text-sm text-muted-foreground">Management Dashboard</p>
            </div>
            <div className="flex items-center justify-center gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size={isMobile ? "icon" : "sm"} onClick={onNavigateLive}>
                            <FaBroadcastTower className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Live View</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Go to Live View</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="secondary" size={isMobile ? "icon" : "sm"} onClick={onEdit}>
                            <FaPen className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Edit Details</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Edit Tournament Details (in Settings)</p></TooltipContent>
                </Tooltip>
            </div>
        </header>
    );
}

ManagementHeader.propTypes = {
    tournament: PropTypes.object.isRequired,
    isMobile: PropTypes.bool,
    onNavigateLive: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
};