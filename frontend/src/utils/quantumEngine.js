/**
 * Pure JavaScript Quantum Mechanics Simulation Engine.
 * Provides client-side fallback simulation, statevector calculations,
 * Bloch vector extraction, and multinomial measurement sampling.
 */

// Complex number helpers
export class Complex {
  constructor(r = 0, i = 0) {
    this.r = r;
    this.i = i;
  }
  static fromReal(r) {
    return new Complex(r, 0);
  }
  add(c) {
    return new Complex(this.r + c.r, this.i + c.i);
  }
  sub(c) {
    return new Complex(this.r - c.r, this.i - c.i);
  }
  mul(c) {
    return new Complex(
      this.r * c.r - this.i * c.i,
      this.r * c.i + this.i * c.r
    );
  }
  mulScalar(s) {
    return new Complex(this.r * s, this.i * s);
  }
  magSq() {
    return this.r * this.r + this.i * this.i;
  }
  mag() {
    return Math.sqrt(this.magSq());
  }
  phase() {
    return Math.atan2(this.i, this.r);
  }
  format() {
    const invSqrt2 = 1 / Math.SQRT2;
    if (Math.abs(Math.abs(this.r) - invSqrt2) < 0.005 && Math.abs(this.i) < 0.005) {
      return this.r > 0 ? '1/√2' : '-1/√2';
    }
    if (Math.abs(this.r - 1) < 0.005 && Math.abs(this.i) < 0.005) return '1';
    if (Math.abs(this.r + 1) < 0.005 && Math.abs(this.i) < 0.005) return '-1';
    if (Math.abs(this.r) < 0.005 && Math.abs(this.i) < 0.005) return '0';
    if (Math.abs(this.i) < 0.005) return this.r.toFixed(3);
    if (Math.abs(this.r) < 0.005) return `${this.i > 0 ? '+' : ''}${this.i.toFixed(3)}i`;
    return `${this.r.toFixed(3)}${this.i >= 0 ? '+' : ''}${this.i.toFixed(3)}i`;
  }
}

// Single-qubit unitaries (2x2 matrices of Complex)
const INV_SQRT2 = 1 / Math.SQRT2;

export function getSingleQubitGateMatrix(gateName, param = null) {
  const g = gateName.toUpperCase();
  const c0 = new Complex(0, 0);
  const c1 = new Complex(1, 0);
  const c_neg1 = new Complex(-1, 0);
  const ci = new Complex(0, 1);
  const c_negi = new Complex(0, -1);

  if (g === 'X') {
    return [[c0, c1], [c1, c0]];
  }
  if (g === 'Y') {
    return [[c0, c_negi], [ci, c0]];
  }
  if (g === 'Z') {
    return [[c1, c0], [c0, c_neg1]];
  }
  if (g === 'H') {
    return [
      [new Complex(INV_SQRT2, 0), new Complex(INV_SQRT2, 0)],
      [new Complex(INV_SQRT2, 0), new Complex(-INV_SQRT2, 0)],
    ];
  }
  if (g === 'S') {
    return [[c1, c0], [c0, ci]];
  }
  if (g === 'T') {
    const tVal = new Complex(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4));
    return [[c1, c0], [c0, tVal]];
  }
  if (g === 'I') {
    return [[c1, c0], [c0, c1]];
  }
  if (g.startsWith('RX')) {
    const theta = param !== null ? Number(param) : Math.PI / 2;
    const cosVal = Math.cos(theta / 2);
    const sinVal = Math.sin(theta / 2);
    return [
      [new Complex(cosVal, 0), new Complex(0, -sinVal)],
      [new Complex(0, -sinVal), new Complex(cosVal, 0)],
    ];
  }
  if (g.startsWith('RY')) {
    const theta = param !== null ? Number(param) : Math.PI / 2;
    const cosVal = Math.cos(theta / 2);
    const sinVal = Math.sin(theta / 2);
    return [
      [new Complex(cosVal, 0), new Complex(-sinVal, 0)],
      [new Complex(sinVal, 0), new Complex(cosVal, 0)],
    ];
  }
  if (g.startsWith('RZ')) {
    const theta = param !== null ? Number(param) : Math.PI / 2;
    return [
      [new Complex(Math.cos(-theta / 2), Math.sin(-theta / 2)), c0],
      [c0, new Complex(Math.cos(theta / 2), Math.sin(theta / 2))],
    ];
  }
  return [[c1, c0], [c0, c1]];
}

