# Quantum Playground — Backend

FastAPI and Qiskit simulation backend for the Quantum Playground educational platform.

## Features
- Single-qubit state preparation and finite-shot measurement.
- Interactive quantum gate circuit builder (X, H, Z, Y, S, T).
- Two-qubit Bell state generator and measurement correlation simulator.
- Real simulation with `qiskit` and `qiskit-aer` (`AerSimulator`).
- Exact mathematical statevector analysis and plain-English pedagogical explanations.

## API Endpoints

- `GET /api/health` — Returns service status and Qiskit / Aer versions.
- `POST /api/qubit/prepare` — Prepares single-qubit states (`0`, `1`, `+`, `-`).
- `POST /api/qubit/measure` — Simulates finite measurement collapse (1 to 10000 shots).
- `POST /api/circuit/run` — Builds and executes arbitrary gate sequences.
- `POST /api/bell/prepare` — Generates theoretical Bell state statevectors.
- `POST /api/bell/measure` — Measures Bell pairs and observes quantum correlations.

## Running the Backend

```bash
# From workspace root:
source .venv/bin/activate
uvicorn backend.app.main:app --reload --port 8000
```

## Running Tests

```bash
source .venv/bin/activate
pytest backend/tests/ -v
```
