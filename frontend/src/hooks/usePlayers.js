import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { convertLevel, calculateStats } from "@/utils/functions/HelperFunctions.js";
import { useAuth0 } from '@auth0/auth0-react';

export function usePlayers() {
    const [players, setPlayers] = useState([]);
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState(null);
    const { getAccessTokenSilently } = useAuth0();

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClub, setSelectedClub] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');

    const fetchPlayers = useCallback(async () => {
        setStatus('loading');
        try {
            // --- FIX: Changed URL to match the @GetMapping("/all") in your controller ---
            const response = await axios.get('http://localhost:8080/api/players/all');
            setPlayers(Array.isArray(response.data) ? response.data : []);
            setStatus('success');
        } catch (err) {
            console.error("Failed to load player data:", err);
            setError("Could not load players. Please try again later.");
            setPlayers([]);
            setStatus('error');
        }
    }, []);

    useEffect(() => {
        fetchPlayers();
    }, [fetchPlayers]);

    const filteredPlayers = useMemo(() => {
        if (!Array.isArray(players)) return [];
        return players.filter(player => {
            const p = player || {};
            const matchesClub = selectedClub ? p.clubName === selectedClub : true;
            const matchesLevel = selectedLevel ? convertLevel(p.skillLevel) === selectedLevel : true;
            const matchesSearch = searchQuery
                ? String(p.name || '').toLowerCase().includes(searchQuery.toLowerCase())
                : true;
            return matchesClub && matchesLevel && matchesSearch;
        });
    }, [players, selectedClub, selectedLevel, searchQuery]);

    const derivedData = useMemo(() => {
        const playerList = Array.isArray(players) ? players : [];
        const filteredPlayerList = Array.isArray(filteredPlayers) ? filteredPlayers : [];

        const stats = calculateStats(filteredPlayerList);

        const clubs = [...new Set(playerList.map(p => p.clubName).filter(val => val && String(val).trim() !== ''))];
        const levels = [...new Set(playerList.map(p => convertLevel(p.skillLevel)).filter(val => val && String(val).trim() !== ''))];

        return { stats, clubs, levels };
    }, [filteredPlayers, players]);

    const actions = {
        refresh: fetchPlayers,
        addPlayer: async (newPlayerData) => {
            setPlayers(currentPlayers => [...currentPlayers, { ...newPlayerData, id: 'temp-id' }]);
            try {
                const token = await getAccessTokenSilently();
                await axios.post('http://localhost:8080/api/players/add', newPlayerData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                await fetchPlayers();
            } catch (err) {
                console.error("Failed to add player:", err);
                setError("Could not save new player. Please try again.");
                await fetchPlayers();
            }
        },
        updatePlayer: async (updatedPlayerData) => {
            const previousPlayers = [...players];
            setPlayers(currentPlayers =>
                currentPlayers.map(p => p.id === updatedPlayerData.id ? { ...p, ...updatedPlayerData } : p)
            );
            try {
                const token = await getAccessTokenSilently();
                await axios.put(`http://localhost:8080/api/players/${updatedPlayerData.id}`, updatedPlayerData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.error("Failed to update player:", err);
                setError("Could not update player. Reverting changes.");
                setPlayers(previousPlayers);
            }
        },
        setSearchQuery,
        setSelectedClub,
        setSelectedLevel,
    };

    return {
        status,
        error,
        players: filteredPlayers,
        stats: derivedData.stats,
        clubs: derivedData.clubs,
        levels: derivedData.levels,
        filters: {
            searchQuery,
            selectedClub,
            selectedLevel,
        },
        actions,
    };
}