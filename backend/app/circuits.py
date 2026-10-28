"""
Quantum circuit constructors and converters using Qiskit.
Ensures correct gate applications, multi-qubit topology, and exact circuit metadata.
"""

import math
from typing import List, Tuple, Optional, Any
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister

def build_single_qubit_circuit(initial_state: str = "0", gates: List[str] = None) -> QuantumCircuit:
    """
    Builds a single-qubit QuantumCircuit.
    initial_state: '0', '1', '+', or '-'
    gates: list of gate names ('X', 'H', 'Z', 'Y', 'S', 'T', 'RX', 'RY', 'RZ', 'I')
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
            elif g == "I":
                qc.id(0)
            elif g.startswith("RX"):
                qc.rx(math.pi / 2, 0)
            elif g.startswith("RY"):
                qc.ry(math.pi / 2, 0)
            elif g.startswith("RZ"):
                qc.rz(math.pi / 2, 0)
            else:
                raise ValueError(f"Unsupported gate: {gate_name}")
                
    return qc

def build_bell_state_circuit(state_name: str, basis: str = "Z") -> QuantumCircuit:
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

    basis: 'Z' (computational) or 'X' (measures in X basis by applying Hadamard before measurement)
    """
    qc = QuantumCircuit(2, name=f"bell_{state_name}")
    s = state_name.lower().replace(" ", "_")
    
    if s in ["phi_plus", "phi+", "|phi+>", "|φ+⟩"]:
        qc.h(0)
        qc.cx(0, 1)
    elif s in ["phi_minus", "phi-", "|phi->", "|φ-⟩"]:
        qc.x(0)
        qc.h(0)
        qc.cx(0, 1)
    elif s in ["psi_plus", "psi+", "|psi+>", "|ψ+⟩"]:
        qc.x(1)
        qc.h(0)
        qc.cx(0, 1)
    elif s in ["psi_minus", "psi-", "|psi->", "|ψ-⟩"]:
        qc.x(1)
        qc.h(0)
        qc.cx(0, 1)
        qc.z(1)
    else:
        raise ValueError(f"Unknown Bell state: {state_name}. Choose from phi_plus, phi_minus, psi_plus, psi_minus.")
        
    if basis.upper() == "X":
        # Rotate measurement basis to X by applying H to both qubits
        qc.h(0)
        qc.h(1)
        
    return qc

def build_multi_qubit_circuit(
    num_qubits: int = 2,
    initial_states: Optional[List[str]] = None,
    operations: Optional[List[Any]] = None
) -> QuantumCircuit:
    """
    Builds a flexible multi-qubit circuit (1 to 5 qubits) with arbitrary gate operations.
    Supports single-qubit gates, 2-qubit controlled gates (CX, CZ, SWAP), and 3-qubit gates (CCX).
    """
    if num_qubits < 1 or num_qubits > 5:
        raise ValueError(f"num_qubits must be between 1 and 5, received {num_qubits}")
        
    qc = QuantumCircuit(num_qubits, name="quantum_circuit")
    
    # Initialize qubit wire states
    if initial_states:
        for idx, st in enumerate(initial_states[:num_qubits]):
            if st == "1":
                qc.x(idx)
                
    if not operations:
        return qc
        
    for op in operations:
        # op can be a dict or a pydantic model GateOp
        if hasattr(op, "gate"):
            gate_name = op.gate.strip().upper()
            target = op.target
            control = op.control
            control2 = op.control2
            target2 = op.target2
            param = op.param
        elif isinstance(op, dict):
            gate_name = str(op.get("gate", "")).strip().upper()
            target = int(op.get("target", 0))
            control = op.get("control")
            control2 = op.get("control2")
            target2 = op.get("target2")
            param = op.get("param")
        else:
            continue
            
        target = max(0, min(num_qubits - 1, target))
        
        # Apply gate
        if gate_name == "X":
            qc.x(target)
        elif gate_name == "Y":
            qc.y(target)
        elif gate_name == "Z":
            qc.z(target)
        elif gate_name == "H":
            qc.h(target)
        elif gate_name == "S":
            qc.s(target)
        elif gate_name == "T":
            qc.t(target)
        elif gate_name == "I":
            qc.id(target)
        elif gate_name == "RX":
            theta = float(param) if param is not None else math.pi / 2
            qc.rx(theta, target)
        elif gate_name == "RY":
            theta = float(param) if param is not None else math.pi / 2
            qc.ry(theta, target)
        elif gate_name == "RZ":
            theta = float(param) if param is not None else math.pi / 2
            qc.rz(theta, target)
        elif gate_name in ["CX", "CNOT"]:
            c = control if control is not None else ((target + 1) % num_qubits)
            c = max(0, min(num_qubits - 1, int(c)))
            if c != target:
                qc.cx(c, target)
        elif gate_name == "CZ":
            c = control if control is not None else ((target + 1) % num_qubits)
            c = max(0, min(num_qubits - 1, int(c)))
            if c != target:
                qc.cz(c, target)
        elif gate_name == "SWAP":
            t2 = target2 if target2 is not None else ((target + 1) % num_qubits)
            t2 = max(0, min(num_qubits - 1, int(t2)))
            if t2 != target:
                qc.swap(target, t2)
        elif gate_name == "CCX":
            if num_qubits >= 3:
                c1 = control if control is not None else 0
                c2 = control2 if control2 is not None else 1
                qc.ccx(c1, c2, target)
        else:
            raise ValueError(f"Unsupported gate operation: {gate_name}")
            
    return qc

def build_teleportation_circuit(state_type: str = "+") -> QuantumCircuit:
    """
    Constructs the canonical 3-qubit Quantum Teleportation circuit.
    q0: State Alice wants to send (|ψ⟩)
    q1: Alice's half of the Bell pair
    q2: Bob's half of the Bell pair
    """
    qr = QuantumRegister(3, name="q")
    crz = ClassicalRegister(1, name="crz")
    crx = ClassicalRegister(1, name="crx")
    qc = QuantumCircuit(qr, crz, crx, name="quantum_teleportation")
    
    # 1. Prepare Alice's secret message on q0
    if state_type == "1":
        qc.x(0)
    elif state_type == "+":
        qc.h(0)
    elif state_type == "-":
        qc.x(0)
        qc.h(0)
        
    qc.barrier()
    
    # 2. Create entangled Bell pair between q1 and q2 (shared between Alice and Bob)
    qc.h(1)
    qc.cx(1, 2)
    qc.barrier()
    
    # 3. Alice performs Bell-state measurement on q0 and q1
    qc.cx(0, 1)
    qc.h(0)
    qc.barrier()
    
    # Measure q0 and q1
    qc.measure(0, crz[0])
    qc.measure(1, crx[0])
    qc.barrier()
    
    # 4. Bob applies correction conditional on classical measurement results
    # Using conditional gates
    qc.x(2).c_if(crx, 1)
    qc.z(2).c_if(crz, 1)
    
    return qc

def add_measurements(qc: QuantumCircuit) -> QuantumCircuit:
    """
    Returns a copy of the circuit with classical registers and measurement operations.
    Preserves original circuit for statevector inspection.
    """
    meas_qc = qc.copy(name=f"{qc.name}_measured")
    if meas_qc.num_clbits == 0:
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
