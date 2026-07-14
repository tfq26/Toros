import React, { useState } from 'react';
import { 
  Trophy, 
  Users, 
  Settings, 
  Plus, 
  Globe, 
  Wifi, 
  ShieldCheck,
  ChevronRight,
  Search,
  Bell,
  LayoutDashboard,
  Calendar,
  BarChart3,
  UserCircle,
  HelpCircle,
  LogOut,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';
import { SPORTS } from './config/sports';
import { cn } from './lib/utils';
import { Card, CardContent } from './components/ui/card';
import Scoreboard from './features/match/Scoreboard';

const App = () => {
  const [selectedSport, setSelectedSport] = useState(SPORTS[0]);
  const [isHosting, setIsHosting] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 overflow-hidden font-sans transition-colors duration-300">
      
      {/* 1. Icon Rail (Primary Sidebar) */}
      <aside className="w-16 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col items-center py-6 gap-8 z-30 transition-colors">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Trophy className="w-6 h-6" />
        </div>
        
        <nav className="flex flex-col gap-6 flex-1 text-slate-400 dark:text-zinc-500">
          <LayoutDashboard className="w-6 h-6 text-primary cursor-pointer" />
          <Calendar className="w-6 h-6 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer transition-colors" />
          <BarChart3 className="w-6 h-6 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer transition-colors" />
          <Users className="w-6 h-6 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer transition-colors" />
          <Globe className="w-6 h-6 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer transition-colors" />
        </nav>

        <div className="flex flex-col gap-6 text-slate-400 dark:text-zinc-500 pb-2">
          <button onClick={toggleTheme} className="hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">
            {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
          <HelpCircle className="w-6 h-6 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer" />
          <Settings className="w-6 h-6 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer" />
          <UserCircle className="w-6 h-6 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer" />
        </div>
      </aside>


      {/* 2. Context Sidebar (Secondary Sidebar) */}
      <aside className="w-64 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col z-20 transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-zinc-800">
          <h2 className="text-xl font-bold tracking-tight">Dashboard</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-6 mb-8">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4">
              <span>Your Tournaments</span>
              <Plus className="w-3 h-3 cursor-pointer hover:text-primary" />
            </div>
            <div className="space-y-1">
              {['Champions League', 'Local Open', 'Weekend Bash'].map((t, i) => (
                <button
                  key={i}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    i === 0 ? "bg-primary/5 text-primary" : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-current rounded-full opacity-40" />
                    <span>{t}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 mb-8">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4">
              <span>Your Matches</span>
            </div>
            <div className="space-y-1">
              {['Semi-Final A', 'Quarter B'].map((m, i) => (
                <button key={i} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800">
                  <Wifi className="w-3 h-3 opacity-40" />
                  <span>{m}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-6">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4">
              <span>Tournament List</span>
            </div>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800">
                <Globe className="w-3 h-3 opacity-40" />
                <span>Explore Global</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              TA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">Taufeeq Ali</p>
              <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium truncate">Director Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 3. Main Dashboard Area */}
      <main className="flex-1 flex flex-col bg-slate-50/50 dark:bg-zinc-950/50 overflow-hidden transition-colors">
        {/* Minimal Header */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-8 z-10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-slate-100 dark:bg-zinc-800 border-none rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-900 dark:text-zinc-100"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-zinc-800 mx-2" />
            <button 
              className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              onClick={() => setIsHosting(true)}
            >
              Start P2P Match
            </button>
          </div>
        </header>


        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Minimal Title Section */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{selectedSport.name} Overview</p>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">Current Tournament Status</h2>
              </div>
              <button className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-zinc-500 hover:text-primary dark:hover:text-primary transition-colors">
                View History <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Active Matches', value: '12', color: 'bg-primary' },
                { label: 'Players Checked In', value: '84', color: 'bg-blue-500' },
                { label: 'Completion', value: '65%', color: 'bg-amber-500' },
                { label: 'P2P Nodes', value: '4', color: 'bg-indigo-500' },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm dark:bg-zinc-900 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-zinc-100">{stat.value}</p>
                    <div className={cn("h-1 w-8 rounded-full mt-3", stat.color)} />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Primary Action: Live Scoreboard */}
            <section>
              <Card className="border-none shadow-sm dark:bg-zinc-900 overflow-hidden">
                <div className="px-8 py-4 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Active Match Control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 dark:text-zinc-600 font-mono">NODE_TX_902</span>
                  </div>
                </div>
                <CardContent className="p-10">
                  <Scoreboard sport={selectedSport} />
                </CardContent>
              </Card>
            </section>

          </div>
        </div>
      </main>

      {/* Hosting Modal (Simplified) */}
      {isHosting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px]" onClick={() => setIsHosting(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-zinc-100">Host Local Match</h3>
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-100 dark:border-zinc-800">
                <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase mb-2">Access Token</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-mono font-black tracking-widest text-primary">TX-902</span>
                  <button className="text-[10px] font-bold bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-1 rounded-full uppercase">Copy</button>
                </div>
              </div>
              <button 
                className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:brightness-110 shadow-lg shadow-primary/20 transition-all uppercase tracking-widest"
                onClick={() => setIsHosting(false)}
              >
                Launch Session
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
