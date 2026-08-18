import { getState } from "./store";

let audioCtx: AudioContext | null = null;

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

/** Deve ser chamado a partir de um gesto do usuário (iniciar treino). */
export function unlockAudio() {
  ctx();
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      window.speechSynthesis.speak(u);
    } catch {
      /* ignore */
    }
  }
}

export function beep(freq = 880, duration = 0.18, times = 1) {
  const c = ctx();
  if (!c) return;
  for (let i = 0; i < times; i++) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    const start = c.currentTime + i * (duration + 0.08);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.35, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(c.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }
}

export function vibrate(pattern: number | number[]) {
  const s = getState().settings;
  if (!s.vibracao) return;
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }
}

export function speak(texto: string, force = false) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const s = getState().settings;
  if (!s.vozAtiva && !force) return;
  try {
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = "pt-BR";
    u.rate = 1.05;
    u.volume = s.vozVolume;
    const voz = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.toLowerCase().startsWith("pt"));
    if (voz) u.voice = voz;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}

export function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function openSpotify() {
  if (typeof window === "undefined") return;
  const isAndroid = /android/i.test(navigator.userAgent);
  const web = "https://open.spotify.com";
  if (isAndroid) {
    const t = window.setTimeout(() => window.open(web, "_blank", "noopener"), 900);
    window.location.href = "spotify://";
    window.setTimeout(() => window.clearTimeout(t), 2500);
    return;
  }
  window.open(web, "_blank", "noopener");
}

/** Controles de mídia do sistema (funcionam quando o dispositivo os expõe). */
export function mediaKey(action: "prev" | "play" | "next") {
  if (typeof navigator === "undefined") return false;
  const key =
    action === "prev"
      ? "previoustrack"
      : action === "next"
        ? "nexttrack"
        : "play";
  try {
    // @ts-expect-error API experimental em alguns navegadores
    if (navigator.mediaSession?.playbackState !== undefined) {
      const el = document.querySelector("audio,video") as HTMLMediaElement | null;
      if (el) {
        if (action === "play") el.paused ? void el.play() : el.pause();
        return true;
      }
    }
  } catch {
    /* ignore */
  }
  void key;
  return false;
}