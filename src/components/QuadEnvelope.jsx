import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import GoldenParticles from './GoldenParticles';
import { soundManager } from '../utils/soundEffects';
import { weddingData } from '../data/weddingData';
import DynamicPetalsDust from './DynamicPetalsDust';
import './QuadEnvelope.css';

const { couple, date } = weddingData;

/**
 * QuadEnvelope - Realistic 3D Quad Envelope Opening & Cinematic Light Reveal
 *
 * Sequence:
 * 1. Screen displays full quad envelope with the golden wax seal ("A & N") at center.
 * 2. On touch/click:
 *    - Wax seal cracks with audio & golden spark burst.
 *    - Paper crease tension releases: bottom, left, and right flaps ease slightly.
 *    - The top flap lifts smoothly and folds back 180° along the top crease in authentic 3D perspective.
 *    - Dynamic cast shadow diffuses and sweeps away.
 *    - Inner lining paper (royal damask & "A & N" motif) turns into view.
 * 3. As the flap clears 80°:
 *    - Radiant golden sunlight and volumetric optical bloom pour out from the opened envelope.
 *    - The inner wedding invitation card gently rises forward displaying the couple's names.
 *    - Optical bokeh motes drift up through the beam.
 *    - Celestial golden chime chord swells.
 * 4. Envelope dissolves into the warm light, revealing the landing page.
 */
