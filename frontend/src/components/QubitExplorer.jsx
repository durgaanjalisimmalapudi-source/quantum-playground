import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Atom, Play, Sparkles, RefreshCw, BarChart3, HelpCircle, Info, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export default function QubitExplorer() {
  const [selectedState, setSelectedState] = useState('0');
  const [experimentData, setExperimentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [measuring, setMeasuring] = useState(false);
  const [error, setError] = useState(null);
  const [shots, setShots] = useState(100);

  // Load state on change
  useEffect(() => {
    loadState(selectedState);
  }, [selectedState]);

  const loadState = async (state) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.prepareQubit(state);
      setExperimentData(data);
    } catch (err) {
      setError(err.message || 'Failed to prepare qubit state.');
    } finally {
      setLoading(false);
    }
  };

  const handleMeasure = async (numShots) => {
    setMeasuring(true);
    setError(null);
    try {
      const data = await api.measureQubit(selectedState, numShots);
      setExperimentData(data);
    } catch (err) {
      setError(err.message || 'Measurement simulation failed.');
    } finally {
      setMeasuring(false);
    }
  };

  // Prepare chart data comparing Theoretical Probability vs Observed Frequency
  const chartData = [
    {
      outcome: '|0⟩',
      Theoretical: experimentData?.probabilities?.['0'] ? Math.round(experimentData.probabilities['0'] * 100) : 0,
      Observed: experimentData?.frequencies?.['0'] !== undefined ? Math.round(experimentData.frequencies['0'] * 100) : null,
      counts: experimentData?.counts?.['0'] || 0,
    },
    {
      outcome: '|1⟩',
      Theoretical: experimentData?.probabilities?.['1'] ? Math.round(experimentData.probabilities['1'] * 100) : 0,
      Observed: experimentData?.frequencies?.['1'] !== undefined ? Math.round(experimentData.frequencies['1'] * 100) : null,
      counts: experimentData?.counts?.['1'] || 0,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              Module 1
            </span>
            <span className="text-xs text-slate-400">Interactive Quantum Computing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Qubit Explorer</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Discover quantum superposition, probability amplitudes, and the physics of state collapse.
          </p>
        </div>

        {/* State Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedState('0')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              selectedState === '0'
                ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Prepare |0⟩
          </button>
          <button
            onClick={() => setSelectedState('1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              selectedState === '1'
                ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Prepare |1⟩ (X Gate)
          </button>
          <button
            onClick={() => setSelectedState('+')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              selectedState === '+'
                ? 'bg-violet-500 text-white shadow-glow-violet font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            |+⟩ Superposition
          </button>
          <button
            onClick={() => setSelectedState('-')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              selectedState === '-'
                ? 'bg-violet-500 text-white shadow-glow-violet font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            |−⟩ Phase State
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-sm">
          {error}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quantum State Display & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active State Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Current Quantum State
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                {experimentData?.state_label || `State |${selectedState}⟩`}
              </span>
            </div>

            {/* Large Mathematical State Formulation */}
            <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800/80 my-3 font-mono text-center">
              <div className="text-xl sm:text-2xl text-cyan-300 font-bold tracking-wider">
                {experimentData?.math_derivation || '|ψ⟩ = α|0⟩ + β|1⟩'}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Born's Rule: Total probability P = |α|² + |β|² = 1.000 (100%)
              </p>
            </div>

            {/* Complex Amplitudes Breakdown */}
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-slate-300 mb-2.5 uppercase tracking-wider">
                Probability Amplitudes
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {experimentData?.statevector?.map((amp) => (
                  <div
                    key={amp.basis}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800"
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="font-bold text-white text-sm">{amp.basis}</span>
                      <span className="text-cyan-400 font-semibold">{amp.formatted}</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-400 font-mono">
                      <div className="flex justify-between">
                        <span>Magnitude |α|:</span>
                        <span className="text-slate-200">{amp.magnitude}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phase θ:</span>
                        <span className="text-violet-300">{amp.phase_degrees}°</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-1 border-t border-slate-800/80">
                        <span>Theoretical P:</span>
                        <span className="text-emerald-400">{(amp.probability * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Measurement Simulation Controls */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Simulate Finite Measurement
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Triggers actual quantum measurement via Qiskit Aer
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleMeasure(1)}
                    disabled={measuring}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all flex items-center space-x-1.5 shadow"
                  >
                    <Play className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Measure Once (1 Shot)</span>
                  </button>
                  <button
                    onClick={() => handleMeasure(100)}
                    disabled={measuring}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-glow-cyan flex items-center space-x-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${measuring ? 'animate-spin' : ''}`} />
                    <span>Run 100 Shots</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Concept Guide */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Scientific Explanation</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {experimentData?.explanation || 'Loading scientific explanation...'}
            </p>

            {/* Special Highlight for |+> and |-> */}
            <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs text-violet-200">
              <span className="font-bold text-violet-300 block mb-1">
                Crucial Concept: Why |+⟩ and |−⟩ are distinct states despite identical 50/50 probabilities
              </span>
              Both <code className="bg-black/40 px-1 py-0.5 rounded text-cyan-300 font-mono">|+⟩ = (|0⟩ + |1⟩)/√2</code> and{' '}
              <code className="bg-black/40 px-1 py-0.5 rounded text-cyan-300 font-mono">|−⟩ = (|0⟩ − |1⟩)/√2</code> yield exactly 50% |0⟩ and 50% |1⟩ when measured in the computational Z-basis. 
              However, their relative phase is shifted by 180° (π radians). 
              If you apply a second Hadamard gate, <strong className="text-white">H|+⟩ returns to |0⟩</strong>, while <strong className="text-white">H|−⟩ flips to |1⟩</strong> due to quantum interference!
            </div>
          </div>
        </div>

        {/* Right Column: Visualization Chart & Measurement Results (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Measurement Histogram Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Measurement Distribution</span>
              </h3>
              {experimentData?.shots && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                  {experimentData.shots} Shots Simulated
                </span>
              )}
            </div>

            {/* Recharts Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="outcome" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12, fontFamily: 'monospace' }} />
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
                  <Bar dataKey="Theoretical" fill="#3b82f6" name="Theoretical Prob (%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Observed" fill="#06b6d4" name="Observed Count (%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Finite-shot Count Tally */}
            {experimentData?.counts ? (
              <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs">
                <div className="text-slate-400 mb-1 font-semibold uppercase text-[10px]">
                  Finite Experimental Count Counts:
                </div>
                <div className="flex justify-around text-center">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Outcome |0⟩</span>
                    <span className="text-lg font-bold text-cyan-400">
                      {experimentData.counts['0']} <span className="text-xs text-slate-500 font-normal">counts</span>
                    </span>
                  </div>
                  <div className="border-r border-slate-800" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Outcome |1⟩</span>
                    <span className="text-lg font-bold text-violet-400">
                      {experimentData.counts['1']} <span className="text-xs text-slate-500 font-normal">counts</span>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                Click <strong>"Measure Once"</strong> or <strong>"Run 100 Shots"</strong> to observe state collapse and count frequencies.
              </div>
            )}
          </div>

          {/* Qiskit Circuit ASCII Diagram */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
              <span>Qiskit Circuit Representation</span>
              <span className="text-[10px] text-cyan-400 lowercase">qiskit.QuantumCircuit(1)</span>
            </h4>
            <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 overflow-x-auto border border-slate-800/80 leading-snug">
              {experimentData?.circuit?.ascii_art || 'q_0: ───'}
            </pre>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              Circuit depth: {experimentData?.circuit?.depth ?? 0} | Gate count: {experimentData?.circuit?.gate_count ?? 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
