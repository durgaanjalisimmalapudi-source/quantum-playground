import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Layers, Play, RotateCcw, Plus, Trash2, Sparkles, BarChart3, Info, ChevronRight, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export default function GateLab() {
  const [initialState, setInitialState] = useState('0');
  const [gates, setGates] = useState(['H']);
  const [shots, setShots] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Available gate palette
  const availableGates = [
    { name: 'X', label: 'Pauli-X', desc: 'Quantum NOT (Bit flip: |0⟩ ↔ |1⟩)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30' },
    { name: 'H', label: 'Hadamard', desc: 'Superposition & Interference (|0⟩ ↔ |+⟩, |1⟩ ↔ |−⟩)', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30' },
    { name: 'Z', label: 'Pauli-Z', desc: 'Phase flip (|0⟩ → |0⟩, |1⟩ → −|1⟩)', color: 'bg-violet-500/20 text-violet-300 border-violet-500/40 hover:bg-violet-500/30' },
    { name: 'Y', label: 'Pauli-Y', desc: 'Combined bit and phase flip (iXZ)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' },
  ];

  // Presets required by Section 5
  const presets = [
    {
      id: 'x-x',
      title: 'Experiment 1: X → X',
      gates: ['X', 'X'],
      summary: 'Bit flip twice restores initial state (X² = I)',
      badge: 'Identity Property',
    },
    {
      id: 'x-h',
      title: 'Experiment 2: X → H',
      gates: ['X', 'H'],
      summary: 'Bit flip to |1⟩, then Hadamard produces |−⟩',
      badge: 'Phase Superposition',
    },
    {
      id: 'h-h',
      title: 'Experiment 3: H → H',
      gates: ['H', 'H'],
      summary: 'Hadamard is self-inverse: interference cancels |1⟩',
      badge: 'Interference Collapse',
    },
    {
      id: 'h-x',
      title: 'Experiment 4: H → X',
      gates: ['H', 'X'],
      summary: 'Hadamard creates |+⟩, X gate swaps amplitudes (+1/√2)',
      badge: 'Symmetric Superposition',
    },
  ];

  // Auto-run circuit whenever gates or initial state change
  useEffect(() => {
    executeCircuit(gates, initialState, shots);
  }, [gates, initialState]);

  const executeCircuit = async (activeGates, activeInitial, activeShots) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.runCircuit({
        initialState: activeInitial,
        gates: activeGates,
        shots: activeShots,
        measure: true,
      });
      setResult(data);
    } catch (err) {
      setError(err.message || 'Error executing quantum circuit simulation.');
    } finally {
      setLoading(false);
    }
  };

  const addGate = (gateName) => {
    if (gates.length >= 10) return;
    setGates([...gates, gateName]);
  };

  const removeGate = (index) => {
    const updated = gates.filter((_, i) => i !== index);
    setGates(updated);
  };

  const clearCircuit = () => {
    setGates([]);
  };

  const applyPreset = (presetGates) => {
    setInitialState('0');
    setGates(presetGates);
  };

  const chartData = [
    {
      basis: '|0⟩',
      Theoretical: result?.probabilities?.['0'] ? Math.round(result.probabilities['0'] * 100) : 0,
      Observed: result?.frequencies?.['0'] !== undefined ? Math.round(result.frequencies['0'] * 100) : 0,
      counts: result?.counts?.['0'] || 0,
    },
    {
      basis: '|1⟩',
      Theoretical: result?.probabilities?.['1'] ? Math.round(result.probabilities['1'] * 100) : 0,
      Observed: result?.frequencies?.['1'] !== undefined ? Math.round(result.frequencies['1'] * 100) : 0,
      counts: result?.counts?.['1'] || 0,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-violet-950 border border-violet-500/40 text-violet-300">
              Module 2
            </span>
            <span className="text-xs text-slate-400">Interactive Circuit Sandbox</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Quantum Gate Lab</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Construct one-qubit gate sequences, observe quantum interference, and verify matrix transformations.
          </p>
        </div>

        {/* Clear & Shots controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-mono">Shots:</span>
            <select
              value={shots}
              onChange={(e) => {
                const s = Number(e.target.value);
                setShots(s);
                executeCircuit(gates, initialState, s);
              }}
              className="bg-transparent text-white font-mono font-semibold focus:outline-none cursor-pointer"
            >
              <option value={100} className="bg-slate-900">100</option>
              <option value={500} className="bg-slate-900">500</option>
              <option value={1000} className="bg-slate-900">1000</option>
            </select>
          </div>

          <button
            onClick={clearCircuit}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 hover:border-rose-500/40 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Preset Experiments Bar */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Curated Benchmark Experiments
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((p) => {
            const isMatch = gates.join('-') === p.gates.join('-');
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p.gates)}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  isMatch
                    ? 'bg-violet-950/60 border-violet-500 shadow-glow-violet'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs text-white">{p.title}</span>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-black/40 text-violet-300 font-mono">
                    {p.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{p.summary}</p>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-sm">
          {error}
        </div>
      )}

      {/* Gate Palette & Interactive Circuit Strip */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 mb-8 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Add Gate to Circuit
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Max gates: {gates.length}/10
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {availableGates.map((g) => (
              <button
                key={g.name}
                onClick={() => addGate(g.name)}
                disabled={gates.length >= 10}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${g.color}`}
              >
                <div className="text-left">
                  <div className="font-mono font-bold text-sm text-white">[{g.name}] {g.label}</div>
                  <div className="text-[10px] text-slate-300 line-clamp-1">{g.desc}</div>
                </div>
                <Plus className="w-4 h-4 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Visual Circuit Timeline */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Circuit Execution Pipeline (Left to Right)
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Initial State:</span>
              <button
                onClick={() => setInitialState(initialState === '0' ? '1' : '0')}
                className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs font-bold"
              >
                |{initialState}⟩
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center overflow-x-auto min-h-[90px] gap-2">
            {/* Initial State Wire Block */}
            <div className="flex items-center shrink-0">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-cyan-400 text-sm shadow">
                |{initialState}⟩
              </div>
              <div className="w-6 h-0.5 bg-slate-700" />
            </div>

            {/* Sequence of Gates */}
            {gates.length === 0 ? (
              <div className="flex items-center text-xs text-slate-500 font-mono italic px-4">
                No gates applied. Circuit evaluates identity operator. Click gates above to add.
              </div>
            ) : (
              gates.map((g, idx) => (
                <div key={idx} className="flex items-center shrink-0 group">
                  <div className="relative flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 border border-violet-400/50 flex items-center justify-center font-mono font-bold text-white text-base shadow-glow-violet">
                      {g}
                    </div>
                    <button
                      onClick={() => removeGate(idx)}
                      title="Remove gate"
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <span className="text-[9px] font-mono text-slate-400 mt-1">Step {idx + 1}</span>
                  </div>
                  <div className="w-6 h-0.5 bg-slate-700" />
                </div>
              ))
            )}

            {/* Final Measurement Block */}
            <div className="flex items-center shrink-0">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center font-mono font-bold text-emerald-400 text-xs shadow text-center p-1">
                Measure 🗲
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results & Scientific Derivation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Mathematical Derivation & Amplitudes (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Mathematical Derivation & Transformation
            </h3>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 font-mono text-sm text-cyan-300 leading-relaxed">
              {result?.math_derivation || 'Computing transformation...'}
            </div>
            <p className="text-xs text-slate-300 mt-4 leading-relaxed">
              {result?.explanation}
            </p>
          </div>

          {/* Current Statevector */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Output Statevector Amplitudes
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {result?.statevector?.map((amp) => (
                <div key={amp.basis} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-base">{amp.basis}</span>
                    <span className="text-cyan-400 font-semibold">{amp.formatted}</span>
                  </div>
                  <div className="space-y-1 text-slate-400 text-[11px]">
                    <div className="flex justify-between">
                      <span>Real part:</span>
                      <span className="text-slate-200">{amp.real}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Imag part:</span>
                      <span className="text-slate-200">{amp.imag}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phase angle:</span>
                      <span className="text-violet-300">{amp.phase_degrees}°</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800 font-semibold">
                      <span>Theoretical Prob:</span>
                      <span className="text-emerald-400">{(amp.probability * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Qiskit Aer Measurement Chart (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-violet-400" />
                <span>Simulation Outcomes</span>
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                {shots} Shots (Aer)
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="basis" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12, fontFamily: 'monospace' }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 100]} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0b0f19',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Theoretical" fill="#8b5cf6" name="Theoretical Prob (%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Observed" fill="#06b6d4" name="Observed Count (%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Counts Breakdown */}
            {result?.counts && (
              <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex justify-around text-center">
                <div>
                  <span className="text-slate-400 block text-[11px]">|0⟩ Counts</span>
                  <span className="text-lg font-bold text-violet-400">{result.counts['0']}</span>
                </div>
                <div className="border-r border-slate-800" />
                <div>
                  <span className="text-slate-400 block text-[11px]">|1⟩ Counts</span>
                  <span className="text-lg font-bold text-cyan-400">{result.counts['1']}</span>
                </div>
              </div>
            )}
          </div>

          {/* Qiskit Raw Drawing */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              Qiskit Text Circuit
            </h4>
            <pre className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-violet-300 overflow-x-auto border border-slate-800/80 leading-snug">
              {result?.circuit?.ascii_art || 'q_0: ───'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
