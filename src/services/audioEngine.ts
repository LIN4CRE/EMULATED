/**
 * Web Audio Chiptune Synthesizer & Retro Sound Engine
 * Provides authentic square-wave, triangle bass, and noise channels
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private musicInterval: any = null;
  private currentBgmTitle: string = '';

  public init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.3, this.ctx.currentTime);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  // Play a simple frequency tone
  public playTone(freq: number, type: OscillatorType = 'square', duration: number = 0.15, gainVal: number = 0.2) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Jump Sound (rising pitch)
  public playJump() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  // Laser / Shoot Sound
  public playLaser() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(900, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // Coin / Item Sound (2 arpeggio chimes)
  public playCoin() {
    if (this.isMuted) return;
    this.playTone(987.77, 'square', 0.08, 0.2); // B5
    setTimeout(() => {
      this.playTone(1318.51, 'square', 0.2, 0.25); // E6
    }, 80);
  }

  // Hit / Damage Sound
  public playHit() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    this.resume();

    // Noise buffer
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.15);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.15);
  }

  // Power Up / Achievement fanfare
  public playPowerUp() {
    if (this.isMuted) return;
    const notes = [330, 392, 659, 523, 587, 784];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.1, 0.22);
      }, idx * 60);
    });
  }

  // Kart Engine Acceleration sound
  public playEngineRev() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(220, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Start Theme BGM loop for current game
  public startBGM(gameId: string) {
    this.stopBGM();
    if (this.isMuted) return;
    this.init();
    this.currentBgmTitle = gameId;

    let step = 0;
    // Scale notes for retro melodies
    const melodyChrono = [220, 261, 329, 392, 440, 392, 329, 261];
    const melodyKart = [261, 329, 392, 523, 392, 523, 659, 784];
    const melodyNinja = [174, 196, 220, 261, 220, 196, 174, 130];
    const melodySciFi = [130, 164, 196, 246, 293, 246, 196, 164];

    let currentNotes = melodyChrono;
    if (gameId.includes('kart')) currentNotes = melodyKart;
    else if (gameId.includes('ninja')) currentNotes = melodyNinja;
    else if (gameId.includes('striker') || gameId.includes('invader')) currentNotes = melodySciFi;

    this.musicInterval = setInterval(() => {
      if (this.isMuted) return;
      const note = currentNotes[step % currentNotes.length];
      this.playTone(note, 'triangle', 0.2, 0.08);

      // Bass line counter
      if (step % 2 === 0) {
        this.playTone(note / 2, 'square', 0.15, 0.05);
      }
      step++;
    }, 220);
  }

  public stopBGM() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.currentBgmTitle = '';
  }
}

export const audioEngine = new AudioEngine();
