import React, { useState } from 'react';
import {
  Trophy,
  Lock,
  Unlock,
  CheckCircle2,
  ChevronRight,
  Play,
  HelpCircle,
  Sparkles,
  Zap,
  RotateCcw,
  BookOpen,
  Award,
  ArrowRight,
  Sliders,
  Compass,
  Cpu,
  Layers,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import QubitExplorer from './QubitExplorer';
import GateLibrary from './GateLibrary';
import BlochSphere from './BlochSphere';
import BellStatesExplorer from './BellStatesExplorer';
import CircuitSimulator from './CircuitSimulator';

export const MISSIONS_DATA = [
  {
    id: 1,
    title: 'Level 1: Qubit Explorer',
    subtitle: 'Bits, Qubits & Superposition',
    badge: 'Qubit Novice',
    xpReward: 100,
    icon: Sliders,
    color: 'from-blue-600 to-cyan-500',
    explanation: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          In classical computing, the fundamental unit of information is the <strong>bit</strong>, which must be deterministically either <code>0</code> or <code>1</code> (like a light switch or a coin resting flat on a table).
        </p>
        <p>
          In quantum computing, the fundamental unit is the <strong>qubit</strong> (quantum bit). A qubit can exist in a linear combination of both states simultaneously, known as a <strong>superposition</strong>:
        </p>
        <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/30 text-center font-mono text-cyan-300">
          |ψ⟩ = α|0⟩ + β|1⟩
        </div>
        <p>
          Here, α and β are complex probability amplitudes satisfying the normalization condition:
          |α|² + |β|² = 1.
          When you measure the qubit in the computational basis, it <strong>collapses</strong> to outcome 0 with probability |α|² and outcome 1 with probability |β|².
        </p>
      </div>
    ),
    challenge: {
      title: 'Mission Challenge: Create Equal Superposition',
      task: 'Prepare a qubit state that yields an exact 50% probability of measuring |0⟩ and 50% probability of measuring |1⟩ with equal positive amplitudes.',
      hint: 'Apply the Hadamard (H) gate to the ground state |0⟩ to reach |+⟩ = (|0⟩ + |1⟩)/√2.',
      targetState: '+',
    },
    quiz: [
      {
        question: 'What is the sum of measurement probabilities |α|² + |β|² for any valid pure qubit state?',
        options: ['0.5', '1.0', '2.0', 'Depends on the number of gates applied'],
        correctIndex: 1,
        explanation: 'Normalization requires the total probability across all mutually exclusive basis states to always sum to exactly 1.0 (100%).',
      },
      {
        question: 'When a qubit in equal superposition (|0⟩ + |1⟩)/√2 is measured in the Z-basis, what happens?',
        options: [
          'It stays in superposition forever',
          'It randomly collapses to either |0⟩ or |1⟩ with 50% probability',
          'It outputs both 0 and 1 simultaneously on the screen',
          'It is destroyed and cannot be used again',
        ],
        correctIndex: 1,
        explanation: 'According to the Copenhagen postulate, measurement projects the continuous probability wave into a single discrete basis state.',
      },
      {
        question: 'Which of the following represents the computational basis states?',
        options: ['{X, Y}', '{|0⟩, |1⟩}', '{|+⟩, |−⟩}', '{CNOT, CZ}'],
        correctIndex: 1,
        explanation: '|0⟩ and |1⟩ form the standard computational orthonormal basis in the 2-dimensional single-qubit Hilbert space.',
      },
    ],
  },
  {
    id: 2,
    title: 'Level 2: Single-Qubit Gate Academy',
    subtitle: 'Pauli Gates, Hadamard & Phase Rotations',
    badge: 'Gate Apprentice',
    xpReward: 150,
    icon: BookOpen,
    color: 'from-indigo-600 to-purple-500',
    explanation: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          Quantum logic gates are represented by <strong>unitary matrices</strong> (U† U = I), meaning all quantum operations are reversible and preserve total probability.
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-slate-300">
          <li><strong>Pauli-X (NOT):</strong> Flips |0⟩ ↔ |1⟩.</li>
          <li><strong>Pauli-Y:</strong> Combines bit-flip with a relative phase shift i.</li>
          <li><strong>Pauli-Z:</strong> Flips the phase of |1⟩ (|1⟩ → -|1⟩).</li>
          <li><strong>Hadamard (H):</strong> Maps |0⟩ → |+⟩ and |1⟩ → |−⟩.</li>
          <li><strong>Phase (S & T):</strong> Shifts the relative phase by π/2 and π/4.</li>
          <li><strong>Rotations (RX, RY, RZ):</strong> Continuously rotate the state vector by angle θ.</li>
        </ul>
      </div>
    ),
    challenge: {
      title: 'Mission Challenge: Synthesize the Negative Superposition State',
      task: 'Transform the ground state |0⟩ into the negative superposition state |−⟩ = (|0⟩ − |1⟩)/√2 using single-qubit gates.',
      hint: 'Flip |0⟩ to |1⟩ with an X gate, then apply Hadamard (H). Or apply H then Z!',
      targetState: '-',
    },
    quiz: [
      {
        question: 'What is the mathematical result of applying the Pauli-X gate twice (X · X)?',
        options: ['Pauli-Z gate', 'Hadamard gate', 'Identity gate (I)', 'Zero matrix'],
        correctIndex: 2,
        explanation: 'Because X² = I, Pauli-X is an involution. Flipping a qubit twice restores the original quantum state.',
      },
      {
        question: 'What is the action of the Hadamard gate on the state |1⟩?',
        options: ['|0⟩', '(|0⟩ + |1⟩)/√2 = |+⟩', '(|0⟩ − |1⟩)/√2 = |−⟩', 'i|1⟩'],
        correctIndex: 2,
        explanation: 'H |1⟩ = (|0⟩ − |1⟩)/√2 = |−⟩, producing an equal superposition with a relative phase of π (180°).',
      },
      {
        question: 'Which gate is known as the √Z gate because applying it twice equals Pauli-Z?',
        options: ['T gate', 'S gate', 'Hadamard gate', 'Y gate'],
        correctIndex: 1,
        explanation: 'The S gate applies a π/2 phase shift. S² applies a π phase shift, which is exactly the Pauli-Z gate!',
      },
    ],
  },
  {
    id: 3,
    title: 'Level 3: Bloch Sphere Adventure',
    subtitle: '3D Geometry, State Trajectories & Phase',
    badge: 'Bloch Explorer',
    xpReward: 200,
    icon: Compass,
    color: 'from-cyan-600 to-teal-500',
    explanation: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          Every pure state of a single qubit can be geometrically mapped to a unique point on the surface of a unit sphere in R³, called the <strong>Bloch sphere</strong>:
        </p>
        <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/30 text-center font-mono text-cyan-300">
          |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩
        </div>
        <p>
          The North Pole corresponds to |0⟩ (θ=0), the South Pole to |1⟩ (θ=π), and the equator contains all equal superpositions differing only by relative phase φ.
        </p>
      </div>
    ),
    challenge: {
      title: 'Mission Challenge: Navigate to the Y-Equator',
      task: 'Rotate the state vector from |0⟩ into the state |+i⟩ = (|0⟩ + i|1⟩)/√2 on the Bloch sphere equator.',
      hint: 'First apply Hadamard (H) to move to |+⟩ along the X-axis, then apply Phase (S) to rotate 90° around Z onto the +Y axis!',
      targetState: '+i',
    },
    quiz: [
      {
        question: 'Where is the ground state |0⟩ located on the standard Bloch sphere?',
        options: ['At the center (0, 0, 0)', 'At the North Pole (0, 0, 1)', 'At the South Pole (0, 0, -1)', 'On the equator'],
        correctIndex: 1,
        explanation: 'In standard Bloch coordinates, θ = 0 places |0⟩ at the North Pole (0, 0, 1).',
      },
      {
        question: 'Why does multiplying a quantum state by a global phase e^{iγ} not change its position on the Bloch sphere?',
        options: [
          'Because global phase is physically unobservable and does not alter any measurement probability',
          'Because computers round off small phases',
          'Because the Bloch sphere only shows real numbers',
          'Because global phase cancels out in the Y-axis',
        ],
        correctIndex: 0,
        explanation: 'Global phase factors have no observable physical consequence. All physical states are rays in projective Hilbert space.',
      },
      {
        question: 'What is the polar angle θ for the state |+⟩ = (|0⟩ + |1⟩)/√2?',
        options: ['0 radians (0°)', 'π/2 radians (90°)', 'π radians (180°)', '2π radians (360°)'],
        correctIndex: 1,
        explanation: 'For |+⟩, cos(θ/2) = 1/√2 implies θ/2 = 45°, so θ = 90° (π/2), placing it squarely on the equator.',
      },
    ],
  },
  {
    id: 4,
    title: 'Level 4: Multi-Qubit Mission',
    subtitle: 'Tensor Products & Controlled Operations',
    badge: 'Multi-Qubit Navigator',
    xpReward: 250,
    icon: Layers,
    color: 'from-purple-600 to-pink-500',
    explanation: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          When multiple qubits combine, their composite state space is the <strong>tensor product</strong> of the individual Hilbert spaces: H = H₁ ⊗ H₂.
        </p>
        <p>
          For n qubits, the dimension of the statevector grows exponentially as 2ⁿ:
          2 qubits ⟹ 2² = 4 basis states: |00⟩, |01⟩, |10⟩, and |11⟩.
        </p>
        <p>
          Controlled gates like <strong>CNOT (Controlled-NOT)</strong>, <strong>CZ (Controlled-Z)</strong>, and <strong>SWAP</strong> allow qubits to interact, generating entanglement.
        </p>
      </div>
    ),
    challenge: {
      title: 'Mission Challenge: Construct a Controlled-Flip',
      task: 'Wire two qubits so that Qubit 1 flips from |0⟩ to |1⟩ if and only if Qubit 0 is |1⟩.',
      hint: 'Place a CNOT (CX) gate with Control on wire 0 and Target on wire 1.',
      targetState: 'cnot',
    },
    quiz: [
      {
        question: 'How many basis states exist in the Hilbert space of a 3-qubit quantum system?',
        options: ['3', '6', '8 (2³)', '9 (3²)'],
        correctIndex: 2,
        explanation: 'An n-qubit system has dimension 2ⁿ. For n = 3, 2³ = 8 basis states (|000⟩ through |111⟩).',
      },
      {
        question: 'What is the action of CNOT when the control qubit is in state |0⟩?',
        options: ['It flips the target qubit', 'It leaves the target qubit unchanged', 'It collapses both qubits', 'It entangles them into a Bell state'],
        correctIndex: 1,
        explanation: 'When control is |0⟩, CNOT acts as the identity operator on the target qubit, leaving it unchanged.',
      },
      {
        question: 'Which of the following gates is completely symmetric between control and target?',
        options: ['CNOT (CX)', 'Controlled-Z (CZ)', 'Toffoli (CCX)', 'Measurement'],
        correctIndex: 1,
        explanation: 'CZ applies a -1 phase factor only to |11⟩. Because c · t = t · c, switching control and target produces the identical operator.',
      },
    ],
  },
  {
    id: 5,
    title: 'Level 5: Bell State Challenge',
    subtitle: 'Maximally Entangled States & Non-Locality',
    badge: 'Entanglement Pioneer',
    xpReward: 300,
    icon: Zap,
    color: 'from-pink-600 to-rose-500',
    explanation: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          <strong>Quantum Entanglement</strong> is a phenomenon where the quantum states of two or more qubits cannot be described independently of each other, regardless of how far apart they are separated.
        </p>
        <p>
          The 4 canonical <strong>Bell states</strong> are:
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-xs">
          <li>|Φ+⟩ = (|00⟩ + |11⟩)/√2</li>
          <li>|Φ−⟩ = (|00⟩ − |11⟩)/√2</li>
          <li>|Ψ+⟩ = (|01⟩ + |10⟩)/√2</li>
          <li>|Ψ−⟩ = (|01⟩ − |10⟩)/√2</li>
        </ul>
      </div>
    ),
    challenge: {
      title: 'Mission Challenge: Convert |Φ+⟩ into |Ψ+⟩',
      task: 'Transform |Φ+⟩ into the anti-correlated Bell state |Ψ+⟩ by applying a single local gate to Qubit 1.',
      hint: 'Applying Pauli-X to Qubit 1 flips |00⟩ to |01⟩ and |11⟩ to |10⟩, creating |Ψ+⟩!',
      targetState: 'psi_plus',
    },
    quiz: [
      {
        question: 'What is the standard quantum circuit to prepare the Bell state |Φ+⟩ from |00⟩?',
        options: ['X on q0, then X on q1', 'Hadamard on q0, then CNOT with control q0 and target q1', 'Hadamard on both qubits', 'SWAP gate between q0 and q1'],
        correctIndex: 1,
        explanation: 'H on q0 creates (|0⟩+|1⟩)/√2 ⊗ |0⟩ = (|00⟩+|10⟩)/√2. The subsequent CNOT flips the target only for |10⟩, yielding (|00⟩+|11⟩)/√2.',
      },
      {
        question: 'If two qubits are in the state |Φ+⟩, what happens when Qubit 0 is measured and yields 1?',
        options: ['Qubit 1 has 50% chance of being 0 and 50% of being 1', 'Qubit 1 immediately collapses to 1 with 100% certainty', 'Qubit 1 collapses to 0', 'Both qubits are destroyed'],
        correctIndex: 1,
        explanation: '|Φ+⟩ only contains |00⟩ and |11⟩ terms. Observing a 1 on Qubit 0 eliminates the |00⟩ term, guaranteeing Qubit 1 is 1.',
      },
      {
        question: 'Does quantum entanglement allow instantaneous communication faster than light?',
        options: [
          'Yes, it violates Einstein’s relativity',
          'No, because measurement outcomes on each local qubit are completely random without classical communication (No-Signaling Theorem)',
          'Only within a few meters distance',
          'Yes, if using fiber optic cables',
        ],
        correctIndex: 1,
        explanation: 'The No-Signaling Theorem proves that no usable information or signal can be transmitted faster than light through entanglement alone.',
      },
    ],
  },
  {
    id: 6,
    title: 'Level 6: Quantum Circuit Builder',
    subtitle: 'Circuit Architecture, Simulation & Depth',
    badge: 'Circuit Architect',
    xpReward: 400,
    icon: Cpu,
    color: 'from-amber-600 to-yellow-500',
    explanation: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          Quantum circuits are sequences of quantum gates arranged chronologically on wires representing qubits. Key architectural metrics include:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-slate-300">
          <li><strong>Width:</strong> The number of qubit wires in the circuit.</li>
          <li><strong>Depth:</strong> The number of discrete time steps (layers) required to execute the circuit in parallel.</li>
          <li><strong>Gate Count:</strong> Total number of elementary unitary operations applied.</li>
        </ul>
      </div>
    ),
    challenge: {
      title: 'Mission Challenge: Build a 3-Qubit GHZ State',
      task: 'Construct a circuit on 3 wires that creates the Greenberger-Horne-Zeilinger state: (|000⟩ + |111⟩)/√2.',
      hint: 'Apply H to wire 0, then CNOT(0→1), then CNOT(1→2)!',
      targetState: 'ghz',
    },
    quiz: [
      {
        question: 'What is circuit depth in quantum computing?',
        options: [
          'The number of qubits in the circuit',
          'The number of layers of quantum gates that can be executed concurrently in parallel',
          'The error rate of the hardware',
          'The physical thickness of the quantum chip',
        ],
        correctIndex: 1,
        explanation: 'Circuit depth measures the longest sequence of dependent gates, directly dictating how long coherence must be maintained.',
      },
      {
        question: 'In the Quantum Teleportation protocol, how many classical bits must Alice send to Bob?',
        options: ['0 bits', '1 bit', '2 classical bits', 'Infinite bits'],
        correctIndex: 2,
        explanation: 'Alice measures her two qubits in the Bell basis and sends 2 classical bits to tell Bob which of the 4 Pauli corrections to apply.',
      },
      {
        question: 'What happens if a circuit’s depth exceeds the qubit coherence time (T1 and T2)?',
        options: ['The circuit executes faster', 'Decoherence and quantum noise destroy the quantum state', 'The computer switches to classical bits', 'The voltage increases'],
        correctIndex: 1,
        explanation: 'If circuit duration exceeds T1 (relaxation time) or T2 (dephasing time), environmental noise destroys superposition and phase information.',
      },
    ],
  },
  {
    id: 7,
    title: 'Level 7: Quantum Master Challenge',
    subtitle: 'Grand Boss Puzzles & Quantum Master Certificate',
    badge: 'Grand Quantum Master',
    xpReward: 600,
    icon: Trophy,
    color: 'from-amber-500 to-rose-600',
    explanation: (
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>
          Welcome to the final frontier of the Quantum Quest! In this master level, you combine all concepts: single-qubit interference, Bloch vector trajectories, controlled entanglement, and circuit equivalence.
        </p>
        <p>
          Successfully conquering this level awards the highest achievement badge and unlocks your official <strong>QExpo 2026 Quantum Master Certificate</strong>!
        </p>
      </div>
    ),
    challenge: {
      title: 'Boss Puzzle: Quantum Interference Cancellation Lock',
      task: 'Find the gate sequence starting from |0⟩ that creates equal superposition, rotates the relative phase by 90°, and interferes constructively back to a deterministic state.',
      hint: 'Sequence: H → S → H!',
      targetState: 'hsh',
    },
    quiz: [
      {
        question: 'Which of the following gate sequences is equivalent to the Identity operator (I)?',
        options: ['H · X · H', 'H · Z · H', 'X · X', 'H · S · H'],
        correctIndex: 2,
        explanation: 'Because X² = I, applying two Pauli-X gates in sequence exactly cancels out to the identity operator.',
      },
      {
        question: 'What is H · Z · H equivalent to?',
        options: ['Pauli-X gate', 'Pauli-Y gate', 'S gate', 'Identity gate'],
        correctIndex: 0,
        explanation: 'HZH = X! In quantum computing, sandwiching the Z gate between two Hadamards changes a phase-flip into a bit-flip (Pauli-X).',
      },
      {
        question: 'What distinguishes true quantum non-locality from classical shared randomness?',
        options: [
          'Classical coins never match',
          'Violation of Bell/CHSH inequalities when measurements are taken across non-orthogonal rotated angles',
          'Quantum states are faster than light',
          'There is no mathematical difference',
        ],
        correctIndex: 1,
        explanation: 'Classical local hidden variable theories are strictly bounded by Bell inequalities (|S| ≤ 2). Quantum entanglement violates this up to Tsirelson’s bound (|S| = 2√2 ≈ 2.828)!',
      },
    ],
  },
];

