import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  Sparkles,
  Award,
  Edit3,
  Check,
  BrainCircuit,
  Lightbulb,
  Compass,
  Cpu,
} from 'lucide-react';

const DEFAULT_MEMBERS = [
  {
    id: 1,
    role: 'Lead Quantum Architect & Developer',
    name: '[Team Member 1 — Full Name]',
    affiliation: 'Department of Computer Science & Quantum Engineering',
    focus: 'Quantum Circuits, Qiskit Aer Backend & Algorithms',
    bio: 'Designs quantum circuit models, statevector simulation pipelines, and educational level progression for quantum learners.',
  },
  {
    id: 2,
    role: 'Frontend & 3D Visualization Engineer',
    name: '[Team Member 2 — Full Name]',
    affiliation: 'Department of Artificial Intelligence & Data Science',
    focus: '3D Bloch Sphere, Interactive UI & Gamification Engine',
    bio: 'Engineered the 3D projection engine for the Bloch sphere, audio synthesizers, and responsive gaming challenges.',
  },
  {
    id: 3,
    role: 'Quantum Pedagogy & UX Specialist',
    name: '[Team Member 3 — Full Name]',
    affiliation: 'Department of Physics & Computational Science',
    focus: 'Scientific Accuracy, Bell States & Educational Outreach',
    bio: 'Develops interactive pedagogical visualizations, quizzes, and ensures rigorous fidelity to quantum mechanics and the No-Signaling theorem.',
  },
];

export default function TeamSection() {
  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  // Load persisted member names if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem('quantum_team_members');
      if (stored) {
        setMembers(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const startEdit = (m) => {
    setEditingId(m.id);
    setEditName(m.name);
  };

  const saveEdit = (id) => {
    const updated = members.map((m) =>
      m.id === id ? { ...m, name: editName.trim() || m.name } : m
    );
    setMembers(updated);
    setEditingId(null);
    try {
      localStorage.setItem('quantum_team_members', JSON.stringify(updated));
    } catch {}
  };

  return (
    <section className="py-16 border-t border-slate-800/80 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* About Section: Educational Purpose & Key Innovations */}
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl backdrop-blur-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <BrainCircuit className="w-5 h-5" />
              </span>
              <h3 className="text-xl font-bold text-white tracking-wide">
                About Quantum Quest @ Quantum Playground
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              QExpo 2026 Educational Platform
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 font-bold text-sm text-cyan-300">
                <Lightbulb className="w-4 h-4 text-cyan-400" />
                Educational Purpose
              </div>
              <p>
                Quantum computing is traditionally taught through dense linear algebra, bra-ket notation, and abstract matrix mechanics that deter beginners. <strong>Quantum Quest</strong> transforms abstract theory into an engaging, interactive adventure game where learners directly manipulate qubits, observe wave-function collapse, and build quantum intuition.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 font-bold text-sm text-purple-300">
                <Compass className="w-4 h-4 text-purple-400" />
                Key Innovations
              </div>
              <p>
                Combines a hardware-accelerated 3D Bloch sphere with real-time unitary arc trajectories, a drag-and-drop multi-qubit circuit editor, dedicated Bell-state basis rotation explorers, scientifically rigorous phase differentiation, and a real <strong>Qiskit Aer</strong> simulation backend.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 font-bold text-sm text-pink-300">
                <Cpu className="w-4 h-4 text-pink-400" />
                Game-Based Learning
              </div>
              <p>
                Features 7 unlockable missions, XP progression, daily challenges, timed speedruns, interactive quizzes with instant scientific feedback, and a verifiable <strong>Quantum Master Certificate</strong> rewarding genuine conceptual mastery.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section: 3 Editable Members */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 border border-cyan-500/40 text-cyan-300 mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>Project Team & Contributors</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Meet the QExpo 2026 Team
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Three team-member cards with editable names for QExpo 2026 judges and student submissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                      Member #{member.id}
                    </span>
                  </div>

                  {/* Name (Editable) */}
                  <div>
                    {editingId === member.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-slate-950 border border-cyan-400 text-white text-sm font-bold px-2 py-1 rounded outline-none w-full"
                          placeholder="Enter full name"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEdit(member.id)}
                          className="p-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white"
                          title="Save Name"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between group">
                        <h3 className="text-base font-bold text-white tracking-tight">
                          {member.name}
                        </h3>
                        <button
                          onClick={() => startEdit(member)}
                          className="opacity-60 hover:opacity-100 text-cyan-400 p-1"
                          title="Edit Name"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-cyan-400 font-medium mt-0.5">
                      {member.role}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {member.affiliation}
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 block mb-2 truncate">
                      Focus: {member.focus}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>QExpo 2026 Participant</span>
                  <button
                    onClick={() => startEdit(member)}
                    className="text-cyan-400 hover:underline"
                  >
                    Click to edit name
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expo Exhibition Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-purple-950/40 to-cyan-950/60 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                QExpo 2026 Quantum Exhibition
              </h4>
              <p className="text-xs text-slate-300">
                Theme: Quantum Circuits: Single-Qubit & Multi-Qubit Gates, Design & Simulation
              </p>
            </div>
          </div>
          <div className="text-xs font-mono text-cyan-300 px-3.5 py-1.5 rounded-xl bg-black/60 border border-cyan-500/40">
            Evaluation Ready • Live Aer Simulation
          </div>
        </div>
      </div>
    </section>
  );
}
