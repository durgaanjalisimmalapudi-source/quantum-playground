import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Radio,
  ArrowRight,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { api } from '../api/client';
import { sounds } from '../utils/soundEffects';

const BELL_STATES = [
  {
    id: 'phi_plus',
    label: '|Φ+⟩',
    name: 'Phi Plus',
    math: '|Φ+⟩ = (|00⟩ + |11⟩) / √2',
    parity: 'Even (00, 11)',
    phase: '+1 (In-phase)',
    prepCircuit: 'q0: ──[H]──■──\n           │  \nq1: ───────X──',
    localTransformFromPhiPlus: 'Standard canonical Bell state (Identity)',
    summary:
      'The canonical maximally entangled state. Measuring qubit 0 immediately forces qubit 1 to collapse into the exact same value (00 or 11 with 50/50 probability).',
    color: 'from-cyan-500 to-blue-600',
    accentColor: '#06b6d4',
  },
  {
    id: 'phi_minus',
    label: '|Φ−⟩',
    name: 'Phi Minus',
    math: '|Φ−⟩ = (|00⟩ − |11⟩) / √2',
    parity: 'Even (00, 11)',
    phase: '−1 (Phase flip π)',
    prepCircuit: 'q0: ──[H]──[Z]──■──\n                │  \nq1: ────────────X──',
    localTransformFromPhiPlus: 'Apply Pauli-Z to Qubit 0 (or Qubit 1)',
    summary:
      'Even-parity entangled state with a negative relative phase between |00⟩ and |11⟩. In computational Z-basis measurements, it appears identical to |Φ+⟩, but measuring in the X-basis reveals the phase difference!',
    color: 'from-purple-500 to-indigo-600',
    accentColor: '#8b5cf6',
  },
  {
    id: 'psi_plus',
    label: '|Ψ+⟩',
    name: 'Psi Plus',
    math: '|Ψ+⟩ = (|01⟩ + |10⟩) / √2',
    parity: 'Odd (01, 10)',
    phase: '+1 (In-phase)',
    prepCircuit: 'q0: ──[H]──■──\n           │  \nq1: ──[X]──X──',
    localTransformFromPhiPlus: 'Apply Pauli-X to Qubit 1 (or Qubit 0)',
    summary:
      'Anti-correlated Bell state: qubit 0 and qubit 1 always yield opposite measurement outcomes (01 or 10 with 50/50 probability).',
    color: 'from-pink-500 to-rose-600',
    accentColor: '#ec4899',
  },
  {
    id: 'psi_minus',
    label: '|Ψ−⟩',
    name: 'Psi Minus (Singlet)',
    math: '|Ψ−⟩ = (|01⟩ − |10⟩) / √2',
    parity: 'Odd (01, 10)',
    phase: '−1 (Phase flip π)',
    prepCircuit: 'q0: ──[H]──[Z]──■──\n                │  \nq1: ──[X]───────X──',
    localTransformFromPhiPlus: 'Apply Pauli-X then Pauli-Z to Qubit 1',
    summary:
      'The famous Singlet State: completely rotational invariant under all simultaneous basis rotations! It forms the basis of quantum cryptography (E91) and experimental tests of Bell’s Theorem.',
    color: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
  },
];

