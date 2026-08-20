import { useSyncExternalStore } from "react";
import type {
  AppData,
  Ficha,
  FichaExercise,
  LibraryExercise,
  Settings,
  SpotifyPlaylist,
  SyncState,
  WorkoutSession,
} from "./types";
import { defaultSettings, defaultSync } from "./types";

const KEY = "jb-training-pro:v1";

const empty: AppData = {
  fichas: [],
  personalizados: [],
  historico: [],
  sessaoAtiva: null,
  settings: defaultSettings,
  ultimaFichaId: null,
  playlists: [],
  sync: defaultSync,
};

let state: AppData = empty;
let hydrated = false;
const listeners = new Set<() => void>();

function read(): AppData {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      ...empty,
      ...parsed,
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      sync: { ...defaultSync, ...(parsed.sync ?? {}) },
      playlists: parsed.playlists ?? [],
    };
  } catch {
    return empty;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* quota */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  state = read();
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getState() {
  return state;
}

export function setState(updater: (prev: AppData) => AppData) {
  state = updater(state);
  persist();
  emit();
}

export function useAppData(): AppData {
  return useSyncExternalStore(subscribe, getState, () => empty);
}

export function useSettings(): Settings {
  return useAppData().settings;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/* ---------------- fichas ---------------- */

export function createFicha(nome: string): Ficha {
  const ficha: Ficha = {
    id: uid(),
    nome,
    exercicios: [],
    criadaEm: Date.now(),
    atualizadaEm: Date.now(),
  };
  setState((p) => ({ ...p, fichas: [...p.fichas, ficha] }));
  return ficha;
}

export function updateFicha(id: string, patch: Partial<Ficha>) {
  setState((p) => ({
    ...p,
    fichas: p.fichas.map((f) =>
      f.id === id ? { ...f, ...patch, atualizadaEm: Date.now() } : f,
    ),
  }));
}

export function deleteFicha(id: string) {
  setState((p) => ({ ...p, fichas: p.fichas.filter((f) => f.id !== id) }));
}

export function duplicateFicha(id: string) {
  setState((p) => {
    const f = p.fichas.find((x) => x.id === id);
    if (!f) return p;
    const copia: Ficha = {
      ...f,
      id: uid(),
      nome: `${f.nome} (cópia)`,
      exercicios: f.exercicios.map((e) => ({ ...e, id: uid() })),
      criadaEm: Date.now(),
      atualizadaEm: Date.now(),
    };
    return { ...p, fichas: [...p.fichas, copia] };
  });
}

export function setExercicios(fichaId: string, exercicios: FichaExercise[]) {
  updateFicha(fichaId, { exercicios });
}

/* ---------------- exercícios personalizados ---------------- */

export function addPersonalizado(exercicio: LibraryExercise) {
  setState((p) => ({ ...p, personalizados: [...p.personalizados, exercicio] }));
}

export function removePersonalizado(id: string) {
  setState((p) => ({
    ...p,
    personalizados: p.personalizados.filter((e) => e.id !== id),
  }));
}

/* ---------------- settings ---------------- */

export function updateSettings(patch: Partial<Settings>) {
  setState((p) => ({ ...p, settings: { ...p.settings, ...patch } }));
}

/* ---------------- playlists (Spotify) ---------------- */

export function addPlaylist(nome: string, url: string): SpotifyPlaylist {
  const pl: SpotifyPlaylist = { id: uid(), nome, url };
  setState((p) => ({ ...p, playlists: [...p.playlists, pl] }));
  return pl;
}

export function removePlaylist(id: string) {
  setState((p) => ({ ...p, playlists: p.playlists.filter((x) => x.id !== id) }));
}

/* ---------------- sincronização com o personal ---------------- */

export function updateSync(patch: Partial<SyncState>) {
  setState((p) => ({ ...p, sync: { ...p.sync, ...patch } }));
}

export function replaceFichas(fichas: Ficha[]) {
  setState((p) => ({ ...p, fichas }));
}

/* ---------------- sessão ---------------- */

export function setSession(
  updater: (s: WorkoutSession) => WorkoutSession | null,
) {
  setState((p) => {
    if (!p.sessaoAtiva) return p;
    return { ...p, sessaoAtiva: updater(p.sessaoAtiva) };
  });
}

export function startSession(session: WorkoutSession) {
  setState((p) => ({ ...p, sessaoAtiva: session, ultimaFichaId: session.fichaId }));
}

export function finishSession(session: WorkoutSession) {
  setState((p) => ({
    ...p,
    sessaoAtiva: null,
    historico: [{ ...session, concluido: true }, ...p.historico],
  }));
}

export function discardSession() {
  setState((p) => ({ ...p, sessaoAtiva: null }));
}

/* ---------------- consultas ---------------- */

export interface LastPerformance {
  carga: number;
  repeticoes: string;
  data: number;
}

export function lastPerformance(
  data: AppData,
  nome: string,
): LastPerformance | null {
  for (const s of data.historico) {
    const logs = s.logs.filter(
      (l) => l.exercicioNome === nome && l.concluida && !l.pulada,
    );
    if (logs.length) {
      const best = logs.reduce((a, b) => (b.carga > a.carga ? b : a));
      return { carga: best.carga, repeticoes: best.repeticoes, data: s.inicioEm };
    }
  }
  return null;
}

export function exerciseHistory(data: AppData, nome: string) {
  const linhas: { data: number; carga: number; repeticoes: string }[] = [];
  for (const s of [...data.historico].reverse()) {
    const logs = s.logs.filter(
      (l) => l.exercicioNome === nome && l.concluida && !l.pulada,
    );
    if (!logs.length) continue;
    const best = logs.reduce((a, b) => (b.carga > a.carga ? b : a));
    linhas.push({ data: s.inicioEm, carga: best.carga, repeticoes: best.repeticoes });
  }
  return linhas;
}

export function allExerciseNames(data: AppData) {
  const set = new Set<string>();
  data.historico.forEach((s) => s.logs.forEach((l) => set.add(l.exercicioNome)));
  return [...set].sort();
}

export function sessionVolume(s: WorkoutSession) {
  return s.logs
    .filter((l) => l.concluida && !l.pulada)
    .reduce((total, l) => {
      const reps = parseInt(l.repeticoes, 10);
      if (!Number.isFinite(reps) || !l.carga) return total;
      return total + l.carga * reps * (l.porLado ? 2 : 1);
    }, 0);
}