import React from 'react';
import {
  Atom,
  Radio,
  Layers,
  HelpCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  BookOpen,
  Compass,
  Trophy,
  Play,
  Zap,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import QuantumBackground from './QuantumBackground';

export default function Hero({
  onSelectModule,
  onOpenTour,
  onOpenPresentation,
  onOpenStudentModal,
  currentStudent,
}) {
  const cards = [
    {
      id: 'missions',
      title: 'Learning Missions',
      badge: 'Levels 1 – 7',
      desc: 'Embark on a level-based gaming journey from basic qubits to advanced quantum circuit architecture.',
      icon: Trophy,
      color: 'from-amber-500 to-rose-600',
      border: 'border-amber-500/30',
      shadow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    },
    {
      id: 'gate',
      title: 'Quantum Lab & Gate Library',
      badge: '13 Quantum Gates',
      desc: 'Interactive encyclopedia: Pauli matrices (X, Y, Z), Hadamard, S, T, continuous rotations (RX, RY, RZ), and CNOT.',
      icon: BookOpen,
      color: 'from-indigo-500 to-purple-600',
      border: 'border-indigo-500/30',
      shadow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]',
    },
    {
      id: 'circuit',
      title: 'Circuit Simulator',
      badge: 'Drag & Drop Builder',
      desc: 'Build multi-qubit circuits (1–4 wires), inspect step-by-step statevectors, and run finite-shot simulations on Qiskit Aer.',
      icon: Cpu,
      color: 'from-pink-500 to-fuchsia-600',
      border: 'border-pink-500/30',
      shadow: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]',
    },
    {
      id: 'bloch',
      title: '3D Bloch Sphere',
      badge: 'Interactive Canvas 3D',
      desc: 'Orbit in 3D, apply gates to watch spherical statevector trajectories, and learn global vs relative phase.',
      icon: Compass,
      color: 'from-cyan-500 to-teal-600',
      border: 'border-cyan-500/30',
      shadow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    },
    {
      id: 'bell',
      title: 'Bell States Explorer',
      badge: 'Quantum Entanglement',
      desc: 'Explore all 4 Bell states (|Φ+⟩, |Φ−⟩, |Ψ+⟩, |Ψ−⟩), rotate measurement bases, and study the No-Signaling theorem.',
      icon: Zap,
      color: 'from-purple-500 to-indigo-600',
      border: 'border-purple-500/30',
      shadow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    },
    {
      id: 'challenges',
      title: 'Challenges & Leaderboard',
      badge: 'Daily & Timed Sprints',
      desc: 'Solve the daily quantum puzzle, beat the 60-second speedrun, earn badges, and climb the QExpo 2026 leaderboard.',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-600',
      border: 'border-emerald-500/30',
      shadow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    },
  ];

  return (
    <div className="relative overflow-hidden py-12 md:py-16">
      {/* State-of-the-art Interactive Quantum Canvas Background */}
      <QuantumBackground interactive={true} particleCount={60} showSymbols={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Interactive Quantum Field Indicator */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold">Interactive Quantum Field</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden sm:inline">Move cursor to perturb wavepacket</span>
          </div>
        </div>

        {/* Category & Expo Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-950/80 border border-violet-500/40 text-violet-300">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>QExpo 2026 Hackathon Official Entry</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Theme: Quantum Circuits & Simulation</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 font-mono">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Powered by Qiskit Aer Engine</span>
          </span>
        </div>

        {/* Hero Title & Tagline */}
        <div className="text-center max-w-4xl mx-auto mb-10 px-2 sm:px-0">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-3">
            Quantum <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500">Quest</span>
          </h1>
          <div className="text-[11px] sm:text-sm font-mono uppercase tracking-widest text-cyan-400 mb-3 sm:mb-4">
            The Quantum Circuit Adventure • The Quantum Playground
          </div>

          <p className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-200 to-slate-200 tracking-wide mb-4 sm:mb-5">
            “Learn Quantum. Build Circuits. Master the Quantum Universe!”
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Step into an educational quantum computing gaming platform. From preparing your first superposition in the <strong className="text-cyan-300">Qubit Explorer</strong>, to commanding the <strong className="text-purple-300">3D Bloch Sphere</strong>, constructing multi-qubit algorithms in the <strong className="text-pink-300">Circuit Designer</strong>, and unraveling spooky action in the <strong className="text-emerald-300">Bell States Explorer</strong>.
          </p>

          {/* Action CTAs (Full-width on mobile, row on tablet/desktop) */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button
              onClick={() => {
                sounds.playVictory();
                onSelectModule('missions');
              }}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform hover:-translate-y-0.5 min-h-[44px]"
            >
              <Trophy className="w-4 h-4" />
              <span>Start Adventure (Level 1)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sounds.playGateClick(500);
                onSelectModule('gate');
              }}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-sm shadow-md transition-all hover:border-cyan-400 min-h-[44px]"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Explore Quantum Lab</span>
            </button>

            <button
              onClick={() => {
                sounds.playGateClick(600);
                onOpenTour();
              }}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-purple-950/80 hover:bg-purple-900/90 text-purple-200 border border-purple-500/50 font-bold text-sm shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Judge Demo Tour (7 Steps)</span>
            </button>
          </div>

          {/* Expo Student Player Interactive Bar */}
          <div className="mt-8 max-w-2xl mx-auto p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentStudent?.avatar || '🎓'}</span>
              <div className="text-left">
                <span className="text-[11px] text-slate-400 block font-mono">QExpo '26 Student Terminal</span>
                <span className="font-bold text-cyan-300 text-sm">
                  {currentStudent?.name || 'Student Explorer'}
                </span>
                {currentStudent?.school && (
                  <span className="text-[11px] text-slate-400 font-mono ml-1.5">
                    • {currentStudent.school}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playGateClick(600);
                  if (onOpenStudentModal) onOpenStudentModal();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow transition transform hover:scale-[1.02]"
              >
                👤 Switch / Next Student
              </button>
              <button
                onClick={() => {
                  sounds.playGateClick(500);
                  onSelectModule('challenges');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition flex items-center gap-1"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Leaderboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid (6 Modules) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 mb-16">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => {
                  sounds.playGateClick(550);
                  onSelectModule(card.id);
                }}
                className={`group cursor-pointer p-6 rounded-2xl bg-slate-900/80 border ${card.border} ${card.shadow} transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 backdrop-blur-md`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-950 border border-slate-700 text-slate-300">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {card.desc}
                  </p>
                </div>
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform pt-2 border-t border-slate-800">
                  <span>Open Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
