# Quantum Playground ⚛️
> **Explore Quantum. Experiment Freely. Understand the Future.**

Interactive Quantum Computing Education Website powered by **Qiskit** and **Qiskit Aer**, built for **QExpo 2026** under the **Quantum Education & Outreach** category.

Developed by a team of two undergraduate AI & ML students:
- **[Student Member 1 — Full Name]** — Quantum Algorithms & Simulation Backend ([University Placeholder])
- **[Student Member 2 — Full Name]** — UI/UX Design & Pedagogical Engineering ([University Placeholder])

---

## 🌟 Overview & Scientific Architecture

Quantum Playground bridges abstract linear algebra and intuitive quantum computing experimentation. Unlike static landing pages or hard-coded mockups, **all circuit simulations, statevectors, and finite-shot measurement collapse statistics are computed live on the local backend using Qiskit 1.4+ and Qiskit Aer (`AerSimulator`)**.

```
React (Vite + Tailwind CSS + Recharts)
              │
              ▼  HTTP JSON API (Vite Proxy: /api/*)
FastAPI Backend (Python 3.12)
              │
              ▼
Qiskit Circuit Builder (circuits.py)
              ├────────────────────────────────────────┐
              ▼                                        ▼
   Statevector Analysis                   Qiskit Aer Simulation (AerSimulator)
   - Exact Amplitudes α, β               - Finite-Shot Collapse (100–1000 shots)
   - Magnitude, Phase (rad/deg)          - Observed Counts & Frequencies
   - Theoretical Probabilities P=|α|²    - Statistical Variance
              │                                        │
              └───────────────────┬────────────────────┘
                                  ▼
           Structured Pedagogical Response & ASCII Circuit
```

### Key Modules
1. **Qubit Explorer**:
   - Inspect computational basis states $|0\rangle$ and $|1\rangle$.
   - Apply Hadamard gates to create $|+\rangle = (|0\rangle + |1\rangle)/\sqrt{2}$ and $|-\rangle = (|0\rangle - |1\rangle)/\sqrt{2}$.
   - Learn why $|+\rangle$ and $|-\rangle$ yield identical 50%/50% Z-basis probabilities yet possess an exact $180^\circ$ relative phase difference.
   - Run single measurement collapse (1 shot) or finite statistical runs (100 shots).
2. **Quantum Gate Lab**:
   - Interactive 1-qubit circuit builder with Pauli-X (bit flip), Hadamard (superposition/interference), Pauli-Z (phase flip), and Pauli-Y.
   - Curated benchmark presets:
     - $X \to X$: Identity ($X^2 = I$, returns $|0\rangle$)
     - $X \to H$: Prepares $|-\rangle$
     - $H \to H$: Self-inverse interference ($H^2 = I$, destructive cancellation on $|1\rangle$)
     - $H \to X$: Prepares $|+\rangle$
   - Step-by-step mathematical derivation and real-time statevector tracking.
3. **Entanglement Explorer**:
   - Prepare and measure the 4 canonical Bell states:
     - $|\Phi^+\rangle = (|00\rangle + |11\rangle)/\sqrt{2}$
     - $|\Phi^-\rangle = (|00\rangle - |11\rangle)/\sqrt{2}$
     - $|\Psi^+\rangle = (|01\rangle + |10\rangle)/\sqrt{2}$
     - $|\Psi^-\rangle = (|01\rangle - |10\rangle)/\sqrt{2}$
   - Finite-shot measurement (100 and 1000 shots) showing 100% correlation/anti-correlation.
   - **Qiskit Little-Endian Bitstring Convention**: Documented and verified as $|q_1 q_0\rangle$ (qubit 0 is rightmost).
   - **Scientific Rigor & Bell Inequality**: Clear pedagogical notes explaining that single-basis correlations do *not* prove quantum non-locality (classical paired coins could do the same); true demonstration requires testing Bell/CHSH inequalities across non-orthogonal angles.
4. **Quantum Quiz Arena**:
   - 12 interactive questions testing qubits, superposition, gates, measurement, entanglement, Born's rule, and Qiskit.
   - Instant feedback, detailed explanations, score tracking, progress bar, and rank certification.
5. **Expo Presentation Mode (Live Jury View)**:
   - Presentation layout designed for exhibition laptops and projectors.
   - Slide-by-slide jury walkthrough with key mathematical equations, 60-second spoken presenter scripts, bulleted talking points, and a "Rerun Simulation for Judges" live verification button.

---

## 🚀 Quick Launch Guide (macOS / VS Code)

