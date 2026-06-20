const SOUND_SHAPES = {
  click: [220, 0.04, "triangle"],
  draw: [440, 0.12, "sine"],
  play: [330, 0.16, "square"],
  summon: [180, 0.28, "sawtooth"],
  spell: [660, 0.25, "triangle"],
  attack: [120, 0.2, "sawtooth"],
  damage: [90, 0.18, "square"],
  lowLife: [70, 0.35, "sawtooth"],
  master: [520, 0.6, "triangle"],
  victory: [392, 0.55, "sine"],
  defeat: [120, 0.6, "sine"]
};

export class AudioEngine {
  constructor(settings) {
    this.settings = settings;
    this.context = null;
    this.master = null;
  }

  updateSettings(settings) {
    this.settings = settings;
    if (this.master) {
      this.master.gain.value = this.settings.masterVolume;
    }
  }

  ensure() {
    if (this.context) return;
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return;
    this.context = new Context();
    this.master = this.context.createGain();
    this.master.gain.value = this.settings.masterVolume;
    this.master.connect(this.context.destination);
  }

  play(name) {
    if (this.settings.reducedMotion) return;
    this.ensure();
    if (!this.context || !this.master) return;
    const shape = SOUND_SHAPES[name] || SOUND_SHAPES.click;
    const [frequency, duration, type] = shape;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, frequency * 1.7), now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(this.settings.sfxVolume * 0.16, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }
}
