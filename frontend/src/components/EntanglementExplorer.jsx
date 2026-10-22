import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Radio, Play, RotateCcw, Sparkles, BarChart3, Info, AlertCircle, ChevronDown, CheckCircle2, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export default function EntanglementExplorer() {
  const [selectedState, setSelectedState] = useState('phi_plus');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [measuring, setMeasuring] = useState(false);
  const [error, setError] = useState(null);
  const [shots, setShots] = useState(1000);
  const [showAdvancedBell, setShowAdvancedBell] = useState(false);

  const bellStates = [
    {
      id: 'phi_plus',
      label: '|Φ+⟩ (Phi Plus)',
      formula: '(|00⟩ + |11⟩)/√2',
      correlation: 'Identical (00 or 11)',
      desc: 'Correlated Bell pair: Measurement results always match.',
    },
    {
      id: 'phi_minus',
      label: '|Φ−⟩ (Phi Minus)',
      formula: '(|00⟩ − |11⟩)/√2',
      correlation: 'Identical with Phase π',
      desc: 'Identical outcomes (00 or 11) with a 180° phase shift.',
    },
    {
      id: 'psi_plus',
      label: '|Ψ+⟩ (Psi Plus)',
      formula: '(|01⟩ + |10⟩)/√2',
      correlation: 'Anti-Correlated (01 or 10)',
      desc: 'Opposite outcomes: If q0=0, q1=1; if q0=1, q1=0.',
    },
    {
      id: 'psi_minus',
      label: '|Ψ−⟩ (Singlet State)',
      formula: '(|01⟩ − |10⟩)/√2',
      correlation: 'Anti-Correlated with Phase π',
      desc: 'The singlet state: Rotationally invariant anti-correlated pair.',
    },
  ];

  useEffect(() => {
    loadBellState(selectedState);
  }, [selectedState]);

  const loadBellState = async (stateId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.prepareBell(stateId);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to prepare Bell state.');
    } finally {
      setLoading(false);
    }
  };

  const handleMeasure = async (numShots) => {
    setMeasuring(true);
    setError(null);
    setShots(numShots);
    try {
      const data = await api.measureBell(selectedState, numShots);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to measure Bell state.');
    } finally {
      setMeasuring(false);
    }
  };

  const chartData = ['00', '01', '10', '11'].map((basis) => ({
    basis: `|${basis}⟩`,
    Theoretical: result?.probabilities?.[basis] ? Math.round(result.probabilities[basis] * 100) : 0,
    Observed: result?.frequencies?.[basis] !== undefined ? Math.round(result.frequencies[basis] * 100) : null,
    counts: result?.counts?.[basis] || 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-fuchsia-950 border border-fuchsia-500/40 text-fuchsia-300">
              Module 3
            </span>
            <span className="text-xs text-slate-400">Two-Qubit Quantum Entanglement</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Entanglement Explorer</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Simulate the 4 canonical Bell states, inspect quantum correlations, and analyze non-locality.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleMeasure(100)}
            disabled={measuring}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all flex items-center space-x-1.5"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            <span>100 Shots</span>
          </button>
          <button
            onClick={() => handleMeasure(1000)}
            disabled={measuring}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500 text-white font-bold text-xs transition-all shadow-glow-violet flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1000 Shots (Aer)</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-sm">
          {error}
        </div>
      )}

      {/* Bell State Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {bellStates.map((b) => {
          const isSelected = selectedState === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedState(b.id)}
              className={`p-4 rounded-2xl text-left border transition-all ${
                isSelected
                  ? 'bg-fuchsia-950/60 border-fuchsia-500 shadow-glow-violet'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white font-mono">{b.label}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-fuchsia-400" />}
              </div>
              <div className="font-mono text-xs text-fuchsia-300 font-semibold mb-1">
                {b.formula}
              </div>
              <div className="text-[11px] text-slate-400 leading-snug">{b.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Mathematical State & Visual Correlation (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Prepared Bell State
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800">
                {result?.state_label}
              </span>
            </div>

            {/* Formula Block */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center font-mono my-3">
              <div className="text-lg sm:text-xl text-fuchsia-300 font-bold">
                {result?.math_derivation}
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Entangled state: Cannot be factored as |ψ⟩ = |q₁⟩ ⊗ |q₀⟩
              </p>
            </div>

            {/* Correlation Visualizer */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mt-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Quantum Correlation Demonstration
              </h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-mono">Qubit 0 (Control)</span>
                  <div className="text-cyan-400 font-mono font-bold text-base mt-1">
                    50% |0⟩ / 50% |1⟩
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">Individually 100% random</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-mono">Qubit 1 (Target)</span>
                  <div className="text-fuchsia-400 font-mono font-bold text-base mt-1">
                    {selectedState.startsWith('phi') ? 'Exact Same as Q0' : 'Exact Opposite of Q0'}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">Instantaneously correlated</span>
                </div>
              </div>
            </div>

            {/* Qiskit Bitstring Convention Note */}
            <div className="mt-4 p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 font-mono">
              <span className="font-bold text-cyan-300 block mb-1">
                Notice: Qiskit Little-Endian Bitstring Convention
              </span>
              {result?.qubit_order_note}
            </div>
          </div>

          {/* Scientific Explanation Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Info className="w-4 h-4 text-fuchsia-400" />
              <span>Scientific Explanation & Phase Nuance</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {result?.explanation}
            </p>

            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
              <span className="font-bold text-amber-300 block mb-1">
                The Relative Phase Blind Spot
              </span>
              Notice that <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200 font-mono">|Φ+⟩</code> and{' '}
              <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200 font-mono">|Φ−⟩</code> both yield 50% 00 and 50% 11 when measured in the computational Z-basis. 
              The minus sign (relative phase of π) cannot be seen from standard computational basis probabilities alone, because <code className="bg-black/40 px-1 py-0.5 rounded font-mono">|+1/√2|² = |-1/√2|² = 0.5</code>.
            </div>
          </div>

          {/* Advanced Bell Inequality Accordion */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <button
              onClick={() => setShowAdvancedBell(!showAdvancedBell)}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-900/40 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">
                  Advanced Expo Topic: Bell's Inequality & Non-Locality
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform ${showAdvancedBell ? 'rotate-180' : ''}`} />
            </button>

            {showAdvancedBell && (
              <div className="p-5 pt-0 text-xs sm:text-sm text-slate-300 space-y-3 border-t border-slate-800/80">
                <p>
                  <strong>Why same-basis correlations alone do NOT prove non-locality:</strong> If you place a left shoe in Box A and a right shoe in Box B, opening Box A and finding a left shoe instantaneously tells you Box B contains the right shoe. This is classical shared correlation, not quantum mechanics!
                </p>
                <p>
                  In 1964, physicist John Stewart Bell proved that local hidden variable theories satisfy an upper bound on statistical correlations (such as the CHSH inequality: <code className="text-violet-300 font-mono font-bold">|S| ≤ 2</code>).
                </p>
                <p>
                  To truly rule out local realism, physicists measure entangled pairs along <em>different non-orthogonal angles</em> (e.g. 0°, 45°, 22.5°, 67.5°). Quantum mechanics predicts <code className="text-cyan-300 font-mono font-bold">|S| = 2√2 ≈ 2.828 &gt; 2</code>, violating Bell's inequality and winning the 2022 Nobel Prize in Physics.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Qiskit Aer Measurement Chart & 4-State Distribution (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-fuchsia-400" />
                <span>Two-Qubit State Distribution</span>
              </h3>
              {result?.shots && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                  {result.shots} Shots
                </span>
              )}
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
                  <Bar dataKey="Theoretical" fill="#d946ef" name="Theoretical (%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Observed" fill="#06b6d4" name="Observed (%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Counts Grid for 00, 01, 10, 11 */}
            {result?.counts ? (
              <div className="mt-4 grid grid-cols-4 gap-2 font-mono text-center text-xs">
                {['00', '01', '10', '11'].map((b) => (
                  <div key={b} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">|{b}⟩</span>
                    <span className={`text-base font-bold ${result.counts[b] > 0 ? 'text-fuchsia-400' : 'text-slate-600'}`}>
                      {result.counts[b]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                Click <strong>"100 Shots"</strong> or <strong>"1000 Shots"</strong> above to run real Qiskit Aer measurement simulation.
              </div>
            )}
          </div>

          {/* Qiskit Entanglement Circuit Drawing */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
              <span>Qiskit Two-Qubit Circuit</span>
              <span className="text-[10px] text-fuchsia-400 lowercase">qiskit.QuantumCircuit(2)</span>
            </h4>
            <pre className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-fuchsia-300 overflow-x-auto border border-slate-800/80 leading-snug">
              {result?.circuit?.ascii_art || 'q_0: ───\nq_1: ───'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
