import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  BarChart2,
  Code,
  CheckCircle2,
  ArrowRight,
  Layers,
  HelpCircle,
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

const PRESET_CIRCUITS = [
  {
    name: 'Bell State |Φ+⟩',
    qubits: 2,
    initialStates: ['0', '0'],
    gates: [
      { gate: 'H', target: 0 },
      { gate: 'CX', control: 0, target: 1 },
    ],
    desc: 'Maximally entangled Bell state: creates (|00⟩ + |11⟩)/√2.',
  },
  {
    name: 'Hadamard Superposition',
    qubits: 1,
    initialStates: ['0'],
    gates: [{ gate: 'H', target: 0 }],
    desc: 'Prepares equal superposition |+⟩ with 50/50 measurement probabilities.',
  },
  {
    name: 'Double NOT (X → X)',
    qubits: 1,
    initialStates: ['0'],
    gates: [
      { gate: 'X', target: 0 },
      { gate: 'X', target: 0 },
    ],
    desc: 'Involution experiment: X² = I. Flipping twice returns state to |0⟩.',
  },
  {
    name: 'Superposition Cancel (H → H)',
    qubits: 1,
    initialStates: ['0'],
    gates: [
      { gate: 'H', target: 0 },
      { gate: 'H', target: 0 },
    ],
    desc: 'Destructive quantum interference cancels |1⟩, returning state to |0⟩.',
  },
  {
    name: 'GHZ State (3-Qubit)',
    qubits: 3,
    initialStates: ['0', '0', '0'],
    gates: [
      { gate: 'H', target: 0 },
      { gate: 'CX', control: 0, target: 1 },
      { gate: 'CX', control: 1, target: 2 },
    ],
    desc: 'Greenberger-Horne-Zeilinger 3-qubit maximally entangled state: (|000⟩ + |111⟩)/√2.',
  },
  {
    name: 'Quantum Teleportation',
    qubits: 3,
    initialStates: ['0', '0', '0'],
    gates: [
      { gate: 'H', target: 0 }, // Alice message prep
      { gate: 'H', target: 1 }, // Bell pair
      { gate: 'CX', control: 1, target: 2 },
      { gate: 'CX', control: 0, target: 1 }, // Bell measurement
      { gate: 'H', target: 0 },
      { gate: 'CX', control: 1, target: 2 }, // Bob conditional correction
      { gate: 'CZ', control: 0, target: 2 },
    ],
    desc: 'Full quantum teleportation circuit transferring quantum state from q0 to q2!',
  },
  {
    name: 'SWAP Gate Circuit',
    qubits: 2,
    initialStates: ['1', '0'],
    gates: [
      { gate: 'SWAP', target: 0, target2: 1 },
    ],
    desc: 'Exchanges quantum states between wire 0 and wire 1.',
  },
];

