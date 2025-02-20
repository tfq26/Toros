import React from "react";
import { getEmojiForRank } from "../utils/playerUtils.js";

const PlayerStats = ({ stats }) => {
    const { totalPlayers, totalTeams, rankCounts, clubCounts } = stats;

    return (
        <aside className="w-full bg-red-600 dark:bg-gray-900 p-4 rounded shadow-md h-fit border-gray-300">
            <h3 className="text-xl text-orange-200 font-bold mb-4 text-center">Player Stats</h3>
            <p className="text-orange-300 text-center"><strong>Total Players:</strong> {totalPlayers}</p>
            <p className="text-orange-300 text-center"><strong>Total Teams:</strong> {totalTeams}</p>
            <div className="text-gray-100 mt-4">
                <strong>Players by Rank:</strong>
                <ul className="pl-4 list-none">
                    {Object.entries(rankCounts).map(([rank, count]) => (
                        <li className="text-white flex items-center" key={rank}>
                            <span className="mr-2 text-lg">{getEmojiForRank(rank)}</span> {rank}: {count}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="text-gray-100">
                <strong>Players by Club:</strong>
                <ul className="pl-4 list-none">
                    {Object.entries(clubCounts).map(([club, count]) => (
                        <li className="text-white flex items-center" key={club}>
                            <span className="mr-2 text-lg">📍</span> {club}: {count}
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default PlayerStats;
