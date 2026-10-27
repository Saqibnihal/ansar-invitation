import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import GoldenParticles from './GoldenParticles';
import { soundManager } from '../utils/soundEffects';
import './Envelope.css';

/**
 * Envelope - The cinematic opening experience
 * Features: 3D envelope, wax seal, seal-breaking animation, card reveal
 */
export default function Envelope({ onOpen }) {
  const [phase, setPhase] = useState('sealed'); // sealed | breaking | opening | revealing | done
  const envelopeRef = useRef(null);
  const flapRef = useRef(null);
  const cardRef = useRef(null);
  const sealRef = useRef(null);
  const glowRef = useRef(null);

  const handleSealClick = useCallback(() => {
    if (phase !== 'sealed') return;
    soundManager.playSealBreakSound();
    setPhase('breaking');
  }, [phase]);

  // Seal breaking -> envelope opening -> card reveal sequence
  useEffect(() => {
    if (phase !== 'breaking') return;

    const tl = gsap.timeline({
      onComplete: () => setPhase('opening'),
    });

    // Seal glow intensifies
    if (glowRef.current) {
      tl.to(glowRef.current, {
        opacity: 1,
        scale: 2.5,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    // Seal shakes and breaks
    if (sealRef.current) {
      tl.to(
        sealRef.current,
        {
          keyframes: [
            { rotation: -3, duration: 0.05 },
            { rotation: 3, duration: 0.05 },
            { rotation: -5, duration: 0.05 },
            { rotation: 5, duration: 0.05 },
            { rotation: -2, duration: 0.05 },
            { rotation: 0, duration: 0.05 },
          ],
          ease: 'none',
        },
        0
      );

      tl.to(sealRef.current, {
        scale: 1.3,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [phase]);

  // Envelope opening animation
  useEffect(() => {
    if (phase !== 'opening') return;

    const tl = gsap.timeline({
      onComplete: () => setPhase('revealing'),
    });

    // Envelope flap opens (3D rotation)
    if (flapRef.current) {
      tl.to(flapRef.current, {
        rotateX: -180,
        duration: 1.2,
        ease: 'power3.inOut',
      });
    }

    // Small delay then card rises
    tl.to({}, { duration: 0.3 });
  }, [phase]);

  // Card reveal animation
  useEffect(() => {
    if (phase !== 'revealing') return;

    soundManager.playCardRiseSound();
    soundManager.startBackgroundMusic();

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase('done');
        setTimeout(() => onOpen?.(), 800);
      },
    });

    // Card rises from envelope
    if (cardRef.current) {
      tl.to(cardRef.current, {
        y: '-120%',
        duration: 1.4,
        ease: 'power2.out',
      });

      // Card scales up and centers
      tl.to(cardRef.current, {
        scale: 1.05,
        duration: 0.6,
        ease: 'power2.inOut',
      });
    }

    // Envelope fades down
    if (envelopeRef.current) {
      tl.to(
        envelopeRef.current,
        {
          y: 100,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.in',
        },
        '-=0.6'
      );
    }
  }, [phase, onOpen]);

  return (
    <div className="envelope-scene">
      {/* Ambient floating particles in background */}
      <div className="ambient-particles" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="ambient-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      {/* Cinematic vignette overlay */}
      <div className="vignette" aria-hidden="true" />

      {/* Particle burst on seal break */}
      <GoldenParticles active={phase === 'breaking' || phase === 'opening'} />

      <motion.div
        className="envelope-container"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Prompt text */}
        <AnimatePresence>
          {phase === 'sealed' && (
            <motion.p
              className="envelope-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              Tap the seal to open your invitation
            </motion.p>
          )}
        </AnimatePresence>

        {/* 3D Envelope */}
        <div className="envelope-3d-wrapper" ref={envelopeRef}>
          <div className="envelope">
            {/* Envelope back */}
            <div className="envelope-back">
              <div className="envelope-liner" />
            </div>

            {/* Envelope flap (opens with 3D rotation) */}
            <div className="envelope-flap" ref={flapRef}>
              <div className="envelope-flap-front" />
              <div className="envelope-flap-back" />
            </div>

            {/* Card inside envelope */}
            <div className="envelope-card" ref={cardRef}>
              <div className="card-preview">
                <div className="card-ornament top-ornament">❦</div>
                <p className="card-preview-text">You are invited</p>
                <div className="card-preview-names">A & N</div>
                <div className="card-preview-date">January 3, 2027</div>
                <div className="card-ornament bottom-ornament">❦</div>
              </div>
            </div>

            {/* Envelope front */}
            <div className="envelope-front">
              {/* Gold border detailing */}
              <div className="envelope-gold-border" />

              {/* Decorative corner flourishes */}
              <div className="corner-flourish top-left">✦</div>
              <div className="corner-flourish top-right">✦</div>
              <div className="corner-flourish bottom-left">✦</div>
              <div className="corner-flourish bottom-right">✦</div>

              {/* Wax Seal */}
              <button
                className="wax-seal-button"
                ref={sealRef}
                onClick={handleSealClick}
                aria-label="Open wedding invitation"
                disabled={phase !== 'sealed'}
              >
                {/* Glow effect behind seal */}
                <div className="seal-glow" ref={glowRef} />

                {/* Seal image */}
                <div className="seal-image-wrapper">
                  <img
                    src="/images/wax-seal.jpg"
                    alt="Golden wax seal"
                    className="seal-image"
                    draggable="false"
                  />
                </div>

                {/* Pulse ring animation */}
                {phase === 'sealed' && (
                  <>
                    <div className="seal-pulse-ring ring-1" />
                    <div className="seal-pulse-ring ring-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
