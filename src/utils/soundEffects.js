/**
 * Audio Synthesizer for Wedding Invitation
 * Uses Web Audio API for zero-dependency, ultra-realistic sound effects and ambient music
 */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.musicPlaying = false;
    this.musicGain = null;
    this.musicInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Sound of wax seal cracking & magical golden particle chimes
   */
  playSealBreakSound() {
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Crisp wax snap / crack (filtered noise burst + snap impulse)
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.03));
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1400, t);
    noiseFilter.Q.setValueAtTime(3, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noiseSource.start(t);

    // 2. Resonant golden bell / glass shimmer harmonic tones
    const chimeFreqs = [880, 1174.66, 1760, 2349.32, 2793.83, 3520];
    chimeFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const delay = idx * 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + delay);

      gain.gain.setValueAtTime(0.0001, t + delay);
      gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), t + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + delay);
      osc.stop(t + delay + 1.3);
    });

    // 3. Low warm thud / paper release
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(180, t);
    subOsc.frequency.exponentialRampToValueAtTime(45, t + 0.3);

    subGain.gain.setValueAtTime(0.25, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.36);
  }

  /**
   * Delicate paper slide swoosh when card rises
   */
  playCardRiseSound() {
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const duration = 0.8;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const envelope = Math.sin((Math.PI * i) / bufferSize);
      data[i] = (Math.random() * 2 - 1) * envelope;
    }

    const swoosh = this.ctx.createBufferSource();
    swoosh.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.exponentialRampToValueAtTime(900, t + duration * 0.6);
    filter.frequency.exponentialRampToValueAtTime(400, t + duration);
    filter.Q.setValueAtTime(2, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.12, t + duration * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    swoosh.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    swoosh.start(t);
  }

  /**
   * Sound of an individual flap unfolding (crisp paper rustle + soft whoosh)
   * @param {number} flapIndex - 0, 1, 2, or 3
   */
  playFlapOpenSound(flapIndex = 0) {
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const duration = 0.45;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      const env = Math.sin(Math.PI * progress);
      data[i] = (Math.random() * 2 - 1) * env * Math.exp(-progress * 2);
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const baseFreq = 420 + flapIndex * 110;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq, t);
    filter.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, t + duration * 0.5);
    filter.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, t + duration);
    filter.Q.setValueAtTime(2.5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    source.start(t);
  }

  /**
   * Sound of top flap peeling halfway with the seal and holding
   */
  playPeelHalfSound() {
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Soft wax release snap
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.1);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.02));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, t);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.28, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);

    // Smooth parchment lifting swoosh
    const swooshDur = 0.5;
    const swooshSize = Math.floor(this.ctx.sampleRate * swooshDur);
    const swooshBuf = this.ctx.createBuffer(1, swooshSize, this.ctx.sampleRate);
    const swooshData = swooshBuf.getChannelData(0);
    for (let i = 0; i < swooshSize; i++) {
      const p = i / swooshSize;
      swooshData[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * p) * 0.5;
    }
    const swoosh = this.ctx.createBufferSource();
    swoosh.buffer = swooshBuf;
    const swooshFilter = this.ctx.createBiquadFilter();
    swooshFilter.type = 'lowpass';
    swooshFilter.frequency.setValueAtTime(350, t);
    swooshFilter.frequency.linearRampToValueAtTime(750, t + swooshDur * 0.7);
    const swooshGain = this.ctx.createGain();
    swooshGain.gain.setValueAtTime(0.01, t);
    swooshGain.gain.linearRampToValueAtTime(0.18, t + 0.15);
    swooshGain.gain.exponentialRampToValueAtTime(0.001, t + swooshDur);

    swoosh.connect(swooshFilter);
    swooshFilter.connect(swooshGain);
    swooshGain.connect(this.ctx.destination);
    swoosh.start(t);
  }

  /**
   * Radiant celestial swell and sparkling chord when bright light pours out
   */
  playCelestialLightSound() {
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Harmonic golden chord frequencies (C major / golden shimmer: C4, E4, G4, B4, D5, G5)
    const chord = [261.63, 329.63, 392.0, 493.88, 587.33, 783.99, 1046.5];

    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const delay = i * 0.05;

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t + delay);

      // Volume swells up as light expands, then gently decays
      gain.gain.setValueAtTime(0.0001, t + delay);
      gain.gain.linearRampToValueAtTime(0.08 / (1 + i * 0.3), t + delay + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + delay);
      osc.stop(t + delay + 2.6);
    });
  }

  /**
   * Romantic harp / acoustic melodic theme looping in the background
   */
  startBackgroundMusic() {
    this.init();
    if (!this.ctx || this.musicPlaying) return;
    this.musicPlaying = true;

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.musicGain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 3);
    this.musicGain.connect(this.ctx.destination);

    // Romantic chord progression (F# major / Eb minor romantic mood)
    // C#4, F4, G#4, C5, D#5, F5, G#5, A#5
    const notes = [
      [261.63, 329.63, 392.0, 523.25], // C major
      [220.0, 261.63, 329.63, 440.0],  // A minor
      [174.61, 220.0, 261.63, 349.23], // F major
      [196.0, 246.94, 293.66, 392.0],  // G major
    ];

    let chordIndex = 0;
    let step = 0;

    const playNextNote = () => {
      if (!this.musicPlaying || !this.ctx) return;

      const chord = notes[chordIndex];
      const freq = chord[step % chord.length] * (step > 4 ? 1.5 : 1.0);
      const t = this.ctx.currentTime;

      // Bell / harp harmonic oscillator
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      // Warm acoustic decay
      oscGain.gain.setValueAtTime(0.001, t);
      oscGain.gain.linearRampToValueAtTime(0.2, t + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);

      osc.connect(oscGain);
      oscGain.connect(this.musicGain);

      osc.start(t);
      osc.stop(t + 2.3);

      step++;
      if (step >= 8) {
        step = 0;
        chordIndex = (chordIndex + 1) % notes.length;
      }
    };

    // Trigger notes every 420ms
    playNextNote();
    this.musicInterval = setInterval(playNextNote, 420);
  }

  stopBackgroundMusic() {
    if (!this.musicPlaying) return;
    this.musicPlaying = false;

    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }

    if (this.musicGain && this.ctx) {
      this.musicGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
    }
  }

  toggleMusic() {
    if (this.musicPlaying) {
      this.stopBackgroundMusic();
      return false;
    } else {
      this.startBackgroundMusic();
      return true;
    }
  }

  isMusicActive() {
    return this.musicPlaying;
  }
}

export const soundManager = new SoundManager();
