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
