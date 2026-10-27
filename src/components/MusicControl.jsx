import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/soundEffects';
import './MusicControl.css';

/**
 * MusicControl - Floating play/pause button for background music
 * Integrates with soundManager for romantic ambient melodies
 */
export default function MusicControl() {
  const [isPlaying, setIsPlaying] = useState(soundManager.isMusicActive());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the button after envelope opening
    const timer = setTimeout(() => setIsVisible(true), 1500);
    const interval = setInterval(() => {
      setIsPlaying(soundManager.isMusicActive());
    }, 500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const toggleMusic = useCallback(() => {
    const active = soundManager.toggleMusic();
    setIsPlaying(active);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className={`music-control ${isPlaying ? 'playing' : ''}`}
          onClick={toggleMusic}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-label={isPlaying ? 'Pause background music' : 'Play romantic music'}
          title={isPlaying ? 'Pause Music' : 'Play Romantic Music'}
        >
          <div className="music-icon-wrapper">
            {isPlaying ? (
              <div className="music-bars" aria-hidden="true">
                <span className="bar bar-1" />
                <span className="bar bar-2" />
                <span className="bar bar-3" />
                <span className="bar bar-4" />
              </div>
            ) : (
              <svg
                className="play-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            )}
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
