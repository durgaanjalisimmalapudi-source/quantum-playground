import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  Sparkles,
  Award,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

const JUDGE_STEPS = [
  {
    step: 1,
    title: '1. Start as a Beginner (Qubit Explorer)',
    targetTab: 'qubit',
    desc: 'Explore the difference between a classical bit and a qubit. Prepare |0⟩, |1⟩, and observe the superposition states |+⟩ and |−⟩.',
    tip: 'Click on the |+⟩ button to see 50/50 superposition amplitudes.',
  },
  {
    step: 2,
    title: '2. Learn and Apply the Hadamard Gate',
    targetTab: 'gate',
    desc: 'Visit the Gate Academy. Click on the Hadamard (H) gate to examine its unitary matrix, 180° rotation axis, and test bench.',
    tip: 'Observe how applying H to |0⟩ creates equal superposition, but applying H to |+⟩ restores |0⟩.',
  },
  {
    step: 3,
    title: '3. Observe State Change on the 3D Bloch Sphere',
    targetTab: 'bloch',
    desc: 'Rotate the 3D Bloch sphere in real time. Apply gates (X, H, S, RX) to watch the state vector smoothly animate along spherical arcs.',
    tip: 'Drag with the mouse to orbit around yaw and pitch. Notice the live polar angles θ and φ.',
  },
  {
    step: 4,
    title: '4. Build a Bell State using H and CNOT',
    targetTab: 'circuit',
    desc: 'Open the Quantum Circuit Builder. Build the canonical circuit: H on wire 0 followed by CNOT(0→1) to prepare the maximally entangled state |Φ+⟩.',
    tip: 'Click the "Bell State |Φ+⟩" preset button or manually add H(q0) and CX(q0→q1).',
  },
  {
    step: 5,
    title: '5. Inspect Measurement Probabilities',
    targetTab: 'bell',
    desc: 'Switch to the dedicated Bell States Explorer. Run 1000 simulated shots in the computational Z-basis, then rotate to the X-basis.',
    tip: 'Notice perfect correlation: only |00⟩ and |11⟩ appear in Z-basis measurements.',
  },
  {
    step: 6,
    title: '6. Solve a Quantum Circuit Challenge',
    targetTab: 'missions',
    desc: 'Navigate to Learning Missions Level 1 or 2. Complete the mission challenge and submit the 3-question quiz.',
    tip: 'Earn XP and watch your player level advance from Novice to Master!',
  },
  {
    step: 7,
    title: '7. Unlock the Next Level & Claim Certificate',
    targetTab: 'challenges',
    desc: 'View your unlocked badges on the Leaderboard and claim your official QExpo 2026 Quantum Master Certificate!',
    tip: 'Click "Claim Quantum Master Certificate" to view or print the credential.',
  },
];

export default function JudgeDemoTour({
  isOpen = false,
  onClose = null,
  onNavigate = null,
  onOpenCertificate = null,
}) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const step = JUDGE_STEPS[currentStepIdx];

  const handleNext = () => {
    sounds.playGateClick(600);
    if (currentStepIdx < JUDGE_STEPS.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      if (onNavigate) {
        onNavigate(JUDGE_STEPS[nextIdx].targetTab);
      }
    } else {
      if (onOpenCertificate) onOpenCertificate();
      if (onClose) onClose();
    }
  };

  const handlePrev = () => {
    sounds.playGateClick(500);
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      if (onNavigate) {
        onNavigate(JUDGE_STEPS[prevIdx].targetTab);
      }
    }
  };

  const jumpToStep = (idx) => {
    sounds.playGateClick(550);
    setCurrentStepIdx(idx);
    if (onNavigate) {
      onNavigate(JUDGE_STEPS[idx].targetTab);
    }
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 bg-slate-950/95 border-2 border-cyan-500/70 rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(6,182,212,0.4)] backdrop-blur-xl animate-fadeIn text-slate-100">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span className="font-bold text-[11px] sm:text-xs uppercase tracking-wider text-cyan-300 truncate">
            QExpo 2026 Judge Tour
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-1.5 mb-3">
        {JUDGE_STEPS.map((s, idx) => (
          <button
            key={s.step}
            onClick={() => jumpToStep(idx)}
            className={`flex-1 h-1.5 rounded-full transition ${
              idx === currentStepIdx
                ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                : idx < currentStepIdx
                ? 'bg-emerald-500'
                : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Step Description */}
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-bold text-white flex items-center justify-between">
          <span>{step.title}</span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
            Step {step.step}/7
          </span>
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
        <div className="p-2 rounded bg-slate-900 border border-cyan-500/20 text-[11px] text-cyan-200">
          <strong>Tip for Judges: </strong>
          {step.tip}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <button
          onClick={handlePrev}
          disabled={currentStepIdx === 0}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-xs text-slate-300 flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/30 transition"
        >
          {currentStepIdx === JUDGE_STEPS.length - 1 ? (
            <>
              <Award className="w-3.5 h-3.5" />
              Claim Certificate
            </>
          ) : (
            <>
              Next Demo Step
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
