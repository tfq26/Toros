const MatchList = ({ teamMatches, loadingMatches }) => {
    if (loadingMatches) return <p>Loading matches...</p>;

    if (teamMatches.length > 0) {
        return (
            <ul className="list-disc pl-5">
                {teamMatches.map((match, index) => (
                    <li key={index}>
                        {match.team1?.name || "Unknown Team 1"} vs {match.team2?.name || "Unknown Team 2"} - Status: {match.status} - <span className="font-bold">Score: {match.team1Score || 0} - {match.team2Score || 0}</span>
                    </li>
                ))}
            </ul>
        );
    }

    return <p>No matches found for this team.</p>;
};

export default MatchList;
