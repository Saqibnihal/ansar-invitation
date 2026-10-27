import { useEffect, useRef } from 'react';
import './DynamicPetalsDust.css';

/**
 * DynamicPetalsDust - Ultra-premium canvas animation engine
 *
 * Replaces dull dark background with:
 * 1. Tumbling 3D rose petals & gold leaf flakes (Pushpa Vrishti)
 * 2. Delicate 5-petal floating jasmine/blossom flowers
 * 3. Dancing, swirling golden dust particles with 4-point celestial star sparkles
 * 4. Warm, radiant bokeh orbs in royal burgundy & champagne gold
 * 5. Gentle interactive touch/cursor wind breeze
 */
export default function DynamicPetalsDust({
  count = 28,
  dustCount = 45,
  flowerCount = 4,
  includeBacklight = true,
  className = '',
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse / Touch interaction for realistic wind currents
    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const m = mouseRef.current;
      m.vx = (clientX - m.lastX) * 0.15;
      m.vy = (clientY - m.lastY) * 0.15;
      m.lastX = clientX;
      m.lastY = clientY;
      m.x = clientX;
      m.y = clientY;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Petal color schemes (Royal Indian Wedding palette)
    const petalPalettes = [
      // Royal Crimson Velvet
      {
        start: 'rgba(168, 32, 42, 0.92)',
        end: 'rgba(92, 16, 22, 0.96)',
        vein: 'rgba(247, 219, 148, 0.45)',
      },
      // Deep Wine / Maroon Rose
      {
        start: 'rgba(138, 24, 32, 0.9)',
        end: 'rgba(62, 10, 15, 0.95)',
        vein: 'rgba(212, 175, 80, 0.35)',
      },
      // Soft Blush Peony
      {
        start: 'rgba(235, 160, 172, 0.88)',
        end: 'rgba(182, 92, 108, 0.92)',
        vein: 'rgba(255, 245, 248, 0.5)',
      },
      // Shimmering 24K Gold Foil Leaf
      {
        start: 'rgba(255, 228, 148, 0.92)',
        end: 'rgba(206, 160, 60, 0.94)',
        vein: 'rgba(255, 255, 255, 0.65)',
      },
    ];

    // Flower palettes (Jasmine & Gold Blossoms)
    const flowerPalettes = [
      {
        inner: 'rgba(255, 250, 240, 0.92)',
        outer: 'rgba(245, 225, 205, 0.88)',
        center: '#D4AF37',
      },
      {
        inner: 'rgba(255, 235, 240, 0.9)',
        outer: 'rgba(230, 165, 180, 0.85)',
        center: '#F7DB94',
      },
      {
        inner: 'rgba(255, 238, 175, 0.95)',
        outer: 'rgba(218, 165, 32, 0.9)',
        center: '#8A1820',
      },
    ];

    const isMobile = width < 768;
    const isSmallMobile = width < 480;

    // Scale count dynamically so mobile screens feel airy, elegant, and uncluttered
    const mobileScale = isSmallMobile ? 0.42 : isMobile ? 0.58 : 1;
    const effectivePetalCount = Math.max(4, Math.round(count * mobileScale));
    const effectiveFlowerCount = Math.max(1, Math.round(flowerCount * mobileScale));
    const effectiveDustCount = Math.max(12, Math.round(dustCount * mobileScale));
    const effectiveBokehCount = isMobile ? 4 : 8;

    // 1. Initialize Petals
    const petals = Array.from({ length: effectivePetalCount }, () => {
      const palette = petalPalettes[Math.floor(Math.random() * petalPalettes.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: (isMobile ? 7 : 9) + Math.random() * (isMobile ? 9 : 15),
        vy: 0.55 + Math.random() * 1.1,
        vx: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: 0.012 + Math.random() * 0.03,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.012 + Math.random() * 0.018,
        swayAmp: 1.2 + Math.random() * 2.0,
        opacity: (isMobile ? 0.65 : 0.72) + Math.random() * 0.25,
        ...palette,
      };
    });

    // 2. Initialize 5-Petal Blossoms (Mogra / Jasmine / Cherry Blossoms)
    const blossoms = Array.from({ length: effectiveFlowerCount }, () => {
      const pal = flowerPalettes[Math.floor(Math.random() * flowerPalettes.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: (isMobile ? 6 : 8) + Math.random() * (isMobile ? 6 : 9),
        vy: 0.4 + Math.random() * 0.75,
        vx: (Math.random() - 0.5) * 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: 0.008 + Math.random() * 0.02,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.01 + Math.random() * 0.015,
        opacity: (isMobile ? 0.7 : 0.78) + Math.random() * 0.22,
        ...pal,
      };
    });

    // 3. Initialize Dancing Golden Dust Particles
    const dustParticles = Array.from({ length: effectiveDustCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: (isMobile ? 0.9 : 1.2) + Math.random() * (isMobile ? 1.8 : 2.8),
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(0.25 + Math.random() * 0.6), // slowly floating up & swirling
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.045,
      hue: 38 + Math.random() * 12,
      baseAlpha: (isMobile ? 0.22 : 0.35) + Math.random() * (isMobile ? 0.45 : 0.6),
      sparkle: Math.random() > (isMobile ? 0.75 : 0.65), // fewer high-contrast sparkles on mobile
    }));

    // 4. Initialize Soft Warm Ambient Bokeh Orbs
    const bokehOrbs = Array.from({ length: effectiveBokehCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: (isMobile ? 35 : 50) + Math.random() * (isMobile ? 55 : 90),
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      alpha: (isMobile ? 0.03 : 0.04) + Math.random() * 0.06,
      hue: 36 + Math.random() * 10,
    }));

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const m = mouseRef.current;
      // Decay cursor wind force
      m.vx *= 0.94;
      m.vy *= 0.94;

      // ----------------------------------------------------
      // 1. RENDER WARM AMBIENT BOKEH ORBS
      // ----------------------------------------------------
      bokehOrbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.radius) orb.x = width + orb.radius;
        if (orb.x > width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = height + orb.radius;
        if (orb.y > height + orb.radius) orb.y = -orb.radius;

        const orbGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        orbGrad.addColorStop(0, `hsla(${orb.hue}, 85%, 65%, ${orb.alpha})`);
        orbGrad.addColorStop(0.55, `hsla(${orb.hue}, 80%, 55%, ${orb.alpha * 0.4})`);
        orbGrad.addColorStop(1, `hsla(${orb.hue}, 75%, 45%, 0)`);

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = orbGrad;
        ctx.fill();
      });

      // ----------------------------------------------------
      // 2. RENDER DANCING GOLDEN DUST & STAR SPARKLES
      // ----------------------------------------------------
      dustParticles.forEach((d) => {
        // Wind interaction near pointer
        const dx = d.x - m.x;
        const dy = d.y - m.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 1) {
          const force = (120 - dist) / 120;
          d.x += (dx / dist) * force * 1.5 + m.vx * 0.2;
          d.y += (dy / dist) * force * 1.5 + m.vy * 0.2;
        }

        d.x += d.vx + Math.sin(d.pulse) * 0.35;
        d.y += d.vy;
        d.pulse += d.pulseSpeed;

        if (d.y < -15) {
          d.y = height + 15;
          d.x = Math.random() * width;
        }
        if (d.x < -15) d.x = width + 15;
        if (d.x > width + 15) d.x = -15;

        const pulseWave = Math.sin(d.pulse);
        const currentAlpha = Math.max(0.05, d.baseAlpha * (0.65 + 0.35 * pulseWave));

        // Soft golden glow
        const glowRadius = d.size * 3.2;
        const dustGrad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, glowRadius);
        dustGrad.addColorStop(0, `hsla(${d.hue}, 95%, 85%, ${currentAlpha})`);
        dustGrad.addColorStop(0.4, `hsla(${d.hue}, 90%, 65%, ${currentAlpha * 0.45})`);
        dustGrad.addColorStop(1, `hsla(${d.hue}, 80%, 55%, 0)`);

        ctx.beginPath();
        ctx.arc(d.x, d.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = dustGrad;
        ctx.fill();

        // Bright white-gold core
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${d.hue}, 100%, 96%, ${Math.min(1, currentAlpha * 1.2)})`;
        ctx.fill();

        // 4-point Diamond Star Sparkle for prominent motes
        if (d.sparkle && pulseWave > 0.4) {
          const sparkleLen = d.size * 2.8 * pulseWave;
          ctx.strokeStyle = `hsla(${d.hue}, 100%, 95%, ${currentAlpha * 0.8})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(d.x - sparkleLen, d.y);
          ctx.lineTo(d.x + sparkleLen, d.y);
          ctx.moveTo(d.x, d.y - sparkleLen);
          ctx.lineTo(d.x, d.y + sparkleLen);
          ctx.stroke();
        }
      });

      // ----------------------------------------------------
      // 3. RENDER 5-PETAL JASMINE / BLOSSOM FLOWERS
      // ----------------------------------------------------
      blossoms.forEach((b) => {
        // Cursor breeze push
        const dx = b.x - m.x;
        const dy = b.y - m.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140 && dist > 1) {
          const force = (140 - dist) / 140;
          b.x += (dx / dist) * force * 1.8 + m.vx * 0.35;
          b.y += (dy / dist) * force * 1.8 + m.vy * 0.35;
        }

        b.swayPhase += b.swaySpeed;
        b.x += b.vx + Math.sin(b.swayPhase) * 1.4;
        b.y += b.vy;
        b.rotation += b.rotSpeed;
        b.flipAngle += b.flipSpeed;

        if (b.y > height + 30) {
          b.y = -30;
          b.x = Math.random() * width;
        }
        if (b.x < -30) b.x = width + 30;
        if (b.x > width + 30) b.x = -30;

        const flipScale = Math.cos(b.flipAngle);

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rotation);
        ctx.scale(flipScale, 1);
        ctx.globalAlpha = b.opacity;

        const r = b.radius;
        // Draw 5 petals
        for (let i = 0; i < 5; i++) {
          ctx.save();
          ctx.rotate((i * Math.PI * 2) / 5);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-r * 0.5, -r * 0.5, -r * 0.4, -r, 0, -r * 1.05);
          ctx.bezierCurveTo(r * 0.4, -r, r * 0.5, -r * 0.5, 0, 0);
          ctx.closePath();

          const flowerGrad = ctx.createLinearGradient(0, 0, 0, -r);
          flowerGrad.addColorStop(0, b.inner);
          flowerGrad.addColorStop(1, b.outer);
          ctx.fillStyle = flowerGrad;
          ctx.fill();
          ctx.restore();
        }

        // Blossom Golden Stamen Center
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.26, 0, Math.PI * 2);
        ctx.fillStyle = b.center;
        ctx.fill();

        ctx.restore();
      });

      // ----------------------------------------------------
      // 4. RENDER TUMBLING ROSE & GOLD LEAF PETALS
      // ----------------------------------------------------
      petals.forEach((p) => {
        // Cursor breeze push
        const dx = p.x - m.x;
        const dy = p.y - m.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150 && dist > 1) {
          const force = (150 - dist) / 150;
          p.x += (dx / dist) * force * 2.2 + m.vx * 0.4;
          p.y += (dy / dist) * force * 2.2 + m.vy * 0.4;
        }

        p.swayPhase += p.swaySpeed;
        p.x += p.vx + Math.sin(p.swayPhase) * p.swayAmp;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.flipAngle += p.flipSpeed;

        if (p.y > height + 30) {
          p.y = -30;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;

        const flipScale = Math.cos(p.flipAngle);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(flipScale, 1);
        ctx.globalAlpha = p.opacity;

        // Realistic curved rose petal silhouette
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(
          p.size * 0.85,
          -p.size * 0.6,
          p.size * 0.95,
          p.size * 0.45,
          0,
          p.size
        );
        ctx.bezierCurveTo(
          -p.size * 0.95,
          p.size * 0.45,
          -p.size * 0.85,
          -p.size * 0.6,
          0,
          -p.size
        );
        ctx.closePath();

        // Shading
        const petalGrad = ctx.createLinearGradient(0, -p.size, 0, p.size);
        petalGrad.addColorStop(0, p.start);
        petalGrad.addColorStop(1, p.end);
        ctx.fillStyle = petalGrad;
        ctx.fill();

        // Delicate central vein
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.75);
        ctx.lineTo(0, p.size * 0.7);
        ctx.strokeStyle = p.vein;
        ctx.lineWidth = 0.9;
        ctx.globalAlpha = p.opacity * 0.55;
        ctx.stroke();

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [count, dustCount, flowerCount]);

  return (
    <div className={`dynamic-petals-dust-container ${className}`} aria-hidden="true">
      {/* Warm royal ambient glow backdrop replacing pitch black */}
      {includeBacklight && <div className="dynamic-ambient-backlight" />}
      {/* Canvas rendering tumbling petals, blossom flowers, and dancing golden dust */}
      <canvas ref={canvasRef} className="dynamic-petals-canvas" />
    </div>
  );
}
