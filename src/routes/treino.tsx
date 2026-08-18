import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Info, Minus, Pause, Play, Plus, SkipForward } from "lucide-react";
import {
  Container,
  EmptyState,
  PageHeader,
  SpotifyButton,
  formatDate,
  formatDuration,
  formatTime,
} from "@/components/app-ui";
import { ExerciseInfoModal } from "@/components/ExerciseInfoModal";
import {
  ajustarDescanso,
  alternarPausaDescanso,
  concluirSerie,
  concluirTreino,
  elapsedMs,
  estimarMinutos,
  finalizarDescanso,
  iniciarTreino,
  pausarTreino,
  pularExercicio,
  pularSerie,
  restanteMs,
  retomarTreino,
  setCarga,
  totalSeries,
} from "@/lib/session";
import { openSpotify, speak, unlockAudio } from "@/lib/feedback";
import { lastPerformance, sessionVolume, useAppData } from "@/lib/store";

export const Route = createFileRoute("/treino")({
  validateSearch: (search: Record<string, unknown>) => ({
    ficha: typeof search["ficha"] === "string" ? (search["ficha"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Modo treino — JB Training Pro" },
      {
        name: "description",
        content:
          "Execute seu treino com controle automático de séries, cronômetro de descanso e avisos por voz.",
      },
      { property: "og:title", content: "Modo treino — JB Training Pro" },
      {
        property: "og:description",
        content: "Séries, descanso, carga e voz: o treino conduzido do início ao fim.",
      },
    ],
  }),
  component: TreinoPage,
});

function TreinoPage() {
  const data = useAppData();
  const { ficha: fichaId } = Route.useSearch();
  const [finalizado, setFinalizado] = useState<string | null>(null);

  if (finalizado) {
    const s = data.historico.find((h) => h.id === finalizado);
    if (s) return <Resumo sessaoId={finalizado} />;
  }

  if (data.sessaoAtiva) {
    return <SessaoAtiva onFinalizar={(id) => setFinalizado(id)} />;
  }

  const ficha = data.fichas.find((f) => f.id === fichaId);
  if (ficha) return <ResumoFicha fichaId={ficha.id} />;

  return (
    <main className="min-h-dvh">
      <PageHeader titulo="Iniciar treino" />
      <Container>
        {!data.fichas.length ? (
          <EmptyState
            titulo="Nenhuma ficha cadastrada"
            descricao="Crie uma ficha ou use o Treino Rápido para começar agora."
          >
            <div className="grid gap-2">
              <Link
                to="/fichas"
                className="rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground"
              >
                CRIAR FICHA
              </Link>
              <Link to="/rapido" className="rounded-xl bg-secondary px-4 py-3 font-bold">
                TREINO RÁPIDO
              </Link>
            </div>
          </EmptyState>
        ) : (
          <ul className="mt-4 space-y-3">
            {data.fichas.map((f) => (
              <li key={f.id}>
                <Link
                  to="/treino"
                  search={{ ficha: f.id }}
                  className="block rounded-2xl border border-border bg-card p-4"
                >
                  <p className="text-lg font-bold">{f.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {f.exercicios.length} exercícios · {totalSeries(f.exercicios)} séries
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </main>
  );
}

function ResumoFicha({ fichaId }: { fichaId: string }) {
  const data = useAppData();
  const ficha = data.fichas.find((f) => f.id === fichaId)!;

  return (
    <main className="min-h-dvh">
      <PageHeader titulo={ficha.nome} voltarPara="/treino" />
      <Container>
        <section className="mt-4 rounded-2xl border border-border bg-card p-6 text-center">
          <h2 className="text-2xl font-black uppercase">{ficha.nome}</h2>
          <p className="mt-2 text-lg">
            {ficha.exercicios.length} exercícios · {totalSeries(ficha.exercicios)} séries
          </p>
          <p className="text-sm text-muted-foreground">
            Tempo estimado: {estimarMinutos(ficha.exercicios)} minutos
          </p>
        </section>

        <ul className="mt-4 space-y-2">
          {ficha.exercicios.map((e) => (
            <li key={e.id} className="rounded-xl border border-border bg-card p-3">
              <p className="font-bold uppercase">{e.nome}</p>
              <p className="text-sm text-muted-foreground">
                {e.series} × {e.repeticoes} · {e.carga} {e.unidade}
              </p>
              <div className="mt-2">
                <ExerciseInfoModal exercicio={e} compact />
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          disabled={!ficha.exercicios.length}
          onClick={() => {
            unlockAudio();
            if (data.settings.spotifyAutoAbrir && data.settings.spotifyAtivo)
              openSpotify();
            iniciarTreino(ficha, ficha.exercicios, ficha.nome);
          }}
          className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-3xl rounded-t-2xl bg-primary px-4 py-5 text-lg font-black text-primary-foreground disabled:opacity-50"
        >
          ▶ INICIAR TREINO
        </button>
      </Container>
    </main>
  );
}

function SessaoAtiva({ onFinalizar }: { onFinalizar: (id: string) => void }) {
  const data = useAppData();
  const s = data.sessaoAtiva!;
  const [, force] = useState(0);
  const avisos = useRef<Set<number>>(new Set());

  useEffect(() => {
    const i = window.setInterval(() => force((n) => n + 1), 250);
    return () => window.clearInterval(i);
  }, []);

  const descanso = s.descanso;
  const restante = descanso ? restanteMs(descanso) : 0;

  useEffect(() => {
    if (!descanso || descanso.pausado) return;
    const seg = Math.ceil(restante / 1000);
    if (restante <= 0) {
      finalizarDescanso();
      avisos.current.clear();
      return;
    }
    if (!data.settings.avisosDescanso) return;
    const marcos = [30, 10, 5, 4, 3, 2, 1];
    if (marcos.includes(seg) && !avisos.current.has(seg)) {
      avisos.current.add(seg);
      if (seg === 30 || seg === 10) speak(`Faltam ${seg} segundos.`);
      else if (data.settings.contagemRegressiva) speak(String(seg));
    }
  }, [restante, descanso, data.settings.avisosDescanso, data.settings.contagemRegressiva]);

  const ex = s.exercicios[s.indiceExercicio];
  const anterior = ex ? lastPerformance(data, ex.nome) : null;

  if (!ex) return null;

  if (s.pausado) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-3xl font-black tracking-widest">TREINO PAUSADO</h1>
        <p className="tabular text-5xl font-black">{formatDuration(elapsedMs(s))}</p>
        <button
          type="button"
          onClick={retomarTreino}
          className="w-full max-w-sm rounded-2xl bg-primary px-4 py-6 text-xl font-black text-primary-foreground"
        >
          RETOMAR
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Encerrar e salvar o treino?")) {
              const id = s.id;
              concluirTreino();
              onFinalizar(id);
            }
          }}
          className="w-full max-w-sm rounded-2xl bg-secondary px-4 py-5 text-lg font-bold"
        >
          ENCERRAR TREINO
        </button>
      </main>
    );
  }

  if (descanso) {
    const seg = Math.ceil(restante / 1000);
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-5">
        <p className="text-sm font-bold tracking-[0.3em] text-muted-foreground">
          {descanso.tipo === "serie" ? "DESCANSO ENTRE SÉRIES" : "DESCANSO ENTRE EXERCÍCIOS"}
        </p>
        <p className="tabular text-8xl font-black text-primary">
          {String(Math.floor(seg / 60)).padStart(2, "0")}:
          {String(seg % 60).padStart(2, "0")}
        </p>
        <p className="text-lg font-bold tracking-widest">PRÓXIMA SÉRIE</p>
        <div className="grid w-full max-w-md grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => ajustarDescanso(-15)}
            className="rounded-2xl bg-secondary py-5 text-lg font-bold"
          >
            -15
          </button>
          <button
            type="button"
            onClick={alternarPausaDescanso}
            className="rounded-2xl bg-secondary py-5 text-lg font-bold"
          >
            {descanso.pausado ? "SEGUIR" : "PAUSAR"}
          </button>
          <button
            type="button"
            onClick={() => ajustarDescanso(15)}
            className="rounded-2xl bg-secondary py-5 text-lg font-bold"
          >
            +15
          </button>
        </div>
        <button
          type="button"
          onClick={() => finalizarDescanso(false)}
          className="w-full max-w-md rounded-2xl bg-primary py-5 text-lg font-black text-primary-foreground"
        >
          ⏭ PULAR DESCANSO
        </button>
        <div className="flex w-full max-w-md gap-2">
          <ExerciseInfoModal exercicio={ex} label="ℹ️ INFORMAÇÕES" />
          {data.settings.spotifyNoTreino && <SpotifyButton compact />}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh pb-6">
      <header className="flex items-center justify-between px-4 py-3 text-sm text-muted-foreground">
        <span className="tabular font-bold">{formatDuration(elapsedMs(s))}</span>
        <span>
          {s.indiceExercicio + 1}/{s.exercicios.length} · {s.fichaNome}
        </span>
        <button type="button" onClick={pausarTreino} className="rounded-lg bg-secondary p-2">
          <Pause className="size-4" />
        </button>
      </header>

      <Container>
        <section className="mt-2 rounded-3xl border border-border bg-card px-5 py-8 text-center">
          <h1 className="text-3xl leading-tight font-black uppercase">{ex.nome}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{ex.grupo}</p>

          <p className="mt-6 text-2xl font-black tracking-widest text-primary">
            SÉRIE {s.serieAtual} / {ex.series}
          </p>
          <p className="mt-4 text-4xl font-black">{ex.repeticoes} REPETIÇÕES</p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setCarga(s.cargaAtual - 1)}
              className="rounded-2xl bg-secondary p-4"
              aria-label="Diminuir carga"
            >
              <Minus className="size-6" />
            </button>
            <input
              type="number"
              step="0.5"
              value={s.cargaAtual}
              onChange={(e) => setCarga(Number(e.target.value))}
              className="tabular w-32 rounded-2xl border border-border bg-background py-3 text-center text-3xl font-black"
              aria-label="Carga da série"
            />
            <button
              type="button"
              onClick={() => setCarga(s.cargaAtual + 1)}
              className="rounded-2xl bg-secondary p-4"
              aria-label="Aumentar carga"
            >
              <Plus className="size-6" />
            </button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground uppercase">
            {ex.unidade}
            {ex.porLado ? " por lado" : " (carga total)"}
          </p>

          {data.settings.mostrarCargaAnterior && (
            <div className="mt-6 grid grid-cols-2 gap-3 text-left">
              <div className="rounded-xl bg-secondary p-3">
                <p className="text-[10px] tracking-widest text-muted-foreground">
                  ÚLTIMO TREINO
                </p>
                <p className="font-bold">
                  {anterior
                    ? `${anterior.carga} ${ex.unidade} × ${anterior.repeticoes}`
                    : "—"}
                </p>
              </div>
              <div className="rounded-xl bg-secondary p-3">
                <p className="text-[10px] tracking-widest text-muted-foreground">
                  CARGA PROGRAMADA
                </p>
                <p className="font-bold">
                  {ex.carga} {ex.unidade} × {ex.repeticoes}
                </p>
              </div>
            </div>
          )}
        </section>

        <div className="mt-4 grid gap-3">
          <button
            type="button"
            onClick={concluirSerie}
            className="rounded-2xl bg-primary py-7 text-2xl font-black text-primary-foreground active:scale-[0.99]"
          >
            ✓ CONCLUÍDA
          </button>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                if (
                  !data.settings.confirmarPular ||
                  window.confirm("Pular esta série?")
                )
                  pularSerie();
              }}
              className="rounded-2xl bg-secondary py-4 font-bold"
            >
              ⏭ PULAR
            </button>
            <button
              type="button"
              onClick={() => {
                if (
                  !data.settings.confirmarPular ||
                  window.confirm("Pular este exercício?")
                )
                  pularExercicio();
              }}
              className="rounded-2xl bg-secondary py-4 text-sm font-bold"
            >
              <SkipForward className="mx-auto size-5" />
              EXERCÍCIO
            </button>
            <button
              type="button"
              onClick={pausarTreino}
              className="rounded-2xl bg-secondary py-4 font-bold"
            >
              ⏸ PAUSAR
            </button>
          </div>
          <ExerciseInfoModal exercicio={ex} label="ℹ️ INFORMAÇÕES" />
          {data.settings.spotifyNoTreino && <SpotifyButton compact />}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Encerrar treino e salvar no histórico?")) {
                const id = s.id;
                concluirTreino();
                onFinalizar(id);
              }
            }}
            className="rounded-2xl border border-border py-3 text-sm font-semibold text-muted-foreground"
          >
            ENCERRAR TREINO
          </button>
        </div>
      </Container>
    </main>
  );
}

