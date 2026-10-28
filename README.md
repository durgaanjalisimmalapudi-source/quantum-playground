# Quantum Quest: The Quantum Circuit Adventure ⚛️
> **“Learn Quantum. Build Circuits. Master the Quantum Universe!”**  
> *The Quantum Playground — Built for **QExpo 2026** Hackathon*  
> **Problem Statement:** “Quantum Circuits: Single-Qubit Gates and Operations, Multi-Qubit Gates and Operations, and Design and Simulation of Quantum Circuits.”

---

## 🌟 Executive Summary & Vision

**Quantum Quest: The Quantum Circuit Adventure** is a complete, modern, interactive, and visually stunning educational gaming platform built for **QExpo 2026**. It transforms complex quantum mechanics and quantum circuit architecture into an engaging, gamified adventure that bridges abstract linear algebra and hands-on intuition.

Rather than static textbook diagrams or hardcoded mockups, **all quantum circuit simulations, complex statevectors, Bell-state non-local correlations, and finite-shot measurement collapse statistics are computed dynamically using Qiskit 1.4+ and Qiskit Aer (`AerSimulator`)**, complemented by a high-precision pure-mathematics client-side quantum engine for offline resilience.

---

## 🎮 Core Platform Features

### 1. Level-Based Quantum Gaming Journey (7 Missions)
- **Level 1 — Qubit Explorer:** Classical bits vs qubits, superposition $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$, computational basis $\{|0\rangle, |1\rangle\}$, Born's rule, and wave-function collapse under finite-shot measurement.
- **Level 2 — Single-Qubit Gate Academy:** Pauli-X (NOT), Pauli-Y, Pauli-Z, Hadamard (H), Phase (S, T), and continuous rotation gates ($R_X, R_Y, R_Z$).
- **Level 3 — Bloch Sphere Adventure:** Fully interactive 3D Bloch sphere with real-time mouse orbit, statevector animation along spherical arcs, live $(\theta, \phi)$ spherical angles, and scientific distinction of global phase vs. relative phase.
- **Level 4 — Multi-Qubit Mission:** Tensor products $\mathcal{H}_1 \otimes \mathcal{H}_2$, exponential state space scaling ($2^n$), controlled entangling gates ($CNOT$, $CZ$, $SWAP$).
- **Level 5 — Bell State Challenge:** All 4 canonical Bell states ($|\Phi^+\rangle, |\Phi^-\rangle, |\Psi^+\rangle, |\Psi^-\rangle$), measurement in computational Z-basis and rotated X-basis, and the No-Signaling Theorem.
- **Level 6 — Quantum Circuit Builder:** Visual drag-and-drop circuit editor (1–4 wires), step-by-step playhead execution, complex statevector amplitude tables, and shot histograms (100, 1024, 4096 shots).
- **Level 7 — Quantum Master Challenge:** Boss-level circuit puzzles, interference cancellation locks, circuit equivalence verifications, and XP badge progression.
- *Each level includes:* A simple explanation, visual demonstration, interactive activity, challenge puzzle, and a 3-question scientific quiz.

### 2. Interactive Quantum Gate Library (13 Gates)
Comprehensive interactive encyclopedia covering all single-qubit, rotation, and multi-qubit gates:
- **X Gate:** Bit-flip ($|0\rangle \leftrightarrow |1\rangle$)
- **Y Gate:** Bit-flip with relative phase shift ($i$)
- **Z Gate:** Phase-flip on $|1\rangle$ component
- **Hadamard (H):** Superposition generator; self-inverse ($H^2 = I$)
- **S Gate:** $\pi/2$ phase shift ($\sqrt{Z}$)
- **T Gate:** $\pi/4$ phase shift ($Z^{1/4}$)
- **RX(θ), RY(θ), RZ(θ):** Continuous unitary rotations around $X, Y, Z$ axes
- **CNOT (CX):** Two-qubit controlled bit-flip entangler
- **CZ Gate:** Symmetric two-qubit controlled phase-flip
- **SWAP Gate:** State exchange operator ($CX_{0,1} \cdot CX_{1,0} \cdot CX_{0,1}$)
- **Identity (I):** Invariant operator
*Includes:* Mathematical matrices, algebraic rules, Bloch sphere geometric actions, basis transformation tables, and an interactive real-time test bench.

