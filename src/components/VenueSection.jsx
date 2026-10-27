import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { weddingData } from '../data/weddingData';
import './VenueSection.css';

const { venue } = weddingData;

/**
 * VenueSection - Venue details with photo and map directions
 */
export default function VenueSection() {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  return (
    <section className="venue-section" id="venue" ref={ref} aria-label="Venue Details">
      <div className="venue-bg-glow" aria-hidden="true" />
      <motion.div
        className="venue-content"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="venue-header">
          <span className="section-ornament">✦ ✦ ✦</span>
          <h2 className="section-title">The Venue</h2>
          <p className="section-subtitle">Where our journey begins</p>
        </div>

        <div className="venue-grid">
          {/* Venue photo */}
          <motion.div
            className="venue-photo-wrapper"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src="/images/venue.jpg"
              alt={venue.name}
              className="venue-photo"
              loading="lazy"
            />
            <div className="venue-photo-overlay" />
          </motion.div>

          {/* Venue details */}
          <motion.div
            className="venue-details"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="venue-name">{venue.name}</h3>
            <div className="venue-address">
              <p>{venue.address}</p>
              <p>{venue.city}</p>
              <p>{venue.country} — {venue.pin}</p>
            </div>

            <div className="venue-divider" />

            <p className="venue-directions">{venue.directions}</p>

            <a
              href={venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="venue-map-link"
              aria-label="Get directions to venue on Google Maps"
            >
              <span className="map-icon">📍</span>
              Get Directions
              <span className="link-arrow">→</span>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
