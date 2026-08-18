import { beep, speak, vibrate } from "./feedback";
import {
  finishSession,
  getState,
  setSession,
  startSession,
  uid,
} from "./store";
import type { Ficha, FichaExercise, WorkoutSession } from "./types";

export function estimarMinutos(exercicios: FichaExercise[]) {
  const seg = exercicios.reduce((total, e) => {
    const trabalho = e.series * 40;
    const descanso = (e.series - 1) * e.descansoSeries + e.descansoExercicios;
    return total + trabalho + descanso;
  }, 0);
  return Math.max(1, Math.round(seg / 60));
}

export function totalSeries(exercicios: FichaExercise[]) {
  return exercicios.reduce((t, e) => t + e.series, 0);
}

export function iniciarTreino(ficha: Ficha | null, exercicios: FichaExercise[], nome: string) {
  const agora = Date.now();
  const sessao: WorkoutSession = {
    id: uid(),
    fichaId: ficha?.id ?? null,
    fichaNome: nome,
    exercicios,
    inicioEm: agora,
    duracaoMs: 0,
    acumuladoMs: 0,
    retomadoEm: agora,
    indiceExercicio: 0,
    serieAtual: 1,
    cargaAtual: exercicios[0]?.carga ?? 0,
    logs: [],
    descanso: null,
    pausado: false,
    concluido: false,
  };
  startSession(sessao);
  const e = exercicios[0];
  if (e) {
    speak(
      `${e.nome}. Série 1 de ${e.series}. ${e.repeticoes} repetições.`,
    );
  }
  return sessao;
}

export function elapsedMs(s: WorkoutSession) {
  return s.acumuladoMs + (s.retomadoEm ? Date.now() - s.retomadoEm : 0);
}

export function pausarTreino() {
  setSession((s) => {
    if (s.pausado) return s;
    return {
      ...s,
      pausado: true,
      acumuladoMs: elapsedMs(s),
      retomadoEm: null,
      descanso: s.descanso ? { ...s.descanso, pausado: true, restanteMs: restanteMs(s.descanso) } : null,
    };
  });
  speak("Treino pausado.");
}

export function retomarTreino() {
  setSession((s) => ({
    ...s,
    pausado: false,
    retomadoEm: Date.now(),
    descanso: s.descanso
      ? { ...s.descanso, pausado: false, terminaEm: Date.now() + s.descanso.restanteMs }
      : null,
  }));
  speak("Treino retomado.");
}

export function restanteMs(d: NonNullable<WorkoutSession["descanso"]>) {
  return d.pausado ? d.restanteMs : Math.max(0, d.terminaEm - Date.now());
}

export function setCarga(carga: number) {
  setSession((s) => ({ ...s, cargaAtual: Math.max(0, Math.round(carga * 10) / 10) }));
}

function iniciarDescanso(tipo: "serie" | "exercicio", segundos: number) {
  if (segundos <= 0) {
    avancar();
    return;
  }
  setSession((s) => ({
    ...s,
    descanso: {
      tipo,
      totalSeg: segundos,
      terminaEm: Date.now() + segundos * 1000,
      restanteMs: segundos * 1000,
      pausado: false,
    },
  }));
  speak(
    tipo === "serie"
      ? `Série concluída. Descanso de ${segundos} segundos.`
      : `Exercício concluído. Descanso de ${segundos} segundos.`,
  );
}

export function concluirSerie() {
  const s = getState().sessaoAtiva;
  if (!s) return;
  const ex = s.exercicios[s.indiceExercicio];
  if (!ex) return;
  vibrate(60);
  beep(660, 0.12);
  setSession((prev) => ({
    ...prev,
    logs: [
      ...prev.logs,
      {
        exercicioId: ex.id,
        exercicioNome: ex.nome,
        serie: prev.serieAtual,
        repeticoes: ex.repeticoes,
        carga: prev.cargaAtual,
        unidade: ex.unidade,
        porLado: ex.porLado,
        concluida: true,
        emMs: Date.now(),
      },
    ],
  }));
  const ultimaSerie = s.serieAtual >= ex.series;
  const ultimoExercicio = s.indiceExercicio >= s.exercicios.length - 1;
  if (ultimaSerie && ultimoExercicio) {
    concluirTreino();
    return;
  }
  iniciarDescanso(
    ultimaSerie ? "exercicio" : "serie",
    ultimaSerie ? ex.descansoExercicios : ex.descansoSeries,
  );
}

