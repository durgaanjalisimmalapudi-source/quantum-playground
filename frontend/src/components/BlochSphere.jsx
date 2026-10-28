import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Sparkles,
  Info,
  Play,
  RotateCw,
  Compass,
  CheckCircle2,
  HelpCircle,
  Eye,
  Sliders,
} from 'lucide-react';
import { Complex, getSingleQubitGateMatrix, apply1QubitGate, statevectorToBloch } from '../utils/quantumEngine';
import { sounds } from '../utils/soundEffects';

export default function BlochSphere({ onGateApplied = null }) {
  // Current quantum state: c0, c1
  const [c0, setC0] = useState(new Complex(1, 0));
  const [c1, setC1] = useState(new Complex(0, 0));
  const [gateHistory, setGateHistory] = useState([]);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showPhaseExplainer, setShowPhaseExplainer] = useState(false);

  // Rotation angles for 3D camera
  const [cameraRot, setCameraRot] = useState({ pitch: 0.35, yaw: 0.8 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // Animation interpolation state
  const animRef = useRef({
    currentVector: { x: 0, y: 0, z: 1 },
    targetVector: { x: 0, y: 0, z: 1 },
    progress: 1.0,
  });

  const canvasRef = useRef(null);

  // Derive current bloch coordinates
  const bloch = statevectorToBloch(c0, c1);

  // Whenever c0 or c1 changes, update target vector and trigger smooth animation
  useEffect(() => {
    animRef.current.targetVector = { x: bloch.x, y: bloch.y, z: bloch.z };
    animRef.current.progress = 0.0;
  }, [c0, c1]);

  // Apply a single-qubit gate
  const applyGate = (gateName, param = null) => {
    sounds.playGateClick(gateName === 'H' ? 750 : 600);
    const mat = getSingleQubitGateMatrix(gateName, param);
    const newSv = apply1QubitGate([c0, c1], 1, 0, mat);
    setC0(newSv[0]);
    setC1(newSv[1]);
    const label = param ? `${gateName}(π/2)` : gateName;
    setGateHistory((prev) => [...prev, label]);
    if (onGateApplied) onGateApplied(label);
  };

  const resetState = () => {
    sounds.playGateClick(440);
    setC0(new Complex(1, 0));
    setC1(new Complex(0, 0));
    setGateHistory([]);
  };

  const setPreset = (presetName) => {
    sounds.playGateClick(580);
    if (presetName === '0') {
      setC0(new Complex(1, 0));
      setC1(new Complex(0, 0));
    } else if (presetName === '1') {
      setC0(new Complex(0, 0));
      setC1(new Complex(1, 0));
    } else if (presetName === '+') {
      setC0(new Complex(1 / Math.SQRT2, 0));
      setC1(new Complex(1 / Math.SQRT2, 0));
    } else if (presetName === '-') {
      setC0(new Complex(1 / Math.SQRT2, 0));
      setC1(new Complex(-1 / Math.SQRT2, 0));
    } else if (presetName === '+i') {
      setC0(new Complex(1 / Math.SQRT2, 0));
      setC1(new Complex(0, 1 / Math.SQRT2));
    } else if (presetName === '-i') {
      setC0(new Complex(1 / Math.SQRT2, 0));
      setC1(new Complex(0, -1 / Math.SQRT2));
    }
    setGateHistory((prev) => [...prev, `Preset |${presetName}⟩`]);
  };

  // 3D Rendering on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.38;

      ctx.clearRect(0, 0, width, height);

      // Handle auto rotation
      if (autoRotate && !isDraggingRef.current) {
        setCameraRot((prev) => ({ ...prev, yaw: prev.yaw + 0.005 }));
      }

      // Smooth interpolation of vector
      if (animRef.current.progress < 1.0) {
        animRef.current.progress += 0.06;
        if (animRef.current.progress > 1.0) animRef.current.progress = 1.0;
        const p = animRef.current.progress;
        // Ease out quad
        const ease = 1 - (1 - p) * (1 - p);
        const cur = animRef.current.currentVector;
        const tgt = animRef.current.targetVector;
        animRef.current.currentVector = {
          x: cur.x + (tgt.x - cur.x) * ease,
          y: cur.y + (tgt.y - cur.y) * ease,
          z: cur.z + (tgt.z - cur.z) * ease,
        };
      } else {
        animRef.current.currentVector = { ...animRef.current.targetVector };
      }

      const { pitch, yaw } = cameraRot;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      // 3D projection function: map (x, y, z) in physics coordinates to (sx, sy)
      // Standard Bloch sphere: +Z is UP, +X is RIGHT/FORWARD, +Y is RIGHT/DEPTH
      const project = (x, y, z) => {
        // Rotate around Z by yaw (X & Y)
        const rx = x * cosY - y * sinY;
        const ry = x * sinY + y * cosY;
        const rz = z;

        // Rotate around X axis by pitch (Y & Z)
        const px = rx;
        const py = ry * cosP - rz * sinP;
        const pz = ry * sinP + rz * cosP;

        // Depth perspective scale
        const cameraDistance = 3.2;
        const scale = cameraDistance / (cameraDistance - py * 0.4);

        const sx = centerX + px * radius * scale;
        const sy = centerY - pz * radius * scale; // invert Z for screen Y
        return { sx, sy, depth: py };
      };

      // 1. Draw outer sphere background with glowing gradient
      const sphereGrad = ctx.createRadialGradient(
        centerX - radius * 0.2,
        centerY - radius * 0.3,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      sphereGrad.addColorStop(0, 'rgba(30, 58, 138, 0.25)');
      sphereGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.45)');
      sphereGrad.addColorStop(1, 'rgba(2, 6, 23, 0.7)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // Outer rim glow
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 2. Draw latitude rings (Equator and parallels)
      const drawRing = (zVal, strokeStyle, isDashed = false) => {
        const ringRadius = Math.sqrt(Math.max(0, 1 - zVal * zVal));
        const segments = 64;
        ctx.beginPath();
        if (isDashed) ctx.setLineDash([4, 4]);
        else ctx.setLineDash([]);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = zVal === 0 ? 1.5 : 0.8;

        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const x = ringRadius * Math.cos(angle);
          const y = ringRadius * Math.sin(angle);
          const pt = project(x, y, zVal);
          if (i === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      };

      // Parallels
      drawRing(0.5, 'rgba(148, 163, 184, 0.15)', true);
      drawRing(-0.5, 'rgba(148, 163, 184, 0.15)', true);
      // Equator
      drawRing(0, 'rgba(6, 182, 212, 0.55)', false);

      // 3. Draw Longitude Circles (Great Circles: XZ plane and YZ plane)
      const drawMeridian = (azimuth, strokeStyle) => {
        const segments = 64;
        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 3]);

        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          const x = Math.sin(theta) * Math.cos(azimuth);
          const y = Math.sin(theta) * Math.sin(azimuth);
          const z = Math.cos(theta);
          const pt = project(x, y, z);
          if (i === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      };

      drawMeridian(0, 'rgba(168, 85, 247, 0.25)'); // XZ plane
      drawMeridian(Math.PI / 2, 'rgba(56, 189, 248, 0.25)'); // YZ plane

      // 4. Draw 3D Axes
      const drawAxis = (axisX, axisY, axisZ, labelPos, labelNeg, color) => {
        const pos = project(axisX * 1.25, axisY * 1.25, axisZ * 1.25);
        const neg = project(-axisX * 1.2, -axisY * 1.2, -axisZ * 1.2);
        const center = project(0, 0, 0);

        // Negative dashed line
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        ctx.moveTo(center.sx, center.sy);
        ctx.lineTo(neg.sx, neg.sy);
        ctx.stroke();

        // Positive solid line
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.moveTo(center.sx, center.sy);
        ctx.lineTo(pos.sx, pos.sy);
        ctx.stroke();

        // Labels
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = color;
        ctx.fillText(labelPos, pos.sx + 4, pos.sy + 4);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.fillText(labelNeg, neg.sx + 4, neg.sy + 4);
      };

      drawAxis(1, 0, 0, '+X (|+⟩)', '-X (|−⟩)', '#ec4899'); // X axis
      drawAxis(0, 1, 0, '+Y (|+i⟩)', '-Y (|-i⟩)', '#38bdf8'); // Y axis
      drawAxis(0, 0, 1, '+Z (|0⟩)', '-Z (|1⟩)', '#10b981'); // Z axis (North/South poles)

      // 5. Draw Key Pole / Equatorial Markers
      const drawMarker = (x, y, z, label, col = '#ffffff') => {
        const pt = project(x, y, z);
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, 4, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = '11px sans-serif';
        ctx.fillStyle = col;
        ctx.fillText(label, pt.sx + 6, pt.sy - 4);
      };

      drawMarker(0, 0, 1, '|0⟩', '#10b981');
      drawMarker(0, 0, -1, '|1⟩', '#ef4444');
      drawMarker(1, 0, 0, '|+⟩', '#ec4899');
      drawMarker(-1, 0, 0, '|−⟩', '#f472b6');
      drawMarker(0, 1, 0, '|+i⟩', '#38bdf8');
      drawMarker(0, -1, 0, '|-i⟩', '#60a5fa');

      // 6. Draw State Vector Arrow
      const v = animRef.current.currentVector;
      const center = project(0, 0, 0);
      const tip = project(v.x, v.y, v.z);

      // Vector shadow / projection on XY plane
      const shadowTip = project(v.x, v.y, 0);
      ctx.beginPath();
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.moveTo(center.sx, center.sy);
      ctx.lineTo(shadowTip.sx, shadowTip.sy);
      ctx.lineTo(tip.sx, tip.sy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Glow line for the state vector
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 6;
      ctx.moveTo(center.sx, center.sy);
      ctx.lineTo(tip.sx, tip.sy);
      ctx.stroke();

      // Main vector line
      ctx.beginPath();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 3;
      ctx.moveTo(center.sx, center.sy);
      ctx.lineTo(tip.sx, tip.sy);
      ctx.stroke();

      // Glowing vector tip
      const tipGrad = ctx.createRadialGradient(tip.sx, tip.sy, 2, tip.sx, tip.sy, 12);
      tipGrad.addColorStop(0, '#ffffff');
      tipGrad.addColorStop(0.4, '#38bdf8');
      tipGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.beginPath();
      ctx.arc(tip.sx, tip.sy, 12, 0, Math.PI * 2);
      ctx.fillStyle = tipGrad;
      ctx.fill();

      // Center pivot point
      ctx.beginPath();
      ctx.arc(center.sx, center.sy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#94a3b8';
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [cameraRot, autoRotate]);

  // Mouse & Touch drag handlers for 3D rotation
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };

    setCameraRot((prev) => ({
      yaw: prev.yaw + dx * 0.01,
      pitch: Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, prev.pitch - dy * 0.01)),
    }));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch event handlers for mobile devices
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      isDraggingRef.current = true;
      lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || !e.touches || e.touches.length === 0) return;
    const dx = e.touches[0].clientX - lastMouseRef.current.x;
    const dy = e.touches[0].clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setCameraRot((prev) => ({
      yaw: prev.yaw + dx * 0.012,
      pitch: Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, prev.pitch - dy * 0.012)),
    }));
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-cyan-500/30 p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              Interactive 3D Bloch Sphere
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Level 3 Mission
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Touch or drag to rotate 3D view. Apply quantum gates to observe unitary rotations & statevector trajectories.
          </p>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              autoRotate
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            {autoRotate ? 'Orbit On' : 'Orbit Off'}
          </button>

          <button
            onClick={() => setShowPhaseExplainer(!showPhaseExplainer)}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 flex items-center gap-1.5 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Phase Details
          </button>

          <button
            onClick={resetState}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset |0⟩
          </button>
        </div>
      </div>

      {/* Scientific Global vs Relative Phase Explainer Modal / Dropdown */}
      {showPhaseExplainer && (
        <div className="mb-6 p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs leading-relaxed space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between font-bold text-sm text-purple-300">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Scientific Deep Dive: Global Phase vs. Relative Phase
            </span>
            <button
              onClick={() => setShowPhaseExplainer(false)}
              className="text-purple-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>
          <p>
            <strong>Global Phase (e^(iγ)):</strong> If you multiply the entire state vector by a phase factor |ψ'⟩ = e^(iγ)|ψ⟩, the probability of every measurement outcome is unchanged (|e^(iγ)α|² = |α|²). Because global phase cannot be observed in any physical experiment, all states differing only by a global phase map to the <em>exact same point</em> on the Bloch sphere!
          </p>
          <p>
            <strong>Relative Phase (e^(iφ)):</strong> In the superposition |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩, the angle φ is the relative phase between |0⟩ and |1⟩. Changing φ rotates the state around the Z-axis along the equator (e.g. from |+⟩ at φ=0 to |+i⟩ at φ=π/2 and |−⟩ at φ=π). While measuring in the computational basis produces 50/50 for all of them, relative phase creates <strong>observable quantum interference</strong> when measured in the X or Y basis!
          </p>
        </div>
      )}

      {/* Main Grid: 3D Canvas + Readout Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3D Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center w-full">
          <div
            className="w-full aspect-square max-w-[340px] sm:max-w-[440px] relative rounded-xl border border-slate-800 bg-slate-950/80 cursor-grab active:cursor-grabbing select-none shadow-inner flex items-center justify-center touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            <canvas
              ref={canvasRef}
              width={460}
              height={460}
              className="w-full h-full object-contain pointer-events-none"
            />
            <div className="absolute bottom-2.5 left-2.5 text-[9px] sm:text-[10px] text-slate-400 font-mono bg-slate-900/90 px-2 py-1 rounded border border-slate-800 pointer-events-none">
              Yaw: {(cameraRot.yaw % (Math.PI * 2)).toFixed(2)} rad • Pitch: {cameraRot.pitch.toFixed(2)} rad
            </div>
            <div className="absolute top-2.5 right-2.5 text-[9px] sm:text-[10px] text-cyan-400 font-mono bg-cyan-950/80 px-2 py-1 rounded border border-cyan-500/30 pointer-events-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Drag / Touch to Rotate</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 w-full">
            <span className="text-xs text-slate-400 mr-1 sm:mr-2">Basis Presets:</span>
            {['0', '1', '+', '-', '+i', '-i'].map((st) => (
              <button
                key={st}
                onClick={() => setPreset(st)}
                className="px-2.5 py-1.5 min-h-[36px] rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 hover:border-cyan-500/50 transition active:scale-95"
              >
                |{st}⟩
              </button>
            ))}
          </div>
        </div>

        {/* Right: Controls & Quantum State Mathematics (5 cols) */}
        <div className="lg:col-span-5 space-y-4 w-full">
          {/* Live State Vector & Probabilities */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Live Quantum State
              </span>
              <span className="text-xs font-mono text-slate-400">
                |ψ⟩ = α|0⟩ + β|1⟩
              </span>
            </div>

            {/* Bra-Ket Formula */}
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-cyan-500/20 text-center font-mono text-xs sm:text-sm text-cyan-200 break-words">
              |ψ⟩ = ({c0.format()})|0⟩ + ({c1.format()})|1⟩
            </div>

            {/* Measurement Probabilities Bars */}
            <div className="space-y-2 pt-1">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-emerald-400">P(|0⟩) = |α|² = cos²(θ/2)</span>
                  <span className="text-emerald-300 font-bold">{(bloch.prob0 * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${bloch.prob0 * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-rose-400">P(|1⟩) = |β|² = sin²(θ/2)</span>
                  <span className="text-rose-300 font-bold">{(bloch.prob1 * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${bloch.prob1 * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bloch Coordinates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300">
              <div className="bg-slate-900 p-2 rounded border border-slate-800/80">
                <span className="text-slate-500 block">Spherical Angles:</span>
                θ = {bloch.theta.toFixed(3)} rad ({bloch.thetaDeg}°)<br />
                φ = {bloch.phi.toFixed(3)} rad ({bloch.phiDeg}°)
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800/80">
                <span className="text-slate-500 block">Bloch Vector [x, y, z]:</span>
                x = {bloch.x.toFixed(3)}<br />
                y = {bloch.y.toFixed(3)}<br />
                z = {bloch.z.toFixed(3)}
              </div>
            </div>
          </div>

          {/* Interactive Gate Controls */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block border-b border-slate-800/80 pb-2">
              Apply Quantum Gates
            </span>

            {/* Standard Pauli & Clifford Gates */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => applyGate('X')}
                className="py-2.5 px-3 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 active:scale-95 border border-indigo-500/40 text-indigo-200 font-bold text-xs flex flex-col items-center justify-center gap-0.5 transition min-h-[44px]"
                title="Pauli-X (NOT / 180° around X)"
              >
                <span>X</span>
                <span className="text-[9px] font-normal text-indigo-400">Bit-Flip</span>
              </button>

              <button
                onClick={() => applyGate('Y')}
                className="py-2.5 px-3 rounded-lg bg-sky-950/60 hover:bg-sky-900 active:scale-95 border border-sky-500/40 text-sky-200 font-bold text-xs flex flex-col items-center justify-center gap-0.5 transition min-h-[44px]"
                title="Pauli-Y (180° around Y)"
              >
                <span>Y</span>
                <span className="text-[9px] font-normal text-sky-400">Phase-Flip</span>
              </button>

              <button
                onClick={() => applyGate('Z')}
                className="py-2.5 px-3 rounded-lg bg-purple-950/60 hover:bg-purple-900 active:scale-95 border border-purple-500/40 text-purple-200 font-bold text-xs flex flex-col items-center justify-center gap-0.5 transition min-h-[44px]"
                title="Pauli-Z (180° around Z)"
              >
                <span>Z</span>
                <span className="text-[9px] font-normal text-purple-400">Phase</span>
              </button>

              <button
                onClick={() => applyGate('H')}
                className="py-2.5 px-3 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 active:scale-95 border border-cyan-500/40 text-cyan-200 font-bold text-xs flex flex-col items-center justify-center gap-0.5 transition min-h-[44px]"
                title="Hadamard (Superposition generator / (X+Z)/√2 axis)"
              >
                <span>H</span>
                <span className="text-[9px] font-normal text-cyan-400">Superpos.</span>
              </button>
            </div>

            {/* Phase & Rotation Gates */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => applyGate('S')}
                className="py-2.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-700 text-slate-200 font-mono text-xs text-center transition min-h-[40px]"
                title="S gate: π/2 phase around Z"
              >
                S (π/2)
              </button>
              <button
                onClick={() => applyGate('T')}
                className="py-2.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-700 text-slate-200 font-mono text-xs text-center transition min-h-[40px]"
                title="T gate: π/4 phase around Z"
              >
                T (π/4)
              </button>
              <button
                onClick={() => applyGate('RX', Math.PI / 2)}
                className="py-2.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-700 text-slate-200 font-mono text-xs text-center transition min-h-[40px]"
                title="RX(π/2): 90° rotation around X axis"
              >
                RX(π/2)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => applyGate('RY', Math.PI / 2)}
                className="py-2.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-700 text-slate-200 font-mono text-xs text-center transition min-h-[40px]"
                title="RY(π/2): 90° rotation around Y axis"
              >
                RY(π/2)
              </button>
              <button
                onClick={() => applyGate('RZ', Math.PI / 2)}
                className="py-2.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-700 text-slate-200 font-mono text-xs text-center transition min-h-[40px]"
                title="RZ(π/2): 90° rotation around Z axis"
              >
                RZ(π/2)
              </button>
            </div>

            {/* Gate History Log */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                Gate Sequence History:
              </span>
              <div className="flex flex-wrap gap-1 min-h-[26px] items-center">
                {gateHistory.length === 0 ? (
                  <span className="text-xs text-slate-600 italic">No gates applied yet</span>
                ) : (
                  gateHistory.map((g, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-[11px] font-mono text-cyan-300"
                    >
                      {g}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
