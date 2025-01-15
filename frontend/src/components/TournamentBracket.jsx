import React, { useState, useEffect } from "react";

function TournamentBracket() {
    const [teams, setTeams] = useState([]);
    const [bracket, setBracket] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);

    // Fetch initial teams and generate the bracket
    const generateBracket = async () => {
        const response = await fetch("/api/tournament/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(teams),
        });
        const data = await response.json();
        setBracket(data);
    };

    const submitMatchResult = async (matchId, winner) => {
        await fetch("/api/tournament/submitResult", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ matchId, winner }),
        });
        generateBracket(); // Refresh the bracket after submitting result
    };

    return (
        <div>
            <button onClick={generateBracket}>Generate Bracket</button>
            <div className="bracket-container">
                {bracket.map((round, roundIndex) => (
                    <div key={roundIndex} className="bracket-column">
                        <h2>Round {roundIndex + 1}</h2>
                        {round.map((match) => (
                            <div
                                key={match.matchId}
                                onClick={() => setSelectedMatch(match)}
                                className="match-box"
                            >
                                <p>{match.team1?.name || "TBD"} vs {match.team2?.name || "TBD"}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {selectedMatch && (
                <div>
                    <h3>Enter Match Result</h3>
                    <button onClick={() => submitMatchResult(selectedMatch.matchId, selectedMatch.team1)}>
                        {selectedMatch.team1?.name} Wins
                    </button>
                    <button onClick={() => submitMatchResult(selectedMatch.matchId, selectedMatch.team2)}>
                        {selectedMatch.team2?.name} Wins
                    </button>
                </div>
            )}
        </div>
    );
}

export default TournamentBracket;