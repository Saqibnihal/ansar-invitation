import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { weddingData } from '../data/weddingData';
import './OurStory.css';

const { couple, story } = weddingData;

/**
 * OurStory - Romantic couple showcase with fine-art photo and their journey
 */
export default function OurStory() {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  return (
    <section className="story-section" id="story" ref={ref} aria-label="Our Love Story">
      <motion.div
        className="story-container"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="story-header">
          <span className="section-ornament">✦ ✦ ✦</span>
          <h2 className="section-title">{story.title}</h2>
          <p className="section-subtitle">{story.subtitle}</p>
        </div>

        <div className="story-grid">
          {/* Couple portrait */}
          <motion.div
            className="story-image-frame"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="portrait-gold-rim" />
            <img
              src="/images/couple.jpg"
              alt={`${couple.groom.fullName} & ${couple.bride.fullName}`}
              className="story-portrait"
              loading="lazy"
            />
            <div className="portrait-caption">
              <span className="caption-names">
                {couple.groom.fullName} & {couple.bride.fullName}
              </span>
              <span className="caption-tagline">Together Forever</span>
            </div>
          </motion.div>

          {/* Story text */}
          <motion.div
            className="story-text-container"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.35 }}
          >
            <blockquote className="story-quote">
              <span className="quote-mark">“</span>
              <p className="quote-body">{story.quote.replace(/^[“"]|[”"]$/g, '')}</p>
              <footer className="quote-author">— {story.quoteAuthor}</footer>
            </blockquote>

            <div className="story-divider">
              <span className="story-diamond">♦</span>
            </div>

            <div className="story-paragraphs">
              {story.paragraphs.map((p, idx) => (
                <p key={idx} className="story-p">
                  {p}
                </p>
              ))}
            </div>

            <div className="family-blessings">
              <div className="family-column">
                <span className="family-label">Groom's Family</span>
                <span className="family-parents">{couple.groom.parents}</span>
              </div>
              <div className="family-sep">✦</div>
              <div className="family-column">
                <span className="family-label">Bride's Family</span>
                <span className="family-parents">{couple.bride.parents}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
