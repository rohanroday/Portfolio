// "Sound of the hills": a soft wind bed with the occasional prayer-wheel bell, synthesised in the
// browser with Web Audio. Nothing is downloaded, and nothing is created until the visitor turns
// sound on (browsers also require that click). It lives outside React so it keeps playing
// across page changes.

type Listener = () => void;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let bellBus: GainNode | null = null;
let bellTimer: ReturnType<typeof setTimeout> | null = null;
let on = false;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((l) => l());

export function subscribe(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}
export const isOn = () => on;

function noiseBuffer(c: AudioContext, seconds: number) {
  const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    // Brown-ish noise: softer and windier than white noise
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3.5;
  }
  return buf;
}

// One second of projector sprocket ticks (24 per second), each a tiny filtered click
function sprocketBuffer(c: AudioContext) {
  const buf = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const data = buf.getChannelData(0);
  const step = c.sampleRate / 24;
  for (let k = 0; k < 24; k++) {
    const start = Math.floor(k * step);
    const amp = 0.6 + Math.random() * 0.4;
    for (let i = 0; i < 260; i++) {
      const env = Math.exp(-i / 45);
      data[start + i] += (Math.random() * 2 - 1) * env * amp * (k % 2 ? 0.7 : 1);
    }
  }
  return buf;
}

// A short burst of shaped noise through a filter, for one-off effects
function burst(seconds: number, filterType: BiquadFilterType, freq: number, q: number, level: number, shape: (t: number) => number) {
  if (!ctx || !master || !on) return;
  const c = ctx;
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * shape(i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = filterType;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = c.createGain();
  g.gain.value = level;
  src.connect(f).connect(g).connect(master);
  src.start();
}

/** Paper ticket tearing along the perforation: a crackly rip that speeds up, then snaps. */
export function playTear() {
  burst(0.42, "bandpass", 2600, 0.9, 1.4, (t) => {
    const crackle = Math.random() < 0.18 + t * 0.5 ? 1 : 0.25; // fibres giving way, faster toward the end
    return crackle * (t < 0.9 ? 0.4 + t * 0.6 : (1 - t) * 10);
  });
}

/** Reel change between pages: a low mechanical clunk. */
export function playReelChange() {
  if (!ctx || !master || !on) return;
  const c = ctx;
  const now = c.currentTime;
  const osc = c.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(48, now + 0.18);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.5, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
  osc.connect(g).connect(master);
  osc.start(now);
  osc.stop(now + 0.32);
  burst(0.08, "highpass", 1800, 0.7, 0.6, (t) => 1 - t);
}

function build(c: AudioContext) {
  master = c.createGain();
  master.gain.value = 0;
  master.connect(c.destination);

  // Wind: looping noise through a band-pass whose centre drifts slowly, with slow gusts
  const wind = c.createBufferSource();
  wind.buffer = noiseBuffer(c, 6);
  wind.loop = true;
  const band = c.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 420;
  band.Q.value = 0.6;
  const windGain = c.createGain();
  windGain.gain.value = 0.55;
  const drift = c.createOscillator();
  drift.frequency.value = 0.06;
  const driftDepth = c.createGain();
  driftDepth.gain.value = 260;
  drift.connect(driftDepth).connect(band.frequency);
  const gust = c.createOscillator();
  gust.frequency.value = 0.11;
  const gustDepth = c.createGain();
  gustDepth.gain.value = 0.25;
  gust.connect(gustDepth).connect(windGain.gain);
  wind.connect(band).connect(windGain).connect(master);
  wind.start();
  drift.start();
  gust.start();

  // Projector: a low motor hum plus the sprocket clatter of film running at 24 frames a second
  const hum = c.createOscillator();
  hum.type = "sawtooth";
  hum.frequency.value = 58;
  const humFilter = c.createBiquadFilter();
  humFilter.type = "lowpass";
  humFilter.frequency.value = 180;
  const humGain = c.createGain();
  humGain.gain.value = 0.035;
  hum.connect(humFilter).connect(humGain).connect(master);
  hum.start();
  const clatter = c.createBufferSource();
  clatter.buffer = sprocketBuffer(c);
  clatter.loop = true;
  const clatterGain = c.createGain();
  clatterGain.gain.value = 0.05;
  clatter.connect(clatterGain).connect(master);
  clatter.start();

  // Bells go through a soft echo, like a valley answering
  bellBus = c.createGain();
  bellBus.gain.value = 1;
  const delay = c.createDelay(1);
  delay.delayTime.value = 0.34;
  const feedback = c.createGain();
  feedback.gain.value = 0.32;
  const wet = c.createGain();
  wet.gain.value = 0.4;
  bellBus.connect(master);
  bellBus.connect(delay);
  delay.connect(feedback).connect(delay);
  delay.connect(wet).connect(master);
}

const NOTES = [659.25, 783.99, 880, 987.77, 1174.66]; // E5 G5 A5 B5 D6, a pentatonic chime

function ring() {
  if (!ctx || !bellBus) return;
  const now = ctx.currentTime;
  const f = NOTES[Math.floor(Math.random() * NOTES.length)];
  for (const [mult, level] of [[1, 0.05], [2.76, 0.018], [5.4, 0.006]] as const) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f * mult;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(level, now + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 4.2 / mult ** 0.3);
    osc.connect(g).connect(bellBus);
    osc.start(now);
    osc.stop(now + 4.5);
  }
}

function scheduleBells() {
  bellTimer = setTimeout(() => {
    ring();
    scheduleBells();
  }, 3500 + Math.random() * 5000);
}

export async function toggle() {
  if (!on) {
    if (!ctx) {
      ctx = new AudioContext();
      build(ctx);
    }
    await ctx.resume();
    const t = ctx.currentTime;
    master!.gain.cancelScheduledValues(t);
    master!.gain.setValueAtTime(master!.gain.value, t);
    master!.gain.linearRampToValueAtTime(0.5, t + 2);
    setTimeout(ring, 900);
    scheduleBells();
    on = true;
  } else if (ctx && master) {
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0, t + 0.8);
    if (bellTimer) clearTimeout(bellTimer);
    setTimeout(() => {
      if (!on) ctx?.suspend();
    }, 900);
    on = false;
  }
  emit();
}
