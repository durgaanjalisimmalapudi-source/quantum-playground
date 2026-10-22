import math
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.quantum_service import prepare_qubit_state, measure_qubit_state

client = TestClient(app)

def test_qubit_state_zero():
    res = prepare_qubit_state("0")
    assert res.probabilities["0"] == 1.0
    assert res.probabilities["1"] == 0.0
    assert len(res.statevector) == 2
    assert res.statevector[0].real == 1.0
    assert res.statevector[1].real == 0.0

def test_qubit_state_one():
    res = prepare_qubit_state("1")
    assert res.probabilities["0"] == 0.0
    assert res.probabilities["1"] == 1.0
    assert res.statevector[1].real == 1.0

def test_qubit_state_plus():
    res = prepare_qubit_state("+")
    assert math.isclose(res.probabilities["0"], 0.5, abs_tol=1e-3)
    assert math.isclose(res.probabilities["1"], 0.5, abs_tol=1e-3)
    # Both amplitudes positive: 1/sqrt(2) approx 0.7071
    assert math.isclose(res.statevector[0].real, 1 / math.sqrt(2), abs_tol=1e-3)
    assert math.isclose(res.statevector[1].real, 1 / math.sqrt(2), abs_tol=1e-3)

def test_qubit_state_minus():
    res = prepare_qubit_state("-")
    assert math.isclose(res.probabilities["0"], 0.5, abs_tol=1e-3)
    assert math.isclose(res.probabilities["1"], 0.5, abs_tol=1e-3)
    # Amplitudes are +1/sqrt(2) and -1/sqrt(2)
    assert math.isclose(res.statevector[0].real, 1 / math.sqrt(2), abs_tol=1e-3)
    assert math.isclose(res.statevector[1].real, -1 / math.sqrt(2), abs_tol=1e-3)
    # Phase on |1> should be pi (180 deg)
    assert abs(res.statevector[1].phase_degrees - 180.0) < 1.0 or abs(res.statevector[1].phase_degrees - (-180.0)) < 1.0

def test_qubit_measure_shots_sum():
    shots = 250
    res = measure_qubit_state("+", shots=shots)
    assert res.counts is not None
    assert sum(res.counts.values()) == shots
    assert res.shots == shots
    # Both 0 and 1 should appear with high probability for 250 shots
    assert res.counts["0"] > 0
    assert res.counts["1"] > 0

def test_api_qubit_prepare():
    response = client.post("/api/qubit/prepare", json={"state": "+"})
    assert response.status_code == 200
    data = response.json()
    assert data["experiment"] == "Qubit Explorer"
    assert data["probabilities"]["0"] == 0.5
    assert data["probabilities"]["1"] == 0.5

def test_api_qubit_measure_single_shot():
    response = client.post("/api/qubit/measure", json={"state": "0", "shots": 1})
    assert response.status_code == 200
    data = response.json()
    assert data["counts"]["0"] == 1
    assert data["counts"]["1"] == 0

def test_api_qubit_invalid_state():
    response = client.post("/api/qubit/prepare", json={"state": "invalid"})
    assert response.status_code == 422
