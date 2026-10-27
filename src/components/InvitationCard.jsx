import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { weddingData } from '../data/weddingData';
import { generateIcsCalendar, openGoogleCalendar } from '../utils/calendar';
import './InvitationCard.css';

const { couple, date, venue, message } = weddingData;

/**
 * InvitationCard - The elegant wedding invitation card
 * Revealed after the envelope opens with staggered text animations,
 * gold foil accents, royal filigree corners, and interactive calendar / venue actions.
 */
export default function InvitationCard() {
  const cardRef = useRef(null);
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.card-animate', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2,
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const handleDownloadIcs = useCallback(() => {
    generateIcsCalendar(weddingData);
    setCalendarMenuOpen(false);
  }, []);

  const handleGoogleCalendar = useCallback(() => {
    openGoogleCalendar(weddingData);
    setCalendarMenuOpen(false);
  }, []);

  return (
    <motion.section
      className="invitation-card-section"
      ref={cardRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      id="invitation"
      aria-label="Wedding Invitation"
    >
      <div className="card-outer-shadow">
        <div className="invitation-card">
          {/* SVG Definitions for Gold Foil Gradients */}
          <svg width="0" height="0" className="svg-defs" aria-hidden="true">
            <defs>
              <linearGradient id="cardGoldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2D1" />
                <stop offset="30%" stopColor="#E8C87A" />
                <stop offset="70%" stopColor="#C9A84C" />
                <stop offset="100%" stopColor="#96722C" />
              </linearGradient>
            </defs>
          </svg>

          {/* Deckled edge gold rim */}
          <div className="card-gold-inner-rim" />

          {/* Four Royal Gold Filigree Corners */}
          <svg className="card-corner corner-tl" viewBox="0 0 60 60" aria-hidden="true">
            <path d="M 4,56 L 4,12 C 4,7.5 7.5,4 12,4 L 56,4" fill="none" stroke="url(#cardGoldFoil)" strokeWidth="1.5" />
            <path d="M 10,50 L 10,18 C 10,13.5 13.5,10 18,10 L 50,10" fill="none" stroke="url(#cardGoldFoil)" strokeWidth="1" opacity="0.6" />
            <path d="M 4,4 C 18,18 18,18 32,4 C 18,18 18,18 4,32" fill="none" stroke="url(#cardGoldFoil)" strokeWidth="1.2" opacity="0.75" />
            <circle cx="18" cy="18" r="3" fill="url(#cardGoldFoil)" />
            <circle cx="6" cy="6" r="1.5" fill="url(#cardGoldFoil)" />
          </svg>
          <svg className="card-corner corner-tr" viewBox="0 0 60 60" aria-hidden="true">
            <path d="M 4,56 L 4,12 C 4,7.5 7.5,4 12,4 L 56,4" fill="none" stroke="url(#cardGoldFoil)" strokeWidth="1.5" />
            <path d="M 10,50 L 10,18 C 10,13.5 13.5,10 18,10 L 50,10" fill="none" stroke="url(#cardGoldFoil)" strokeWidth="1" opacity="0.6" />
            <path d="M 4,4 C 18,18 18,18 32,4 C 18,18 18,18 4,32" fill="none" stroke="url(#cardGoldFoil)" strokeWidth="1.2" opacity="0.75" />
            <circle cx="18" cy="18" r="3" fill="url(#cardGoldFoil)" />
            <circle cx="6" cy="6" r="1.5" fill="url(#cardGoldFoil)" />
          </svg>
          <svg className="card-corner corner-bl" viewBox="0 0 60 60" aria-hidden="true">
            <path d="M 4,56 L 4,12 C 4,7.5 7.5,4 12,4 L 56,4" fill="none" stroke="url(#cardGoldFoil)" strokeWidth="1.5" />
            <path d="M 10,50 L 10,18 C 10,13.5 13.5,10 18,10 L 50,10" fill="none" stroke="url(#cardGoldFoil)" strokeWidth="1" opacity="0.6" />
            <path d="M 4,4 C 18,18 18,18 32,4 C 18,18 18,18 4,32" fill="none" stroke="url(#cardGoldFoil)" strokeWidth="1.2" opacity="0.75" />
            <circle cx="18" cy="18" r="3" fill="url(#cardGoldFoil)" />
            <circle cx="6" cy="6" r="1.5" fill="url(#cardGoldFoil)" />
          </svg>
          <svg className="card-corner corner-br" viewBox="0 0 60 60" aria-hidden="true">
            <path d="M 4,56 L 4,12 C 4,7.5 7.5,4 12,4 L 56,4" fill="none" stroke="url(#cardGoldFoil)" strokeWidth="1.5" />
            <path d="M 10,50 L 10,18 C 10,13.5 13.5,10 18,10 L 50,10" fill="none" stroke="url(#cardGoldFoil)" strokeWidth="1" opacity="0.6" />
            <path d="M 4,4 C 18,18 18,18 32,4 C 18,18 18,18 4,32" fill="none" stroke="url(#cardGoldFoil)" strokeWidth="1.2" opacity="0.75" />
            <circle cx="18" cy="18" r="3" fill="url(#cardGoldFoil)" />
            <circle cx="6" cy="6" r="1.5" fill="url(#cardGoldFoil)" />
          </svg>

          {/* Floral border overlay */}
          <div className="card-floral-border" aria-hidden="true">
            <img src="/images/floral-border.jpg" alt="" className="floral-border-img" />
          </div>

          <div className="card-content">
            {/* Sacred Bismillah Calligraphy */}
            <div className="card-animate card-bismillah-wrapper">
              <span className="card-bismillah" title="In the name of Allah, the Most Gracious, the Most Merciful">
                ﷽
              </span>
            </div>

            {/* Top ornament */}
            <div className="card-animate ornamental-divider">
              <span className="gold-sparkle">✦</span>
              <span className="ornament-center">❦</span>
              <span className="gold-sparkle">✦</span>
            </div>

            {/* Headline */}
            <p className="card-animate card-headline">{message.headline}</p>

            {/* Couple names */}
            <div className="card-animate couple-names-section">
              <div className="name-group">
                <h1 className="groom-name">{couple.groom.firstName}</h1>
                <p className="full-name-subtitle">{couple.groom.fullName}</p>
                <p className="parent-names">{couple.groom.parents}</p>
              </div>

              <div className="ampersand-wrapper">
                <span className="ampersand-line" />
                <span className="ampersand-crest">
                  <span className="crest-sparkle">✦</span>
                  <span className="ampersand">&</span>
                  <span className="crest-sparkle">✦</span>
                </span>
                <span className="ampersand-line" />
              </div>

              <div className="name-group">
                <h1 className="bride-name">{couple.bride.firstName}</h1>
                <p className="full-name-subtitle">{couple.bride.fullName}</p>
                <p className="parent-names">{couple.bride.parents}</p>
              </div>
            </div>

            {/* Invitation text */}
            <p className="card-animate invitation-text">{message.invitation}</p>

            {/* Decorative line */}
            <div className="card-animate decorative-line">
              <span className="line" />
              <span className="line-ornament">♦</span>
              <span className="line" />
            </div>

            {/* Royal Date & Venue Highlight Badge */}
            <div className="card-animate date-venue-badge">
              <div className="badge-header">
                <span className="badge-flourish">✦</span>
                <span className="badge-day">{date.full}</span>
                <span className="badge-flourish">✦</span>
              </div>

              <div className="badge-main-date">
                <div className="badge-date-highlight">
                  <span className="badge-date-number">03</span>
                  <div className="badge-date-sub">
                    <span className="badge-month">JANUARY</span>
                    <span className="badge-year">{date.year}</span>
                  </div>
                </div>
                <div className="badge-divider-vert" />
                <div className="badge-time-highlight">
                  <span className="badge-time-label">NIKAH TIME</span>
                  <span className="badge-time-val">{date.time}</span>
                </div>
              </div>

              <div className="badge-venue-footer">
                <div className="badge-venue-item">
                  <span className="badge-venue-icon">🕌</span>
                  <div className="badge-venue-text">
                    <strong>Mohideen Masjid</strong> — Eruvadi, Tirunelveli
                  </div>
                </div>
                <div className="badge-venue-item lunch-item">
                  <span className="badge-venue-icon">🍽️</span>
                  <div className="badge-venue-text">
                    Followed by Lunch after Zuhar at <strong>Baithussalam</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Romantic message */}
            <p className="card-animate romantic-message">{message.romantic}</p>

            {/* Quick Actions Bar */}
            <div className="card-animate card-actions">
              <div className="calendar-dropdown-wrapper">
                <button
                  type="button"
                  className="card-action-btn calendar-btn"
                  onClick={() => setCalendarMenuOpen((prev) => !prev)}
                  aria-expanded={calendarMenuOpen}
                >
                  <span className="btn-icon">📅</span> Add to Calendar
                  <span className="dropdown-caret">▾</span>
                </button>

                <AnimatePresence>
                  {calendarMenuOpen && (
                    <motion.div
                      className="calendar-dropdown-menu"
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        type="button"
                        className="calendar-dropdown-item"
                        onClick={handleGoogleCalendar}
                      >
                        <span className="cal-item-icon">🗓️</span> Google Calendar
                      </button>
                      <button
                        type="button"
                        className="calendar-dropdown-item"
                        onClick={handleDownloadIcs}
                      >
                        <span className="cal-item-icon">📥</span> Apple / Outlook (.ics)
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a
                href={venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-action-btn venue-btn"
                aria-label="View Venue Location on Google Maps"
              >
                <span className="btn-icon">📍</span> View Venue Maps
                <span className="btn-arrow">↗</span>
              </a>
            </div>

            {/* Bottom ornament */}
            <div className="card-animate ornamental-divider bottom">❦</div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