/**
 * Applies a 1-qubit gate to target qubit wire in statevector of length 2^n.
 * Little-endian convention: Qubit 0 is LSB (least significant bit).
 */
export function apply1QubitGate(statevector, numQubits, targetWire, matrix) {
  const dim = 1 << numQubits;
  const newSv = new Array(dim);
  for (let i = 0; i < dim; i++) newSv[i] = new Complex(0, 0);

  const bitMask = 1 << targetWire;

  for (let i = 0; i < dim; i++) {
    if ((i & bitMask) === 0) {
      const idx0 = i;
      const idx1 = i | bitMask;

      const v0 = statevector[idx0];
      const v1 = statevector[idx1];

      // [u00*v0 + u01*v1, u10*v0 + u11*v1]
      newSv[idx0] = matrix[0][0].mul(v0).add(matrix[0][1].mul(v1));
      newSv[idx1] = matrix[1][0].mul(v0).add(matrix[1][1].mul(v1));
    }
  }
  return newSv;
}

/**
 * Applies controlled-NOT (CX) where control and target are distinct wires.
 */
export function applyCXGate(statevector, numQubits, controlWire, targetWire) {
  const dim = 1 << numQubits;
  const newSv = [...statevector];
  const controlMask = 1 << controlWire;
  const targetMask = 1 << targetWire;

  for (let i = 0; i < dim; i++) {
    // If control is 1 and target is 0, swap with corresponding target 1
    if ((i & controlMask) !== 0 && (i & targetMask) === 0) {
      const partner = i | targetMask;
      const tmp = newSv[i];
      newSv[i] = newSv[partner];
      newSv[partner] = tmp;
    }
  }
  return newSv;
}

/**
 * Applies controlled-Z (CZ): applies -1 phase if both control and target are 1.
 */
export function applyCZGate(statevector, numQubits, controlWire, targetWire) {
  const dim = 1 << numQubits;
  const newSv = [...statevector];
  const mask = (1 << controlWire) | (1 << targetWire);

  for (let i = 0; i < dim; i++) {
    if ((i & mask) === mask) {
      newSv[i] = newSv[i].mulScalar(-1);
    }
  }
  return newSv;
}

/**
 * Applies SWAP gate between wire1 and wire2.
 */
export function applySWAPGate(statevector, numQubits, wire1, wire2) {
  const dim = 1 << numQubits;
  const newSv = [...statevector];
  const mask1 = 1 << wire1;
  const mask2 = 1 << wire2;

  for (let i = 0; i < dim; i++) {
    const b1 = (i & mask1) !== 0 ? 1 : 0;
    const b2 = (i & mask2) !== 0 ? 1 : 0;
    if (b1 !== b2 && b1 === 1) {
      // swap i (where wire1=1, wire2=0) with partner (where wire1=0, wire2=1)
      const partner = (i ^ mask1) | mask2;
      const tmp = newSv[i];
      newSv[i] = newSv[partner];
      newSv[partner] = tmp;
    }
  }
  return newSv;
}

/**
 * Computes Bloch sphere coordinates [x, y, z], theta, and phi for a 1-qubit pure state.
 * statevector = [c0, c1]
 */
export function statevectorToBloch(c0, c1) {
  // Density matrix elements:
  // rho_00 = |c0|^2, rho_11 = |c1|^2
  // rho_01 = c0 * conj(c1), rho_10 = conj(c0) * c1
  // x = 2 * Re(rho_01)
  // y = 2 * Im(rho_10) = -2 * Im(rho_01)
  // z = rho_00 - rho_11
  const rho00 = c0.magSq();
  const rho11 = c1.magSq();
  const rho01 = c0.mul(new Complex(c1.r, -c1.i)); // c0 * conj(c1)

  const x = 2 * rho01.r;
  const y = 2 * rho01.i;
  const z = rho00 - rho11;

  // Spherical coordinates:
  // z = cos(theta) => theta = acos(z)
  // phi = atan2(y, x)
  const clampedZ = Math.max(-1, Math.min(1, z));
  const theta = Math.acos(clampedZ);
  let phi = Math.atan2(y, x);
  if (phi < 0) phi += 2 * Math.PI;

  return {
    x: Math.round(x * 1000) / 1000,
    y: Math.round(y * 1000) / 1000,
    z: Math.round(z * 1000) / 1000,
    theta: Math.round(theta * 1000) / 1000,
    phi: Math.round(phi * 1000) / 1000,
    thetaDeg: Math.round((theta * 180) / Math.PI),
    phiDeg: Math.round((phi * 180) / Math.PI),
    prob0: Math.round(rho00 * 1000) / 1000,
    prob1: Math.round(rho11 * 1000) / 1000,
  };
}

