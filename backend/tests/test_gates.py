import math
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.quantum_service import run_gate_circuit

client = TestClient(app)

def test_initial_state_zero():
    res = run_gate_circuit(initial_state="0", gates=[], shots=100)
    assert res.probabilities["0"] == 1.0
    assert res.probabilities["1"] == 0.0

def test_single_x_gate():
    # X |0> = |1>
    res = run_gate_circuit(initial_state="0", gates=["X"], shots=100)
    assert res.probabilities["0"] == 0.0
    assert res.probabilities["1"] == 1.0

def test_preset_x_then_x():
    # X -> X returns |0> to |0>
    res = run_gate_circuit(initial_state="0", gates=["X", "X"], shots=100)
    assert res.probabilities["0"] == 1.0
    assert res.probabilities["1"] == 0.0
    assert res.counts["0"] == 100
    assert res.counts["1"] == 0

def test_preset_h_then_h():
    # H -> H returns |0> to |0>
    res = run_gate_circuit(initial_state="0", gates=["H", "H"], shots=150)
    assert res.probabilities["0"] == 1.0
    assert res.probabilities["1"] == 0.0
    assert res.counts["0"] == 150
    assert res.counts["1"] == 0

def test_preset_x_then_h():
    # X -> H produces |->
    res = run_gate_circuit(initial_state="0", gates=["X", "H"], shots=100)
    assert math.isclose(res.probabilities["0"], 0.5, abs_tol=1e-3)
    assert math.isclose(res.probabilities["1"], 0.5, abs_tol=1e-3)
    assert math.isclose(res.statevector[0].real, 1 / math.sqrt(2), abs_tol=1e-3)
    assert math.isclose(res.statevector[1].real, -1 / math.sqrt(2), abs_tol=1e-3)

def test_preset_h_then_x():
    # H -> X produces |+>
    res = run_gate_circuit(initial_state="0", gates=["H", "X"], shots=100)
    assert math.isclose(res.probabilities["0"], 0.5, abs_tol=1e-3)
    assert math.isclose(res.probabilities["1"], 0.5, abs_tol=1e-3)
    assert math.isclose(res.statevector[0].real, 1 / math.sqrt(2), abs_tol=1e-3)
    assert math.isclose(res.statevector[1].real, 1 / math.sqrt(2), abs_tol=1e-3)

def test_counts_add_up_to_shots():
    shots = 400
    res = run_gate_circuit(initial_state="0", gates=["H"], shots=shots)
    assert sum(res.counts.values()) == shots

def test_api_invalid_gate_rejected():
    response = client.post("/api/circuit/run", json={"initial_state": "0", "gates": ["NOT_A_GATE"]})
    assert response.status_code == 422

def test_api_invalid_shots_rejected():
    response = client.post("/api/circuit/run", json={"initial_state": "0", "gates": ["H"], "shots": 0})
    assert response.status_code == 422
    response = client.post("/api/circuit/run", json={"initial_state": "0", "gates": ["H"], "shots": 50000})
    assert response.status_code == 422
