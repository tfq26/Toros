const TeamCard = ({ team, onClick }) => {
    return (
        <div
            key={team.id}
            className="p-4 border rounded shadow hover:bg-gray-100 cursor-pointer"
            onClick={() => onClick(team)}
        >
            <h2 className="text-xl font-semibold">{team.name}</h2>
            <p className="text-sm text-gray-600">Team ID: {team.id}</p>
            <p>Wins: {team.wins}</p>
            <p>Losses: {team.losses}</p>
            <p>Matches Played: {team.matchesPlayed}</p>
        </div>
    );
};

export default TeamCard;
