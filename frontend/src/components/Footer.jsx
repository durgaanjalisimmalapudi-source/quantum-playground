import React from 'react';
import { Atom, ShieldCheck, Heart, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-navy-950 text-slate-400 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">Quantum Playground</span>
              <p className="text-[11px] text-slate-400">
                Explore Quantum. Experiment Freely. Understand the Future.
              </p>
            </div>
          </div>

          {/* Expo and Category */}
          <div className="text-center md:text-right">
            <div className="font-semibold text-slate-300">QExpo 2026 Exhibition</div>
            <div className="text-[11px] text-violet-400">Category: Quantum Education & Outreach</div>
          </div>
        </div>

        {/* Scientific Transparency & Local Simulation Statement */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center space-x-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Scientific Simulation Notice:</strong> All quantum circuit simulations and finite-shot measurements run locally using 
              <code className="bg-black/50 px-1 py-0.5 rounded text-cyan-300 font-mono ml-1">Qiskit</code> and 
              <code className="bg-black/50 px-1 py-0.5 rounded text-cyan-300 font-mono ml-1">Qiskit Aer (AerSimulator)</code>. 
              No measurement results are hardcoded, and the system does not fake a physical QPU connection.
            </span>
          </div>
          <span className="shrink-0 font-mono text-slate-400">
            Python 3.12 • Qiskit 1.4+
          </span>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900 text-slate-400 text-[11px]">
          <div>
            © 2026 Quantum Playground Team • Undergraduate AI & ML Exhibition Project
          </div>
          <div className="flex items-center space-x-1">
            <span>Built with precision for QExpo 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
