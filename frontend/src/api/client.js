/**
 * API client for Quantum Playground backend.
 * Connects React UI to FastAPI / Qiskit Aer simulation engine.
 */

const API_BASE = '/api';

class ApiError extends Error {
  constructor(message, status = 500, detail = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
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

    return await res.json();
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network or server unreachable error
    throw new ApiError(
      'Cannot connect to Quantum Playground backend. Ensure FastAPI server is running on http://127.0.0.1:8000',
      0,
      err
    );
  }
}

export const api = {
  // System Health
  async checkHealth() {
    return request('/health');
  },

  // Module 1: Qubit Explorer
  async prepareQubit(state) {
    return request('/qubit/prepare', {
      method: 'POST',
      body: JSON.stringify({ state }),
    });
  },

  async measureQubit(state, shots = 100) {
    return request('/qubit/measure', {
      method: 'POST',
      body: JSON.stringify({ state, shots }),
    });
  },

  // Module 2: Quantum Gate Lab
  async runCircuit({ initialState = '0', gates = [], shots = 100, measure = true }) {
    return request('/circuit/run', {
      method: 'POST',
      body: JSON.stringify({
        initial_state: initialState,
        gates,
        shots,
        measure,
      }),
    });
  },

  // Module 3: Entanglement Explorer
  async prepareBell(state) {
    return request('/bell/prepare', {
      method: 'POST',
      body: JSON.stringify({ state }),
    });
  },

  async measureBell(state, shots = 1000) {
    return request('/bell/measure', {
      method: 'POST',
      body: JSON.stringify({ state, shots }),
    });
  },
};
