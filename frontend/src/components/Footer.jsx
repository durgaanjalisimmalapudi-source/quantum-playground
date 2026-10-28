import React from 'react';
import { Atom, ShieldCheck, Heart, Sparkles, Cpu, Trophy } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Atom className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  Quantum Quest: The Quantum Circuit Adventure
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono font-bold">
                  QExpo 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                “Learn Quantum. Build Circuits. Master the Quantum Universe!” • The Quantum Playground
              </p>
            </div>
          </div>

          {/* Expo and Problem Statement */}
          <div className="text-center md:text-right">
            <div className="font-semibold text-slate-200">QExpo 2026 Hackathon</div>
            <div className="text-[11px] text-cyan-400">
              Problem: Quantum Circuits: Single & Multi-Qubit Operations, Design & Simulation
            </div>
          </div>
        </div>

        {/* Scientific Transparency & Local Simulation Statement */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] leading-relaxed">
          <div className="flex items-center space-x-2.5 text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Scientific Simulation Notice:</strong> Quantum statevectors and finite-shot measurements run using{' '}
              <code className="bg-black/50 px-1 py-0.5 rounded text-cyan-300 font-mono">Qiskit</code> and{' '}
              <code className="bg-black/50 px-1 py-0.5 rounded text-cyan-300 font-mono">Qiskit Aer (AerSimulator)</code> on Python 3.12, with a high-fidelity pure-math client engine fallback. No measurement distributions or statevectors are hardcoded or faked.
            </span>
          </div>
          <span className="shrink-0 font-mono text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-500/30">
            Qiskit 1.4+ • Aer 0.16+
          </span>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900 text-slate-500 text-[11px]">
          <div>
            © 2026 Quantum Quest @ Quantum Playground Team • QExpo 2026 Hackathon Entry
          </div>
          <div className="flex items-center space-x-2 text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gamified Interactive Quantum Computing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
