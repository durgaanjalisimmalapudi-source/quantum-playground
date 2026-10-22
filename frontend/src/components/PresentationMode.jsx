import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  MonitorPlay,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  MessageSquare,
  Award,
  CheckCircle2,
  Atom,
  Radio,
  Layers,
  Terminal,
} from 'lucide-react';

export default function PresentationMode({ onClose }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [liveSimData, setLiveSimData] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [showJudgeScript, setShowJudgeScript] = useState(true);

  const slides = [
    {
      id: 'intro',
      title: 'QExpo 2026 Presentation: Quantum Playground',
      category: 'Quantum Education & Outreach Category',
      subtitle: 'Explore Quantum. Experiment Freely. Understand the Future.',
      equations: ['|ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1', '|Φ+⟩ = (|00⟩ + |11⟩)/√2'],
      talkingPoints: [
        'Built by a team of two undergraduate AI & ML students to bridge abstract quantum theory and hands-on simulation.',
        'Runs real Qiskit 1.4+ and Qiskit Aer simulation on the backend—zero hardcoded or faked data.',
        'Demonstrates computational basis states, superposition, unitary interference, and Bell entanglement with mathematical precision.',
      ],
      script:
        '“Good morning esteemed judges! We are a team of two undergraduate AI & ML students presenting Quantum Playground. We built this full-stack platform to solve a core problem in quantum education: quantum mechanics is often taught purely as abstract linear algebra, while hardware is intimidating. Quantum Playground lets any student or judge run genuine Qiskit circuits, observe finite-shot measurement collapse, and see quantum interference in action.”',
    },
    {
      id: 'qubit',
      title: 'Spotlight 1: Superposition & Phase Invariance',
      category: 'Module 1 — Qubit Explorer',
      subtitle: 'Why |+⟩ and |−⟩ are distinct despite identical 50/50 measurement probabilities',
      equations: [
        '|+⟩ = (|0⟩ + |1⟩)/√2 ⇒ P(0) = 50%, P(1) = 50%',
        '|−⟩ = (|0⟩ − |1⟩)/√2 ⇒ P(0) = 50%, P(1) = 50%',
        'Relative Phase: e^(iπ) = −1',
      ],
      talkingPoints: [
        'A single Z-basis measurement cannot distinguish |+⟩ from |−⟩ because Born’s rule squares the amplitude: |+1/√2|² = |−1/√2|² = 0.5.',
        'The difference lies in quantum phase: applying a second Hadamard gate causes constructive vs destructive interference.',
        'H|+⟩ deterministically returns to |0⟩, whereas H|−⟩ flips to |1⟩.',
      ],
      script:
        '“Here in Module 1, we demonstrate one of the most misunderstood concepts in quantum computing. If you measure |+⟩ and |−⟩, both give 50% zeros and 50% ones. Are they the same state? No! They possess an exact 180-degree relative phase difference. In quantum mechanics, phase acts like wave interference—when we apply a second Hadamard gate, the paths cancel or amplify, proving they are completely distinct physical states.”',
      simAction: async () => {
        return api.measureQubit('-', 500);
      },
    },
    {
      id: 'gates',
      title: 'Spotlight 2: Gate Lab & Interference',
      category: 'Module 2 — Quantum Gate Lab',
      subtitle: 'Proving H · H = I (Identity) and X · H = |−⟩',
      equations: [
        'H = (1/√2) [[1, 1], [1, -1]]',
        'X = [[0, 1], [1, 0]]',
        'H · H |0⟩ = I |0⟩ = |0⟩',
      ],
      talkingPoints: [
        'Quantum gates are unitary operators (U†U = I) which preserve vector norm and total probability.',
        'The Hadamard gate is self-inverse: H² = I.',
        'Sequential gate application modifies statevector amplitudes step-by-step.',
      ],
      script:
        '“In Module 2, our Quantum Gate Lab, students construct arbitrary gate pipelines. Let’s run H followed by H on state |0⟩. Classical intuition might expect repeated randomization. But because Hadamard is unitary and self-inverse, the probability waves for state |1⟩ undergo complete destructive cancellation, returning the qubit to |0⟩ with 100% certainty.”',
      simAction: async () => {
        return api.runCircuit({ initialState: '0', gates: ['H', 'H'], shots: 500, measure: true });
      },
    },
    {
      id: 'entanglement',
      title: 'Spotlight 3: Bell State Entanglement',
      category: 'Module 3 — Entanglement Explorer',
      subtitle: 'Simulating |Φ+⟩ = (|00⟩ + |11⟩)/√2 with Qiskit CX Gate',
      equations: [
        '|Φ+⟩ = (|00⟩ + |11⟩)/√2',
        'CX (H ⊗ I)|00⟩ = CX ((|00⟩ + |10⟩)/√2) = (|00⟩ + |11⟩)/√2',
        'P(00) = 50%, P(11) = 50%, P(01) = 0%, P(10) = 0%',
      ],
      talkingPoints: [
        'Entangled states cannot be factored into product states: |ψ⟩ ≠ |q₁⟩ ⊗ |q₀⟩.',
        'Measurement of qubit 0 instantaneously predicts qubit 1 with 100% correlation.',
        'Verified using Qiskit Aer with 1000 finite shots: 01 and 10 never appear in ideal simulation.',
      ],
      script:
        '“Module 3 explores quantum entanglement, famously termed ‘spooky action at a distance’ by Einstein. We prepare the canonical Bell pair |Φ+⟩ using Hadamard on qubit 0 and a CNOT onto qubit 1. Notice the live 1000-shot Qiskit Aer simulation: exactly ~50% 00 and ~50% 11, with exactly 0 counts for 01 or 10. The state of each individual qubit does not exist independently of the joint pair.”',
      simAction: async () => {
        return api.measureBell('phi_plus', 1000);
      },
    },
    {
      id: 'integrity',
      title: 'Spotlight 4: Scientific Rigor & Bell Inequality',
      category: 'Scientific Integrity & QExpo Outreach',
      subtitle: 'Why single-basis correlations do not prove Bell inequality violation',
      equations: [
        'Classical Local Hidden Variables: |S| ≤ 2 (CHSH Bound)',
        'Quantum Mechanics: |S| = 2√2 ≈ 2.828 > 2',
      ],
      talkingPoints: [
        'Crucial pedagogical integrity: We explicitly teach students that 50/50 correlation in the computational basis alone does not prove non-locality (classical paired coins could do the same).',
        'True violation requires testing Bell/CHSH inequalities across rotated measurement bases (0°, 45°, 22.5°, 67.5°).',
        'Platform runs offline without cloud dependency, while adhering strictly to Qiskit standards.',
      ],
      script:
        '“Finally, as AI and ML students, scientific integrity is our highest priority. Many educational tools erroneously claim that observing matching 00 and 11 outcomes proves quantum non-locality. We explicitly instruct students that classical correlations—like putting matching socks in two envelopes—can produce identical single-basis data. Genuine quantum non-locality requires testing Bell inequalities across rotated bases, which we detail in our advanced judge notes.”',
    },
  ];

  const currentSlide = slides[activeSlide];

  // Run live simulation for slide if available
  const triggerSlideSim = async () => {
    if (!currentSlide.simAction) return;
    setSimulating(true);
    try {
      const data = await currentSlide.simAction();
      setLiveSimData(data);
    } catch (err) {
      console.error('Sim error in presentation:', err);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    setLiveSimData(null);
    if (currentSlide.simAction) {
      triggerSlideSim();
    }
  }, [activeSlide]);

  return (
    <div className="fixed inset-0 z-50 bg-navy-950 text-slate-100 flex flex-col overflow-y-auto">
      {/* Top Bar for Presentation Mode */}
      <div className="bg-navy-900 border-b border-violet-500/30 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-white shadow-glow-violet">
            <MonitorPlay className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-base">QExpo 2026 Presentation Mode</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-950 border border-violet-500/40 text-violet-300">
                Live Jury View
              </span>
            </div>
            <span className="text-xs text-slate-400">Undergraduate AI & ML Team Project</span>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
            disabled={activeSlide === 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-mono text-sm text-cyan-400 font-bold px-2">
            Slide {activeSlide + 1} / {slides.length}
          </span>
          <button
            onClick={() => setActiveSlide((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={activeSlide === slides.length - 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={onClose}
            className="ml-4 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-semibold border border-rose-500/40 transition"
          >
            <X className="w-4 h-4" />
            <span>Exit Expo Mode</span>
          </button>
        </div>
      </div>

      {/* Main Presentation Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-between gap-8">
        <div>
          {/* Header */}
          <div className="mb-6">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 px-3 py-1 rounded-full bg-violet-950 border border-violet-500/30">
              {currentSlide.category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white mt-3 tracking-tight">
              {currentSlide.title}
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mt-2 font-medium">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Grid Layout: Left Equations & Live Sim (6 Cols), Right Talking Points & Script (6 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Equations & Live Backend Proof */}
            <div className="lg:col-span-6 space-y-6">
              {/* Equations Card */}
              <div className="glass-panel p-6 rounded-2xl border border-violet-500/30">
                <h3 className="text-xs font-mono font-bold text-violet-300 uppercase tracking-wider mb-3">
                  Key Mathematical Equations
                </h3>
                <div className="space-y-2">
                  {currentSlide.equations.map((eq, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-sm sm:text-base text-cyan-300 font-semibold"
                    >
                      {eq}
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Qiskit Simulation Output for Judges */}
              {currentSlide.simAction && (
                <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Terminal className="w-4 h-4" />
                      <span>Live Qiskit Aer Backend Proof</span>
                    </span>
                    <button
                      onClick={triggerSlideSim}
                      disabled={simulating}
                      className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
                      <span>Rerun Simulation for Judges</span>
                    </button>
                  </div>

                  {liveSimData ? (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
                        <span className="text-slate-500 block text-[10px] mb-1">Qiskit Circuit ASCII:</span>
                        <pre className="text-cyan-300 text-xs overflow-x-auto leading-tight">
                          {liveSimData.circuit?.ascii_art}
                        </pre>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
                        <span className="text-slate-500 block text-[10px] mb-1">Finite-Shot Measurement Counts:</span>
                        <div className="flex flex-wrap gap-3 text-cyan-300 font-bold">
                          {Object.entries(liveSimData.counts || {}).map(([k, v]) => (
                            <span key={k} className="px-2 py-1 rounded bg-slate-900 border border-slate-800">
                              |{k}⟩: {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 font-mono py-4 text-center">
                      Simulating on Qiskit Aer...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Talking Points & Spoken Script */}
            <div className="lg:col-span-6 space-y-6">
              {/* Talking Points for Judges */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Key Talking Points for Jury</span>
                </h3>
                <ul className="space-y-3">
                  {currentSlide.talkingPoints.map((tp, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-violet-950 border border-violet-500/40 text-violet-300 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{tp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Spoken Presentation Script */}
              <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/20">
                <h3 className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>60-Second Presenter Script (Verbatim for AI & ML Students)</span>
                </h3>
                <blockquote className="text-xs sm:text-sm text-indigo-100 italic leading-relaxed p-4 rounded-xl bg-black/40 border border-indigo-500/20">
                  {currentSlide.script}
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Slide Navigation Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <span>Project: Quantum Playground</span>
            <span>•</span>
            <span>Category: Quantum Education & Outreach</span>
          </div>

          <div className="flex items-center space-x-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeSlide === i
                    ? 'w-8 bg-cyan-400 shadow-glow-cyan'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
