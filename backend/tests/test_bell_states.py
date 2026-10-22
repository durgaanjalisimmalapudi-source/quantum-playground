import math
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.quantum_service import prepare_bell_state, measure_bell_state

client = TestClient(app)

def test_phi_plus_superposition():
    res = prepare_bell_state("phi_plus")
    # P(00) = 0.5, P(11) = 0.5, P(01) = 0, P(10) = 0
    assert math.isclose(res.probabilities["00"], 0.5, abs_tol=1e-3)
    assert math.isclose(res.probabilities["11"], 0.5, abs_tol=1e-3)
    assert res.probabilities["01"] == 0.0
    assert res.probabilities["10"] == 0.0

def test_phi_plus_measurement_correlations():
    shots = 500
    res = measure_bell_state("phi_plus", shots=shots)
    assert res.counts["00"] + res.counts["11"] == shots
    assert res.counts["01"] == 0
    assert res.counts["10"] == 0
    assert res.counts["00"] > 0
    assert res.counts["11"] > 0

def test_phi_minus_phase():
    res = prepare_bell_state("phi_minus")
    assert math.isclose(res.probabilities["00"], 0.5, abs_tol=1e-3)
    assert math.isclose(res.probabilities["11"], 0.5, abs_tol=1e-3)
    # Check amplitudes: amplitude of 00 is positive, 11 is negative
    # Index 0 is 00, Index 3 is 11
    assert math.isclose(res.statevector[0].real, 1 / math.sqrt(2), abs_tol=1e-3)
    assert math.isclose(res.statevector[3].real, -1 / math.sqrt(2), abs_tol=1e-3)

def test_psi_plus_superposition():
    res = prepare_bell_state("psi_plus")
    # P(01) = 0.5, P(10) = 0.5, P(00) = 0, P(11) = 0
    assert math.isclose(res.probabilities["01"], 0.5, abs_tol=1e-3)
    assert math.isclose(res.probabilities["10"], 0.5, abs_tol=1e-3)
    assert res.probabilities["00"] == 0.0
    assert res.probabilities["11"] == 0.0

def test_psi_plus_measurement_anti_correlations():
    shots = 500
    res = measure_bell_state("psi_plus", shots=shots)
    assert res.counts["01"] + res.counts["10"] == shots
    assert res.counts["00"] == 0
    assert res.counts["11"] == 0

def test_psi_minus_singlet_phase():
    res = prepare_bell_state("psi_minus")
    assert math.isclose(res.probabilities["01"], 0.5, abs_tol=1e-3)
    assert math.isclose(res.probabilities["10"], 0.5, abs_tol=1e-3)
    # Index 1 is 01, Index 2 is 10 in Qiskit bitstring order
    # |01> has positive amplitude, |10> has negative amplitude
    assert math.isclose(res.statevector[1].real, 1 / math.sqrt(2), abs_tol=1e-3)
    assert math.isclose(res.statevector[2].real, -1 / math.sqrt(2), abs_tol=1e-3)

def test_api_bell_measure():
    response = client.post("/api/bell/measure", json={"state": "phi_plus", "shots": 200})
    assert response.status_code == 200
    data = response.json()
    assert sum(data["counts"].values()) == 200
    assert data["counts"]["01"] == 0
    assert data["counts"]["10"] == 0

def test_api_invalid_bell_state():
    response = client.post("/api/bell/prepare", json={"state": "unknown_state"})
    assert response.status_code == 422
