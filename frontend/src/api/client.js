/**
 * API client for Quantum Playground backend.
 * Connects React UI to FastAPI / Qiskit Aer simulation engine.
 * Includes automatic client-side fallback simulation when backend is starting up or offline.
 */

import { simulateLocalMultiQubit, simulateLocalQubit, simulateLocalBell } from '../utils/quantumEngine';

const ENV_BACKEND = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const DEFAULT_BASE = ENV_BACKEND ? `${ENV_BACKEND}/api` : '/api';
const DIRECT_BACKEND = 'http://127.0.0.1:8000/api';
let activeBase = null;

class ApiError extends Error {
  constructor(message, status = 500, detail = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

async function resolveBaseUrl() {
  if (activeBase) return activeBase;

  // If explicit external backend is provided via environment variable, test that first
  if (ENV_BACKEND) {
    try {
      const res = await fetch(`${DEFAULT_BASE}/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        activeBase = DEFAULT_BASE;
        return activeBase;
      }
    } catch {}
  }

  try {
    const res = await fetch(`${DEFAULT_BASE}/health`, { signal: AbortSignal.timeout(1000) });
    if (res.ok) {
      activeBase = DEFAULT_BASE;
      return activeBase;
    }
  } catch {}

  try {
    const res = await fetch(`${DIRECT_BACKEND}/health`, { signal: AbortSignal.timeout(1200) });
    if (res.ok) {
      activeBase = DIRECT_BACKEND;
      return activeBase;
    }
  } catch {}

  return DEFAULT_BASE;
}

async function request(endpoint, options = {}) {
  const base = await resolveBaseUrl();
  const url = `${base}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = { message: res.statusText };
      }
      const message = errorData.detail || errorData.message || `Request failed with status ${res.status}`;
      throw new ApiError(message, res.status, errorData);
    }

    const data = await res.json();
    return { ...data, isBackend: true };
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    activeBase = null;
    throw err;
  }
}

export const api = {
  // System Health
  async checkHealth() {
    return request('/health');
  },

  // Module 1: Qubit Explorer
  async prepareQubit(state) {
    try {
      return await request('/qubit/prepare', {
        method: 'POST',
        body: JSON.stringify({ state }),
      });
    } catch {
      return simulateLocalQubit(state);
    }
  },

  async measureQubit(state, shots = 100) {
    try {
      return await request('/qubit/measure', {
        method: 'POST',
        body: JSON.stringify({ state, shots }),
      });
    } catch {
      return simulateLocalQubit(state, shots);
    }
  },

  // Module 2: Quantum Gate Lab (1-qubit circuit)
  async runCircuit({ initialState = '0', gates = [], shots = 100, measure = true }) {
    try {
      return await request('/circuit/run', {
        method: 'POST',
        body: JSON.stringify({
          initial_state: initialState,
          gates,
          shots,
          measure,
        }),
      });
    } catch {
      const ops = gates.map((g) => ({ gate: g, target: 0 }));
      return simulateLocalMultiQubit({
        numQubits: 1,
        initialStates: [initialState],
        operations: ops,
        shots,
        measure,
      });
    }
  },

  // Module 3: Entanglement Explorer
  async prepareBell(state) {
    try {
      return await request('/bell/prepare', {
        method: 'POST',
        body: JSON.stringify({ state }),
      });
    } catch {
      return simulateLocalBell(state, 1000, 'Z', false);
    }
  },

  async measureBell(state, shots = 1000, basis = 'Z') {
    try {
      return await request('/bell/measure', {
        method: 'POST',
        body: JSON.stringify({ state, shots, basis }),
      });
    } catch {
      return simulateLocalBell(state, shots, basis, true);
    }
  },

  // Module 4: Multi-Qubit Circuit Builder
  async simulateMultiQubit({ numQubits = 2, initialStates = null, operations = [], shots = 1024, measure = true }) {
    try {
      return await request('/circuit/simulate', {
        method: 'POST',
        body: JSON.stringify({
          num_qubits: numQubits,
          initial_states: initialStates,
          operations,
          shots,
          measure,
        }),
      });
    } catch {
      return simulateLocalMultiQubit({ numQubits, initialStates, operations, shots, measure });
    }
  },

  // Module 5: Quantum Teleportation
  async simulateTeleport({ qubitState = '+', shots = 1024 }) {
    try {
      return await request('/teleport/simulate', {
        method: 'POST',
        body: JSON.stringify({ qubit_state: qubitState, shots }),
      });
    } catch {
      // Local fallback for teleportation
      return {
        experiment: 'Quantum Teleportation (Local Engine)',
        state_label: `Teleportation of |${qubitState}⟩`,
        initial_state: `|${qubitState}⟩ ⊗ |00⟩`,
        gates: ['H(1)', 'CX(1,2)', 'CX(0,1)', 'H(0)', 'Measure', 'Correction Z, X'],
        circuit: {
          ascii_art: 'q0: ──|ψ⟩──■──H──[M]═══════\n              │        ║\nq1: ─[H]──■───X───────[M]══\n          │            ║   ║\nq2: ──────X────────────╫───╫──[X if M1]──[Z if M0]──|ψ⟩\n',
          num_qubits: 3,
          depth: 6,
          gate_count: 6,
          gate_sequence: ['StatePrep', 'BellPair', 'BellMeas', 'Correction'],
        },
        statevector: [],
        probabilities: { '000': 0.25, '001': 0.25, '010': 0.25, '011': 0.25 },
        counts: { '000': Math.round(shots * 0.25), '001': Math.round(shots * 0.25), '010': Math.round(shots * 0.25), '011': Math.round(shots * 0.25) },
        frequencies: { '000': 0.25, '001': 0.25, '010': 0.25, '011': 0.25 },
        shots,
        math_derivation: '|ψ⟩_A ⊗ |Φ+⟩_AB → Classical comms (2 bits) → Bob recovers |ψ⟩ with 100% fidelity.',
        explanation: 'Teleportation transfers the quantum state from Alice to Bob via an entangled Bell pair and 2 classical bits.',
        qubit_order_note: 'Qubit 0: Alice, Qubit 1: Bell half, Qubit 2: Bob (receiver).',
        isBackend: false,
      };
    }
  },

  // Module 6: Persistent Student Leaderboard & Expo Sessions
  async getLeaderboard() {
    try {
      return await request('/leaderboard');
    } catch {
      // Local fallback from localStorage
      const local = localStorage.getItem('quantum_expo_leaderboard');
      if (local) {
        return JSON.parse(local);
      }
      return {
        entries: [
          { rank: 1, name: 'Alice_Qiskit', score: 2850, level: 'Grand Quantum Master', badge: 'CHSH Champion', streak: 12, school: 'MIT Quantum Lab' },
          { rank: 2, name: 'Erwin_Cat', score: 2400, level: 'Circuit Architect', badge: 'Superposition King', streak: 9, school: 'Vienna Quantum Group' },
          { rank: 3, name: 'Bob_Entangled', score: 2150, level: 'Circuit Architect', badge: 'Teleport Pioneer', streak: 7, school: 'Caltech IQIM' },
          { rank: 4, name: 'John_Bell', score: 1900, level: 'Entanglement Pioneer', badge: 'Spooky Action', streak: 5, school: 'CERN Theory Group' },
          { rank: 5, name: 'Richard_Feynman', score: 1750, level: 'Bloch Explorer', badge: 'Sim Universe', streak: 8, school: 'Cornell Physics' },
        ],
        total_players: 5,
        timestamp: new Date().toISOString(),
        isLocalFallback: true,
      };
    }
  },

  async submitScore({ name, score, level, badge, streak, school }) {
    try {
      const res = await request('/leaderboard/submit', {
        method: 'POST',
        body: JSON.stringify({ name, score, level, badge, streak, school }),
      });
      // Also cache in localStorage
      if (res && res.entries) {
        localStorage.setItem('quantum_expo_leaderboard', JSON.stringify({
          entries: res.entries,
          total_players: res.total_players,
          timestamp: new Date().toISOString(),
        }));
      }
      return res;
    } catch {
      // Local fallback storage
      const prev = await this.getLeaderboard();
      const entries = [...prev.entries];
      const existingIdx = entries.findIndex((e) => e.name.toLowerCase() === name.toLowerCase());
      const now = new Date().toISOString();
      let updatedEntry = null;

      if (existingIdx >= 0) {
        if (score >= entries[existingIdx].score) {
          entries[existingIdx].score = score;
          entries[existingIdx].level = level || entries[existingIdx].level;
          entries[existingIdx].badge = badge || entries[existingIdx].badge;
          entries[existingIdx].streak = Math.max(entries[existingIdx].streak || 1, streak || 1);
          entries[existingIdx].school = school || entries[existingIdx].school;
          entries[existingIdx].timestamp = now;
        }
        updatedEntry = entries[existingIdx];
      } else {
        updatedEntry = {
          id: `local-${Date.now()}`,
          name,
          score,
          level: level || 'Gate Apprentice',
          badge: badge || 'Active Hacker',
          streak: streak || 1,
          school: school || 'Student Visitor',
          timestamp: now,
          is_seed: false,
        };
        entries.push(updatedEntry);
      }

      entries.sort((a, b) => b.score - a.score);
      entries.forEach((e, i) => { e.rank = i + 1; });
      const rank = entries.findIndex((e) => e.name.toLowerCase() === name.toLowerCase()) + 1;

      const payload = {
        status: 'success',
        rank,
        entry: updatedEntry,
        entries,
        total_players: entries.length,
      };
      localStorage.setItem('quantum_expo_leaderboard', JSON.stringify(payload));
      return payload;
    }
  },

  async resetLeaderboard() {
    try {
      const res = await request('/leaderboard/reset', { method: 'POST' });
      localStorage.removeItem('quantum_expo_leaderboard');
      return res;
    } catch {
      localStorage.removeItem('quantum_expo_leaderboard');
      return this.getLeaderboard();
    }
  },

  async clearLeaderboard() {
    try {
      const res = await request('/leaderboard/clear', { method: 'POST' });
      localStorage.removeItem('quantum_expo_leaderboard');
      return res;
    } catch {
      localStorage.removeItem('quantum_expo_leaderboard');
      return { entries: [], total_players: 0, timestamp: new Date().toISOString() };
    }
  },

  async getStudentProfile(name) {
    try {
      return await request(`/student/${encodeURIComponent(name)}`);
    } catch {
      return null;
    }
  },

  async saveStudentProgress({ name, score, level, badge, streak, school, avatar, completed_missions }) {
    try {
      return await request('/student/save', {
        method: 'POST',
        body: JSON.stringify({
          name,
          score,
          level,
          badge,
          streak,
          school,
          avatar,
          completed_missions,
        }),
      });
    } catch {
      return null;
    }
  },

  getExportUrl() {
    const base = activeBase || DEFAULT_BASE;
    return `${base}/leaderboard/export`;
  },
};



