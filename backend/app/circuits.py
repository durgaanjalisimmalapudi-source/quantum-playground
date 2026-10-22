"""
Quantum circuit constructors and converters using Qiskit.
Ensures correct gate applications and exact circuit metadata.
"""

from typing import List, Tuple
from qiskit import QuantumCircuit
from qiskit.circuit import Gate

def build_single_qubit_circuit(initial_state: str = "0", gates: List[str] = None) -> QuantumCircuit:
    """
    Builds a single-qubit QuantumCircuit.
    initial_state: '0', '1', '+', or '-'
    gates: list of gate names ('X', 'H', 'Z', 'Y', 'S', 'T')
    """
    qc = QuantumCircuit(1, name="single_qubit")
    
    # Handle initial state preparation
    if initial_state == "1":
        qc.x(0)
    elif initial_state == "+":
        qc.h(0)
    elif initial_state == "-":
        qc.x(0)
        qc.h(0)
    elif initial_state != "0":
        raise ValueError(f"Unsupported initial state: {initial_state}")
        
    if gates:
        for gate_name in gates:
            g = gate_name.strip().upper()
            if g == "X":
                qc.x(0)
            elif g == "H":
                qc.h(0)
            elif g == "Z":
                qc.z(0)
            elif g == "Y":
                qc.y(0)
            elif g == "S":
                qc.s(0)
            elif g == "T":
                qc.t(0)
            else:
                raise ValueError(f"Unsupported gate: {gate_name}")
                
    return qc

def build_bell_state_circuit(state_name: str) -> QuantumCircuit:
    """
    Builds a two-qubit QuantumCircuit preparing one of the four Bell states.
    Qubit convention:
    q0 is the first qubit (control in CX), q1 is the second qubit (target in CX).
    Qiskit represents computational basis states as |q1 q0> (little-endian).
    
    Bell states:
    - phi_plus:  (|00> + |11>) / sqrt(2)
    - phi_minus: (|00> - |11>) / sqrt(2)
    - psi_plus:  (|01> + |10>) / sqrt(2)
    - psi_minus: (|01> - |10>) / sqrt(2)
    """
    qc = QuantumCircuit(2, name=f"bell_{state_name}")
    s = state_name.lower().replace(" ", "_")
    
    if s in ["phi_plus", "phi+", "|phi+>", "|φ+⟩"]:
        # |00> -> H on q0 -> CX(0, 1) -> (|00> + |11>) / sqrt(2)
        qc.h(0)
        qc.cx(0, 1)
    elif s in ["phi_minus", "phi-", "|phi->", "|φ-⟩"]:
        # |00> -> X on q0 -> H on q0 -> CX(0, 1) -> (|00> - |11>) / sqrt(2)
        qc.x(0)
        qc.h(0)
        qc.cx(0, 1)
    elif s in ["psi_plus", "psi+", "|psi+>", "|ψ+⟩"]:
        # |00> -> X on q1 -> H on q0 -> CX(0, 1) -> (|01> + |10>) / sqrt(2)
        qc.x(1)
        qc.h(0)
        qc.cx(0, 1)
    elif s in ["psi_minus", "psi-", "|psi->", "|ψ-⟩"]:
        # |00> -> X on q1 -> H on q0 -> CX(0, 1) -> Z on q1 -> (|01> - |10>) / sqrt(2)
        qc.x(1)
        qc.h(0)
        qc.cx(0, 1)
        qc.z(1)
    else:
        raise ValueError(f"Unknown Bell state: {state_name}. Choose from phi_plus, phi_minus, psi_plus, psi_minus.")
        
    return qc

def add_measurements(qc: QuantumCircuit) -> QuantumCircuit:
    """
    Returns a copy of the circuit with classical registers and measurement operations.
    Preserves original circuit for statevector inspection.
    """
    meas_qc = qc.copy(name=f"{qc.name}_measured")
    meas_qc.measure_all()
    return meas_qc

def get_circuit_ascii(qc: QuantumCircuit) -> str:
    """
    Returns text drawing of the quantum circuit.
    """
    try:
        return qc.draw(output="text").single_string()
    except Exception:
        return str(qc)
