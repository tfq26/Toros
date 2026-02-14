import 'react';
import PropTypes from 'prop-types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { FaTachometerAlt, FaUsers, FaTableTennis, FaCogs } from "react-icons/fa";

// Import your tab components
import DashboardTab from "../Tabs/DashboardTab.jsx";
import ParticipantsTab from "../Tabs/Participant/ParticipantsTab.jsx";
import MatchesTab from "../Tabs/MatchesTab.jsx";
import SettingsTab from "../Tabs/SettingsTab.jsx";

// This component is only responsible for the Tabs layout and passing props down.
export default function ManagementTabs({
                                           tournament,
                                           activeTab,
                                           setActiveTab,
                                           onAddParticipant,
                                           onUpdateParticipant,
                                           onRemoveParticipant,
                                           onUpdateMatch,
                                           onRefreshMatches,
                                           onUpdateTournament,
                                           onDeleteTournament
                                       }) {
    return (
        <main>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="dashboard"><FaTachometerAlt className="mr-2" />Dashboard</TabsTrigger>
                    <TabsTrigger value="participants"><FaUsers className="mr-2" />Participants</TabsTrigger>
                    <TabsTrigger value="matches"><FaTableTennis className="mr-2" />Matches</TabsTrigger>
                    <TabsTrigger value="settings"><FaCogs className="mr-2" />Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="mt-4">
                    <DashboardTab tournament={tournament} />
                </TabsContent>
                <TabsContent value="participants" className="mt-4">
                    <ParticipantsTab
                        tournament={tournament}
                        onAdd={onAddParticipant}
                        onUpdate={onUpdateParticipant}
                        onRemove={onRemoveParticipant}
                    />
                </TabsContent>
                <TabsContent value="matches" className="mt-4">
                    <MatchesTab
                        tournament={tournament}
                        refreshMatches={onRefreshMatches}
                        updateMatch={onUpdateMatch}
                    />
                </TabsContent>
                <TabsContent value="settings" className="mt-4">
                    <SettingsTab
                        tournament={tournament}
                        onUpdate={onUpdateTournament}
                        onDelete={onDeleteTournament}
                    />
                </TabsContent>
            </Tabs>
        </main>
    );
}

// Define PropTypes for all the props this component receives and passes down
ManagementTabs.propTypes = {
    tournament: PropTypes.object.isRequired,
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    onAddParticipant: PropTypes.func.isRequired,
    onUpdateParticipant: PropTypes.func.isRequired,
    onRemoveParticipant: PropTypes.func.isRequired,
    onUpdateMatch: PropTypes.func.isRequired,
    onRefreshMatches: PropTypes.func.isRequired,
    onUpdateTournament: PropTypes.func.isRequired,
    onDeleteTournament: PropTypes.func.isRequired,
};