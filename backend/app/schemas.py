from typing import List, Dict, Optional, Literal
from pydantic import BaseModel, Field

class Amplitude(BaseModel):
    basis: str
    real: float
    imag: float
    magnitude: float
    probability: float
    phase_radians: float
    phase_degrees: float
    formatted: str

class CircuitInfo(BaseModel):
    ascii_art: str
    qasm: Optional[str] = None
    num_qubits: int
    depth: int
    gate_count: int
    gate_sequence: List[str]

class QubitPrepareRequest(BaseModel):
    state: Literal["0", "1", "+", "-"] = Field(
        default="0",
        description="Target qubit state to prepare: '0', '1', '+', or '-'"
    )

class QubitMeasureRequest(BaseModel):
    state: Literal["0", "1", "+", "-"] = Field(
        default="0",
        description="Qubit state to measure"
    )
    shots: int = Field(
        default=100,
        ge=1,
        le=10000,
        description="Number of finite measurement shots (1 to 10000)"
    )

class CircuitRunRequest(BaseModel):
    initial_state: Literal["0", "1"] = Field(
        default="0",
        description="Initial state of the qubit (|0⟩ or |1⟩)"
    )
    gates: List[Literal["X", "H", "Z", "Y", "S", "T", "RX", "RY", "RZ", "I"]] = Field(
        default=[],
        max_length=50,
        description="Ordered sequence of quantum gates to apply"
    )
    shots: int = Field(
        default=100,
        ge=1,
        le=10000,
        description="Number of simulation shots"
    )
    measure: bool = Field(
        default=True,
        description="Whether to perform finite-shot measurement simulation"
    )

class BellPrepareRequest(BaseModel):
    state: Literal["phi_plus", "phi_minus", "psi_plus", "psi_minus"] = Field(
        default="phi_plus",
        description="Bell state identifier: phi_plus (|Φ+⟩), phi_minus (|Φ-⟩), psi_plus (|Ψ+⟩), psi_minus (|Ψ-⟩)"
    )

class BellMeasureRequest(BaseModel):
    state: Literal["phi_plus", "phi_minus", "psi_plus", "psi_minus"] = Field(
        default="phi_plus",
        description="Bell state identifier"
    )
    shots: int = Field(
        default=1000,
        ge=1,
        le=10000,
        description="Number of measurement shots"
    )
    basis: Literal["Z", "X"] = Field(
        default="Z",
        description="Measurement basis: 'Z' (computational) or 'X' (Hadamard-rotated basis)"
    )

class GateOp(BaseModel):
    gate: str = Field(description="Gate name: X, Y, Z, H, S, T, RX, RY, RZ, I, CX, CNOT, CZ, SWAP, CCX")
    target: int = Field(default=0, ge=0, le=4, description="Target qubit wire index")
    control: Optional[int] = Field(default=None, ge=0, le=4, description="Control qubit wire index for controlled gates")
    control2: Optional[int] = Field(default=None, ge=0, le=4, description="Second control qubit for CCX")
    target2: Optional[int] = Field(default=None, ge=0, le=4, description="Second target qubit for SWAP")
    param: Optional[float] = Field(default=None, description="Rotation parameter angle in radians (or degrees if handled)")

class MultiQubitCircuitRequest(BaseModel):
    num_qubits: int = Field(default=2, ge=1, le=5, description="Number of qubits in circuit (1 to 5)")
    initial_states: Optional[List[Literal["0", "1"]]] = Field(
        default=None,
        description="Initial classical state for each qubit wire (default all '0')"
    )
    operations: List[GateOp] = Field(
        default=[],
        max_length=60,
        description="Ordered list of quantum gate operations"
    )
    shots: int = Field(
        default=1024,
        ge=1,
        le=10000,
        description="Number of measurement shots for Aer simulation"
    )
    measure: bool = Field(
        default=True,
        description="Whether to execute finite-shot measurement simulation"
    )

class TeleportRequest(BaseModel):
    qubit_state: Literal["0", "1", "+", "-"] = Field(
        default="+",
        description="State Alice wishes to teleport to Bob: '0', '1', '+', or '-'"
    )
    shots: int = Field(
        default=1024,
        ge=1,
        le=10000,
        description="Number of simulation shots"
    )

class QuantumExperimentResponse(BaseModel):
    experiment: str
    state_label: str
    initial_state: str
    gates: List[str]
    circuit: CircuitInfo
    statevector: List[Amplitude]
    probabilities: Dict[str, float]
    counts: Optional[Dict[str, int]] = None
    frequencies: Optional[Dict[str, float]] = None
    shots: Optional[int] = None
    math_derivation: str
    explanation: str
    qubit_order_note: str

class HealthResponse(BaseModel):
    status: str
    app_name: str
    category: str
    expo: str
    qiskit_version: str
    aer_version: str
    simulator_available: bool

class LeaderboardEntry(BaseModel):
    id: str
    name: str
    score: int
    level: str = "Gate Apprentice"
    badge: str = "Active Hacker"
    streak: int = 1
    school: Optional[str] = "Student Visitor"
    avatar: Optional[str] = "⚛️"
    completed_missions: Optional[str] = "[1]"
    timestamp: str
    rank: Optional[int] = None
    is_seed: Optional[bool] = False

class LeaderboardSubmitRequest(BaseModel):
    name: str = Field(min_length=1, max_length=60, description="Student player name")
    score: int = Field(ge=0, le=100000, description="Student cumulative XP or sprint points")
    level: Optional[str] = Field(default="Gate Apprentice", description="Player achievement tier")
    badge: Optional[str] = Field(default="Active Hacker", description="Active badge title")
    streak: Optional[int] = Field(default=1, ge=1, description="Days or games streak")
    school: Optional[str] = Field(default="", description="School, college, or team organization")
    avatar: Optional[str] = Field(default="⚛️", description="Quantum avatar icon")
    completed_missions: Optional[List[int]] = Field(default=None, description="Array of completed level IDs")

class LeaderboardResponse(BaseModel):
    entries: List[LeaderboardEntry]
    total_players: int
    timestamp: str

class LeaderboardSubmitResponse(BaseModel):
    status: str
    rank: int
    entry: LeaderboardEntry
    entries: List[LeaderboardEntry]
    total_players: int

class StudentProfileResponse(BaseModel):
    id: str
    name: str
    school: str
    avatar: str
    score: int
    level: str
    badge: str
    streak: int
    completed_missions: str
    completed_missions_list: List[int]
    timestamp: str
    rank: Optional[int] = None

class StudentSaveProgressRequest(BaseModel):
    name: str = Field(min_length=1, max_length=60)
    score: int = Field(ge=0, le=100000)
    level: Optional[str] = "Qubit Novice"
    badge: Optional[str] = "Active Hacker"
    streak: Optional[int] = 1
    school: Optional[str] = "Student Visitor"
    avatar: Optional[str] = "⚛️"
    completed_missions: Optional[List[int]] = None