const AVAILABLE_GATES = [
  { name: 'H', label: 'Hadamard', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
  { name: 'X', label: 'Pauli-X', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
  { name: 'Y', label: 'Pauli-Y', color: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
  { name: 'Z', label: 'Pauli-Z', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  { name: 'S', label: 'Phase (S)', color: 'bg-violet-500/20 text-violet-300 border-violet-500/40' },
  { name: 'T', label: 'Phase (T)', color: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40' },
  { name: 'RX', label: 'RX(π/2)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { name: 'RY', label: 'RY(π/2)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { name: 'RZ', label: 'RZ(π/2)', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
  { name: 'CX', label: 'CNOT (CX)', color: 'bg-pink-500/20 text-pink-300 border-pink-500/40', isMulti: true },
  { name: 'CZ', label: 'CZ', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', isMulti: true },
  { name: 'SWAP', label: 'SWAP', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', isMulti: true },
];

export default function CircuitSimulator({ onCircuitCompleted = null }) {
  const [numQubits, setNumQubits] = useState(2);
  const [initialStates, setInitialStates] = useState(['0', '0', '0', '0']);
  const [gates, setGates] = useState([
    { gate: 'H', target: 0 },
    { gate: 'CX', control: 0, target: 1 },
  ]);
  const [selectedGateToAdd, setSelectedGateToAdd] = useState('H');
  const [targetWire, setTargetWire] = useState(0);
  const [controlWire, setControlWire] = useState(1);
  const [shots, setShots] = useState(1024);
  const [currentStep, setCurrentStep] = useState(-1); // -1 means full circuit execution

  // Simulation Results
  const [simResult, setSimResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState('probabilities'); // probabilities, statevector, qasm

  // Auto-run simulation on circuit changes
  useEffect(() => {
    runSimulation();
  }, [numQubits, initialStates, gates, currentStep, shots]);

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const activeOps = currentStep >= 0 ? gates.slice(0, currentStep + 1) : gates;
      const res = await api.simulateMultiQubit({
        numQubits,
        initialStates: initialStates.slice(0, numQubits),
        operations: activeOps,
        shots,
        measure: true,
      });
      setSimResult(res);
      if (onCircuitCompleted) {
        onCircuitCompleted(gates);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleAddGate = () => {
    sounds.playGateClick(680);
    const gObj = { gate: selectedGateToAdd, target: targetWire };
    if (['CX', 'CZ'].includes(selectedGateToAdd)) {
      if (targetWire === controlWire) {
        alert('Control and target wires must be different.');
        return;
      }
      gObj.control = controlWire;
    } else if (selectedGateToAdd === 'SWAP') {
      if (targetWire === controlWire) {
        alert('SWAP wires must be different.');
        return;
      }
      gObj.target2 = controlWire;
    }
    setGates((prev) => [...prev, gObj]);
    setCurrentStep(-1);
  };

  const handleRemoveGate = (index) => {
    sounds.playGateClick(400);
    setGates((prev) => prev.filter((_, idx) => idx !== index));
    setCurrentStep(-1);
  };

  const handleClearCircuit = () => {
    sounds.playGateClick(300);
    setGates([]);
    setCurrentStep(-1);
  };

  const loadPreset = (preset) => {
    sounds.playVictory();
    setNumQubits(preset.qubits);
    const inits = ['0', '0', '0', '0'];
    preset.initialStates.forEach((st, idx) => {
      inits[idx] = st;
    });
    setInitialStates(inits);
    setGates(preset.gates);
    setCurrentStep(-1);
  };

  const toggleInitialState = (wireIdx) => {
    sounds.playGateClick(500);
    setInitialStates((prev) => {
      const updated = [...prev];
      updated[wireIdx] = updated[wireIdx] === '0' ? '1' : '0';
      return updated;
    });
  };

  // Step-by-step navigation
  const stepForward = () => {
    sounds.playGateClick(700);
    if (currentStep < gates.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const stepBackward = () => {
    sounds.playGateClick(500);
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else if (currentStep === 0) {
      setCurrentStep(-1);
    }
  };

  // Format chart data
  const chartData = simResult
    ? Object.entries(simResult.probabilities).map(([basis, prob]) => ({
        state: `|${basis}⟩`,
        prob: Math.round(prob * 100),
        count: simResult.counts ? simResult.counts[basis] || 0 : 0,
      }))
    : [];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-pink-500/30 p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400">
              <Cpu className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Quantum Circuit Designer & Simulator
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              Level 6 Mission
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build multi-qubit algorithms, place controlled entanglers, inspect statevectors, and simulate finite shots on Qiskit Aer.
          </p>
        </div>

        {/* Top Controls: Shots & Engine Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <span className="text-slate-500">Shots:</span>
            {[100, 1024, 4096].map((s) => (
              <button
                key={s}
                onClick={() => setShots(s)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                  shots === s ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={handleClearCircuit}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Preset Circuits Row */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Load Landmark Circuit Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_CIRCUITS.map((p) => (
            <button
              key={p.name}
              onClick={() => loadPreset(p)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-pink-500/40 text-xs font-medium text-slate-200 transition flex items-center gap-1.5 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Circuit Configuration Bar: Wire Count & Palette */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Wire Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Wires (Qubits):</span>
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => {
                  sounds.playGateClick(520);
                  setNumQubits(n);
                  // Prune any gates that reference wires beyond n
                  setGates((prev) =>
                    prev.filter((g) => g.target < n && (g.control === undefined || g.control < n))
                  );
                }}
                className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition ${
                  numQubits === n
                    ? 'bg-pink-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Add Gate Form */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedGateToAdd}
              onChange={(e) => setSelectedGateToAdd(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-bold rounded-lg px-3 py-2 outline-none"
            >
              {AVAILABLE_GATES.map((g) => (
                <option key={g.name} value={g.name}>
                  {g.name} — {g.label}
                </option>
              ))}
            </select>

            {/* Target Wire */}
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span>Target:</span>
              <select
                value={targetWire}
                onChange={(e) => setTargetWire(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1.5 font-mono"
              >
                {Array.from({ length: numQubits }).map((_, idx) => (
                  <option key={idx} value={idx}>
                    q{idx}
                  </option>
                ))}
              </select>
            </div>

            {/* Control Wire (if controlled gate) */}
            {['CX', 'CZ', 'SWAP'].includes(selectedGateToAdd) && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <span>{selectedGateToAdd === 'SWAP' ? 'Target 2:' : 'Control:'}</span>
                <select
                  value={controlWire}
                  onChange={(e) => setControlWire(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1.5 font-mono"
                >
                  {Array.from({ length: numQubits }).map((_, idx) => (
                    <option key={idx} value={idx}>
                      q{idx}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddGate}
              className="px-3 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-pink-600/30 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Gate
            </button>
          </div>
        </div>
      </div>

      {/* Visual Circuit Diagram Wire Canvas */}
      <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 shadow-inner mb-6 overflow-x-auto">
        <div className="min-w-[650px] space-y-6">
          {Array.from({ length: numQubits }).map((_, wireIdx) => {
            const initVal = initialStates[wireIdx] || '0';
            return (
              <div key={wireIdx} className="flex items-center relative">
                {/* Wire Qubit Input Badge */}
                <button
                  onClick={() => toggleInitialState(wireIdx)}
                  className="w-20 shrink-0 flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 transition z-10"
                  title="Click to toggle initial state between |0⟩ and |1⟩"
                >
                  <span className="text-slate-400 font-sans">q{wireIdx}:</span>
                  <span className="font-bold text-emerald-400">|{initVal}⟩</span>
                </button>

                {/* Circuit Wire Line */}
                <div className="flex-1 relative flex items-center h-10 ml-4">
                  {/* Background horizontal wire line */}
                  <div className="absolute inset-x-0 h-[2px] bg-cyan-500/30" />

                  {/* Gate slots along this wire */}
                  <div className="flex items-center gap-4 z-10 pl-2">
                    {gates.map((op, gIdx) => {
                      const isTarget = op.target === wireIdx;
                      const isControl = op.control === wireIdx;
                      const isTarget2 = op.target2 === wireIdx;
                      const isActiveStep = currentStep === gIdx;

                      if (isTarget) {
                        return (
                          <div
                            key={gIdx}
                            onClick={() => handleRemoveGate(gIdx)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-xs cursor-pointer select-none transition transform hover:scale-105 shadow ${
                              isActiveStep
                                ? 'ring-2 ring-yellow-400 bg-pink-500 text-white'
                                : 'bg-slate-900 border border-pink-500/50 text-pink-300 hover:border-rose-400'
                            }`}
                            title={`Click to remove ${op.gate}`}
                          >
                            {op.gate === 'CX' ? '⊕' : op.gate === 'SWAP' ? '×' : op.gate}
                          </div>
                        );
                      }

                      if (isControl) {
                        return (
                          <div
                            key={gIdx}
                            onClick={() => handleRemoveGate(gIdx)}
                            className="w-10 h-10 flex items-center justify-center cursor-pointer select-none"
                            title={`Control for gate #${gIdx + 1}`}
                          >
                            <div className="w-3.5 h-3.5 rounded-full bg-pink-400 border border-white shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
                          </div>
                        );
                      }

                      if (isTarget2) {
                        return (
                          <div
                            key={gIdx}
                            onClick={() => handleRemoveGate(gIdx)}
                            className="w-10 h-10 flex items-center justify-center font-mono font-bold text-pink-300 text-base cursor-pointer select-none bg-slate-900 rounded-lg border border-pink-500/40"
                            title={`SWAP Target 2`}
                          >
                            ×
                          </div>
                        );
                      }

                      // Wire passthrough empty spacer
                      return (
                        <div key={gIdx} className="w-10 h-10 flex items-center justify-center opacity-0 pointer-events-none">
                          ──
                        </div>
                      );
                    })}

                    {/* Circuit End Measurement Box */}
                    <div className="w-8 h-8 rounded bg-slate-900/80 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-400">
                      [M]
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step-by-Step Execution Player */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={stepBackward}
            disabled={currentStep <= -1}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition"
            title="Step Backward"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.playGateClick(600);
              setCurrentStep(-1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              currentStep === -1
                ? 'bg-pink-600 text-white'
                : 'bg-slate-900 border border-slate-700 text-slate-300'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Full Execution
          </button>

          <button
            onClick={stepForward}
            disabled={currentStep >= gates.length - 1}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition"
            title="Step Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-slate-400 ml-2">
            Execution Step:{' '}
            <strong className="text-pink-300">
              {currentStep === -1 ? 'Final State (All Gates)' : `Step ${currentStep + 1} of ${gates.length}`}
            </strong>
          </span>
        </div>

        {/* Engine status indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {simResult?.isBackend
              ? 'Simulated on Qiskit Aer (Backend API)'
              : 'Simulated on Client-Side Quantum Engine'}
          </span>
        </div>
      </div>

      {/* Simulation Output Dashboard */}
      {simResult && (
        <div className="space-y-4">
          {/* Subtabs: Probabilities / Statevector / QASM & ASCII */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('probabilities')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'probabilities'
                  ? 'bg-pink-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Measurement Probabilities & Counts
            </button>

            <button
              onClick={() => setActiveTab('statevector')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'statevector'
                  ? 'bg-pink-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Statevector ({simResult.statevector?.length} Amplitudes)
            </button>

            <button
              onClick={() => setActiveTab('qasm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'qasm'
                  ? 'bg-pink-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              ASCII & QASM Code
            </button>
          </div>

          {/* Probabilities Tab */}
          {activeTab === 'probabilities' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 h-64 w-full bg-slate-950 p-4 rounded-xl border border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="state" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                    <Tooltip
                      content={({ payload }) => {
                        if (!payload || !payload.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 p-2 rounded text-xs font-mono shadow-xl">
                            <div className="font-bold text-pink-300">{d.state}</div>
                            <div className="text-emerald-400">Probability: {d.prob}%</div>
                            <div className="text-slate-300">Observed Counts: {d.count}</div>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="prob" radius={[4, 4, 0, 0]}>
                      {chartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index % 2 === 0 ? '#ec4899' : '#06b6d4'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Numerical breakdown */}
              <div className="lg:col-span-5 space-y-2">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="text-slate-400 uppercase text-[10px] tracking-wider mb-2">
                    Exact Theoretical Probabilities:
                  </div>
                  {Object.entries(simResult.probabilities).map(([bit, p]) => (
                    <div key={bit} className="flex justify-between items-center p-2 rounded bg-slate-900/80">
                      <span className="text-pink-300 font-bold">|{bit}⟩:</span>
                      <span className="text-emerald-400">{(p * 100).toFixed(2)}%</span>
                      {simResult.counts && (
                        <span className="text-slate-400">
                          {simResult.counts[bit] || 0} / {shots} shots
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Statevector Tab */}
          {activeTab === 'statevector' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">Basis</th>
                    <th className="py-2 px-3">Complex Amplitude</th>
                    <th className="py-2 px-3">Real</th>
                    <th className="py-2 px-3">Imag</th>
                    <th className="py-2 px-3">Phase (rad)</th>
                    <th className="py-2 px-3">Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {simResult.statevector?.map((amp, idx) => (
                    <tr key={idx} className="border-b border-slate-900 hover:bg-slate-900/50">
                      <td className="py-2 px-3 text-pink-300 font-bold">{amp.basis}</td>
                      <td className="py-2 px-3 text-cyan-300">{amp.formatted}</td>
                      <td className="py-2 px-3 text-slate-300">{amp.real}</td>
                      <td className="py-2 px-3 text-slate-300">{amp.imag}</td>
                      <td className="py-2 px-3 text-purple-300">{amp.phase_radians} rad</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">
                        {(amp.probability * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* QASM & ASCII Tab */}
          {activeTab === 'qasm' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider">
                ASCII Quantum Circuit Diagram:
              </span>
              <pre className="p-3 rounded bg-slate-900 text-cyan-300 overflow-x-auto border border-slate-800">
                {simResult.circuit?.ascii_art || 'No circuit art generated.'}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
