import React, { useState } from 'react';
import { BookOpen, Sparkles, ArrowRight, Play, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const GATES_CATALOG = [
  {
    id: 'X',
    name: 'Pauli-X Gate',
    category: 'Single-Qubit',
    symbol: 'X',
    badge: 'Bit-Flip (NOT)',
    matrix: [
      ['0', '1'],
      ['1', '0'],
    ],
    summary: 'Flips |0⟩ to |1⟩ and |1⟩ to |0⟩. The quantum analogue of a classical NOT gate.',
    blochEffect: 'Rotates the state vector by π (180°) around the X axis on the Bloch sphere.',
    onZero: '|1⟩',
    onOne: '|0⟩',
    onPlus: '|+⟩ (eigenstate with eigenvalue +1)',
    onMinus: '−|−⟩ (eigenstate with eigenvalue -1)',
    exampleCircuit: 'q: ──|0⟩──[ X ]── |1⟩',
    algebraicRule: 'X |0⟩ = |1⟩,  X |1⟩ = |0⟩,  X² = I',
  },
  {
    id: 'Y',
    name: 'Pauli-Y Gate',
    category: 'Single-Qubit',
    symbol: 'Y',
    badge: 'Bit + Phase Flip',
    matrix: [
      ['0', '-i'],
      ['i', '0'],
    ],
    summary: 'Performs a bit-flip combined with an imaginary relative phase change.',
    blochEffect: 'Rotates the state vector by π (180°) around the Y axis on the Bloch sphere.',
    onZero: 'i|1⟩',
    onOne: '-i|0⟩',
    onPlus: '-i|−⟩',
    onMinus: 'i|+⟩',
    exampleCircuit: 'q: ──|0⟩──[ Y ]── i|1⟩',
    algebraicRule: 'Y = iXZ,  Y² = I',
  },
  {
    id: 'Z',
    name: 'Pauli-Z Gate',
    category: 'Single-Qubit',
    symbol: 'Z',
    badge: 'Phase-Flip',
    matrix: [
      ['1', '0'],
      ['0', '-1'],
    ],
    summary: 'Leaves |0⟩ unchanged and flips the phase of the |1⟩ component by multiplying it by −1.',
    blochEffect: 'Rotates the state vector by π (180°) around the Z axis on the Bloch sphere.',
    onZero: '|0⟩ (unchanged)',
    onOne: '−|1⟩ (phase flip)',
    onPlus: '|−⟩ = (|0⟩ − |1⟩)/√2',
    onMinus: '|+⟩ = (|0⟩ + |1⟩)/√2',
    exampleCircuit: 'q: ──|+⟩──[ Z ]── |−⟩',
    algebraicRule: 'Z |0⟩ = |0⟩,  Z |1⟩ = -|1⟩,  Z² = I',
  },
  {
    id: 'H',
    name: 'Hadamard Gate',
    category: 'Single-Qubit',
    symbol: 'H',
    badge: 'Superposition Generator',
    matrix: [
      ['1/√2', '1/√2'],
      ['1/√2', '-1/√2'],
    ],
    summary:
      'Creates an equal superposition from computational basis states |0⟩ or |1⟩. It is also self-inverse: applying H twice restores the original state through quantum interference.',
    blochEffect: 'Rotates the state vector by 180° around the diagonal axis (X + Z)/√2.',
    onZero: '|+⟩ = (|0⟩ + |1⟩)/√2',
    onOne: '|−⟩ = (|0⟩ − |1⟩)/√2',
    onPlus: '|0⟩ (constructive/destructive interference cancels |1⟩)',
    onMinus: '|1⟩',
    exampleCircuit: 'q: ──|0⟩──[ H ]── |+⟩',
    algebraicRule: 'H |0⟩ = |+⟩,  H |1⟩ = |−⟩,  H² = I',
  },
  {
    id: 'S',
    name: 'Phase (S) Gate',
    category: 'Single-Qubit',
    symbol: 'S',
    badge: 'π/2 Phase Shift',
    matrix: [
      ['1', '0'],
      ['0', 'i'],
    ],
    summary: 'Applies a phase shift of π/2 (90°) to the |1⟩ component. Often called the √Z gate because S² = Z.',
    blochEffect: 'Rotates the state vector by π/2 (90°) clockwise around the Z axis.',
    onZero: '|0⟩',
    onOne: 'i|1⟩',
    onPlus: '|+i⟩ = (|0⟩ + i|1⟩)/√2',
    onMinus: '|−i⟩ = (|0⟩ − i|1⟩)/√2',
    exampleCircuit: 'q: ──|+⟩──[ S ]── |+i⟩',
    algebraicRule: 'S = √Z,  S² = Z,  S⁴ = I',
  },
  {
    id: 'T',
    name: 'π/8 (T) Gate',
    category: 'Single-Qubit',
    symbol: 'T',
    badge: 'π/4 Phase Shift',
    matrix: [
      ['1', '0'],
      ['0', 'e^{iπ/4}'],
    ],
    summary: 'Applies a phase shift of π/4 (45°) to the |1⟩ component. The fourth root of Z (T⁴ = Z, T² = S).',
    blochEffect: 'Rotates the state vector by π/4 (45°) around the Z axis.',
    onZero: '|0⟩',
    onOne: 'e^{iπ/4}|1⟩ = ((1+i)/√2)|1⟩',
    onPlus: '(|0⟩ + e^{iπ/4}|1⟩)/√2',
    onMinus: '(|0⟩ − e^{iπ/4}|1⟩)/√2',
    exampleCircuit: 'q: ──|0⟩──[ H ]──[ T ]── |ψ⟩',
    algebraicRule: 'T = √S = Z^{1/4},  T² = S,  T⁴ = Z',
  },
  {
    id: 'RX',
    name: 'RX Rotation Gate',
    category: 'Rotation',
    symbol: 'RX(θ)',
    badge: 'X-Axis Rotation',
    matrix: [
      ['cos(θ/2)', '-i sin(θ/2)'],
      ['-i sin(θ/2)', 'cos(θ/2)'],
    ],
    summary: 'Rotates the qubit state continuously by an arbitrary angle θ around the Bloch sphere’s X axis.',
    blochEffect: 'Arbitrary angle θ continuous rotation around the X axis.',
    onZero: 'cos(θ/2)|0⟩ − i sin(θ/2)|1⟩',
    onOne: '−i sin(θ/2)|0⟩ + cos(θ/2)|1⟩',
    onPlus: '|+⟩ (X eigenstate, picks up global phase)',
    onMinus: '|−⟩ (X eigenstate)',
    exampleCircuit: 'q: ──|0⟩──[ RX(π/2) ]── (|0⟩ − i|1⟩)/√2',
    algebraicRule: 'RX(θ) = exp(-i θ X / 2)',
  },
  {
    id: 'RY',
    name: 'RY Rotation Gate',
    category: 'Rotation',
    symbol: 'RY(θ)',
    badge: 'Y-Axis Rotation',
    matrix: [
      ['cos(θ/2)', '-sin(θ/2)'],
      ['sin(θ/2)', 'cos(θ/2)'],
    ],
    summary:
      'Rotates the qubit state continuously by angle θ around the Y axis. Crucially, all matrix entries remain real numbers, making it popular for real-valued variational circuits.',
    blochEffect: 'Arbitrary angle θ continuous rotation around the Y axis.',
    onZero: 'cos(θ/2)|0⟩ + sin(θ/2)|1⟩',
    onOne: '−sin(θ/2)|0⟩ + cos(θ/2)|1⟩',
    onPlus: 'Rotates towards |0⟩ or |1⟩ along real circle',
    onMinus: 'Rotates towards |0⟩ or |1⟩',
    exampleCircuit: 'q: ──|0⟩──[ RY(π) ]── |1⟩',
    algebraicRule: 'RY(θ) = exp(-i θ Y / 2)',
  },
  {
    id: 'RZ',
    name: 'RZ Rotation Gate',
    category: 'Rotation',
    symbol: 'RZ(θ)',
    badge: 'Z-Axis Rotation',
    matrix: [
      ['e^{-iθ/2}', '0'],
      ['0', 'e^{iθ/2}'],
    ],
    summary: 'Rotates the qubit state continuously by angle θ around the Z axis, adjusting the relative phase.',
    blochEffect: 'Continuous rotation around the Z axis by angle θ (changes relative phase φ).',
    onZero: 'e^{-iθ/2}|0⟩',
    onOne: 'e^{iθ/2}|1⟩',
    onPlus: 'e^{-iθ/2}(|0⟩ + e^{iθ}|1⟩)/√2',
    onMinus: 'e^{-iθ/2}(|0⟩ − e^{iθ}|1⟩)/√2',
    exampleCircuit: 'q: ──|0⟩──[ H ]──[ RZ(π/2) ]── |+i⟩',
    algebraicRule: 'RZ(θ) = exp(-i θ Z / 2)',
  },
  {
    id: 'CNOT',
    name: 'Controlled-NOT (CX) Gate',
    category: 'Multi-Qubit',
    symbol: 'CNOT',
    badge: 'Two-Qubit Entangler',
    matrix: [
      ['1', '0', '0', '0'],
      ['0', '1', '0', '0'],
      ['0', '0', '0', '1'],
      ['0', '0', '1', '0'],
    ],
    summary:
      'Flips the target qubit if and only if the control qubit is in state |1⟩. Fundamental building block for quantum entanglement and Bell state preparation.',
    blochEffect: 'Cannot be represented on a single Bloch sphere because it entangles 2 qubits!',
    onZero: '|00⟩ → |00⟩',
    onOne: '|01⟩ → |01⟩',
    onPlus: '|10⟩ → |11⟩',
    onMinus: '|11⟩ → |10⟩',
    exampleCircuit: 'q0: ──[H]──■──\n           │  \nq1: ───────X── (|00⟩+|11⟩)/√2',
    algebraicRule: 'CX |c, t⟩ = |c, t ⊕ c⟩',
  },
  {
    id: 'CZ',
    name: 'Controlled-Z Gate',
    category: 'Multi-Qubit',
    symbol: 'CZ',
    badge: 'Controlled Phase-Flip',
    matrix: [
      ['1', '0', '0', '0'],
      ['0', '1', '0', '0'],
      ['0', '0', '1', '0'],
      ['0', '0', '0', '-1'],
    ],
    summary:
      'Applies a phase flip of −1 only to the |11⟩ component. Completely symmetric between control and target qubits (CZ = (I ⊗ H) CNOT (I ⊗ H)).',
    blochEffect: 'Multi-qubit entangler; alters the 2-qubit joint phase without changing single-qubit Z-probabilities.',
    onZero: '|00⟩ → |00⟩',
    onOne: '|01⟩ → |01⟩',
    onPlus: '|10⟩ → |10⟩',
    onMinus: '|11⟩ → −|11⟩',
    exampleCircuit: 'q0: ──■──\n      │  \nq1: ──■── (symmetric)',
    algebraicRule: 'CZ |c, t⟩ = (-1)^{c · t} |c, t⟩',
  },
  {
    id: 'SWAP',
    name: 'SWAP Gate',
    category: 'Multi-Qubit',
    symbol: 'SWAP',
    badge: 'Qubit State Exchange',
    matrix: [
      ['1', '0', '0', '0'],
      ['0', '0', '1', '0'],
      ['0', '1', '0', '0'],
      ['0', '0', '0', '1'],
    ],
    summary:
      'Exchanges the states of two qubits: |q0, q1⟩ becomes |q1, q0⟩. Can be synthesized using three alternating CNOT gates.',
    blochEffect: 'Exchanges the coordinates of Qubit 1 and Qubit 2.',
    onZero: '|00⟩ → |00⟩',
    onOne: '|01⟩ → |10⟩',
    onPlus: '|10⟩ → |01⟩',
    onMinus: '|11⟩ → |11⟩',
    exampleCircuit: 'q0: ──x──\n      │  \nq1: ──x── = 3 alternating CX gates',
    algebraicRule: 'SWAP = CX_{0,1} · CX_{1,0} · CX_{0,1}',
  },
  {
    id: 'I',
    name: 'Identity Gate',
    category: 'Single-Qubit',
    symbol: 'I',
    badge: 'No-Op (Unchanged)',
    matrix: [
      ['1', '0'],
      ['0', '1'],
    ],
    summary:
      'Leaves the quantum state completely unchanged. Used in quantum circuits as a delay buffer, noise benchmark, or placeholder wire alignment.',
    blochEffect: 'State vector does not move at all (0° rotation).',
    onZero: '|0⟩',
    onOne: '|1⟩',
    onPlus: '|+⟩',
    onMinus: '|−⟩',
    exampleCircuit: 'q: ──[ I ]── (leaves state invariant)',
    algebraicRule: 'I |ψ⟩ = |ψ⟩',
  },
];

export default function GateLibrary() {
  const [selectedGateId, setSelectedGateId] = useState('H');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [testInput, setTestInput] = useState('0');

  const selectedGate = GATES_CATALOG.find((g) => g.id === selectedGateId) || GATES_CATALOG[3];

  const categories = ['All', 'Single-Qubit', 'Rotation', 'Multi-Qubit'];

  const filteredGates =
    categoryFilter === 'All'
      ? GATES_CATALOG
      : GATES_CATALOG.filter((g) => g.category === categoryFilter);

  // Compute test bench outcome
  const getOutcome = () => {
    if (selectedGate.id === 'X') {
      return testInput === '0' ? '|1⟩ (P(1)=100%)' : testInput === '1' ? '|0⟩ (P(0)=100%)' : testInput === '+' ? '|+⟩' : '−|−⟩';
    }
    if (selectedGate.id === 'H') {
      return testInput === '0'
        ? '|+⟩ (50% 0, 50% 1)'
        : testInput === '1'
        ? '|−⟩ (50% 0, 50% 1, Phase π)'
        : testInput === '+'
        ? '|0⟩ (Interference cancelled |1⟩!)'
        : '|1⟩ (Interference cancelled |0⟩!)';
    }
    if (selectedGate.id === 'Z') {
      return testInput === '0' ? '|0⟩' : testInput === '1' ? '−|1⟩' : testInput === '+' ? '|−⟩' : '|+⟩';
    }
    if (selectedGate.id === 'S') {
      return testInput === '0' ? '|0⟩' : testInput === '1' ? 'i|1⟩' : testInput === '+' ? '|+i⟩' : '|−i⟩';
    }
    return `Transformed via ${selectedGate.name}`;
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-indigo-500/30 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              Quantum Gate Academy & Library
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Level 2 Mission
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Master single-qubit unitaries, Pauli matrices, rotations, and multi-qubit entanglers with mathematical rigor.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto self-start sm:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sounds.playGateClick(500);
                setCategoryFilter(cat);
              }}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gate Selector Pills */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-6">
        {filteredGates.map((g) => (
          <button
            key={g.id}
            onClick={() => {
              sounds.playGateClick(650);
              setSelectedGateId(g.id);
            }}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition group text-center ${
              selectedGateId === g.id
                ? 'bg-indigo-950/80 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)] text-white'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <span className="text-lg font-black font-mono tracking-tight group-hover:scale-110 transition-transform">
              {g.symbol}
            </span>
            <span className="text-[10px] text-slate-400 truncate w-full">
              {g.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Gate Deep Dive Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Description & Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">
                  {selectedGate.category} Gate
                </span>
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  {selectedGate.name}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {selectedGate.badge}
                  </span>
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-mono font-black text-xl text-indigo-300 shadow-inner">
                {selectedGate.symbol}
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedGate.summary}
            </p>

            {/* Matrix & Algebraic Rule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block mb-2 uppercase">
                  Unitary Matrix U:
                </span>
                <div className="flex items-center justify-center">
                  <div className="border-l-2 border-r-2 border-indigo-400 px-3 py-1 rounded font-mono text-sm text-cyan-300 text-center space-y-1">
                    {selectedGate.matrix.map((row, rIdx) => (
                      <div key={rIdx} className="flex gap-4 justify-center">
                        {row.map((cell, cIdx) => (
                          <span key={cIdx} className="w-12 inline-block">
                            {cell}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-center">
                <span className="text-[11px] font-mono text-slate-400 block mb-1 uppercase">
                  Mathematical Identity:
                </span>
                <div className="font-mono text-xs text-purple-300 bg-purple-950/40 p-2 rounded border border-purple-500/20">
                  {selectedGate.algebraicRule}
                </div>
              </div>
            </div>

            {/* Bloch Sphere Geometric Effect */}
            <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <strong className="text-cyan-300 block mb-0.5">Bloch Sphere Geometric Action:</strong>
                {selectedGate.blochEffect}
              </div>
            </div>

            {/* Important Scientific Disclaimer */}
            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <strong className="text-amber-300 block mb-0.5">Input-State Dependence:</strong>
                The exact result depends strictly on the input state! A gate does <em>not</em> unconditionally create superposition for every possible input (for example, applying H to |+⟩ yields |0⟩).
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Basis Transformations & Interactive Test Bench (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Action on Basis States Table */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-800 pb-2">
              Action on Basis States
            </span>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">{selectedGate.symbol} |0⟩ →</span>
                <span className="text-emerald-400 font-bold">{selectedGate.onZero}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">{selectedGate.symbol} |1⟩ →</span>
                <span className="text-rose-400 font-bold">{selectedGate.onOne}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">{selectedGate.symbol} |+⟩ →</span>
                <span className="text-cyan-400 font-bold">{selectedGate.onPlus}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">{selectedGate.symbol} |−⟩ →</span>
                <span className="text-purple-400 font-bold">{selectedGate.onMinus}</span>
              </div>
            </div>

            {/* Example Circuit ASCII representation */}
            <div className="pt-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                Circuit Wire Diagram:
              </span>
              <pre className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                {selectedGate.exampleCircuit}
              </pre>
            </div>
          </div>

          {/* Interactive Test Bench */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block">
              Interactive Test Bench
            </span>
            <p className="text-[11px] text-indigo-200">
              Select an input state to evaluate {selectedGate.symbol} in real time:
            </p>

            <div className="flex gap-2">
              {['0', '1', '+', '-'].map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    sounds.playGateClick(540);
                    setTestInput(st);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                    testInput === st
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  |{st}⟩
                </button>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-indigo-500/20 text-center font-mono text-xs">
              <span className="text-slate-400">{selectedGate.symbol} |{testInput}⟩ = </span>
              <span className="text-cyan-300 font-bold">{getOutcome()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