export default function QuadEnvelope({ onOpen }) {
  // phase: 'sealed' | 'opening' | 'light' | 'dissolving' | 'done'
  const [phase, setPhase] = useState('sealed');

  const topFlapRef = useRef(null);
  const flapShadowRef = useRef(null);
  const flapShineRef = useRef(null);
  const leftFlapRef = useRef(null);
  const rightFlapRef = useRef(null);
  const bottomFlapRef = useRef(null);
  const sealAnchorRef = useRef(null);
  const sealMedallionRef = useRef(null);
  const innerCardRef = useRef(null);
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

  // Main touch interaction: Realistic 3D Paper Flap Unfolding
  const handleTouchOpen = useCallback(() => {
    if (phase !== 'sealed') return;
    setPhase('opening');

    // 1. Play wax snap & particle chime sound
    soundManager.playSealBreakSound();

    const tl = gsap.timeline();

    // STEP 1: Seal unlatches & pops slightly forward (0.0s - 0.22s)
    if (sealMedallionRef.current) {
      tl.to(
        sealMedallionRef.current,
        {
          scale: 1.12,
          z: 22,
          duration: 0.22,
          ease: 'power2.out',
        },
        0
      );
    }

    // Flap tip lifts slightly off surface as seal breaks
    if (topFlapRef.current) {
      tl.to(
        topFlapRef.current,
        {
          rotateX: 8,
          duration: 0.22,
          ease: 'power2.out',
        },
        0
      );
    }

    // STEP 2: Crease tension release on the 3 stationary flaps (0.2s - 0.8s)
    if (leftFlapRef.current) {
      tl.to(
        leftFlapRef.current,
        {
          rotateY: -7,
          duration: 0.7,
          ease: 'power2.out',
        },
        0.2
      );
    }
    if (rightFlapRef.current) {
      tl.to(
        rightFlapRef.current,
        {
          rotateY: 7,
          duration: 0.7,
          ease: 'power2.out',
        },
        0.2
      );
    }
    if (bottomFlapRef.current) {
      tl.to(
        bottomFlapRef.current,
        {
          rotateX: 4,
          duration: 0.7,
          ease: 'power2.out',
        },
        0.2
      );
    }

    // STEP 3: Top Flap folds back 180° along the top crease in 3D (0.2s - 1.45s)
    if (topFlapRef.current) {
      tl.to(
        topFlapRef.current,
        {
          rotateX: 176,
          duration: 1.25,
          ease: 'power2.inOut',
        },
        0.2
      );
    }

    // Specular lighting sweeps across the paper face as it tilts
    if (flapShineRef.current) {
      tl.to(
        flapShineRef.current,
        {
          x: '100%',
          opacity: 0.85,
          duration: 0.65,
          ease: 'power1.inOut',
        },
        0.25
      );
      tl.to(
        flapShineRef.current,
        {
          opacity: 0,
          duration: 0.35,
        },
        0.8
      );
    }

    // Dynamic contact shadow under top flap expands, blurs, and dissipates
    if (flapShadowRef.current) {
      tl.to(
        flapShadowRef.current,
        {
          y: 45,
          scaleX: 1.05,
          opacity: 0,
          filter: 'blur(35px)',
          duration: 0.65,
          ease: 'power2.in',
        },
        0.2
      );
    }

    // STEP 4: Golden light break & Card Elevation (0.7s - 1.6s)
    // Flap has cleared ~80 degrees; radiant golden light pours forth!
    tl.add(() => {
      setPhase('light');
      soundManager.playCelestialLightSound();
      soundManager.playCardRiseSound();
    }, 0.7);

    // Inner card elevates from pocket to meet the light
    if (innerCardRef.current) {
      tl.to(
        innerCardRef.current,
        {
          y: -38,
          z: 32,
          scale: 1.04,
          duration: 0.95,
          ease: 'power2.out',
        },
        0.7
      );
    }

    // Volumetric optical light spill through the opened archway
    if (lightSpillRef.current) {
      tl.to(
        lightSpillRef.current,
        {
          opacity: 1,
          scaleY: 1.55,
          scaleX: 1.3,
          duration: 0.85,
          ease: 'power2.out',
        },
        0.7
      );
    }

    // STEP 5: Warm golden bloom & music swell (1.4s - 2.2s)
    if (lightBloomRef.current) {
      tl.to(
        lightBloomRef.current,
        {
          opacity: 1,
          duration: 1.15,
          ease: 'power2.inOut',
        },
        1.35
      );
    }

    // STEP 6: Envelope dissolves smoothly into the golden radiance (2.05s)
    tl.add(() => {
      setPhase('dissolving');
      soundManager.startBackgroundMusic();
    }, 2.05);

    if (envelopeWrapRef.current) {
      tl.to(
        envelopeWrapRef.current,
        {
          opacity: 0,
          scale: 1.04,
          duration: 0.85,
          ease: 'power2.inOut',
        },
        2.05
      );
    }

    // STEP 7: Smooth transition to the full landing page
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
      aria-label="Quad wedding invitation envelope. Touch wax seal to open."
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

      {/* Golden particle sparks on seal break */}
      <GoldenParticles active={phase === 'opening' || phase === 'light'} />

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
          <div className="curved-glimpse-card" ref={innerCardRef}>
            <span className="curved-glimpse-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <span className="curved-glimpse-ornament">✦ ❦ ✦</span>
            <p className="curved-glimpse-subtitle">Wedding Invitation</p>
            <h2 className="curved-glimpse-names">
              {couple.groom.firstName} & {couple.bride.firstName}
            </h2>
            <p className="curved-glimpse-date">{date.display}</p>
            <p className="curved-glimpse-venue">Eruvadi, Tamil Nadu</p>
          </div>
        </div>

        {/* FLAP 3: BOTTOM FLAP */}
        <div className="curved-flap flap-bottom" ref={bottomFlapRef} aria-hidden="true">
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
              <linearGradient id="curvedPaperGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7E1F22" />
                <stop offset="45%" stopColor="#5C1618" />
                <stop offset="100%" stopColor="#3F0E10" />
              </linearGradient>
              <linearGradient id="innerLinerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2A090B" />
                <stop offset="50%" stopColor="#461113" />
                <stop offset="100%" stopColor="#5E1719" />
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

        {/* FLAP 4: LEFT FLAP */}
        <div className="curved-flap flap-left" ref={leftFlapRef} aria-hidden="true">
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

        {/* FLAP 2: RIGHT FLAP */}
        <div className="curved-flap flap-right" ref={rightFlapRef} aria-hidden="true">
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

        {/* DYNAMIC SHADOW UNDER TOP FLAP */}
        <div className="flap-dynamic-shadow" ref={flapShadowRef} aria-hidden="true" />

        {/* TOP FLAP (REALISTIC 3D CARDSTOCK FOLD) */}
        <div className="curved-flap flap-top-3d" ref={topFlapRef}>
          {/* FRONT FACE OF TOP FLAP */}
          <div className="flap-face-front">
            <div className="flap-paper-body">
              <div className="curved-paper-texture" />
              <svg className="curved-flap-svg" viewBox="0 0 1000 500" preserveAspectRatio="none">
                <polygon points="0,0 1000,0 500,502" fill="url(#curvedPaperGrad)" />
                <polygon
                  points="20,10 980,10 500,480"
                  fill="none"
                  stroke="url(#foilGrad)"
                  strokeWidth="2"
                  opacity="0.85"
                />
                <polygon
                  points="40,22 960,22 500,455"
                  fill="none"
                  stroke="url(#foilGrad)"
                  strokeWidth="1.2"
                  strokeDasharray="6,4"
                  opacity="0.6"
                />
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
                <text x="500" y="190" textAnchor="middle" fill="url(#foilGrad)" fontSize="24" opacity="0.7">
                  ❦
                </text>
              </svg>
              {/* Specular lighting sheen across the paper */}
              <div className="flap-shine-overlay" ref={flapShineRef} />
            </div>

            {/* WAX SEAL WITH "A & N" AT THE FLAP TIP */}
            <div className="curved-seal-anchor" ref={sealAnchorRef}>
              <div className="curved-seal-medallion" ref={sealMedallionRef}>
                <img
                  src="/images/wax-seal.jpg"
                  alt="Royal Wax Seal A & N"
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

          {/* BACK FACE OF TOP FLAP (Revealed when folded back in 3D!) */}
          <div className="flap-face-back" aria-hidden="true">
            <div className="flap-paper-body">
              <div className="curved-paper-texture" />
              <svg className="curved-flap-svg" viewBox="0 0 1000 500" preserveAspectRatio="none">
                <polygon points="0,0 1000,0 500,502" fill="url(#innerLinerGrad)" />
                <polygon
                  points="20,10 980,10 500,480"
                  fill="none"
                  stroke="url(#foilGrad)"
                  strokeWidth="1.8"
                  opacity="0.75"
                />
                <polygon
                  points="40,22 960,22 500,455"
                  fill="none"
                  stroke="url(#foilGrad)"
                  strokeWidth="1"
                  strokeDasharray="6,4"
                  opacity="0.45"
                />
                <text x="500" y="150" textAnchor="middle" fill="url(#foilGrad)" fontSize="28" opacity="0.8">
                  ❦ ✦ ❦
                </text>
                <text
                  x="500"
                  y="210"
                  textAnchor="middle"
                  fill="url(#foilGrad)"
                  fontSize="24"
                  fontFamily="Georgia, serif"
                  opacity="0.85"
                  letterSpacing="6"
                >
                  A & N
                </text>
                <text
                  x="500"
                  y="250"
                  textAnchor="middle"
                  fill="url(#foilGrad)"
                  fontSize="13"
                  fontFamily="Georgia, serif"
                  opacity="0.65"
                  letterSpacing="4"
                >
                  TOGETHER IN LOVE
                </text>
                {/* Gold wax seal backing disc impression */}
                <circle
                  cx="500"
                  cy="500"
                  r="62"
                  fill="url(#foilGrad)"
                  opacity="0.22"
                  stroke="url(#foilGrad)"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* REALISTIC OPTICAL LIGHTING EMITTING FROM UNDER THE OPEN FLAP */}
      <div
        className={`curved-light-container ${phase === 'light' || phase === 'dissolving' ? 'is-active' : ''}`}
        aria-hidden="true"
      >
        {/* Volumetric light spill pouring out through the opened archway */}
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
