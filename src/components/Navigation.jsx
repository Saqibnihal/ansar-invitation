import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navigation.css';

const navItems = [
  { id: 'invitation', label: 'Invitation' },
  { id: 'countdown', label: 'Countdown' },
  { id: 'story', label: 'Our Story' },
  { id: 'events', label: 'Events' },
  { id: 'venue', label: 'Venue' },
];

/**
 * Navigation - Fixed side navigation with scroll-spy
 */
export default function Navigation() {
  const [activeSection, setActiveSection] = useState('invitation');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' }
    );

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          className="side-navigation"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.6 }}
          aria-label="Page navigation"
        >
          <ul className="nav-list">
            {navItems.map(({ id, label }) => (
              <li key={id} className="nav-item">
                <button
                  className={`nav-dot ${activeSection === id ? 'active' : ''}`}
                  onClick={() => scrollTo(id)}
                  aria-label={`Scroll to ${label}`}
                  aria-current={activeSection === id ? 'true' : undefined}
                >
                  <span className="dot" />
                  <span className="nav-label">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
