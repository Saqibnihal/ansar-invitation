import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import DynamicPetalsDust from './components/DynamicPetalsDust';
import QuadEnvelope from './components/QuadEnvelope';
import InvitationCard from './components/InvitationCard';
import Countdown from './components/Countdown';
import OurStory from './components/OurStory';
import EventTimeline from './components/EventTimeline';
import VenueSection from './components/VenueSection';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import MusicControl from './components/MusicControl';

/**
 * App - Main application component
 * Features full-screen 4-flap Quad Envelope opening experience
 * and persistent dynamic dancing golden dust particles & flower petals
 */
export default function App() {
  const [isOpened, setIsOpened] = useState(false);

  const handleEnvelopeOpen = useCallback(() => {
    setIsOpened(true);
    // Smooth scroll to top when invitation reveals
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleReplayEnvelope = useCallback(() => {
    setIsOpened(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="app">
      {/* Persistent dynamic atmosphere: dancing golden dust, floating flowers & petals */}
      <DynamicPetalsDust className="is-fixed" count={22} dustCount={45} flowerCount={7} />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="quad-envelope"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <QuadEnvelope onOpen={handleEnvelopeOpen} />
          </motion.div>
        ) : (
          <motion.div
            key="invitation"
            className="invitation-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.1 }}
          >
            <Navigation />
            <MusicControl />

            <main>
              <InvitationCard />
              <Countdown />
              <OurStory />
              <EventTimeline />
              <VenueSection />
            </main>

            <Footer onReplayEnvelope={handleReplayEnvelope} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
