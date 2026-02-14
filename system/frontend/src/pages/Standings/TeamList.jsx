import TeamCard from './TeamCard';

const TeamList = ({ teams, onTeamClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team, index) => (
                <TeamCard key={team.id} team={team} onClick={onTeamClick} />
            ))}
        </div>
    );
};

export default TeamList;