function Resumo({ sessaoId }: { sessaoId: string }) {
  const data = useAppData();
  const navigate = useNavigate();
  const s = data.historico.find((h) => h.id === sessaoId);
  if (!s) return null;
  const feitas = s.logs.filter((l) => l.concluida);
  const volume = sessionVolume(s);

  return (
    <main className="min-h-dvh">
      <Container>
        <section className="mt-10 rounded-3xl border border-primary bg-primary/10 p-6 text-center">
          <h1 className="text-3xl font-black">TREINO CONCLUÍDO! 💪</h1>
          <p className="mt-2 text-sm text-muted-foreground">{s.fichaNome}</p>
        </section>
        <ul className="mt-4 grid gap-2">
          <Linha titulo="Tempo total" valor={formatDuration(s.duracaoMs)} />
          <Linha
            titulo="Exercícios realizados"
            valor={String(new Set(feitas.map((l) => l.exercicioNome)).size)}
          />
          <Linha titulo="Séries realizadas" valor={String(feitas.length)} />
          <Linha
            titulo="Carga total movimentada"
            valor={volume ? `${Math.round(volume)} kg` : "não calculável"}
          />
          <Linha titulo="Data" valor={formatDate(s.inicioEm)} />
          <Linha titulo="Horário" valor={formatTime(s.inicioEm)} />
        </ul>
        <div className="mt-6 grid gap-3">
          <Link
            to="/historico"
            className="rounded-2xl bg-secondary py-4 text-center font-bold"
          >
            VER RESUMO
          </Link>
          <button
            type="button"
            onClick={() => void navigate({ to: "/" })}
            className="rounded-2xl bg-primary py-4 font-black text-primary-foreground"
          >
            FINALIZAR
          </button>
        </div>
      </Container>
    </main>
  );
}

function Linha({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <li className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
      <span className="text-sm text-muted-foreground">{titulo}</span>
      <span className="font-bold">{valor}</span>
    </li>
  );
}

void Info;
void Play;