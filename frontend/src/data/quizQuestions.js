export const quizQuestions = [
  {
    id: 1,
    topic: "Classical Bits vs. Qubits",
    question: "How does a qubit fundamentally differ from a classical bit before measurement?",
    options: [
      "A qubit can store infinitely many bytes of classical text at once.",
      "A qubit exists in a continuous linear superposition of basis states |0⟩ and |1⟩ with complex probability amplitudes.",
      "A qubit is simply a standard transistor operating at higher clock frequencies.",
      "A qubit always outputs 0 and 1 at the same time to classical display monitors."
    ],
    correctIndex: 1,
    explanation: "Unlike a classical bit which is strictly 0 or 1, a qubit state |ψ⟩ = α|0⟩ + β|1⟩ is a linear superposition where α and β are complex amplitudes satisfying |α|² + |β|² = 1."
  },
  {
    id: 2,
    topic: "Superposition & Born Rule",
    question: "If a qubit is prepared in the state |+⟩ = (|0⟩ + |1⟩)/√2, what is the probability of measuring 0 in the computational basis?",
    options: [
      "0%",
      "25%",
      "50%",
      "100%"
    ],
    correctIndex: 2,
    explanation: "According to Born's Rule, the measurement probability P(0) equals |α|² = |1/√2|² = 1/2 = 50%."
  },
  {
    id: 3,
    topic: "Quantum Phase",
    question: "What is the crucial physical difference between the quantum states |+⟩ and |−⟩?",
    options: [
      "|+⟩ has 100% chance of measuring 1, while |−⟩ has 0%.",
      "They have identical computational basis measurement probabilities (50/50), but |−⟩ has a relative phase difference of π (180°) between its amplitudes.",
      "|−⟩ is an invalid quantum state that violates energy conservation.",
      "|+⟩ can only be created on physical quantum hardware, whereas |−⟩ is purely hypothetical."
    ],
    correctIndex: 1,
    explanation: "Both |+⟩ = (|0⟩ + |1⟩)/√2 and |−⟩ = (|0⟩ − |1⟩)/√2 give 50% probability for 0 and 1 in the Z-basis. However, their relative phase of π causes different quantum interference patterns when additional gates are applied."
  },
  {
    id: 4,
    topic: "Pauli-X Gate",
    question: "What is the action of the Pauli-X gate on the computational ground state |0⟩?",
    options: [
      "It leaves |0⟩ unchanged as the identity operator.",
      "It flips |0⟩ to |1⟩ (acting as a quantum NOT gate).",
      "It puts |0⟩ into equal superposition |+⟩.",
      "It destroys the qubit state permanently."
    ],
    correctIndex: 1,
    explanation: "The Pauli-X gate is the quantum bit-flip operator: X|0⟩ = |1⟩ and X|1⟩ = |0⟩. Its matrix representation is [[0, 1], [1, 0]]."
  },
  {
    id: 5,
    topic: "Hadamard Gate",
    question: "What happens when you apply two consecutive Hadamard gates (H → H) to the initial state |0⟩?",
    options: [
      "The qubit enters an irreversible chaotic state.",
      "The qubit returns deterministically to |0⟩ because H is self-inverse (H² = I).",
      "The qubit permanently flips to |1⟩.",
      "The measurement probabilities become 25% for 0 and 75% for 1."
    ],
    correctIndex: 1,
    explanation: "Because Hadamard is a unitary Hermitian gate, H · H = I (Identity). Quantum interference causes constructive interference for |0⟩ and destructive interference for |1⟩, restoring |0⟩."
  },
  {
    id: 6,
    topic: "Quantum Measurement & State Collapse",
    question: "What happens to a qubit in superposition (|0⟩ + |1⟩)/√2 when an observer measures it?",
    options: [
      "The observer sees both 0 and 1 simultaneously on the meter.",
      "The superposition instantaneously collapses into either |0⟩ or |1⟩ with 50% probability.",
      "The qubit duplicates itself into two parallel physical computers.",
      "The measurement operator reverses time to restore the ground state."
    ],
    correctIndex: 1,
    explanation: "Under the Copenhagen interpretation, measurement projects the continuous quantum state vector onto one of the measurement basis eigenstates, destroying the superposition upon observation."
  },
  {
    id: 7,
    topic: "Quantum Entanglement",
    question: "What does it mean for a two-qubit state to be entangled?",
    options: [
      "The two qubits are physically glued together by atomic forces.",
      "The quantum state cannot be factored into the tensor product of two independent single-qubit states (|ψ⟩ ≠ |ψ₁⟩ ⊗ |ψ₂⟩).",
      "One qubit can send Morse code messages instantaneously to the other across any distance.",
      "Both qubits must always have the value 0."
    ],
    correctIndex: 1,
    explanation: "Entanglement is a non-separable quantum correlation: the joint state |ψ⟩ cannot be written as |ψA⟩ ⊗ |ψB⟩. The properties of the individual particles do not exist independently of the joint system."
  },
  {
    id: 8,
    topic: "Bell State |Φ+⟩",
    question: "Which quantum circuit creates the maximally entangled Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2 from initial |00⟩?",
    options: [
      "Two Pauli-X gates on both qubits.",
      "A Hadamard gate on qubit 0, followed by a CNOT (CX) gate with qubit 0 as control and qubit 1 as target.",
      "Measuring both qubits repeatedly without applying any gates.",
      "Applying two Hadamard gates on qubit 1 only."
    ],
    correctIndex: 1,
    explanation: "Hadamard creates superposition on q0: (|0⟩ + |1⟩)|0⟩ = |00⟩ + |10⟩. CNOT flips q1 whenever q0 is 1, yielding (|00⟩ + |11⟩)/√2."
  },
  {
    id: 9,
    topic: "Faster-Than-Light Communication",
    question: "Can quantum entanglement be used to transmit signals or messages faster than light?",
    options: [
      "Yes, quantum computers transmit data instantaneously across galaxies.",
      "No, because the local measurement outcome at each end is completely random (No-Communication Theorem).",
      "Yes, but only if using fiber-optic cables.",
      "Yes, if both qubits are cooled to absolute zero."
    ],
    correctIndex: 1,
    explanation: "The No-Communication Theorem in quantum mechanics proves that entanglement cannot transmit classical information faster than light, because local measurement results are purely random without sharing a classical key."
  },
  {
    id: 10,
    topic: "Bell Inequalities & Local Realism",
    question: "Why does observing 50% 00 and 50% 11 in a single measurement basis NOT prove quantum non-locality?",
    options: [
      "Because quantum mechanics is incorrect.",
      "Because classical correlation (like putting one red shoe in box A and one in box B) can also produce matching 50/50 outcomes.",
      "Because Qiskit simulators cannot simulate 2 qubits.",
      "Because measurement always produces 100% 00."
    ],
    correctIndex: 1,
    explanation: "Classical shared randomness can trivially mimic single-basis correlations. True demonstration of quantum non-locality requires testing Bell/CHSH inequalities across multiple non-orthogonal measurement angles."
  },
  {
    id: 11,
    topic: "Qiskit Convention",
    question: "In Qiskit's standard classical bitstring convention (little-endian), which qubit does the rightmost bit represent?",
    options: [
      "Qubit n-1 (the highest index qubit).",
      "Qubit 0 (the least significant qubit).",
      "A random qubit chosen during compile time.",
      "The classical clock generator bit."
    ],
    correctIndex: 1,
    explanation: "Qiskit orders bitstrings in little-endian notation |qn-1 ... q1 q0⟩, meaning the rightmost bit corresponds to qubit 0 (classical bit 0)."
  },
  {
    id: 12,
    topic: "Qiskit Aer Simulator",
    question: "What is the primary function of Qiskit Aer in quantum application development?",
    options: [
      "It acts as a word processor for writing research papers.",
      "It provides high-performance local simulation of quantum circuits with realistic noise models and finite shot sampling.",
      "It converts quantum circuits into classical Python bytecode.",
      "It physically cools down the CPU using liquid helium."
    ],
    correctIndex: 1,
    explanation: "Qiskit Aer is the simulation framework for Qiskit, offering fast local simulators (such as AerSimulator) that accurately replicate ideal or noisy finite-shot circuit measurements without requiring access to real quantum hardware."
  }
];