export default function LearningMissions({
  playerLevel = 1,
  playerXp = 0,
  completedMissions = [],
  onMissionCompleted = null,
  onOpenCertificate = null,
}) {
  const [activeLevelId, setActiveLevelId] = useState(1);
  const [activeSubTab, setActiveSubTab] = useState('explanation'); // explanation, demo, challenge, quiz
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const mission = MISSIONS_DATA.find((m) => m.id === activeLevelId) || MISSIONS_DATA[0];
  const isLevelUnlocked = mission.id <= playerLevel || completedMissions.includes(mission.id);

  const handleLevelSelect = (levelId) => {
    sounds.playGateClick(500);
    setActiveLevelId(levelId);
    setActiveSubTab('explanation');
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleAnswerSelect = (qIdx, optIdx) => {
    sounds.playGateClick(600);
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleQuizSubmit = () => {
    let score = 0;
    mission.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score === mission.quiz.length) {
      sounds.playVictory();
      if (onMissionCompleted) {
        onMissionCompleted(mission.id, mission.xpReward);
      }
    } else {
      sounds.playError();
    }
  };

  const completeChallenge = () => {
    sounds.playVictory();
    setChallengeCompleted(true);
    if (onMissionCompleted) {
      onMissionCompleted(mission.id, mission.xpReward);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-blue-500/30 p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Trophy className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Beginner-to-Advanced Quantum Gaming Journey
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Progress through 7 adventure missions. Solve puzzles, conduct interactive experiments, and pass quizzes to unlock the next level!
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Player Rank:
            </span>
            <span className="text-xs font-bold text-cyan-300">
              Level {playerLevel} • {playerXp} XP
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300">
            {playerLevel}
          </div>
        </div>
      </div>

      {/* Level Selector Cards Navigation (Levels 1 to 7) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-6">
        {MISSIONS_DATA.map((m) => {
          const unlocked = m.id <= playerLevel || completedMissions.includes(m.id);
          const isCompleted = completedMissions.includes(m.id);
          const isSelected = activeLevelId === m.id;

          return (
            <button
              key={m.id}
              onClick={() => handleLevelSelect(m.id)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-between gap-2 transition text-center relative ${
                isSelected
                  ? 'bg-blue-950/80 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                  : unlocked
                  ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  : 'bg-slate-950/30 border-slate-900 opacity-60 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-mono font-bold text-cyan-400">
                  L{m.id}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : unlocked ? (
                  <Unlock className="w-3 h-3 text-cyan-400" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-600" />
                )}
              </div>

              <div className="text-xs font-bold truncate w-full">
                {m.title.split(':')[1]?.trim() || m.title}
              </div>

              <span className="text-[10px] font-mono text-slate-500">
                +{m.xpReward} XP
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Mission Active Card */}
      <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-6">
        {/* Mission Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Level {mission.id} of 7
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Badge: {mission.badge}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mt-1">
              {mission.title}
            </h3>
            <p className="text-xs text-slate-400">{mission.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-400 font-bold font-mono">
              Reward: +{mission.xpReward} XP
            </span>
          </div>
        </div>

        {/* 4 Mission Sub-Tabs: Explanation / Interactive Activity / Challenge / Quiz */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveSubTab('explanation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'explanation'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Simple Explanation
          </button>

          <button
            onClick={() => setActiveSubTab('activity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'activity'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Interactive Activity
          </button>

          <button
            onClick={() => setActiveSubTab('challenge')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'challenge'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Mission Challenge
          </button>

          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'quiz'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            4. Short Quiz (3 Questions)
          </button>
        </div>

        {/* Content by Sub-Tab */}
        <div>
          {/* Subtab 1: Explanation */}
          {activeSubTab === 'explanation' && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              {mission.explanation}
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveSubTab('activity')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow"
                >
                  Proceed to Interactive Activity
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Subtab 2: Interactive Activity (embedded live component based on level) */}
          {activeSubTab === 'activity' && (
            <div className="space-y-4">
              {mission.id === 1 && <QubitExplorer />}
              {mission.id === 2 && <GateLibrary />}
              {mission.id === 3 && <BlochSphere />}
              {mission.id === 4 && <CircuitSimulator />}
              {mission.id === 5 && <BellStatesExplorer />}
              {mission.id === 6 && <CircuitSimulator />}
              {mission.id === 7 && <CircuitSimulator />}

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setActiveSubTab('challenge')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow"
                >
                  Proceed to Mission Challenge
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Subtab 3: Mission Challenge */}
          {activeSubTab === 'challenge' && (
            <div className="p-6 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-4">
              <div className="flex items-center gap-2 font-bold text-lg text-purple-300">
                <Sparkles className="w-5 h-5 text-purple-400" />
                {mission.challenge.title}
              </div>

              <p className="text-sm text-slate-200 leading-relaxed">
                {mission.challenge.task}
              </p>

              <div className="p-3 rounded-lg bg-slate-900/90 border border-purple-500/20 text-xs text-purple-200">
                <strong className="text-purple-300">Hint: </strong>
                {mission.challenge.hint}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={completeChallenge}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Verify & Solve Challenge (+{mission.xpReward} XP)
                </button>

                <button
                  onClick={() => setActiveSubTab('quiz')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  Skip to Quiz
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Subtab 4: Quiz */}
          {activeSubTab === 'quiz' && (
            <div className="space-y-6">
              {mission.quiz.map((q, qIdx) => {
                const userChoice = selectedAnswers[qIdx];
                const isCorrect = userChoice === q.correctIndex;

                return (
                  <div
                    key={qIdx}
                    className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
                  >
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                      Question {qIdx + 1} of {mission.quiz.length}
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {q.question}
                    </h4>

                    <div className="space-y-2 pt-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userChoice === optIdx;
                        let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                        if (quizSubmitted) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-blue-950 border-cyan-400 text-cyan-200';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleAnswerSelect(qIdx, optIdx)}
                            className={`w-full p-3 rounded-lg border text-xs text-left font-medium transition flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && optIdx === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after submission */}
                    {quizSubmitted && (
                      <div
                        className={`p-3 rounded-lg text-xs leading-relaxed mt-2 ${
                          isCorrect
                            ? 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-200'
                            : 'bg-rose-950/30 border border-rose-500/30 text-rose-200'
                        }`}
                      >
                        <strong>{isCorrect ? 'Correct! ' : 'Incorrect. '}</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Submit Quiz Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedAnswers).length < mission.quiz.length}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition"
                  >
                    Submit Quiz Answers
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-white">
                      Score: {quizScore} / {mission.quiz.length}{' '}
                      {quizScore === mission.quiz.length ? '🎉 Perfect Score!' : ''}
                    </span>
                    <button
                      onClick={() => {
                        sounds.playGateClick(500);
                        setQuizSubmitted(false);
                        setSelectedAnswers({});
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Retry Quiz
                    </button>
                  </div>
                )}

                {/* Level 7 Certificate button trigger */}
                {mission.id === 7 && (
                  <button
                    onClick={onOpenCertificate}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-600/30 transition"
                  >
                    <Award className="w-4 h-4" />
                    Claim Quantum Master Certificate
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
