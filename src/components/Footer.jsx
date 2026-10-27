import { motion } from 'framer-motion';
import { weddingData } from '../data/weddingData';
import './Footer.css';

const { couple, date } = weddingData;

/**
 * Footer - Elegant closing section with Replay Invitation option
 */
export default function Footer({ onReplayEnvelope }) {
  return (
    <footer className="footer" id="footer" aria-label="Footer">
      <motion.div
        className="footer-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="footer-ornament">❦</div>

        <p className="footer-names">
          {couple.groom.fullName} & {couple.bride.fullName}
        </p>

        <p className="footer-date">{date.display}</p>

        <div className="footer-divider" />

        <p className="footer-message">
          With gratitude and love, we thank you for being part of our story.
        </p>

        <p className="footer-hashtag">#AhamedWedsNowfiyath</p>

        {onReplayEnvelope && (
          <button
            type="button"
            className="replay-envelope-btn"
            onClick={onReplayEnvelope}
            aria-label="Replay the quad envelope unfolding animation"
          >
            <span className="replay-icon">↺</span> Replay Quad Envelope Unfolding
          </button>
        )}

        <p className="footer-credit">Handcrafted with love for Ahamed Ansar & Nowfiyath Basriya</p>
      </motion.div>
    </footer>
  );
}
