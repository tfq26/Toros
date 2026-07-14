import { useState, useEffect, useCallback } from 'react';

/**
 * useMatchSession - Local-first P2P Match State Hook
 * Handles score tracking, timing, and ephemeral state for a match.
 */
export const useMatchSession = (sportId) => {
  const [matchId, setMatchId] = useState(null);
  const [score, setScore] = useState({ home: 0, away: 0 });
  const [status, setStatus] = useState('idle'); // idle, live, paused, finished
  const [timer, setTimer] = useState(0);
  const [history, setHistory] = useState([]);
  const [lastSync, setLastSync] = useState(null);

  // Periodic Sync Logic (Simulating P2P scaling)
  useEffect(() => {
    if (status !== 'live' || !matchId) return;

    const syncInterval = setInterval(() => {
      pushSnapshot();
    }, 10000); // Sync every 10 seconds as requested for scaling

    return () => clearInterval(syncInterval);
  }, [status, matchId, score, timer]);

  const pushSnapshot = useCallback(async () => {
    const snapshot = {
      matchId,
      score,
      timer,
      timestamp: new Date().toISOString(),
      sportId
    };

    try {
      // Simulate P2P push to relay/server
      // await api.post('/matches/sync', snapshot);
      console.log(`[P2P Sync] Snapshot pushed for ${matchId}:`, snapshot);
      setLastSync(new Date().toLocaleTimeString());
    } catch (e) {
      console.error("Sync failed", e);
    }
  }, [matchId, score, timer, sportId]);

  // Generate a random P2P Match Token
  const createSession = useCallback(() => {
    const token = Math.random().toString(36).substring(2, 6).toUpperCase();
    setMatchId(token);
    setStatus('live');
    setScore({ home: 0, away: 0 });
    setTimer(0);
    setHistory([{ type: 'session_start', timestamp: new Date().toISOString() }]);
    
    // Save to local storage (Host Device is the Source of Truth)
    localStorage.setItem(`host_match_${token}`, JSON.stringify({
      sportId,
      score: { home: 0, away: 0 },
      status: 'live',
      timestamp: new Date().toISOString()
    }));
    
    return token;
  }, [sportId]);


  const updateScore = useCallback((team, amount) => {
    setScore(prev => {
      const newScore = { ...prev, [team]: Math.max(0, prev[team] + amount) };
      
      // Update history
      setHistory(h => [...h, {
        type: 'score_update',
        team,
        delta: amount,
        newScore,
        timestamp: new Date().toISOString()
      }]);

      return newScore;
    });
  }, []);

  const endSession = useCallback(() => {
    setStatus('finished');
    // Here we would typically prepare the "Result Bundle" for backend sync
    const result = {
      matchId,
      sportId,
      finalScore: score,
      duration: timer,
      timestamp: new Date().toISOString()
    };
    console.log('Match Finished - Result Ready for Sync:', result);
    return result;
  }, [matchId, score, timer, sportId]);

  return {
    matchId,
    score,
    status,
    timer,
    history,
    lastSync,
    createSession,
    updateScore,
    pushSnapshot,
    endSession,
    setTimer
  };
};