### Prerequisites
1. **Python 3.12** (or Python 3.10 / 3.11). Check with:
   ```bash
   python3 --version
   ```
2. **Node.js** (v18 or v20+) and **npm**. Check with:
   ```bash
   node -v
   npm -v
   ```

---

### Step 1: Start the Backend (Terminal 1)

Open a terminal in the root `quantum-playground/` folder:

```bash
# 1. Create a Python 3.12 virtual environment (if not already created)
python3.12 -m venv .venv

# 2. Activate the virtual environment
source .venv/bin/activate

# 3. Upgrade pip and install dependencies
pip install --upgrade pip
pip install -r backend/requirements.txt

# 4. Start the FastAPI development server
uvicorn backend.app.main:app --reload --port 8000
```
> The API will be available at: **http://127.0.0.1:8000**  
> Interactive OpenAPI documentation: **http://127.0.0.1:8000/docs**

---

### Step 2: Start the Frontend (Terminal 2)

In VS Code, open a second terminal (`Ctrl + Shift + \`` or `Cmd + Shift + \``):

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the Vite development server
npm run dev
```
> The website will open at: **http://localhost:5173**

---

### Windows (PowerShell) Alternative

If running on Windows:

```powershell
# Backend (PowerShell)
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r backend\requirements.txt
uvicorn backend.app.main:app --reload --port 8000

# Frontend (Second PowerShell window)
cd frontend
npm install
npm run dev
```

---

## 🧪 Running Automated Tests

Run the complete backend test suite (30 unit and integration tests):

```bash
source .venv/bin/activate
pytest backend/tests/ -v
```

### Verified Test Cases:
- `test_qubit.py`: Basis state preparations ($|0\rangle, |1\rangle, |+\rangle, |-\rangle$), complex amplitude phase verification ($\pi$ relative phase), single-shot collapse, 250-shot statistical sum.
- `test_gates.py`: Single X gate, $X \to X$ identity, $H \to H$ interference cancellation, $X \to H$ phase preparation, $H \to X$ symmetric superposition, input validation for illegal gates/shot counts.
- `test_bell_states.py`: Superposition and theoretical probabilities for all 4 Bell states ($|\Phi^+\rangle, |\Phi^-\rangle, |\Psi^+\rangle, |\Psi^-\rangle$), singlet state phase check, 500-shot finite simulation correlation verification ($P(01)=0, P(10)=0$).
- `test_integration.py`: End-to-end API verification for `/api/health`, `/api/qubit/prepare`, `/api/qubit/measure`, `/api/circuit/run`, `/api/bell/prepare`, and `/api/bell/measure`.

---

## 🔍 How Frontend & Backend Communicate

1. The frontend uses a lightweight, robust API client located in [`frontend/src/api/client.js`](file:///Users/anjalisimmalapudi/Desktop/quantum-playground/frontend/src/api/client.js).
2. Development requests are reverse-proxied by Vite (`/api/*` $\to$ `http://127.0.0.1:8000/api/*`), eliminating CORS friction.
3. The top navigation bar maintains an active health-check pulse (`GET /api/health`).
   - 🟢 **Green ("Qiskit Aer Active")**: The backend is healthy and simulator is online.
   - 🔴 **Red ("Backend Offline")**: If the backend is stopped, a clear troubleshooting banner displays the command to restart it.

---

## 🛑 Stopping the Application

To shut down the servers:
- In Terminal 1 (Backend): Press `Ctrl + C`
- In Terminal 2 (Frontend): Press `Ctrl + C`
- To deactivate the virtual environment: `deactivate`

---

## 🛠️ Troubleshooting

- **Issue: `Command not found: python3.12`**  
  You can use standard `python3` or brew: `/opt/homebrew/bin/python3 -m venv .venv`.
- **Issue: Frontend displays "Backend Not Detected"**  
  Ensure Terminal 1 is running `uvicorn backend.app.main:app --reload --port 8000`. You can test connectivity by visiting `http://127.0.0.1:8000/api/health` in your browser.
- **Issue: Node version mismatch**  
  Ensure Node $\ge 18$ is active. On macOS with nvm: `nvm use 20`.

---

## 📜 QExpo 2026 Exhibition Statement

> **Category**: Quantum Education & Outreach  
> **Simulation Engine**: Local Qiskit 1.4+ and Qiskit Aer (`AerSimulator`)  
> **Scientific Integrity**: All measurement distributions arise from real pseudo-random finite-shot quantum collapse simulations. Computational basis correlation limitations and Bell's theorem nuances are explicitly taught.
