import React from 'react';
import { useMatchSession } from '../../hooks/useMatchSession';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Plus, Minus, Trophy, Share2, Timer as ClockIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

const Scoreboard = ({ sport }) => {
    status, 
    updateScore, 
    createSession, 
    endSession,
    lastSync,
    pushSnapshot
  } = useMatchSession(sport.id);

  if (!matchId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50/50 dark:bg-zinc-950/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-zinc-800">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
          <Trophy className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-zinc-100">Initialize Host Session</h3>
        <p className="text-slate-500 dark:text-zinc-500 mb-8 text-center max-w-sm text-sm">
          Act as the host for this {sport.name} match. Participants will sync periodically with your device.
        </p>
        <Button size="lg" onClick={createSession} className="font-bold px-10 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-95">
          Start Local Host
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20 uppercase tracking-widest">
            Host Active
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-600 uppercase">Token: {matchId}</span>
            {lastSync && (
              <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-tighter">
                Last P2P Sync: {lastSync}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={pushSnapshot} className="h-8 gap-2 text-[10px] font-bold text-slate-400 dark:text-zinc-500 hover:text-primary transition-colors uppercase tracking-widest">
            <Wifi className="w-3 h-3" /> Sync Now
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-2 text-slate-400 dark:text-zinc-500">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>


      {/* Main Score Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        {/* Home Team */}
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-inner">
            <span className="text-3xl font-black text-slate-300">H</span>
          </div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Home Team</h4>
          <div className="flex flex-col items-center gap-4">
            <span className="text-8xl font-black tracking-tighter text-slate-900">{score.home}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => updateScore('home', -1)} className="rounded-full border-slate-200">
                <Minus className="w-3 h-3" />
              </Button>
              <Button variant="secondary" size="sm" onClick={() => updateScore('home', 1)} className="rounded-full bg-slate-100 font-bold px-4">
                <Plus className="w-3 h-3 mr-1" /> Point
              </Button>
            </div>
          </div>
        </div>

        {/* Center Info */}
        <div className="flex flex-col items-center gap-8 py-8 md:py-0 border-y md:border-y-0 md:border-x border-slate-100">
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <ClockIcon className="w-8 h-8 text-slate-300" />
            </div>
            <span className="text-5xl font-mono font-bold tracking-widest text-slate-900">12:45</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Quarter 1</span>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest leading-relaxed max-w-[120px]">
              {sport.rules}
            </p>
          </div>
        </div>

        {/* Away Team */}
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-primary/5 rounded-full flex items-center justify-center border border-primary/10 shadow-inner">
            <span className="text-3xl font-black text-primary/40">A</span>
          </div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Away Team</h4>
          <div className="flex flex-col items-center gap-4">
            <span className="text-8xl font-black tracking-tighter text-slate-900">{score.away}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => updateScore('away', -1)} className="rounded-full border-slate-200">
                <Minus className="w-3 h-3" />
              </Button>
              <Button variant="secondary" size="sm" onClick={() => updateScore('away', 1)} className="rounded-full bg-slate-100 font-bold px-4">
                <Plus className="w-3 h-3 mr-1" /> Point
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 pt-12">
        <Button variant="outline" onClick={() => endSession()} className="rounded-full px-10 font-bold uppercase text-[10px] tracking-widest border-red-100 text-red-500 hover:bg-red-50">
          End Session
        </Button>
      </div>
    </div>
  );
};


export default Scoreboard;
