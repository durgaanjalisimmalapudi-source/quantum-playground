import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, Download, Printer, X, Sparkles, ShieldCheck, Trophy, School } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function QuantumCertificate({
  playerName = 'Quantum Explorer',
  playerSchool = '',
  playerXp = 1450,
  playerLevel = 7,
  playerRank = null,
  onClose = null,
}) {
  const [name, setName] = useState(playerName);
  const [school, setSchool] = useState(playerSchool);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setName(playerName);
    setSchool(playerSchool);
  }, [playerName, playerSchool]);

  const certId = `QEXPO-2026-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    sounds.playVictory();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-950 border-2 border-amber-500/50 rounded-3xl p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center text-slate-100 overflow-hidden">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Certificate Ornamental Background Border */}
        <div className="absolute inset-2 border border-amber-500/20 rounded-2xl pointer-events-none" />

        {/* Header Ribbon */}
        <div className="flex flex-col items-center justify-center space-y-2 mb-4">
          <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            QExpo 2026 Official Hackathon Certificate
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 pt-2">
            QUANTUM MASTER CERTIFICATE
          </h1>
          <p className="text-xs text-slate-400 font-sans tracking-wide">
            Quantum Computing: Single-Qubit & Multi-Qubit Circuit Design & Simulation
          </p>
        </div>

        {/* Recipient */}
        <div className="my-5 space-y-2">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">
            This is proudly awarded to
          </span>
          <div className="flex flex-col items-center justify-center gap-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Student Name"
                  className="bg-slate-900 border border-amber-500 text-2xl font-serif text-amber-300 px-4 py-1 rounded-lg text-center font-bold outline-none"
                />
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="School / Organization"
                  className="bg-slate-900 border border-slate-700 text-sm font-sans text-slate-300 px-3 py-1 rounded-lg text-center outline-none block mx-auto"
                />
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-bold"
                >
                  Save Name
                </button>
              </div>
            ) : (
              <div onClick={() => setIsEditing(true)} className="cursor-pointer group">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300 group-hover:underline decoration-amber-500/50">
                  {name} ✏️
                </h2>
                {school && (
                  <p className="text-xs text-slate-400 font-sans mt-0.5 flex items-center justify-center gap-1">
                    <School className="w-3 h-3 text-amber-400/70" />
                    <span>{school}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Achievement Pills */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
              Level {playerLevel} • {playerXp} XP
            </span>
            {playerRank && (
              <span className="px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1">
                <Trophy className="w-3 h-3 text-cyan-400" />
                Leaderboard Rank #{playerRank}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed pt-2">
            for successfully mastering quantum superposition, Pauli transformations, the 3D Bloch sphere, Bell-state entanglement, and designing multi-qubit quantum circuits verified on <strong>Qiskit Aer</strong>.
          </p>
        </div>

        {/* Signatures & Credentials Grid */}
        <div className="grid grid-cols-3 gap-4 pt-5 my-5 border-t border-slate-800/80 text-xs font-mono">
          <div className="text-left space-y-1">
            <span className="text-slate-500 block text-[10px]">ISSUED DATE:</span>
            <span className="text-slate-200 font-semibold">{currentDate}</span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
            <span className="text-[10px] text-amber-300 font-bold tracking-wider">
              VERIFIED SIMULATION
            </span>
          </div>

          <div className="text-right space-y-1">
            <span className="text-slate-500 block text-[10px]">CERTIFICATE ID:</span>
            <span className="text-slate-200 font-mono text-[11px] font-bold">{certId}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30 transition"
          >
            <Printer className="w-4 h-4" />
            Print / Save Certificate PDF
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Back to Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
