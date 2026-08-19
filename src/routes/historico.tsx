import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Container,
  EmptyState,
  PageHeader,
  formatDate,
  formatDuration,
  formatTime,
} from "@/components/app-ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { sessionVolume, useAppData } from "@/lib/store";
import type { WorkoutSession } from "@/lib/types";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Histórico de treinos — JB Training Pro" },
      {
        name: "description",
        content: "Veja todos os treinos realizados com séries, cargas, duração e datas.",
      },
      { property: "og:title", content: "Histórico de treinos — JB Training Pro" },
      {
        property: "og:description",
        content: "Todo treino é salvo automaticamente no seu aparelho.",
      },
    ],
  }),
  component: HistoricoPage,
});

function HistoricoPage() {
  const data = useAppData();
  const [aberto, setAberto] = useState<WorkoutSession | null>(null);

  return (
    <main className="min-h-dvh">
      <PageHeader titulo="Histórico" />
      <Container>
        {!data.historico.length ? (
          <EmptyState
            titulo="Nenhum treino registrado"
            descricao="Assim que você concluir um treino, ele aparece aqui automaticamente."
          />
        ) : (
          <ul className="mt-4 space-y-3">
            {data.historico.map((s) => {
              const feitas = s.logs.filter((l) => l.concluida);
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setAberto(s)}
                    className="w-full rounded-2xl border border-border bg-card p-4 text-left"
                  >
                    <p className="text-xs text-muted-foreground">
                      {formatDate(s.inicioEm)} · {formatTime(s.inicioEm)}
                    </p>
                    <p className="text-lg font-bold uppercase">{s.fichaNome}</p>
                    <p className="text-sm text-muted-foreground">
                      Duração: {formatDuration(s.duracaoMs)} ·{" "}
                      {new Set(feitas.map((l) => l.exercicioNome)).size} exercícios ·{" "}
                      {feitas.length} séries
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Container>

      <Dialog open={!!aberto} onOpenChange={(o) => !o && setAberto(null)}>
        <DialogContent className="max-h-[85dvh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{aberto?.fichaNome}</DialogTitle>
          </DialogHeader>
          {aberto && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {formatDate(aberto.inicioEm)} às {formatTime(aberto.inicioEm)} ·{" "}
                {formatDuration(aberto.duracaoMs)} · carga total{" "}
                {Math.round(sessionVolume(aberto))} kg
              </p>
              {agrupar(aberto).map(([nome, logs]) => (
                <section
                  key={nome}
                  className="rounded-xl border border-border bg-card p-3"
                >
                  <p className="font-bold uppercase">{nome}</p>
                  <ul className="mt-1 space-y-1 text-sm">
                    {logs.map((l, i) => (
                      <li key={i} className="flex justify-between">
                        <span>Série {l.serie}</span>
                        <span className={l.pulada ? "text-muted-foreground" : ""}>
                          {l.pulada
                            ? "pulada"
                            : `${l.carga} ${l.unidade} × ${l.repeticoes}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
              {aberto.observacoes && (
                <p className="text-sm text-muted-foreground">{aberto.observacoes}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function agrupar(s: WorkoutSession) {
  const mapa = new Map<string, WorkoutSession["logs"]>();
  s.logs.forEach((l) => {
    const lista = mapa.get(l.exercicioNome) ?? [];
    lista.push(l);
    mapa.set(l.exercicioNome, lista);
  });
  return [...mapa.entries()];
}