/**
 * Simulates finite measurement sampling based on probabilities.
 */
export function sampleMeasurements(probabilities, shots = 1000) {
  const entries = Object.entries(probabilities);
  const counts = {};
  for (const [k] of entries) counts[k] = 0;

  // Cumulative distribution
  const cumulative = [];
  let sum = 0;
  for (const [bit, prob] of entries) {
    sum += prob;
    cumulative.push({ bit, cum: sum });
  }

  for (let s = 0; s < shots; s++) {
    const r = Math.random();
    for (const item of cumulative) {
      if (r <= item.cum) {
        counts[item.bit] = (counts[item.bit] || 0) + 1;
        break;
      }
    }
  }

  const frequencies = {};
  for (const [k, v] of Object.entries(counts)) {
    frequencies[k] = Math.round((v / shots) * 10000) / 10000;
  }

  return { counts, frequencies };
}

/**
 * Full local simulation of single qubit state.
 */
export function simulateLocalQubit(state = '0', shots = null) {
  let c0 = new Complex(1, 0);
  let c1 = new Complex(0, 0);

  if (state === '1') {
    c0 = new Complex(0, 0);
    c1 = new Complex(1, 0);
  } else if (state === '+') {
    c0 = new Complex(INV_SQRT2, 0);
    c1 = new Complex(INV_SQRT2, 0);
  } else if (state === '-') {
    c0 = new Complex(INV_SQRT2, 0);
    c1 = new Complex(-INV_SQRT2, 0);
  }

  const prob0 = c0.magSq();
  const prob1 = c1.magSq();
  const probabilities = { '0': Math.round(prob0 * 1000) / 1000, '1': Math.round(prob1 * 1000) / 1000 };

  const statevector = [
    {
      basis: '|0⟩',
      real: Math.round(c0.r * 1000) / 1000,
      imag: Math.round(c0.i * 1000) / 1000,
      magnitude: Math.round(c0.mag() * 1000) / 1000,
      probability: probabilities['0'],
      phase_radians: Math.round(c0.phase() * 1000) / 1000,
      phase_degrees: Math.round((c0.phase() * 180) / Math.PI),
      formatted: c0.format(),
    },
    {
      basis: '|1⟩',
      real: Math.round(c1.r * 1000) / 1000,
      imag: Math.round(c1.i * 1000) / 1000,
      magnitude: Math.round(c1.mag() * 1000) / 1000,
      probability: probabilities['1'],
      phase_radians: Math.round(c1.phase() * 1000) / 1000,
      phase_degrees: Math.round((c1.phase() * 180) / Math.PI),
      formatted: c1.format(),
    },
  ];

  let counts = null;
  let frequencies = null;
  if (shots) {
    const sampled = sampleMeasurements(probabilities, shots);
    counts = sampled.counts;
    frequencies = sampled.frequencies;
  }

  return {
    experiment: 'Qubit Explorer',
    state_label: `|${state}⟩`,
    initial_state: state,
    gates: state === '1' ? ['X'] : state === '+' ? ['H'] : state === '-' ? ['X', 'H'] : [],
    circuit: {
      ascii_art: state === '0' ? 'q: ──|0⟩──' : `q: ──|0⟩──[${state}]──`,
      num_qubits: 1,
      depth: 1,
      gate_count: state === '0' ? 0 : 1,
      gate_sequence: state === '0' ? [] : [state],
    },
    statevector,
    probabilities,
    counts,
    frequencies,
    shots,
    math_derivation: `|ψ⟩ = ${c0.format()}|0⟩ + ${c1.format()}|1⟩`,
    explanation: `Prepared qubit in state |${state}⟩ using client simulation engine.`,
    qubit_order_note: 'Single qubit standard basis {|0⟩, |1⟩}.',
    isBackend: false,
  };
}

/**
 * Full local simulation of Bell states.
 */
