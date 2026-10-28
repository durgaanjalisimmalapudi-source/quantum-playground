import math
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.quantum_service import simulate_multi_qubit_circuit, simulate_teleportation, measure_bell_state

client = TestClient(app)

def test_multi_qubit_bell_state_via_builder():
    # Build H(0) + CX(0, 1) through simulate_multi_qubit_circuit
    ops = [
        {"gate": "H", "target": 0},
        {"gate": "CX", "target": 1, "control": 0}
    ]
    res = simulate_multi_qubit_circuit(num_qubits=2, initial_states=["0", "0"], operations=ops, shots=500)
    assert res.circuit.num_qubits == 2
    assert math.isclose(res.probabilities["00"], 0.5, abs_tol=1e-3)
    assert math.isclose(res.probabilities["11"], 0.5, abs_tol=1e-3)
    assert res.probabilities["01"] == 0.0
    assert res.probabilities["10"] == 0.0
    assert res.counts["00"] + res.counts["11"] == 500

def test_multi_qubit_cz_gate():
    # |11> with CZ gate should pick up a -1 phase on |11>
    ops = [
        {"gate": "X", "target": 0},
        {"gate": "X", "target": 1},
        {"gate": "CZ", "target": 1, "control": 0}
    ]
    res = simulate_multi_qubit_circuit(num_qubits=2, initial_states=["0", "0"], operations=ops, shots=100)
    assert res.probabilities["11"] == 1.0
    # Amplitude of |11> (index 3 in 2-qubit) should be -1.0
    assert math.isclose(res.statevector[3].real, -1.0, abs_tol=1e-3)

def test_multi_qubit_swap_gate():
    # Initialize q0=1, q1=0, then SWAP -> q0=0, q1=1 (|q1 q0> = |10> or bitstring "01" depending on order)
    # Target 0 has X, so q0=1. Target 1 has nothing, so q1=0.
    # Swap q0 and q1 => q0=0, q1=1. Bitstring |q1 q0> = |10>
    ops = [
        {"gate": "X", "target": 0},
        {"gate": "SWAP", "target": 0, "target2": 1}
    ]
    res = simulate_multi_qubit_circuit(num_qubits=2, initial_states=["0", "0"], operations=ops, shots=100)
    assert res.probabilities["10"] == 1.0
    assert res.probabilities["01"] == 0.0

def test_bell_measure_in_x_basis():
    # Measuring phi_plus in X basis produces correlated ++ and --
    res = measure_bell_state("phi_plus", shots=500, basis="X")
    assert res.counts is not None
    assert sum(res.counts.values()) == 500

def test_teleportation_simulation():
    res = simulate_teleportation(qubit_state="+", shots=500)
    assert res.experiment == "Quantum Teleportation"
    assert sum(res.counts.values()) == 500

def test_api_multi_qubit_endpoint():
    payload = {
        "num_qubits": 3,
        "initial_states": ["0", "0", "0"],
        "operations": [
            {"gate": "H", "target": 0},
            {"gate": "CX", "target": 1, "control": 0},
            {"gate": "CX", "target": 2, "control": 1}
        ],
        "shots": 256
    }
    response = client.post("/api/circuit/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["circuit"]["num_qubits"] == 3
    # GHZ state: (|000> + |111>)/sqrt(2)
    assert math.isclose(data["probabilities"]["000"], 0.5, abs_tol=1e-2)
    assert math.isclose(data["probabilities"]["111"], 0.5, abs_tol=1e-2)
    assert data["counts"]["000"] + data["counts"]["111"] == 256
