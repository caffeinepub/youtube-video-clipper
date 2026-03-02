export type SoundTone = 'airhorn' | 'bruh' | 'mission-failed' | 'victory';

export function useSoundEffect() {
  const playSound = (tone: SoundTone) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

      const playTone = (freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.3) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gainNode.gain.setValueAtTime(gain, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      };

      switch (tone) {
        case 'airhorn':
          playTone(440, 0.1, 'sawtooth', 0.4);
          setTimeout(() => playTone(880, 0.8, 'sawtooth', 0.5), 100);
          break;
        case 'bruh':
          playTone(200, 0.3, 'sine', 0.3);
          setTimeout(() => playTone(150, 0.5, 'sine', 0.2), 300);
          break;
        case 'mission-failed':
          playTone(300, 0.3, 'square', 0.3);
          setTimeout(() => playTone(250, 0.3, 'square', 0.3), 300);
          setTimeout(() => playTone(200, 0.6, 'square', 0.3), 600);
          break;
        case 'victory':
          [523, 659, 784, 1047].forEach((freq, i) => {
            setTimeout(() => playTone(freq, 0.3, 'sine', 0.3), i * 150);
          });
          break;
      }
    } catch {
      // Audio context not available
    }
  };

  return { playSound };
}
