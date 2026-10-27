import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { weddingData } from '../data/weddingData';
import './EventTimeline.css';

const { events } = weddingData;

/**
 * EventTimeline - Timeline of wedding events with staggered scroll reveals
 */
export default function EventTimeline() {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="events-section" id="events" ref={ref} aria-label="Wedding Events">
      <div className="events-bg-glow" aria-hidden="true" />
      <div className="events-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-ornament">✦ ✦ ✦</span>
          <h2 className="section-title">Wedding Celebrations</h2>
          <p className="section-subtitle">A journey of love, laughter, and togetherness</p>
        </motion.div>
      </div>

      <motion.div
        className="timeline"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <div className="timeline-line" aria-hidden="true" />

        {events.map((event, index) => (
          <motion.div
            key={event.name}
            className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
            variants={itemVariants}
          >
            <div className="timeline-dot" aria-hidden="true">
              <span className="dot-icon">{event.icon}</span>
            </div>

            <div className="timeline-card">
              <div className="timeline-card-header">
                <h3 className="event-name">{event.name}</h3>
                <div className="event-meta">
                  <span className="event-date">{event.date}</span>
                  <span className="event-divider">•</span>
                  <span className="event-time">{event.time}</span>
                </div>
              </div>
              <p className="event-description">{event.description}</p>
              <p className="event-venue">
                <span className="venue-icon">📍</span> {event.venue}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
