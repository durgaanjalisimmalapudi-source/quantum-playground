"""
FastAPI application for Quantum Playground backend.
Serves interactive quantum simulation endpoints powered by Qiskit and Qiskit Aer.
Designed for QExpo 2026 Quantum Education & Outreach category.
"""

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import qiskit
import qiskit_aer

from app.schemas import (
    HealthResponse,
    QubitPrepareRequest,
    QubitMeasureRequest,
    CircuitRunRequest,
    BellPrepareRequest,
    BellMeasureRequest,
    QuantumExperimentResponse,
)
from app.quantum_service import (
    prepare_qubit_state,
    measure_qubit_state,
    run_gate_circuit,
    prepare_bell_state,
    measure_bell_state,
)

app = FastAPI(
    title="Quantum Playground API",
    description="Backend quantum simulation API powered by Qiskit and Qiskit Aer for QExpo 2026",
    version="1.0.0"
)

# CORS configuration for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Clean JSON error response to prevent leaking internal stack traces."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "QuantumSimulationError",
            "message": str(exc),
            "detail": "An error occurred during quantum circuit construction or simulation."
        }
    )

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Returns backend system status and Qiskit package versions."""
    return HealthResponse(
        status="healthy",
        app_name="Quantum Playground",
        category="Quantum Education & Outreach",
        expo="QExpo 2026",
        qiskit_version=qiskit.__version__,
        aer_version=qiskit_aer.__version__,
        simulator_available=True
    )

# --- Module 1: Qubit Explorer Endpoints ---

@app.post("/api/qubit/prepare", response_model=QuantumExperimentResponse)
async def api_prepare_qubit(req: QubitPrepareRequest):
    """Prepares and evaluates a single qubit state (|0⟩, |1⟩, |+⟩, or |−⟩)."""
    try:
        return prepare_qubit_state(req.state)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/qubit/measure", response_model=QuantumExperimentResponse)
async def api_measure_qubit(req: QubitMeasureRequest):
    """Simulates finite measurement shots on a prepared single qubit using Qiskit Aer."""
    try:
        return measure_qubit_state(req.state, shots=req.shots)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- Module 2: Quantum Gate Lab Endpoints ---

@app.post("/api/circuit/run", response_model=QuantumExperimentResponse)
async def api_run_circuit(req: CircuitRunRequest):
    """Constructs and simulates an arbitrary 1-qubit circuit with statevector and measurement counts."""
    try:
        return run_gate_circuit(
            initial_state=req.initial_state,
            gates=req.gates,
            shots=req.shots,
            measure=req.measure
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- Module 3: Entanglement Explorer Endpoints ---

@app.post("/api/bell/prepare", response_model=QuantumExperimentResponse)
async def api_prepare_bell(req: BellPrepareRequest):
    """Prepares one of the 4 canonical Bell states and returns theoretical statevector."""
    try:
        return prepare_bell_state(req.state)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/bell/measure", response_model=QuantumExperimentResponse)
async def api_measure_bell(req: BellMeasureRequest):
    """Executes finite-shot measurement simulation of a Bell state on Qiskit Aer."""
    try:
        return measure_bell_state(req.state, shots=req.shots)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
