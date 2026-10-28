import React, { useEffect, useRef, useState } from 'react';

/**
 * QuantumBackground Component
 * Renders a state-of-the-art interactive quantum background canvas:
 * - Dynamic entangling qubit nodes with traveling photon wavelets
 * - Quantum vacuum fluctuations (virtual particle pair creation/annihilation)
 * - Bra-ket mathematical state labels (|0⟩, |1⟩, |+⟩, |−⟩, |ψ⟩, |Φ+⟩, ℏ, ⊗)
 * - Mouse wavefunction disturbance (probability ripple)
 * - Layered ambient quantum aurora glows
 */

const BRA_KET_SYMBOLS = [
  '|0⟩', '|1⟩', '|+⟩', '|−⟩', '|ψ⟩',
  '|Φ+⟩', '|Ψ−⟩', 'ℏ', '⊗', 'e^iθ',
  '|00⟩', '|11⟩', 'α|0⟩+β|1⟩', 'σ_z', 'H',
];

export default function QuantumBackground({
  interactive = true,
  particleCount = 55,
  showSymbols = true,
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, radius: 180, active: false });
  const [fieldMode, setFieldMode] = useState('entangled'); // entangled, superposition, vacuum

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Initialize quantum particles
    const count = Math.min(particleCount, Math.floor((width * height) / 18000) || 45);
    const particles = [];

    const colors = [
      { r: 6, g: 182, b: 212 },   // Cyan
      { r: 168, g: 85, b: 247 },  // Purple
      { r: 99, g: 102, b: 241 },  // Indigo
      { r: 236, g: 72, b: 153 },  // Pink
      { r: 52, g: 211, b: 153 },  // Emerald
    ];

    for (let i = 0; i < count; i++) {
      const isSymbol = showSymbols && i < BRA_KET_SYMBOLS.length;
      const col = colors[i % colors.length];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: isSymbol ? Math.random() * 2 + 3 : Math.random() * 2 + 1.8,
        color: col,
        alpha: Math.random() * 0.5 + 0.35,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        pulseOffset: Math.random() * Math.PI * 2,
        symbol: isSymbol ? BRA_KET_SYMBOLS[i] : null,
        symbolSize: isSymbol ? Math.floor(Math.random() * 3 + 12) : 0,
      });
    }

    // Vacuum fluctuations (transient flashing particles)
    const vacuumFlashes = [];
    for (let i = 0; i < 12; i++) {
      vacuumFlashes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        maxRadius: Math.random() * 25 + 10,
        currentRadius: 0,
        alpha: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.floor(Math.random() * 80 + 40),
        delay: Math.floor(Math.random() * 100),
      });
    }

    // Mouse handlers
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    if (interactive && canvas.parentElement) {
      canvas.parentElement.addEventListener('mousemove', handleMouseMove);
      canvas.parentElement.addEventListener('mouseleave', handleMouseLeave);
    }

    let time = 0;

    // Main animation loop
    const render = () => {
      time += 0.02;

      // Smooth mouse interpolation
      if (mouseRef.current.active) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;
      } else {
        mouseRef.current.x = -1000;
        mouseRef.current.y = -1000;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient quantum probability waves
      ctx.save();
      const waveGrad = ctx.createRadialGradient(
        width * 0.3 + Math.sin(time * 0.4) * 80,
        height * 0.4 + Math.cos(time * 0.3) * 60,
        10,
        width * 0.5,
        height * 0.5,
        width * 0.6
      );
      waveGrad.addColorStop(0, 'rgba(6, 182, 212, 0.045)');
      waveGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.03)');
      waveGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = waveGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 2. Render vacuum fluctuations (particle-antiparticle pairs)
      for (let f of vacuumFlashes) {
        if (f.delay > 0) {
          f.delay--;
          continue;
        }
        f.life++;
        const progress = f.life / f.maxLife;
        f.currentRadius = f.maxRadius * Math.sin(progress * Math.PI);
        f.alpha = Math.sin(progress * Math.PI) * 0.4;

        if (f.currentRadius > 0 && f.alpha > 0) {
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${f.color.r}, ${f.color.g}, ${f.color.b}, ${f.alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Spark center
          ctx.beginPath();
          ctx.arc(f.x, f.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha * 1.5})`;
          ctx.fill();
        }

        if (f.life >= f.maxLife) {
          f.x = Math.random() * width;
          f.y = Math.random() * height;
          f.life = 0;
          f.maxLife = Math.floor(Math.random() * 90 + 50);
          f.delay = Math.floor(Math.random() * 120 + 30);
        }
      }

      // 3. Update & interact with particles
      for (let p of particles) {
        // Natural drift
        p.x += p.vx;
        p.y += p.vy;

        // Soft screen bounce / wrap
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Wavefunction mouse disturbance
        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRef.current.radius && dist > 0) {
            const force = (1 - dist / mouseRef.current.radius) * 1.8;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }
      }

      // 4. Draw dynamic quantum entanglement filaments
      const maxDist = 135;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const factor = 1 - dist / maxDist;
            const alpha = factor * 0.28;

            // Gradient line for the entanglement link
            const lineGrad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            lineGrad.addColorStop(
              0,
              `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${alpha})`
            );
            lineGrad.addColorStop(
              1,
              `rgba(${p2.color.r}, ${p2.color.g}, ${p2.color.b}, ${alpha})`
            );

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineGrad;
            ctx.lineWidth = factor * 1.5;
            ctx.stroke();

            // Traveling photon wavelet along the entanglement link
            const photonPos = ((time * 0.8 + i * 0.3) % 1);
            const px = p1.x + dx * photonPos;
            const py = p1.y + dy * photonPos;

            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 2})`;
            ctx.shadowBlur = 4;
            ctx.shadowColor = `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, 0.8)`;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // 5. Render Qubit Nodes and Bra-Ket symbols
      for (let p of particles) {
        const pulse = Math.sin(time * 3 + p.pulseOffset) * 0.35 + 0.65;
        const currentAlpha = p.alpha * pulse;

        // Glowing core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha})`;
        ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.9)`;
        ctx.shadowBlur = p.symbol ? 12 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Subtle outer wave ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (1.8 + pulse * 0.8), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha * 0.3})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Render Bra-Ket / Math label if available
        if (p.symbol) {
          ctx.save();
          ctx.font = `600 ${p.symbolSize}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = `rgba(226, 232, 240, ${Math.min(currentAlpha * 1.5, 0.75)})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.8)`;
          ctx.shadowBlur = 8;
          ctx.fillText(p.symbol, p.x, p.y - p.radius - 10);
          ctx.restore();
        }
      }

      // 6. Draw subtle interactive mouse probability ring
      if (mouseRef.current.active && mouseRef.current.x > 0) {
        ctx.save();
        const pulseRing = Math.sin(time * 5) * 6;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, mouseRef.current.radius * 0.35 + pulseRing, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.stroke();

        // Crosshair center
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (interactive && canvas.parentElement) {
        canvas.parentElement.removeEventListener('mousemove', handleMouseMove);
        canvas.parentElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [particleCount, interactive, showSymbols, fieldMode]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Dynamic Hardware-Accelerated Quantum Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* Layered Deep Ambient Quantum Aurora Beams */}
      <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-[36rem] h-[36rem] bg-gradient-to-bl from-purple-600/15 via-pink-600/10 to-transparent rounded-full blur-[110px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '3s' }} />
      <div className="absolute -bottom-32 left-1/3 w-[32rem] h-[32rem] bg-gradient-to-t from-indigo-600/15 via-cyan-600/10 to-transparent rounded-full blur-[100px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '1.5s' }} />

      {/* Subtle Quantum Grid Lattice Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)',
        }}
      />
    </div>
  );
}
