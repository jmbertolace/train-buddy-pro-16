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

/* ---------- Ducking: abaixa a música durante os alertas ---------- */

let duckEl: HTMLAudioElement | null = null;
let duckTimer: number | null = null;
let duckUrl: string | null = null;

function silentTrackUrl(): string {
  if (duckUrl) return duckUrl;
  const sampleRate = 8000;
  const seconds = 30;
  const frames = sampleRate * seconds;
  const buffer = new ArrayBuffer(44 + frames * 2);
  const view = new DataView(buffer);
  const ascii = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
  };
  ascii(0, "RIFF");
  view.setUint32(4, 36 + frames * 2, true);
  ascii(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  ascii(36, "data");
  view.setUint32(40, frames * 2, true);
  duckUrl = URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
  return duckUrl;
}

/**
 * Toma o foco de áudio do sistema para que Spotify / player de MP3 abaixem
 * (ou pausem) a música enquanto o app fala o alerta.
 */
export function duckMusic(ms = 4000) {
  if (typeof window === "undefined") return;
  if (!getState().settings.abaixarMusicaAlerta) return;
  try {
    if (!duckEl) {
      duckEl = new Audio(silentTrackUrl());
      duckEl.loop = true;
      duckEl.volume = 0.02;
    }
    void duckEl.play().catch(() => undefined);
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: "JB Training Pro — alerta",
        artist: "Treino",
      });
      navigator.mediaSession.playbackState = "playing";
    }
  } catch {
    /* ignore */
  }
  if (duckTimer) window.clearTimeout(duckTimer);
  duckTimer = window.setTimeout(unduckMusic, ms);
}

export function unduckMusic() {
  if (duckTimer) {
    window.clearTimeout(duckTimer);
    duckTimer = null;
  }
  try {
    duckEl?.pause();
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      navigator.mediaSession.playbackState = "none";
    }
  } catch {
    /* ignore */
  }
}

export function beep(freq = 880, duration = 0.18, times = 1) {
  const c = ctx();
  if (!c) return;
  duckMusic(Math.ceil((duration + 0.1) * times * 1000) + 800);
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
  duckMusic(Math.min(12000, 1500 + texto.length * 90));
  try {
    const u = new SpeechSynthesisUtterance(texto);
    u.onend = () => unduckMusic();
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

/** Abre uma playlist/álbum a partir de um link do Spotify, preferindo o app nativo. */
export function abrirPlaylist(url: string) {
  if (typeof window === "undefined") return;
  const match = /open\.spotify\.com\/([a-z]+)\/([A-Za-z0-9]+)/.exec(url);
  const uri = match ? `spotify:${match[1]}:${match[2]}` : null;
  if (uri) {
    const t = window.setTimeout(() => window.open(url, "_blank", "noopener"), 900);
    window.location.href = uri;
    window.setTimeout(() => window.clearTimeout(t), 2500);
    return;
  }
  window.open(url, "_blank", "noopener");
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
    const el = document.querySelector("audio,video") as HTMLMediaElement | null;
    if (el) {
      if (action === "play") {
        if (el.paused) void el.play();
        else el.pause();
      }
      return true;
    }
  } catch {
    /* ignore */
  }
  void key;
  return false;
}