### 3. Interactive 3D Bloch Sphere
- Hardware-accelerated 3D projection on HTML5 Canvas.
- Orbit controls (mouse drag rotation around yaw and pitch, auto-orbit mode).
- 3D labeled axes ($X, Y, Z$), North Pole $|0\rangle$, South Pole $|1\rangle$, and equatorial states ($|+\rangle, |-\rangle, |+i\rangle, |-i\rangle$).
- Trajectory animation: Smooth spherical arc slerp between quantum states upon applying any gate.
- Live polar coordinates ($\theta, \phi$), Cartesian vector $[x, y, z]$, and measurement probabilities $P(|0\rangle) = \cos^2(\theta/2)$, $P(|1\rangle) = \sin^2(\theta/2)$.
- Scientific deep dive explaining why global phase $e^{i\gamma}$ is physically unobservable, while relative phase creates measurable quantum interference.

### 4. Dedicated Bell States & Entanglement Explorer
- Visual representations of all four Bell pairs:
  - $|\Phi^+\rangle = (|00\rangle + |11\rangle)/\sqrt{2}$
  - $|\Phi^-\rangle = (|00\rangle - |11\rangle)/\sqrt{2}$
  - $|\Psi^+\rangle = (|01\rangle + |10\rangle)/\sqrt{2}$
  - $|\Psi^-\rangle = (|01\rangle - |10\rangle)/\sqrt{2}$
- Animated two-qubit entanglement link connecting Qubit A and Qubit B.
- Measurement in both computational Z-basis and Hadamard-rotated X-basis.
- Clear explanation of why a single Bloch sphere cannot represent entangled states (reduced density matrix is maximally mixed $\rho = \frac{1}{2}I$ at vector length $r=0$).
- Explicit No-Signaling Theorem explanation proving entanglement does not permit faster-than-light communication.

### 5. Multi-Qubit Circuit Designer & Simulator
- 1 to 4 configurable qubit wires ($q_0, q_1, q_2, q_3$).
- Wire initial state toggles ($|0\rangle$ or $|1\rangle$).
- Gate palette for single-qubit, controlled, and swap operations.
- Step-by-step circuit playhead (step forward, step backward, full execution).
- Preset algorithms:
  - Hadamard Superposition ($H$)
  - Double NOT ($X \to X$)
  - Superposition Cancellation ($H \to H$)
  - Bell State ($|\Phi^+\rangle$)
  - GHZ 3-Qubit Entangled State ($(|000\rangle + |111\rangle)/\sqrt{2}$)
  - Full Quantum Teleportation Protocol
  - SWAP Gate Circuit
- Real-time Qiskit ASCII art diagram and OpenQASM export.

### 6. Gaming & Gamification Mechanics
- Player Level & XP Points system ($100$ to $600$ XP per mission).
- Daily Quantum Challenge with countdown timer and streak tracker.
- 60-Second Timed Sprint Mode with live score multiplier.
- QExpo 2026 Leaderboard with demo competitors and live player rank.
- Badges & Achievements gallery (First Superposition, Phase Alchemist, Spooky Action Hero, Circuit Architect, Teleportation Pioneer, CHSH Champion).
- Web Audio Synthesizer: Procedural sci-fi quantum soundscapes (muted by default with navbar toggle).
- Official printable **QExpo 2026 Quantum Master Certificate** with verifiable ID and student name.

### 7. Judge Demo Tour (7-Step Guided Flow)
Specially crafted for QExpo 2026 judges to evaluate the entire problem statement in under 3 minutes:
1. **Start as Beginner:** Inspect basis states and prepare superposition.
2. **Learn & Apply Hadamard:** Observe unitary transformation in Gate Lab.
3. **Inspect 3D Bloch Sphere:** Watch statevector rotate along spherical arc.
4. **Build a Bell State:** Place $H(q0)$ and $CX(q0 \to q1)$ in Circuit Simulator.
5. **Inspect Probabilities:** Measure Bell state on Qiskit Aer in Z & X bases.
6. **Solve a Challenge:** Complete a mission puzzle and 3-question quiz.
7. **Unlock & Claim Certificate:** Earn XP, achieve Quantum Master tier, and view certificate.

