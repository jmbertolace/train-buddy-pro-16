import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHeader } from "@/components/app-ui";
import { ExerciseInfoModal } from "@/components/ExerciseInfoModal";
import { ExercisePicker, toFichaExercise } from "@/components/ExercisePicker";
import { iniciarTreino } from "@/lib/session";
import { unlockAudio } from "@/lib/feedback";
import { uid, useAppData } from "@/lib/store";
import type { FichaExercise, LibraryExercise } from "@/lib/types";

export const Route = createFileRoute("/rapido")({
  head: () => ({
    meta: [
      { title: "Treino rápido — JB Training Pro" },
      {
        name: "description",
        content:
          "Escolha um exercício, defina séries, repetições, carga e descanso e comece a treinar na hora.",
      },
      { property: "og:title", content: "Treino rápido — JB Training Pro" },
      {
        property: "og:description",
        content: "Comece a treinar imediatamente, sem cadastrar uma ficha completa.",
      },
    ],
  }),
  component: RapidoPage,
});

function RapidoPage() {
  const data = useAppData();
  const [lib, setLib] = useState<LibraryExercise | null>(null);
  const [series, setSeries] = useState(3);
  const [reps, setReps] = useState("10");
  const [carga, setCarga] = useState(0);
  const [descanso, setDescanso] = useState(data.settings.descansoPadrao);

  function comecar() {
    if (!lib) return;
    const base = toFichaExercise(lib, uid(), descanso, descanso);
    const ex: FichaExercise = {
      ...base,
      series,
      repeticoes: reps,
      carga,
    };
    unlockAudio();
    iniciarTreino(null, [ex], `Treino rápido — ${lib.nome}`);
    window.location.href = "/treino";
  }

  return (
    <main className="min-h-dvh">
      <PageHeader titulo="Treino rápido" />
      <Container>
        {!lib ? (
          <div className="mt-4">
            <ExercisePicker onSelect={setLib} acaoLabel="ESCOLHER" />
          </div>
        ) : (
          <div className="mt-4 grid gap-4">
            <section className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xl font-black uppercase">{lib.nome}</p>
              <p className="text-sm text-muted-foreground">{lib.grupo}</p>
              <div className="mt-3 grid gap-2">
                <ExerciseInfoModal exercicio={lib} />
                <button
                  type="button"
                  onClick={() => setLib(null)}
                  className="rounded-xl bg-secondary px-4 py-3 text-sm font-semibold"
                >
                  TROCAR EXERCÍCIO
                </button>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3">
              <Campo label="Séries">
                <input
                  type="number"
                  min={1}
                  value={series}
                  onChange={(e) => setSeries(Math.max(1, Number(e.target.value)))}
                  className={inputCls}
                />
              </Campo>
              <Campo label="Repetições">
                <input
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className={inputCls}
                />
              </Campo>
              <Campo label="Carga (kg)">
                <input
                  type="number"
                  step="0.5"
                  value={carga}
                  onChange={(e) => setCarga(Number(e.target.value))}
                  className={inputCls}
                />
              </Campo>
              <Campo label="Descanso (s)">
                <input
                  type="number"
                  value={descanso}
                  onChange={(e) => setDescanso(Number(e.target.value))}
                  className={inputCls}
                />
              </Campo>
            </div>

            <button
              type="button"
              onClick={comecar}
              className="rounded-2xl bg-primary py-5 text-lg font-black text-primary-foreground"
            >
              ▶ COMEÇAR AGORA
            </button>
          </div>
        )}
      </Container>
    </main>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-3 py-3 text-base outline-none focus:border-primary";

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}