export default function BellStatesExplorer({ onStateExplored = null }) {
  const [selectedStateId, setSelectedStateId] = useState('phi_plus');
  const [basis, setBasis] = useState('Z'); // 'Z' (computational) or 'X' (Hadamard rotated)
  const [shots, setShots] = useState(1000);
  const [simData, setSimData] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [animPulse, setAnimPulse] = useState(0);

  const activeBell = BELL_STATES.find((b) => b.id === selectedStateId) || BELL_STATES[0];

  // Periodic visual pulse for entanglement connection
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimPulse((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Run Bell state simulation whenever state, basis, or shots change
  useEffect(() => {
    runBellSimulation();
  }, [selectedStateId, basis, shots]);

  const runBellSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await api.measureBell(selectedStateId, shots, basis);
      setSimData(res);
      if (onStateExplored) {
        onStateExplored(selectedStateId);
      }
    } catch (err) {
      console.error('Bell measurement error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const chartData = simData?.counts
    ? Object.entries(simData.counts).map(([bit, count]) => ({
        state: `|${bit}⟩`,
        count,
        prob: Math.round(((simData.frequencies?.[bit] || 0) * 100) * 10) / 10,
      }))
    : [];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-cyan-500/30 p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Zap className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Bell States & Quantum Entanglement Explorer
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Level 5 Mission
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Explore the 4 canonical maximally entangled Bell states, basis-rotation measurements, and the No-Signaling Theorem.
          </p>
        </div>

        {/* Basis Selector Pills */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 px-2">Measurement Basis:</span>
          <button
            onClick={() => {
              sounds.playGateClick(520);
              setBasis('Z');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              basis === 'Z'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Z-Basis [|0⟩, |1⟩]
          </button>
          <button
            onClick={() => {
              sounds.playGateClick(650);
              setBasis('X');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              basis === 'X'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            X-Basis [|+⟩, |−⟩]
          </button>
        </div>
      </div>

      {/* Bell State Selector Cards (4 states) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {BELL_STATES.map((b) => (
          <button
            key={b.id}
            onClick={() => {
              sounds.playEntanglement();
              setSelectedStateId(b.id);
            }}
            className={`p-3.5 rounded-xl border flex flex-col items-start gap-1.5 transition text-left relative overflow-hidden ${
              selectedStateId === b.id
                ? 'bg-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-mono text-lg font-black text-cyan-300">
                {b.label}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-500">
                {b.parity.split(' ')[0]}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-200">
              {b.name}
            </span>
            <span className="text-[10px] text-slate-400 font-mono truncate w-full">
              {b.math}
            </span>
          </button>
        ))}
      </div>

      {/* Main Grid: Animated Entanglement Visualizer + Measurement Correlations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-6">
        {/* Left Column: Visual Entanglement Link & Circuit (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Animated 2-Qubit Entanglement Stage */}
          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[220px]">
            {/* Background glowing particles */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/20 via-purple-950/20 to-cyan-950/20 pointer-events-none" />

            <div className="flex items-center justify-between w-full max-w-md z-10 px-6">
              {/* Qubit A */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-cyan-600/30 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)] relative">
                  <span className="text-sm font-mono font-bold text-white">Qubit A</span>
                  <div className="absolute -inset-1 rounded-full border border-cyan-400/30 animate-ping opacity-25" />
                </div>
                <span className="text-xs font-mono text-cyan-300 mt-2">Wire q0</span>
              </div>

              {/* Shimmering Entanglement Link Line */}
              <div className="flex-1 mx-4 relative flex items-center justify-center">
                <div className="w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
                {/* Traveling photon/correlation pulses */}
                <div
                  className="absolute w-3 h-3 rounded-full bg-white shadow-[0_0_10px_#ffffff] transition-all"
                  style={{
                    left: `${(Math.sin((animPulse * Math.PI) / 25) + 1) * 45}%`,
                  }}
                />
                <span className="absolute -top-5 text-[10px] font-mono text-purple-300 uppercase tracking-widest bg-slate-900/90 px-2 py-0.5 rounded border border-purple-500/30">
                  Entangled Link
                </span>
              </div>

              {/* Qubit B */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-purple-600/30 border-2 border-purple-400 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.6)] relative">
                  <span className="text-sm font-mono font-bold text-white">Qubit B</span>
                  <div className="absolute -inset-1 rounded-full border border-purple-400/30 animate-ping opacity-25" />
                </div>
                <span className="text-xs font-mono text-purple-300 mt-2">Wire q1</span>
              </div>
            </div>

            <div className="mt-6 text-center z-10">
              <span className="text-sm font-bold text-white font-mono block">
                {activeBell.math}
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                Parity: <strong className="text-cyan-300">{activeBell.parity}</strong> • Phase: <strong className="text-purple-300">{activeBell.phase}</strong>
              </span>
            </div>
          </div>

          {/* Preparation Circuit & Local Transformation */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-800 pb-2">
              Preparation Circuit (from |00⟩)
            </span>
            <pre className="p-3 rounded bg-slate-900 font-mono text-xs text-cyan-300 overflow-x-auto border border-slate-800/80">
              {activeBell.prepCircuit}
            </pre>

            <div className="p-2.5 rounded bg-slate-900 text-xs font-mono text-slate-300 flex items-center justify-between border border-slate-800">
              <span className="text-slate-500">Transform from |Φ+⟩:</span>
              <span className="text-pink-300 font-bold">{activeBell.localTransformFromPhiPlus}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Measurement Simulation & Probability Histogram (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                Finite Shot Simulation ({shots} Shots in {basis}-Basis)
              </span>
              <button
                onClick={runBellSimulation}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
              >
                <RotateCcw className="w-3 h-3" /> Reshoot
              </button>
            </div>

            {/* Probability Histogram */}
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="state" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, shots]} />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2 rounded text-xs font-mono shadow-xl">
                          <div className="font-bold text-cyan-300">{d.state}</div>
                          <div className="text-emerald-400">Observed Counts: {d.count}</div>
                          <div className="text-slate-300">Frequency: {d.prob}%</div>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.count > 0 ? '#06b6d4' : '#334155'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Scientific Explanation of the outcome */}
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
              {activeBell.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Scientific Insights & Disclaimers Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Insight 1: Why a Single Bloch Sphere Cannot Represent Bell States */}
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 text-xs leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-indigo-300">
            <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
            Why can't a single Bloch sphere represent a Bell state?
          </div>
          <p>
            The Bloch sphere is defined exclusively for <em>pure states of a single qubit</em> (H = C²). For an entangled 2-qubit state, the system lives in a 4-dimensional Hilbert space (C² ⊗ C² = C⁴).
          </p>
          <p>
            If you trace out Qubit B to look at Qubit A alone, its reduced density matrix is the <strong>maximally mixed state</strong>: ρ_A = Tr_B(|Φ+⟩⟨Φ+|) = (1/2) I. On the Bloch sphere, this corresponds to the dead center (0, 0, 0) with vector length r = 0! We have zero knowledge of individual qubits, despite 100% complete knowledge of the joint pair!
          </p>
        </div>

        {/* Insight 2: No-Signaling Theorem & No Faster-Than-Light Communication */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            No-Signaling Theorem: Entanglement is NOT Faster-Than-Light Comms!
          </div>
          <p>
            Although measuring Qubit A instantaneously collapses Qubit B across arbitrary cosmic distances ("spooky action at a distance"), <strong>no information can be transmitted faster than light</strong>.
          </p>
          <p>
            An observer at Qubit B observing their detector sees purely random 50/50 noise in every shot, completely oblivious to whether or when Qubit A was measured. The non-local correlation can only be discovered when Alice and Bob compare their result logs via a classical channel bounded by the speed of light c!
          </p>
        </div>
      </div>
    </div>
  );
}
