import React from 'react';
import { Atom, Radio, Sparkles, Activity, Layers, HelpCircle, MonitorPlay, Wifi, WifiOff } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  isBackendHealthy,
  onCheckHealth,
  presentationMode,
  setPresentationMode,
}) {
  const navItems = [
    { id: 'qubit', label: '1. Qubit Explorer', icon: Atom },
    { id: 'gate', label: '2. Quantum Gate Lab', icon: Layers },
    { id: 'entanglement', label: '3. Entanglement Explorer', icon: Radio },
    { id: 'quiz', label: '4. Quiz Arena', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('hero')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 shadow-glow-cyan">
            <Atom className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight">Quantum Playground</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-mono">
                QExpo '26
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 font-medium">Qiskit Simulation Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id && !presentationMode;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setPresentationMode(false);
                  setActiveTab(item.id);
                }}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions & Health Status */}
        <div className="flex items-center space-x-3">
          {/* Health Indicator */}
          <button
            onClick={onCheckHealth}
            title={isBackendHealthy ? 'Qiskit Aer Simulator Connected' : 'Backend Disconnected - Click to retry'}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono transition-all border ${
              isBackendHealthy
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-400 animate-pulse'
            }`}
          >
            {isBackendHealthy ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Qiskit Aer Active</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Backend Offline</span>
              </>
            )}
          </button>

          {/* Presentation Mode Button */}
          <button
            onClick={() => setPresentationMode(!presentationMode)}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
              presentationMode
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white ring-2 ring-violet-400 shadow-glow-violet'
                : 'bg-slate-800 hover:bg-slate-700 text-violet-300 border border-violet-500/30'
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>{presentationMode ? 'Exit Presentation' : 'Expo Mode'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