export function pularSerie() {
  const s = getState().sessaoAtiva;
  if (!s) return;
  const ex = s.exercicios[s.indiceExercicio];
  if (!ex) return;
  setSession((prev) => ({
    ...prev,
    logs: [
      ...prev.logs,
      {
        exercicioId: ex.id,
        exercicioNome: ex.nome,
        serie: prev.serieAtual,
        repeticoes: ex.repeticoes,
        carga: prev.cargaAtual,
        unidade: ex.unidade,
        porLado: ex.porLado,
        concluida: false,
        pulada: true,
        emMs: Date.now(),
      },
    ],
  }));
  avancar();
}

export function pularExercicio() {
  const s = getState().sessaoAtiva;
  if (!s) return;
  if (s.indiceExercicio >= s.exercicios.length - 1) {
    concluirTreino();
    return;
  }
  const prox = s.exercicios[s.indiceExercicio + 1]!;
  setSession((prev) => ({
    ...prev,
    indiceExercicio: prev.indiceExercicio + 1,
    serieAtual: 1,
    cargaAtual: prox.carga,
    descanso: null,
  }));
  anunciarProximo(prox);
}

function anunciarProximo(ex: FichaExercise) {
  speak(
    `Próximo exercício: ${ex.nome}. ${ex.series} séries de ${ex.repeticoes} repetições.`,
  );
}

/** Avança para a próxima série/exercício (chamado ao fim do descanso). */
export function avancar() {
  const s = getState().sessaoAtiva;
  if (!s) return;
  const ex = s.exercicios[s.indiceExercicio];
  if (!ex) return;
  if (s.serieAtual < ex.series) {
    const proximaSerie = s.serieAtual + 1;
    setSession((prev) => ({ ...prev, serieAtual: proximaSerie, descanso: null }));
    if (getState().settings.avisoInicioSerie) {
      speak(`${ex.nome}. Série ${proximaSerie} de ${ex.series}. ${ex.repeticoes} repetições.`);
    }
    return;
  }
  const prox = s.exercicios[s.indiceExercicio + 1];
  if (!prox) {
    concluirTreino();
    return;
  }
  setSession((prev) => ({
    ...prev,
    indiceExercicio: prev.indiceExercicio + 1,
    serieAtual: 1,
    cargaAtual: prox.carga,
    descanso: null,
  }));
  anunciarProximo(prox);
}

export function ajustarDescanso(deltaSeg: number) {
  setSession((s) => {
    if (!s.descanso) return s;
    const restante = Math.max(1000, restanteMs(s.descanso) + deltaSeg * 1000);
    return {
      ...s,
      descanso: {
        ...s.descanso,
        restanteMs: restante,
        terminaEm: Date.now() + restante,
      },
    };
  });
}

export function alternarPausaDescanso() {
  setSession((s) => {
    if (!s.descanso) return s;
    const d = s.descanso;
    return {
      ...s,
      descanso: d.pausado
        ? { ...d, pausado: false, terminaEm: Date.now() + d.restanteMs }
        : { ...d, pausado: true, restanteMs: restanteMs(d) },
    };
  });
}

export function finalizarDescanso(anunciar = true) {
  if (anunciar) {
    const s = getState().settings;
    if (s.somFinalCronometro) beep(880, 0.2, 2);
    vibrate([120, 80, 120]);
    speak("Descanso concluído. Próxima série.");
  }
  avancar();
}

export function concluirTreino() {
  const s = getState().sessaoAtiva;
  if (!s) return;
  const duracaoMs = elapsedMs(s);
  finishSession({
    ...s,
    duracaoMs,
    fimEm: Date.now(),
    descanso: null,
    retomadoEm: null,
    acumuladoMs: duracaoMs,
    concluido: true,
  });
  beep(990, 0.25, 3);
  vibrate([200, 100, 200]);
  speak("Treino concluído. Parabéns!");
}