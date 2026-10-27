import { motion } from 'framer-motion';
import { useCountdown } from '../hooks/useCountdown';
import { useInView } from '../hooks/useInView';
import { weddingData } from '../data/weddingData';
import './Countdown.css';

const { date } = weddingData;

const timeUnits = ['days', 'hours', 'minutes', 'seconds'];

/**
 * Countdown - Live countdown timer to the wedding date
 */
export default function Countdown() {
  const countdown = useCountdown(date.numeric);
  const [ref, isInView] = useInView({ threshold: 0.3 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="countdown-section" id="countdown" ref={ref} aria-label="Countdown Timer">
      <div className="section-bg-pattern" aria-hidden="true" />

      <motion.div
        className="countdown-content"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <motion.div className="countdown-header" variants={itemVariants}>
          <span className="countdown-ornament">✦</span>
          <h2 className="countdown-title">Counting Down To</h2>
          <p className="countdown-subtitle">{date.display}</p>
          <span className="countdown-ornament">✦</span>
        </motion.div>

        <div className="countdown-timer">
          {timeUnits.map((unit) => (
            <motion.div
              key={unit}
              className="countdown-unit"
              variants={itemVariants}
            >
              <div className="countdown-number-wrapper">
                <span className="countdown-number">
                  {String(countdown[unit]).padStart(2, '0')}
                </span>
              </div>
              <span className="countdown-label">{unit}</span>
            </motion.div>
          ))}
        </div>

        {countdown.isExpired && (
          <motion.p
            className="countdown-expired"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            The celebration has begun! 🎉
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
