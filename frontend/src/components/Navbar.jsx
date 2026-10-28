import React, { useState } from 'react';
import {
  Atom,
  Radio,
  Sparkles,
  Layers,
  HelpCircle,
  MonitorPlay,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Compass,
  Trophy,
  Cpu,
  BookOpen,
  Menu,
  X,
  Award,
  UserPlus,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function Navbar({
  activeTab,
  setActiveTab,
  isBackendHealthy,
  onCheckHealth,
  onOpenTour,
  onOpenCertificate,
  onOpenStudentModal,
  currentStudent = { name: 'Player' },
  playerLevel = 1,
  playerXp = 0,
}) {
  const [isMuted, setIsMuted] = useState(sounds.isMuted);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home', icon: Atom },
    { id: 'missions', label: 'Learning Missions', icon: Trophy },
    { id: 'gate', label: 'Quantum Lab', icon: BookOpen },
    { id: 'circuit', label: 'Circuit Simulator', icon: Cpu },
    { id: 'bloch', label: 'Bloch Sphere', icon: Compass },
    { id: 'bell', label: 'Bell States', icon: Radio },
    { id: 'challenges', label: 'Challenges & Ranks', icon: Sparkles },
  ];

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const handleSelectTab = (id) => {
    sounds.playGateClick(500);
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div
          className="flex items-center space-x-2.5 cursor-pointer shrink-0"
          onClick={() => handleSelectTab('hero')}
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Atom className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-base text-white tracking-tight">
                Quantum Quest
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono font-bold">
                QExpo '26
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 font-medium">
              The Quantum Playground
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden xl:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Sound Mute/Unmute */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl text-xs border transition ${
              isMuted
                ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            }`}
            title={isMuted ? 'Sound Muted (Click to enable audio)' : 'Sound Enabled (Click to mute)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Active Student Player / Switch CTA */}
          <button
            onClick={onOpenStudentModal}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-[0_0_12px_rgba(6,182,212,0.15)] transition"
            title="Switch student player or register a new student for QExpo 2026"
          >
            <span className="text-sm">{currentStudent?.avatar || '👤'}</span>
            <span className="font-bold max-w-[90px] sm:max-w-[110px] truncate">
              {currentStudent?.name || 'New Player'}
            </span>
            <UserPlus className="w-3 h-3 text-cyan-400 hidden sm:inline" />
          </button>

          {/* XP Badge */}
          <div
            onClick={() => handleSelectTab('challenges')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-amber-500/40 transition"
            title="Your current player rank and XP points"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-mono font-bold text-slate-200">
              Lv.{playerLevel} • {playerXp}XP
            </span>
          </div>

          {/* Judge Demo Tour CTA */}
          <button
            onClick={onOpenTour}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 transition-all"
            title="Launch guided 7-step walkthrough for QExpo 2026 judges"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span className="hidden sm:inline">Judge Tour</span>
          </button>

          {/* Backend Status Indicator */}
          <button
            onClick={onCheckHealth}
            title={
              isBackendHealthy
                ? 'Backend: Connected to Qiskit & Qiskit Aer'
                : 'Backend Offline: Using High-Fidelity Client-Side Quantum Engine'
            }
            className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono transition border ${
              isBackendHealthy
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {isBackendHealthy ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px]">Qiskit Aer</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-[11px]">Client Engine</span>
              </>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-950/95 p-4 space-y-2 backdrop-blur-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center space-x-2.5 p-3 rounded-xl text-xs font-semibold text-left transition ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 text-cyan-400" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenTour) onOpenTour();
              }}
              className="w-full flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-cyan-600/30 transition"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Start Judge Walkthrough Demo</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenStudentModal) onOpenStudentModal();
              }}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-cyan-300 font-semibold"
            >
              <div className="flex items-center gap-2">
                <span>{currentStudent?.avatar || '👤'}</span>
                <span>Playing as: {currentStudent?.name || 'New Player'}</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold underline">Switch</span>
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCertificate();
                }}
                className="text-xs text-amber-400 font-bold flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                Claim Certificate
              </button>
              <span className="text-xs font-mono text-slate-500">
                Lv.{playerLevel} • {playerXp}XP
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
