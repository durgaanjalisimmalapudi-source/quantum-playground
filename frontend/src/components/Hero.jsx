import React from 'react';
import { Atom, Radio, Layers, HelpCircle, ArrowRight, Sparkles, CheckCircle2, Cpu, BookOpen, ShieldCheck } from 'lucide-react';

export default function Hero({ onSelectModule, onOpenPresentation }) {
  const cards = [
    {
      id: 'qubit',
      title: 'Module 1: Qubit Explorer',
      badge: 'Basis & Superposition',
      desc: 'Explore computational basis states |0⟩ and |1⟩, Hadamard superpositions |+⟩ and |−⟩, probability amplitudes, and quantum state collapse.',
      icon: Atom,
      color: 'from-cyan-500 to-blue-600',
      border: 'border-cyan-500/30',
      shadow: 'hover:shadow-glow-cyan',
    },
    {
      id: 'gate',
      title: 'Module 2: Quantum Gate Lab',
      badge: 'Circuit Construction',
      desc: 'Build single-qubit quantum circuits with Pauli-X and Hadamard gates. Experiment with quantum interference sequences (X→X, X→H, H→H, H→X).',
      icon: Layers,
      color: 'from-violet-500 to-indigo-600',
      border: 'border-violet-500/30',
      shadow: 'hover:shadow-glow-violet',
    },
    {
      id: 'entanglement',
      title: 'Module 3: Entanglement Explorer',
      badge: 'Two-Qubit Bell States',
      desc: 'Prepare the 4 canonical Bell pairs (|Φ+⟩, |Φ−⟩, |Ψ+⟩, |Ψ−⟩). Observe instantaneous measurement correlations and examine Bell inequality fundamentals.',
      icon: Radio,
      color: 'from-fuchsia-500 to-pink-600',
      border: 'border-fuchsia-500/30',
      shadow: 'hover:shadow-glow-violet',
    },
    {
      id: 'quiz',
      title: 'Module 4: Quiz Arena',
      badge: 'Knowledge Verification',
      desc: 'Test your grasp of quantum computing fundamentals, gates, statevectors, Born’s rule, and Qiskit simulation through 12 interactive questions.',
      icon: HelpCircle,
      color: 'from-emerald-500 to-teal-600',
      border: 'border-emerald-500/30',
      shadow: 'hover:shadow-glow-blue',
    },
  ];

  return (
    <div className="relative overflow-hidden py-12 md:py-16">
      {/* Background Quantum Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Category & Expo Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-950/80 border border-violet-500/40 text-violet-300">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>QExpo 2026 Project</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Category: Quantum Education & Outreach</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 font-mono">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Powered by Qiskit & Aer</span>
          </span>
        </div>

        {/* Hero Title & Tagline */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4">
            Quantum <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400">Playground</span>
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-slate-300 tracking-wide mb-6">
            Explore Quantum. Experiment Freely. Understand the Future.
          </p>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto">
            Quantum computing harnesses the strange laws of quantum mechanics—such as <strong className="text-cyan-300">superposition</strong>, <strong className="text-violet-300">quantum interference</strong>, and <strong className="text-fuchsia-300">entanglement</strong>—to process information in ways fundamentally impossible for classical computers. 
            Quantum Playground lets you inspect mathematical statevectors, run genuine Qiskit simulations, and witness quantum state collapse in real time.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={() => onSelectModule('qubit')}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
            >
              <span>Start Experimenting</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenPresentation}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-violet-300 border border-violet-500/40 font-bold text-sm shadow-md transition-all hover:border-violet-400"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Launch Expo Presentation Mode</span>
            </button>
          </div>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 mb-16">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onSelectModule(card.id)}
                className={`group cursor-pointer glass-panel p-6 rounded-2xl border ${card.border} ${card.shadow} transition-all duration-300 flex flex-col justify-between hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300">
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
                  <span>Launch Experiment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Learning Outcomes Banner */}
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 mb-12">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Key Educational Outcomes for Students & Expo Visitors</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <h4 className="font-semibold text-cyan-300 mb-1.5">1. Classical vs. Quantum Information</h4>
              <p className="text-slate-400 leading-relaxed">
                Understand how qubits differ from classical binary bits through linear combinations of basis vectors, complex probability amplitudes, and the Born rule.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <h4 className="font-semibold text-violet-300 mb-1.5">2. Quantum Interference & Phase</h4>
              <p className="text-slate-400 leading-relaxed">
                Discover why relative phase matters: see how |+⟩ and |−⟩ yield identical 50/50 Z-basis measurement probabilities, yet interfere differently under gate operations.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <h4 className="font-semibold text-fuchsia-300 mb-1.5">3. Entanglement & Non-Locality</h4>
              <p className="text-slate-400 leading-relaxed">
                Explore non-separable two-qubit Bell states, distinguish real quantum correlations from classical shared randomness, and learn why Bell tests require non-orthogonal bases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
