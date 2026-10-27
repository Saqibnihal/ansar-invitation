import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { soundManager } from '../utils/soundEffects';
import { weddingData } from '../data/weddingData';
import DynamicPetalsDust from './DynamicPetalsDust';
import './QuadEnvelope.css';

const { date } = weddingData;

/**
 * QuadEnvelope - Curved Paper Bend & Cinematic Light Unfolding
 *
 * Sequence:
 * 1. Screen is covered by the 4-flap quad envelope with the golden wax seal at the center.
 * 2. On touch/click:
 *    - The top flap and seal bend with a natural, realistic paper curve (curving upward like heavy cotton paper).
 *    - The seal tracks the curved tip and stays a 100% true circle (no oval squashing!).
 *    - It halts smoothly at the halfway curved position.
 * 3. The bright light emerges:
 *    - Radiant golden sunlight and volumetric optical bloom pour out from under the curved archway.
 *    - Soft golden bokeh motes drift up through the beam.
 *    - Celestial golden chime chord swells.
 * 4. The envelope fades away into the warm light, revealing the landing page.
 */
export default function QuadEnvelope({ onOpen }) {
  // phase: 'sealed' | 'bending' | 'light' | 'dissolving' | 'done'
  const [phase, setPhase] = useState('sealed');

  const flapPathRef = useRef(null);
  const flapBorderRef = useRef(null);
  const flapDashedBorderRef = useRef(null);
  const sealAnchorRef = useRef(null);
  const sealMedallionRef = useRef(null);
  const curvedShadowRef = useRef(null);
  const curvedUnderlinerRef = useRef(null);
  const lightSpillRef = useRef(null);
  const lightBloomRef = useRef(null);
  const canvasRef = useRef(null);
  const envelopeWrapRef = useRef(null);
  const animFrameRef = useRef(null);

  // Optical bokeh motes floating in light beam
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const isMobile = window.innerWidth < 768;
    const motesCount = isMobile ? 18 : 36;

    const motes = Array.from({ length: motesCount }, () => ({
      x: width * 0.5 + (Math.random() - 0.5) * width * 0.55,
      y: height * 0.5 + Math.random() * height * 0.35,
      radius: (isMobile ? 2 : 3) + Math.random() * (isMobile ? 8 : 14),
      vy: -(0.5 + Math.random() * 1.3),
      vx: (Math.random() - 0.5) * 0.4,
      alpha: 0,
      targetAlpha: (isMobile ? 0.12 : 0.18) + Math.random() * (isMobile ? 0.35 : 0.55),
      hue: 40 + Math.random() * 12,
      pulse: Math.random() * Math.PI * 2,
    }));

    let active = false;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (active) {
        motes.forEach((m) => {
          m.y += m.vy;
          m.x += m.vx + Math.sin(m.pulse) * 0.25;
          m.pulse += 0.035;

          if (m.alpha < m.targetAlpha) {
            m.alpha += 0.025;
          }

          if (m.y < height * 0.12) {
            m.y = height * 0.62 + Math.random() * 80;
            m.x = width * 0.5 + (Math.random() - 0.5) * width * 0.5;
          }

          const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius);
          grad.addColorStop(0, `hsla(${m.hue}, 95%, 85%, ${m.alpha})`);
          grad.addColorStop(0.5, `hsla(${m.hue}, 85%, 65%, ${m.alpha * 0.5})`);
          grad.addColorStop(1, `hsla(${m.hue}, 80%, 55%, 0)`);

          ctx.beginPath();
          ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        });
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    if (phase === 'light' || phase === 'dissolving') {
      active = true;
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [phase]);

  // Main touch interaction: realistic paper curve bend
  const handleTouchOpen = useCallback(() => {
    if (phase !== 'sealed') return;
    setPhase('bending');

    // 1. Play wax snap & realistic paper bend sound
    soundManager.playPeelHalfSound();

    const tl = gsap.timeline();

    // 2. Animate paper curl upside down to half (50% mark)
    const bendProgress = { value: 0 };

    tl.to(
      bendProgress,
      {
        value: 1,
        duration: 1.1,
        ease: 'power2.out',
        onUpdate: () => {
          const p = bendProgress.value;

          // Tip curls upward from 502 to 250 (exact halfway mark of top flap)
          const tipY = 502 - p * 252;

          // Quadratic Bezier curves bowing outward as the paper rolls up
          const cpX1 = 750 + p * 85;
          const cpY1 = 250 - p * 85;
          const cpX2 = 250 - p * 85;
          const cpY2 = 250 - p * 85;

          // Update main paper flap path
          if (flapPathRef.current) {
            flapPathRef.current.setAttribute(
              'd',
              `M 0,0 L 1000,0 Q ${cpX1.toFixed(1)},${cpY1.toFixed(1)} 500,${tipY.toFixed(1)} Q ${cpX2.toFixed(1)},${cpY2.toFixed(1)} 0,0 Z`
            );
          }

          // Update gold foil outer border
          if (flapBorderRef.current) {
            const bTipY = 480 - p * 242;
            const bCpX1 = 735 + p * 80;
            const bCpY1 = 240 - p * 80;
            const bCpX2 = 265 - p * 80;
            const bCpY2 = 240 - p * 80;
            flapBorderRef.current.setAttribute(
              'd',
              `M 20,10 L 980,10 Q ${bCpX1.toFixed(1)},${bCpY1.toFixed(1)} 500,${bTipY.toFixed(1)} Q ${bCpX2.toFixed(1)},${bCpY2.toFixed(1)} 20,10 Z`
            );
          }

          // Update gold foil dashed border
          if (flapDashedBorderRef.current) {
            const dTipY = 455 - p * 230;
            const dCpX1 = 720 + p * 75;
            const dCpY1 = 230 - p * 75;
            const dCpX2 = 280 - p * 75;
            const dCpY2 = 230 - p * 75;
            flapDashedBorderRef.current.setAttribute(
              'd',
              `M 40,22 L 960,22 Q ${dCpX1.toFixed(1)},${dCpY1.toFixed(1)} 500,${dTipY.toFixed(1)} Q ${dCpX2.toFixed(1)},${dCpY2.toFixed(1)} 40,22 Z`
            );
          }

          // Curled-back paper roll (showing inside lining paper rolled upside-down)
          if (curvedUnderlinerRef.current) {
            const rollApexY = tipY - p * 80;
            const rollInnerY = tipY - p * 30;
            const rollLeftX = 500 - p * 230;
            const rollRightX = 500 + p * 230;
            curvedUnderlinerRef.current.setAttribute(
              'd',
              `M ${rollLeftX.toFixed(1)},${tipY.toFixed(1)} Q 500,${rollApexY.toFixed(1)} ${rollRightX.toFixed(1)},${tipY.toFixed(1)} Q 500,${rollInnerY.toFixed(1)} ${rollLeftX.toFixed(1)},${tipY.toFixed(1)} Z`
            );
            curvedUnderlinerRef.current.style.opacity = `${p * 0.98}`;
          }

          // Cast shadow under the curl roll
          if (curvedShadowRef.current) {
            const sBottomY = tipY + 65 * p;
            const sLeftX = 500 - p * 270;
            const sRightX = 500 + p * 270;
            curvedShadowRef.current.setAttribute(
              'd',
              `M ${sLeftX.toFixed(1)},${tipY.toFixed(1)} Q 500,${sBottomY.toFixed(1)} ${sRightX.toFixed(1)},${tipY.toFixed(1)} Q 500,${(tipY + 12).toFixed(1)} ${sLeftX.toFixed(1)},${tipY.toFixed(1)} Z`
            );
            curvedShadowRef.current.style.opacity = `${p * 0.85}`;
          }

          // Wax seal travels upward to exact halfway mark (100% -> 50%)
          if (sealAnchorRef.current) {
            const sealPct = 100 - p * 50;
            sealAnchorRef.current.style.top = `${sealPct}%`;
          }

          // Wax seal curls upside down: rotates from 0deg to 180deg!
          // Locks 1:1 circular aspect ratio at every frame!
          if (sealMedallionRef.current) {
            sealMedallionRef.current.style.transform = `rotate(${p * 180}deg) scale(${1 + p * 0.06})`;
          }
        },
      },
      0
    );

    // 3. Right when paper finishes bending to its halfway curve: trigger the bright light!
    tl.add(() => {
      setPhase('light');
      soundManager.playCelestialLightSound();
    }, 1.05);

    // Volumetric optical light spill through the curved archway
    if (lightSpillRef.current) {
      tl.to(
        lightSpillRef.current,
        {
          opacity: 1,
          scaleY: 1.6,
          scaleX: 1.3,
          duration: 0.85,
          ease: 'power2.out',
        },
        1.05
      );
    }

    // Warm golden film exposure bloom
    if (lightBloomRef.current) {
      tl.to(
        lightBloomRef.current,
        {
          opacity: 1,
          duration: 1.15,
          ease: 'power2.inOut',
        },
        1.2
      );
    }

    // 4. Envelope smoothly dissolves into the warm light
    tl.add(() => {
      setPhase('dissolving');
      soundManager.startBackgroundMusic();
    }, 2.05);

    if (envelopeWrapRef.current) {
      tl.to(
        envelopeWrapRef.current,
        {
          opacity: 0,
          scale: 1.03,
          duration: 0.85,
          ease: 'power2.inOut',
        },
        2.05
      );
    }

    // 5. Complete transition to landing page
    tl.add(() => {
      setPhase('done');
      onOpen?.();
    }, 2.75);
  }, [phase, onOpen]);

  return (
    <div
      className="curved-quad-envelope-viewport"
      onClick={handleTouchOpen}
      onTouchStart={handleTouchOpen}
      role="button"
      tabIndex={0}
      aria-label="Quad wedding invitation envelope. Touch to bend top flap with a curve and reveal invitation."
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleTouchOpen();
        }
      }}
    >
      {/* Dynamic flowing flowers, petals & golden dust background */}
      <DynamicPetalsDust
        count={16}
        dustCount={36}
        flowerCount={4}
        className="curved-envelope-backdrop"
      />

      {/* Cinematic vignette */}
      <div className="curved-vignette" aria-hidden="true" />

      {/* Optical bokeh dust canvas */}
      <canvas ref={canvasRef} className="curved-bokeh-canvas" aria-hidden="true" />

      {/* Delicate floating petals and golden dust in front of the envelope */}
      <DynamicPetalsDust
        count={5}
        dustCount={14}
        flowerCount={2}
        includeBacklight={false}
        className="curved-envelope-foreground-particles"
      />

      {/* THE 3D ENVELOPE ASSEMBLY */}
      <div className="curved-envelope-scene" ref={envelopeWrapRef}>
        {/* Underneath Card Interior Glimpse */}
        <div className="curved-interior-glimpse" aria-hidden="true">
          <div className="curved-glimpse-card">
            <span className="curved-glimpse-ornament">✦ ✦ ✦</span>
            <p className="curved-glimpse-title">Wedding Invitation</p>
            <p className="curved-glimpse-date">{date.display}</p>
          </div>
        </div>

        {/* FLAP 3: BOTTOM FLAP (stationary) */}
        <div className="curved-flap flap-bottom" aria-hidden="true">
          <div className="curved-paper-texture" />
          <svg className="curved-flap-svg" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <defs>
              <linearGradient id="foilGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFF2D1" />
                <stop offset="35%" stopColor="#E8C87A" />
                <stop offset="70%" stopColor="#C9A84C" />
                <stop offset="100%" stopColor="#8C6E2E" />
              </linearGradient>
              <linearGradient id="burgundyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6E1B1D" />
                <stop offset="50%" stopColor="#541516" />
                <stop offset="100%" stopColor="#3C0E0F" />
              </linearGradient>
            </defs>
            <polygon points="0,500 1000,500 500,-2" fill="url(#burgundyGrad)" />
            <polygon
              points="20,490 980,490 500,20"
              fill="none"
              stroke="url(#foilGrad)"
              strokeWidth="2"
              opacity="0.8"
            />
            <polygon
              points="40,478 960,478 500,45"
              fill="none"
              stroke="url(#foilGrad)"
              strokeWidth="1.2"
              strokeDasharray="6,4"
              opacity="0.55"
            />
            <text
              x="500"
              y="380"
              textAnchor="middle"
              fill="url(#foilGrad)"
              fontSize="22"
              fontFamily="Georgia, serif"
              opacity="0.8"
              letterSpacing="5"
            >
              ✦ JANUARY 3, 2027 • ERUVADI ✦
            </text>
          </svg>
        </div>

        {/* FLAP 4: LEFT FLAP (stationary) */}
        <div className="curved-flap flap-left" aria-hidden="true">
          <div className="curved-paper-texture" />
          <svg className="curved-flap-svg" viewBox="0 0 500 1000" preserveAspectRatio="none">
            <polygon points="0,0 0,1000 502,500" fill="url(#burgundyGrad)" />
            <polygon
              points="10,20 10,980 480,500"
              fill="none"
              stroke="url(#foilGrad)"
              strokeWidth="2"
              opacity="0.8"
            />
            <polygon
              points="22,40 22,960 455,500"
              fill="none"
              stroke="url(#foilGrad)"
              strokeWidth="1.2"
              strokeDasharray="6,4"
              opacity="0.55"
            />
            <text x="70" y="500" textAnchor="middle" fill="url(#foilGrad)" fontSize="28" opacity="0.7">
              ❦
            </text>
          </svg>
        </div>

        {/* FLAP 2: RIGHT FLAP (stationary) */}
        <div className="curved-flap flap-right" aria-hidden="true">
          <div className="curved-paper-texture" />
          <svg className="curved-flap-svg" viewBox="0 0 500 1000" preserveAspectRatio="none">
            <polygon points="500,0 500,1000 -2,500" fill="url(#burgundyGrad)" />
            <polygon
              points="490,20 490,980 20,500"
              fill="none"
              stroke="url(#foilGrad)"
              strokeWidth="2"
              opacity="0.8"
            />
            <polygon
              points="478,40 478,960 45,500"
              fill="none"
              stroke="url(#foilGrad)"
              strokeWidth="1.2"
              strokeDasharray="6,4"
              opacity="0.55"
            />
            <text x="430" y="500" textAnchor="middle" fill="url(#foilGrad)" fontSize="28" opacity="0.7">
              ❧
            </text>
          </svg>
        </div>

        {/* TOP FLAP ASSEMBLY (Bends with a realistic paper curve!) */}
        <div className="curved-flap flap-top-curved">
          {/* Dynamic SVG with Bezier curving edges */}
          <svg className="curved-flap-svg" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <defs>
              <linearGradient id="curvedPaperGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7E1F22" />
                <stop offset="45%" stopColor="#5C1618" />
                <stop offset="100%" stopColor="#3F0E10" />
              </linearGradient>
              <linearGradient id="undersideLinerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FAF1DF" />
                <stop offset="100%" stopColor="#D9B76A" />
              </linearGradient>
              <filter id="curvedBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="10" />
              </filter>
            </defs>

            {/* Dynamic cast shadow underneath the curved arch */}
            <path
              ref={curvedShadowRef}
              d="M 260,500 Q 500,500 740,500 Q 500,500 260,500 Z"
              fill="rgba(0,0,0,0.85)"
              filter="url(#curvedBlur)"
              style={{ opacity: 0 }}
            />

            {/* Main bending paper flap */}
            <path
              ref={flapPathRef}
              d="M 0,0 L 1000,0 Q 750,250 500,502 Q 250,250 0,0 Z"
              fill="url(#curvedPaperGrad)"
            />

            {/* Outer gold foil border (bends along curve) */}
            <path
              ref={flapBorderRef}
              d="M 20,10 L 980,10 Q 735,240 500,480 Q 265,240 20,10 Z"
              fill="none"
              stroke="url(#foilGrad)"
              strokeWidth="2"
              opacity="0.85"
            />

            {/* Dashed gold foil border (bends along curve) */}
            <path
              ref={flapDashedBorderRef}
              d="M 40,22 L 960,22 Q 720,230 500,455 Q 280,230 40,22 Z"
              fill="none"
              stroke="url(#foilGrad)"
              strokeWidth="1.2"
              strokeDasharray="6,4"
              opacity="0.6"
            />

            {/* Underside gold-cream liner revealed under the curved tip */}
            <path
              ref={curvedUnderlinerRef}
              d="M 320,500 Q 500,500 680,500 Q 500,500 320,500 Z"
              fill="url(#undersideLinerGrad)"
              stroke="url(#foilGrad)"
              strokeWidth="1.5"
              style={{ opacity: 0 }}
            />

            {/* Typography on the top flap */}
            <text
              x="500"
              y="140"
              textAnchor="middle"
              fill="url(#foilGrad)"
              fontSize="26"
              fontFamily="Georgia, serif"
              opacity="0.85"
              letterSpacing="7"
            >
              ✦ WEDDING INVITATION ✦
            </text>
            <text
              x="500"
              y="190"
              textAnchor="middle"
              fill="url(#foilGrad)"
              fontSize="24"
              opacity="0.7"
            >
              ❦
            </text>
          </svg>

          {/* WAX SEAL ATTACHED TO THE CURVING TIP (Always 100% Circular!) */}
          <div className="curved-seal-anchor" ref={sealAnchorRef}>
            <div className="curved-seal-medallion" ref={sealMedallionRef}>
              <img
                src="/images/wax-seal.jpg"
                alt="Royal Wax Seal"
                className="curved-medallion-photo"
                draggable="false"
              />
              <div className="curved-seal-highlight" />
              {phase === 'sealed' && (
                <>
                  <div className="curved-seal-aura" />
                  <div className="curved-seal-wave wave-1" />
                  <div className="curved-seal-wave wave-2" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* REALISTIC OPTICAL LIGHTING EMITTING FROM UNDER THE CURVE */}
      <div
        className={`curved-light-container ${phase === 'light' || phase === 'dissolving' ? 'is-active' : ''}`}
        aria-hidden="true"
      >
        {/* Volumetric light spill pouring out through the curved arch */}
        <div className="curved-light-spill" ref={lightSpillRef} />

        {/* Soft core glow */}
        <div className="curved-core-glow" />

        {/* Full-screen warm exposure bloom */}
        <div className="curved-exposure-bloom" ref={lightBloomRef} />
      </div>

      {/* Touch prompt */}
      <AnimatePresence>
        {phase === 'sealed' && (
          <motion.div
            className="curved-touch-prompt"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <span className="prompt-touch-icon">✧</span>
            <p className="prompt-label">Touch to open</p>
            <span className="prompt-touch-icon">✧</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
