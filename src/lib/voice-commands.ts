/**
 * Comandos de voz durante o treino (offline no Android/Chrome, via
 * Web Speech API). Reconhece "concluído", "pular", "pausar", "retomar".
 */

type RecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type Ctor = new () => RecognitionLike;

export type VoiceCommand = "concluir" | "pular" | "pausar" | "retomar";

function ctor(): Ctor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: Ctor;
    webkitSpeechRecognition?: Ctor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function voiceCommandsSupported() {
  return ctor() !== null;
}

const MAPA: { termos: string[]; comando: VoiceCommand }[] = [
  { termos: ["concluid", "concluíd", "conclui", "feito", "pronto", "ok série", "próxima"], comando: "concluir" },
  { termos: ["pular", "pula"], comando: "pular" },
  { termos: ["pausar", "pausa"], comando: "pausar" },
  { termos: ["retomar", "continuar", "voltar"], comando: "retomar" },
];

function interpretar(texto: string): VoiceCommand | null {
  const t = texto.toLowerCase();
  for (const m of MAPA) if (m.termos.some((x) => t.includes(x))) return m.comando;
  return null;
}

/** Inicia a escuta contínua. Retorna uma função para parar. */
export function startVoiceCommands(onCommand: (c: VoiceCommand) => void) {
  const C = ctor();
  if (!C) return () => undefined;

  let ativo = true;
  let rec: RecognitionLike | null = null;

  const criar = () => {
    if (!ativo) return;
    const r = new C();
    r.lang = "pt-BR";
    r.continuous = true;
    r.interimResults = false;
    r.onresult = (e) => {
      const results = e.results;
      for (let i = 0; i < results.length; i++) {
        const texto = results[i]?.[0]?.transcript ?? "";
        const cmd = interpretar(texto);
        if (cmd) onCommand(cmd);
      }
    };
    r.onerror = () => undefined;
    r.onend = () => {
      if (ativo) window.setTimeout(criar, 400);
    };
    try {
      r.start();
      rec = r;
    } catch {
      /* ignore */
    }
  };

  criar();

  return () => {
    ativo = false;
    try {
      rec?.abort();
    } catch {
      /* ignore */
    }
  };
}