export function simulateLocalBell(state = 'phi_plus', shots = 1000, basis = 'Z', measure = true) {
  const s = state.toLowerCase().replace(/[^a-z_]/g, '');
  let probabilities = {};
  let statevector = [];
  let mathFormula = '';

  const inv2 = 1 / Math.SQRT2;

  if (s.includes('plus') && (s.includes('phi') || s.includes('φ'))) {
    mathFormula = '|Φ+⟩ = (|00⟩ + |11⟩)/√2';
    if (basis === 'X') {
      probabilities = { '00': 0.5, '11': 0.5, '01': 0.0, '10': 0.0 };
    } else {
      probabilities = { '00': 0.5, '11': 0.5, '01': 0.0, '10': 0.0 };
    }
    statevector = [
      { basis: '|00⟩', real: inv2, imag: 0, magnitude: inv2, probability: 0.5, formatted: '1/√2' },
      { basis: '|01⟩', real: 0, imag: 0, magnitude: 0, probability: 0, formatted: '0' },
      { basis: '|10⟩', real: 0, imag: 0, magnitude: 0, probability: 0, formatted: '0' },
      { basis: '|11⟩', real: inv2, imag: 0, magnitude: inv2, probability: 0.5, formatted: '1/√2' },
    ];
  } else if (s.includes('minus') && (s.includes('phi') || s.includes('φ'))) {
    mathFormula = '|Φ−⟩ = (|00⟩ − |11⟩)/√2';
    if (basis === 'X') {
      probabilities = { '01': 0.5, '10': 0.5, '00': 0.0, '11': 0.0 };
    } else {
      probabilities = { '00': 0.5, '11': 0.5, '01': 0.0, '10': 0.0 };
    }
    statevector = [
      { basis: '|00⟩', real: inv2, imag: 0, magnitude: inv2, probability: 0.5, formatted: '1/√2' },
      { basis: '|01⟩', real: 0, imag: 0, magnitude: 0, probability: 0, formatted: '0' },
      { basis: '|10⟩', real: 0, imag: 0, magnitude: 0, probability: 0, formatted: '0' },
      { basis: '|11⟩', real: -inv2, imag: 0, magnitude: inv2, probability: 0.5, formatted: '-1/√2' },
    ];
  } else if (s.includes('plus') && (s.includes('psi') || s.includes('ψ'))) {
    mathFormula = '|Ψ+⟩ = (|01⟩ + |10⟩)/√2';
    probabilities = { '00': 0.0, '01': 0.5, '10': 0.5, '11': 0.0 };
    statevector = [
      { basis: '|00⟩', real: 0, imag: 0, magnitude: 0, probability: 0, formatted: '0' },
      { basis: '|01⟩', real: inv2, imag: 0, magnitude: inv2, probability: 0.5, formatted: '1/√2' },
      { basis: '|10⟩', real: inv2, imag: 0, magnitude: inv2, probability: 0.5, formatted: '1/√2' },
      { basis: '|11⟩', real: 0, imag: 0, magnitude: 0, probability: 0, formatted: '0' },
    ];
  } else {
    mathFormula = '|Ψ−⟩ = (|01⟩ − |10⟩)/√2';
    probabilities = { '00': 0.0, '01': 0.5, '10': 0.5, '11': 0.0 };
    statevector = [
      { basis: '|00⟩', real: 0, imag: 0, magnitude: 0, probability: 0, formatted: '0' },
      { basis: '|01⟩', real: inv2, imag: 0, magnitude: inv2, probability: 0.5, formatted: '1/√2' },
      { basis: '|10⟩', real: -inv2, imag: 0, magnitude: inv2, probability: 0.5, formatted: '-1/√2' },
      { basis: '|11⟩', real: 0, imag: 0, magnitude: 0, probability: 0, formatted: '0' },
    ];
  }

  let counts = null;
  let frequencies = null;
  if (measure) {
    const sampled = sampleMeasurements(probabilities, shots);
    counts = sampled.counts;
    frequencies = sampled.frequencies;
  }

  return {
    experiment: 'Entanglement Explorer',
    state_label: mathFormula.split('=')[0].trim(),
    initial_state: '|00⟩',
    gates: ['H(0)', 'CX(0,1)'],
    circuit: {
      ascii_art: 'q0: ──[H]──■──\n           │  \nq1: ───────X──\n',
      num_qubits: 2,
      depth: 2,
      gate_count: 2,
      gate_sequence: ['H', 'CX'],
    },
    statevector,
    probabilities,
    counts,
    frequencies,
    shots: measure ? shots : null,
    math_derivation: mathFormula,
    explanation:
      'Bell states are maximally entangled 2-qubit states. Notice how measuring one qubit instantaneously determines the state of the other.',
    qubit_order_note: 'Little-endian ordering |q1 q0⟩ where q0 is rightmost.',
    isBackend: false,
  };
}

