"""
Verification script for Quantum Quest @ Quantum Playground.
Tests live backend and Qiskit Aer simulation results across all modules.
"""
import httpx
import sys

def main():
    print("=================================================================")
    print(" Quantum Quest — End-to-End Simulation Verification")
    print(" QExpo 2026 Hackathon | Qiskit & Qiskit Aer Engine")
    print("=================================================================")

    base_url = "http://127.0.0.1:8000/api"
    client = httpx.Client(base_url=base_url, timeout=8.0)

    # 1. Health & Qiskit Versions Check
    print("\n[Step 1] Checking Backend Health & Qiskit Aer Version...")
    try:
        res = client.get("/health")
        assert res.status_code == 200, f"Health check failed: {res.status_code}"
        data = res.json()
        print(f"  ✓ Status: {data['status']}")
        print(f"  ✓ App Name: {data['app_name']}")
        print(f"  ✓ Expo Event: {data['expo']}")
        print(f"  ✓ Qiskit Core Version: {data['qiskit_version']}")
        print(f"  ✓ Qiskit Aer Simulator Version: {data['aer_version']}")
        print(f"  ✓ AerSimulator Available: {data['simulator_available']}")
    except Exception as e:
        print(f"  ✗ Failed to connect to backend: {e}")
        print("  Notice: Start FastAPI server with `uvicorn backend.app.main:app --port 8000`")
        sys.exit(1)

    # 2. Module 1: Qubit Explorer Live Simulation
    print("\n[Step 2] Testing Qubit Explorer Simulation (|−⟩ State, 250 Shots)...")
    res = client.post("/qubit/measure", json={"state": "-", "shots": 250})
    assert res.status_code == 200, f"Qubit measure failed: {res.text}"
    data = res.json()
    print(f"  ✓ State: {data['state_label']}")
    print(f"  ✓ Math Derivation: {data['math_derivation']}")
    print(f"  ✓ Theoretical Probabilities: {data['probabilities']}")
    print(f"  ✓ Finite-Shot Measured Counts: {data['counts']}")
    assert sum(data['counts'].values()) == 250, "Counts did not sum to 250!"
    print(f"  ✓ Verified finite-shot counts sum to 250 ({data['counts']['0']} zeros, {data['counts']['1']} ones).")

    # 3. Module 2: Quantum Gate Lab (Hadamard Reversibility H -> H)
    print("\n[Step 3] Testing Quantum Gate Lab (H -> H Reversibility, 100 Shots)...")
    res = client.post("/circuit/run", json={"initial_state": "0", "gates": ["H", "H"], "shots": 100, "measure": True})
    assert res.status_code == 200, f"Circuit run failed: {res.text}"
    data = res.json()
    print(f"  ✓ Gate Sequence: {data['gates']}")
    print(f"  ✓ Theoretical Probabilities: {data['probabilities']}")
    print(f"  ✓ Measured Counts: {data['counts']}")
    assert data['counts']['0'] == 100, "H -> H should deterministically yield 100 zeros!"
    assert data['counts']['1'] == 0, "H -> H should have 0 ones!"
    print("  ✓ Verified destructive interference: state returned deterministically to |0⟩.")

    # 4. Module 3: Entanglement Explorer (|Φ+⟩ Bell Pair, 1000 Shots on Aer)
    print("\n[Step 4] Testing Entanglement Explorer (|Φ+⟩ Bell Pair, 1000 Shots on Aer)...")
    res = client.post("/bell/measure", json={"state": "phi_plus", "shots": 1000, "basis": "Z"})
    assert res.status_code == 200, f"Bell measure failed: {res.text}"
    data = res.json()
    print(f"  ✓ State Label: {data['state_label']}")
    print(f"  ✓ Math: {data['math_derivation']}")
    print(f"  ✓ Theoretical Probabilities: {data['probabilities']}")
    print(f"  ✓ Qiskit Aer 1000-Shot Counts: {data['counts']}")
    assert data['counts']['01'] == 0, "Outcome 01 must be 0 for |Φ+⟩!"
    assert data['counts']['10'] == 0, "Outcome 10 must be 0 for |Φ+⟩!"
    assert data['counts']['00'] + data['counts']['11'] == 1000, "Sum of correlated outcomes must be 1000!"
    print("  ✓ Verified perfect correlation: 00 and 11 observed, 01 and 10 are strictly 0.")

    # 5. Singlet Anti-correlation (|Ψ+⟩, 500 Shots)
    print("\n[Step 5] Testing Anti-Correlated Bell Pair (|Ψ+⟩, 500 Shots on Aer)...")
    res = client.post("/bell/measure", json={"state": "psi_plus", "shots": 500, "basis": "Z"})
    assert res.status_code == 200, f"Psi+ measure failed: {res.text}"
    data = res.json()
    print(f"  ✓ Counts: {data['counts']}")
    assert data['counts']['00'] == 0, "Outcome 00 must be 0 for |Ψ+⟩!"
    assert data['counts']['11'] == 0, "Outcome 11 must be 0 for |Ψ+⟩!"
    assert data['counts']['01'] + data['counts']['10'] == 500, "Sum of anti-correlated outcomes must be 500!"
    print("  ✓ Verified anti-correlation: 01 and 10 observed, 00 and 11 are strictly 0.")

    # 6. Multi-Qubit Circuit Builder (3-Qubit GHZ State)
    print("\n[Step 6] Testing Multi-Qubit Circuit Simulator (3-Qubit GHZ State, 500 Shots)...")
    ghz_payload = {
        "num_qubits": 3,
        "initial_states": ["0", "0", "0"],
        "operations": [
            {"gate": "H", "target": 0},
            {"gate": "CX", "target": 1, "control": 0},
            {"gate": "CX", "target": 2, "control": 1}
        ],
        "shots": 500,
        "measure": True
    }
    res = client.post("/circuit/simulate", json=ghz_payload)
    assert res.status_code == 200, f"Circuit simulate failed: {res.text}"
    data = res.json()
    print(f"  ✓ GHZ Probabilities: {data['probabilities']}")
    print(f"  ✓ GHZ Measured Counts: {data['counts']}")
    assert data['counts']['000'] + data['counts']['111'] == 500, "GHZ state should only measure 000 and 111!"
    print("  ✓ Verified 3-qubit entanglement: GHZ state only yields |000⟩ and |111⟩.")

    # 7. Quantum Teleportation Protocol
    print("\n[Step 7] Testing Quantum Teleportation Protocol (Teleporting |+⟩, 500 Shots)...")
    teleport_payload = {
        "qubit_state": "+",
        "shots": 500
    }
    res = client.post("/teleport/simulate", json=teleport_payload)
    assert res.status_code == 200, f"Teleport simulate failed: {res.text}"
    data = res.json()
    print(f"  ✓ Protocol: {data['experiment']}")
    print(f"  ✓ Circuit Depth: {data['circuit']['depth']}, Gate Count: {data['circuit']['gate_count']}")
    assert sum(data['counts'].values()) == 500, "Teleportation counts must sum to 500!"
    print("  ✓ Verified quantum teleportation protocol simulation executed successfully.")

    print("\n=================================================================")
    print(" ALL 7 END-TO-END SIMULATION CHECKS PASSED: Qiskit Aer verified!")
    print("=================================================================")

if __name__ == "__main__":
    main()
