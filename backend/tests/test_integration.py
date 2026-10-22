import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["app_name"] == "Quantum Playground"
    assert data["category"] == "Quantum Education & Outreach"
    assert "qiskit_version" in data
    assert "aer_version" in data
    assert data["simulator_available"] is True

def test_all_qubit_states():
    for state in ["0", "1", "+", "-"]:
        res = client.post("/api/qubit/prepare", json={"state": state})
        assert res.status_code == 200
        data = res.json()
        assert sum(data["probabilities"].values()) == pytest.approx(1.0, abs=1e-3)
        assert len(data["statevector"]) == 2

def test_gate_lab_presets():
    presets = [
        (["X", "X"], "0"),
        (["X", "H"], "0"),
        (["H", "H"], "0"),
        (["H", "X"], "0"),
    ]
    for gates, initial in presets:
        res = client.post("/api/circuit/run", json={"initial_state": initial, "gates": gates, "shots": 100})
        assert res.status_code == 200
        data = res.json()
        assert data["gates"] == gates
        assert sum(data["probabilities"].values()) == pytest.approx(1.0, abs=1e-3)
        assert sum(data["counts"].values()) == 100

def test_all_bell_states_probabilities():
    states = ["phi_plus", "phi_minus", "psi_plus", "psi_minus"]
    for s in states:
        res = client.post("/api/bell/prepare", json={"state": s})
        assert res.status_code == 200
        data = res.json()
        assert sum(data["probabilities"].values()) == pytest.approx(1.0, abs=1e-3)
        assert len(data["statevector"]) == 4

def test_bell_measure_aer_simulation():
    res = client.post("/api/bell/measure", json={"state": "phi_plus", "shots": 500})
    assert res.status_code == 200
    data = res.json()
    assert sum(data["counts"].values()) == 500
    assert data["counts"]["01"] == 0
    assert data["counts"]["10"] == 0
    assert data["counts"]["00"] + data["counts"]["11"] == 500
