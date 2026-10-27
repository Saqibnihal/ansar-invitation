import { useEffect, useRef, useCallback } from 'react';

/**
 * GoldenParticles - Canvas-based particle effect for the seal-breaking animation
 * Creates sparkling golden particles that burst outward and fade
 */
export default function GoldenParticles({ active, onComplete }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  const createParticles = useCallback((canvas) => {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const particles = [];

    for (let i = 0; i < 120; i++) {
      const angle = (Math.PI * 2 * i) / 120 + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 4;
      const size = 1 + Math.random() * 3.5;
      const life = 60 + Math.random() * 80;
      const hue = 38 + Math.random() * 20; // gold range
      const lightness = 55 + Math.random() * 25;

      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        life,
        maxLife: life,
        hue,
        lightness,
        sparkle: Math.random(),
        trail: [],
      });
    }

    // Add extra shimmer particles (smaller, faster)
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 0.5 + Math.random() * 1.5,
        life: 30 + Math.random() * 40,
        maxLife: 30 + Math.random() * 40,
        hue: 45,
        lightness: 80 + Math.random() * 15,
        sparkle: Math.random(),
        trail: [],
      });
    }

    return particles;
  }, []);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    particlesRef.current = createParticles(canvas);

    let frame = 0;
    const maxFrames = 180;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      let aliveCount = 0;

      particlesRef.current.forEach((p) => {
        if (p.life <= 0) return;
        aliveCount++;

        p.life--;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03; // subtle gravity
        p.vx *= 0.995;
        p.vy *= 0.995;

        // Store trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();

        const progress = p.life / p.maxLife;
        const alpha = progress * (0.5 + p.sparkle * 0.5 * Math.sin(frame * 0.3 + p.sparkle * 10));

        // Draw trail
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let i = 1; i < p.trail.length; i++) {
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
          }
          ctx.strokeStyle = `hsla(${p.hue}, 80%, ${p.lightness}%, ${alpha * 0.3})`;
          ctx.lineWidth = p.size * 0.5;
          ctx.stroke();
        }

        // Draw particle glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `hsla(${p.hue}, 90%, ${p.lightness}%, ${alpha})`);
        gradient.addColorStop(0.4, `hsla(${p.hue}, 80%, ${p.lightness - 10}%, ${alpha * 0.5})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 70%, ${p.lightness - 20}%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, ${Math.min(p.lightness + 20, 95)}%, ${alpha})`;
        ctx.fill();
      });

      if (aliveCount > 0 && frame < maxFrames) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onComplete?.();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [active, createParticles, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
      aria-hidden="true"
    />
  );
}
