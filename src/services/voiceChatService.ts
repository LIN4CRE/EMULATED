/**
 * Voice Chat Service & Real-Time Audio Visualizer for Co-Op Sessions
 */

class VoiceChatService {
  private mediaStream: MediaStream | null = null;
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private isMuted: boolean = false;
  private isDeafened: boolean = false;
  private isConnected: boolean = false;
  private volumeLevel: number = 0;
  private animFrame: number | null = null;
  private listeners: ((level: number) => void)[] = [];

  public async connect(): Promise<boolean> {
    if (this.isConnected) return true;
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      const source = this.audioCtx.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      this.isConnected = true;
      this.startAudioMeter();
      return true;
    } catch (e) {
      console.warn("Microphone access not granted or unavailable", e);
      this.isConnected = true; // Fallback mock connection
      return false;
    }
  }

  public disconnect() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
    this.isConnected = false;
    this.volumeLevel = 0;
    this.notifyListeners(0);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach(track => {
        track.enabled = !this.isMuted;
      });
    }
    return this.isMuted;
  }

  public toggleDeafen(): boolean {
    this.isDeafened = !this.isDeafened;
    if (this.isDeafened && !this.isMuted) {
      this.toggleMute();
    }
    return this.isDeafened;
  }

  public getIsMuted() { return this.isMuted; }
  public getIsDeafened() { return this.isDeafened; }
  public getIsConnected() { return this.isConnected; }

  public onVolumeChange(cb: (level: number) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notifyListeners(val: number) {
    this.volumeLevel = val;
    this.listeners.forEach(cb => cb(val));
  }

  private startAudioMeter() {
    if (!this.analyser) return;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const checkLevel = () => {
      if (!this.isConnected) return;
      if (this.isMuted || this.isDeafened) {
        this.notifyListeners(0);
      } else if (this.analyser) {
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        this.notifyListeners(normalized);
      }
      this.animFrame = requestAnimationFrame(checkLevel);
    };

    this.animFrame = requestAnimationFrame(checkLevel);
  }
}

export const voiceChatService = new VoiceChatService();
