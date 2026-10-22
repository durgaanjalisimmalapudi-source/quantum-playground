import React from 'react';
import { Users, GraduationCap, Sparkles, Award, Code, BrainCircuit } from 'lucide-react';

export default function TeamSection() {
  const teamMembers = [
    {
      id: 1,
      role: 'Student Developer 1',
      title: 'Undergraduate AI & ML Student',
      placeholderName: '[Student Member 1 — Full Name]',
      affiliation: '[University / Department Placeholder]',
      bio: 'Undergraduate researcher in Artificial Intelligence and Machine Learning specializing in quantum circuits, full-stack application architecture, and Qiskit simulation backend integration.',
      focus: 'Quantum Algorithms & Simulation Backend',
    },
    {
      id: 2,
      role: 'Student Developer 2',
      title: 'Undergraduate AI & ML Student',
      placeholderName: '[Student Member 2 — Full Name]',
      affiliation: '[University / Department Placeholder]',
      bio: 'Undergraduate researcher in Artificial Intelligence and Machine Learning focusing on interactive user interfaces, educational pedagogical design, and data visualization for quantum states.',
      focus: 'UI/UX Design & Pedagogical Engineering',
    },
  ];

  return (
    <section className="py-16 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-950/80 border border-violet-500/40 text-violet-300 mb-3">
            <Users className="w-3.5 h-3.5 text-violet-400" />
            <span>Project Contributors</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Meet the Development Team
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Developed by two undergraduate AI & Machine Learning students for the <strong>QExpo 2026</strong> Quantum Education & Outreach Exhibition.
          </p>
        </div>

        {/* Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-violet-500/40 transition-colors"
            >
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {member.placeholderName}
                    </h3>
                    <p className="text-xs text-violet-400 font-medium">
                      {member.title}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {member.affiliation}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                    Focus: {member.focus}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 italic">
                * Editable placeholder for Expo team submission
              </div>
            </div>
          ))}
        </div>

        {/* Expo Exhibition Details Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">QExpo 2026 Submission</h4>
              <p className="text-xs text-slate-400">Category: Quantum Education & Outreach • Local Simulation Track</p>
            </div>
          </div>
          <div className="text-xs font-mono text-cyan-300 px-3 py-1.5 rounded-lg bg-black/40 border border-cyan-800/40">
            Status: Exhibition-Ready
          </div>
        </div>
      </div>
    </section>
  );
}