/**
 * General multi-qubit circuit simulation fallback.
 */
export function simulateLocalMultiQubit({
  numQubits = 2,
  initialStates = null,
  operations = [],
  shots = 1024,
  measure = true,
}) {
  const dim = 1 << numQubits;
  let sv = new Array(dim);
  for (let i = 0; i < dim; i++) sv[i] = new Complex(0, 0);

  // Initialize initial state index
  let initIndex = 0;
  if (initialStates) {
    for (let w = 0; w < numQubits; w++) {
      if (initialStates[w] === '1') {
        initIndex |= 1 << w;
      }
    }
  }
  sv[initIndex] = new Complex(1, 0);

  // Sequentially apply operations
  for (const op of operations) {
    const g = (op.gate || '').toUpperCase();
    const t = Number(op.target || 0);
    const c = op.control !== undefined && op.control !== null ? Number(op.control) : null;
    const t2 = op.target2 !== undefined && op.target2 !== null ? Number(op.target2) : null;

    if (g === 'CX' || g === 'CNOT') {
      const ctrl = c !== null ? c : (t + 1) % numQubits;
      sv = applyCXGate(sv, numQubits, ctrl, t);
    } else if (g === 'CZ') {
      const ctrl = c !== null ? c : (t + 1) % numQubits;
      sv = applyCZGate(sv, numQubits, ctrl, t);
    } else if (g === 'SWAP') {
      const target2 = t2 !== null ? t2 : (t + 1) % numQubits;
      sv = applySWAPGate(sv, numQubits, t, target2);
    } else {
      const mat = getSingleQubitGateMatrix(g, op.param);
      sv = apply1QubitGate(sv, numQubits, t, mat);
    }
  }

  // Extract probabilities & statevector format
  const probabilities = {};
  const statevectorList = [];

  for (let i = 0; i < dim; i++) {
    const bitstring = i.toString(2).padStart(numQubits, '0');
    const val = sv[i];
    const prob = val.magSq();
    probabilities[bitstring] = Math.round(prob * 10000) / 10000;

    statevectorList.push({
      basis: `|${bitstring}⟩`,
      real: Math.round(val.r * 1000) / 1000,
      imag: Math.round(val.i * 1000) / 1000,
      magnitude: Math.round(val.mag() * 1000) / 1000,
      probability: probabilities[bitstring],
      phase_radians: Math.round(val.phase() * 1000) / 1000,
      phase_degrees: Math.round((val.phase() * 180) / Math.PI),
      formatted: val.format(),
    });
  }

  let counts = null;
  let frequencies = null;
  if (measure) {
    const sampled = sampleMeasurements(probabilities, shots);
    counts = sampled.counts;
    frequencies = sampled.frequencies;
  }

  // Build simple ascii art
  const wireLines = [];
  for (let w = 0; w < numQubits; w++) {
    const initVal = initialStates && initialStates[w] === '1' ? '1' : '0';
    let line = `q${w} |${initVal}⟩: `;
    for (const op of operations) {
      const g = (op.gate || '').toUpperCase();
      const t = Number(op.target || 0);
      const c = op.control !== undefined && op.control !== null ? Number(op.control) : null;
      if (t === w) {
        if (g === 'CX') line += '──[X]──';
        else if (g === 'CZ') line += '──[Z]──';
        else line += `──[${g}]──`;
      } else if (c === w) {
        line += '───■───';
      } else {
        line += '───────';
      }
    }
    wireLines.push(line);
  }

  return {
    experiment: 'Circuit Simulator',
    state_label: `${numQubits}-Qubit Circuit (${operations.length} gates)`,
    initial_state: initialStates ? `|${initialStates.join('')}⟩` : `|${'0'.repeat(numQubits)}⟩`,
    gates: operations.map((o) => o.gate),
    circuit: {
      ascii_art: wireLines.join('\n'),
      num_qubits: numQubits,
      depth: operations.length,
      gate_count: operations.length,
      gate_sequence: operations.map((o) => o.gate),
    },
    statevector: statevectorList,
    probabilities,
    counts,
    frequencies,
    shots: measure ? shots : null,
    math_derivation: `Dimension 2^${numQubits} = ${dim}. Total quantum statevector simulated accurately.`,
    explanation: `Multi-qubit circuit simulation with ${numQubits} wires and ${operations.length} gate operations.`,
    qubit_order_note: `Little-endian ordering |q${numQubits - 1}...q0⟩.`,
    isBackend: false,
  };
}
