"""
FastAPI application for Quantum Playground backend.
Serves interactive quantum simulation endpoints powered by Qiskit and Qiskit Aer.
Designed for QExpo 2026 Quantum Education & Outreach category.
"""

import os
from fastapi import FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timezone
import qiskit
import qiskit_aer

try:
    from .schemas import (
        HealthResponse,
        QubitPrepareRequest,
        QubitMeasureRequest,
        CircuitRunRequest,
        MultiQubitCircuitRequest,
        TeleportRequest,
        BellPrepareRequest,
        BellMeasureRequest,
        QuantumExperimentResponse,
        LeaderboardEntry,
        LeaderboardSubmitRequest,
        LeaderboardResponse,
        LeaderboardSubmitResponse,
        StudentProfileResponse,
        StudentSaveProgressRequest,
    )
    from .quantum_service import (
        prepare_qubit_state,
        measure_qubit_state,
        run_gate_circuit,
        prepare_bell_state,
        measure_bell_state,
        simulate_multi_qubit_circuit,
        simulate_teleportation,
    )
    from .leaderboard_service import (
        get_all_entries,
        submit_student_score,
        get_student_profile,
        reset_to_defaults,
        clear_all_entries,
        generate_csv_export,
    )
except ImportError:  # pragma: no cover - fallback for direct app.main execution
    from app.schemas import (
        HealthResponse,
        QubitPrepareRequest,
        QubitMeasureRequest,
        CircuitRunRequest,
        MultiQubitCircuitRequest,
        TeleportRequest,
        BellPrepareRequest,
        BellMeasureRequest,
        QuantumExperimentResponse,
        LeaderboardEntry,
        LeaderboardSubmitRequest,
        LeaderboardResponse,
        LeaderboardSubmitResponse,
        StudentProfileResponse,
        StudentSaveProgressRequest,
    )
    from app.quantum_service import (
        prepare_qubit_state,
        measure_qubit_state,
        run_gate_circuit,
        prepare_bell_state,
        measure_bell_state,
        simulate_multi_qubit_circuit,
        simulate_teleportation,
    )
    from app.leaderboard_service import (
        get_all_entries,
        submit_student_score,
        get_student_profile,
        reset_to_defaults,
        clear_all_entries,
        generate_csv_export,
    )

app = FastAPI(
    title="Quantum Playground API",
    description="Backend quantum simulation API powered by Qiskit and Qiskit Aer for QExpo 2026",
    version="2.0.0"
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
    """Executes finite-shot measurement simulation of a Bell state on Qiskit Aer in Z or X basis."""
    try:
        return measure_bell_state(req.state, shots=req.shots, basis=req.basis)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- Module 4: Multi-Qubit Circuit Builder Endpoints ---

@app.post("/api/circuit/simulate", response_model=QuantumExperimentResponse)
async def api_simulate_multi_qubit(req: MultiQubitCircuitRequest):
    """Constructs and simulates an arbitrary multi-qubit circuit on Qiskit Aer."""
    try:
        return simulate_multi_qubit_circuit(
            num_qubits=req.num_qubits,
            initial_states=req.initial_states,
            operations=req.operations,
            shots=req.shots,
            measure=req.measure
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- Module 5: Quantum Teleportation Protocol ---

@app.post("/api/teleport/simulate", response_model=QuantumExperimentResponse)
async def api_simulate_teleport(req: TeleportRequest):
    """Executes full Quantum Teleportation protocol on Qiskit Aer."""
    try:
        return simulate_teleportation(
            qubit_state=req.qubit_state,
            shots=req.shots
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# --- Module 6: Persistent Student Leaderboard & Expo Sessions ---

@app.get("/api/leaderboard", response_model=LeaderboardResponse)
async def api_get_leaderboard():
    """Returns the persistent QExpo 2026 leaderboard sorted by score descending."""
    entries = get_all_entries()
    return LeaderboardResponse(
        entries=entries,
        total_players=len(entries),
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@app.post("/api/leaderboard/submit", response_model=LeaderboardSubmitResponse)
async def api_submit_score(req: LeaderboardSubmitRequest):
    """
    Submits or updates a student's score in the persistent database.
    Calculates their live rank among all expo attendees and updates storage.
    """
    try:
        result = submit_student_score(
            name=req.name,
            score=req.score,
            level=req.level,
            badge=req.badge,
            streak=req.streak,
            school=req.school,
            avatar=req.avatar,
            completed_missions=req.completed_missions,
        )
        return LeaderboardSubmitResponse(
            status="success",
            rank=result["rank"],
            entry=result["entry"],
            entries=result["entries"],
            total_players=result["total_players"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save student score: {str(e)}")


@app.get("/api/student/{name}", response_model=StudentProfileResponse)
async def api_get_student_profile(name: str):
    """Retrieves student profile, level, completed missions, and XP from the persistent database."""
    profile = get_student_profile(name)
    if not profile:
        raise HTTPException(status_code=404, detail=f"Student '{name}' not found")
    return profile


@app.post("/api/student/save", response_model=StudentProfileResponse)
async def api_save_student_progress(req: StudentSaveProgressRequest):
    """Saves student learning progress, completed missions, and score directly into the persistent database."""
    res = submit_student_score(
        name=req.name,
        score=req.score,
        level=req.level,
        badge=req.badge,
        streak=req.streak,
        school=req.school,
        avatar=req.avatar,
        completed_missions=req.completed_missions,
    )
    profile = get_student_profile(req.name)
    if not profile:
        profile = res["entry"]
        profile["completed_missions_list"] = req.completed_missions or [1]
    return profile



@app.post("/api/leaderboard/reset", response_model=LeaderboardResponse)
async def api_reset_leaderboard():
    """Resets the leaderboard back to default benchmark seeds."""
    entries = reset_to_defaults()
    return LeaderboardResponse(
        entries=entries,
        total_players=len(entries),
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@app.post("/api/leaderboard/clear", response_model=LeaderboardResponse)
async def api_clear_leaderboard():
    """Completely clears all entries from the persistent leaderboard."""
    entries = clear_all_entries()
    return LeaderboardResponse(
        entries=entries,
        total_players=0,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )



@app.get("/api/leaderboard/export")
async def api_export_leaderboard():
    """Exports the persistent leaderboard as a CSV file for expo judges and organizers."""
    csv_data = generate_csv_export()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=qexpo_2026_quantum_quest_leaderboard.csv"
        },
    )


# --- Production Deployment: Serve Built Frontend SPA ---
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.isdir(FRONTEND_DIST):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")


