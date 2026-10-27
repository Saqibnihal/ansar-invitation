import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { weddingData } from '../data/weddingData';
import './RSVPForm.css';

const { rsvp, couple } = weddingData;

/**
 * RSVPForm - Interactive RSVP form with validation and submission state
 */
export default function RSVPForm() {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const [formState, setFormState] = useState('idle'); // idle | submitting | success | error
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: '',
    guests: '1',
    meal: '',
    message: '',
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setFormState('submitting');

      // Simulate form submission
      setTimeout(() => {
        setFormState('success');
      }, 1500);
    },
    []
  );

  return (
    <section className="rsvp-section" id="rsvp" ref={ref} aria-label="RSVP Form">
      <motion.div
        className="rsvp-content"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rsvp-header">
          <span className="section-ornament">✦ ✦ ✦</span>
          <h2 className="section-title">Répondez S'il Vous Plaît</h2>
          <p className="section-subtitle">
            Kindly respond by {rsvp.deadline}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {formState === 'success' ? (
            <motion.div
              key="success"
              className="rsvp-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <div className="success-icon">✓</div>
              <h3 className="success-title">Thank You!</h3>
              <p className="success-message">
                Your RSVP has been received. We look forward to celebrating with you!
              </p>
              <p className="success-names">
                — {couple.groom.firstName} & {couple.bride.firstName}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className="rsvp-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rsvp-name" className="form-label">
                    Full Name
                  </label>
                  <input
                    id="rsvp-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Your full name"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rsvp-email" className="form-label">
                    Email Address
                  </label>
                  <input
                    id="rsvp-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rsvp-attending" className="form-label">
                    Will you be attending?
                  </label>
                  <select
                    id="rsvp-attending"
                    name="attending"
                    value={formData.attending}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="" disabled>
                      Select your response
                    </option>
                    <option value="yes">Joyfully Accepts</option>
                    <option value="no">Regretfully Declines</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="rsvp-guests" className="form-label">
                    Number of Guests
                  </label>
                  <select
                    id="rsvp-guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {Array.from({ length: rsvp.maxGuests }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="rsvp-meal" className="form-label">
                  Meal Preference
                </label>
                <select
                  id="rsvp-meal"
                  name="meal"
                  value={formData.meal}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="" disabled>
                    Select meal preference
                  </option>
                  {rsvp.meals.map((meal) => (
                    <option key={meal} value={meal.toLowerCase()}>
                      {meal}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="rsvp-message" className="form-label">
                  Message for the Couple (Optional)
                </label>
                <textarea
                  id="rsvp-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Share your blessings and warm wishes..."
                  rows={4}
                />
              </div>

              <button
                type="submit"
                className="rsvp-submit"
                disabled={formState === 'submitting'}
              >
                {formState === 'submitting' ? (
                  <span className="submit-loading">
                    <span className="loading-dot" />
                    <span className="loading-dot" />
                    <span className="loading-dot" />
                  </span>
                ) : (
                  'Send RSVP'
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