### 8. Team & Hackathon Section
- Displays **QExpo 2026** prominently.
- 3 Editable Team-Member cards with inline name editing and persistence.
- Comprehensive About section outlining educational purpose, key innovations, and pedagogical methodology.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, Recharts, Lucide Icons |
| **3D Visualization** | HTML5 Hardware-Accelerated 3D Canvas Engine |
| **Audio** | Web Audio API Synthesizer (procedural quantum sound effects) |
| **Backend** | Python 3.12, FastAPI, Uvicorn, Pydantic v2 |
| **Quantum Simulation** | Qiskit 1.4+, Qiskit Aer (`AerSimulator`), NumPy |
| **Testing** | Pytest, HTTPX, TestClient (36 comprehensive tests passing) |
| **Persistence** | Browser LocalStorage (XP, levels, sound settings, team names) |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.12** (or 3.10 / 3.11): `python3 --version`
- **Node.js 18+** & **npm**: `node -v && npm -v`

---

### Step 1: Start the Backend (Terminal 1)

```bash
# 1. Activate virtual environment
source .venv/bin/activate

# 2. Install dependencies (if needed)
pip install -r backend/requirements.txt

# 3. Start the FastAPI simulation server
PYTHONPATH=. uvicorn backend.app.main:app --reload --port 8000
```
Backend will be live at: `http://127.0.0.1:8000`  
API Swagger Docs: `http://127.0.0.1:8000/docs`

---

### Step 2: Start the Frontend (Terminal 2)

```bash
cd frontend

# Start the Vite development server
npm run dev
```
Frontend will be live at: `http://localhost:5173`

---

### Step 3: Run End-to-End Simulation Tests

To verify backend simulation accuracy and Qiskit Aer integration:

```bash
# Run backend pytest suite (36 tests)
.venv/bin/pytest backend/tests

# Run end-to-end verification script against live server
python3 verify_simulation.py
```

---

## 📡 REST API Specification

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Backend status, Qiskit & Aer version numbers |
| `/api/qubit/prepare` | POST | Single-qubit state preparation ($|0\rangle, |1\rangle, |+\rangle, |-\rangle$) |
| `/api/qubit/measure` | POST | Finite-shot measurement simulation on single qubit |
| `/api/circuit/run` | POST | 1-qubit gate sequence simulation |
| `/api/bell/prepare` | POST | Bell state preparation ($|\Phi^+\rangle, |\Phi^-\rangle, |\Psi^+\rangle, |\Psi^-\rangle$) |
| `/api/bell/measure` | POST | Bell state measurement in Z or X basis on Qiskit Aer |
| `/api/circuit/simulate` | POST | Multi-qubit arbitrary circuit simulation (1–5 wires) |
| `/api/teleport/simulate`| POST | 3-qubit quantum teleportation protocol simulation |

---

## 🏆 QExpo 2026 Judge Walkthrough Checklist

- [x] **Single-Qubit Operations:** Demonstrated in Qubit Explorer, Gate Lab, and 3D Bloch Sphere.
- [x] **Multi-Qubit Operations:** Demonstrated with CNOT, CZ, and SWAP in Multi-Qubit Missions and Circuit Simulator.
- [x] **Design & Simulation of Quantum Circuits:** Interactive drag-and-drop circuit builder with step-by-step statevector inspection and finite-shot measurement histograms.
- [x] **Gamification:** 7 level missions, XP points, daily challenge, timed sprint, leaderboard, badges, and Quantum Master Certificate.
- [x] **Scientific Integrity:** Real Qiskit Aer backend simulation, No-Signaling theorem disclaimer, and global vs relative phase distinction.

---

*Developed with passion for **QExpo 2026** by the Quantum Quest Team.*
