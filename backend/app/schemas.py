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
    gates: List[Literal["X", "H", "Z", "Y", "S", "T"]] = Field(
        default=[],
        max_length=20,
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
