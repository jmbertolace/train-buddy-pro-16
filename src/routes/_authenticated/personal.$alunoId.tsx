import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Container,
  EmptyState,
  PageHeader,
  formatDate,
  formatDuration,
} from "@/components/app-ui";
import { dadosDoAluno, salvarFichasDoAluno, type DadosAluno } from "@/lib/cloud";
import type { Ficha } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/personal/$alunoId")({
  head: () => ({
    meta: [
      { title: "Aluno — JB Training Pro" },
      {
        name: "description",
        content: "Histórico de treinos e fichas do aluno, com edição de séries e cargas.",
      },
      { property: "og:title", content: "Aluno — JB Training Pro" },
      {
        property: "og:description",
        content: "Acompanhe a evolução do aluno e ajuste a ficha dele.",
      },
    ],
  }),
  component: AlunoPage,
});

function AlunoPage() {
  const { alunoId } = Route.useParams();
  const [dados, setDados] = useState<DadosAluno | null>(null);
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [aba, setAba] = useState<"historico" | "fichas">("historico");
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const d = await dadosDoAluno(alunoId);
      setDados(d);
      setFichas(d?.fichas ?? []);
    } catch {
      toast.error("Não foi possível carregar os dados deste aluno.");
    } finally {
      setCarregando(false);
    }
  }, [alunoId]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  function patchExercicio(
    fi: number,
    ei: number,
    patch: Record<string, number | string>,
  ) {
    setFichas((prev) =>
      prev.map((f, i) =>
        i !== fi
          ? f
          : {
              ...f,
              exercicios: f.exercicios.map((e, j) => (j !== ei ? e : { ...e, ...patch })),
            },
      ),
    );
  }

  async function salvar() {
    try {
      await salvarFichasDoAluno(alunoId, fichas);
      toast.success("Fichas salvas. O aluno pode baixá-las no app dele.");
      await carregar();
    } catch {
      toast.error("Não foi possível salvar as fichas.");
    }
  }

  return (
    <main className="min-h-dvh">
      <PageHeader titulo="Aluno" voltarPara="/personal" />
      <Container>
        {carregando ? (
          <p className="mt-6 text-sm text-muted-foreground">Carregando…</p>
        ) : !dados ? (
          <EmptyState
            titulo="Sem dados enviados"
            descricao="O aluno ainda não enviou fichas nem histórico pelo app dele."
          />
        ) : (
          <>
            <p className="mt-4 text-xs text-muted-foreground">
              Último envio do aluno:{" "}
              {dados.enviado_em ? formatDate(new Date(dados.enviado_em).getTime()) : "—"}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["historico", "fichas"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setAba(k)}
                  className={`rounded-xl py-3 font-bold uppercase ${
                    aba === k
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card"
                  }`}
                >
                  {k === "historico" ? "Histórico" : "Fichas"}
                </button>
              ))}
            </div>

            {aba === "historico" && (
              <ul className="mt-4 grid gap-2">
                {!dados.historico?.length && (
                  <p className="text-sm text-muted-foreground">
                    Nenhum treino registrado.
                  </p>
                )}
                {(dados.historico ?? []).map((s) => (
                  <li key={s.id} className="rounded-2xl border border-border bg-card p-4">
                    <p className="font-bold uppercase">{s.fichaNome}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(s.inicioEm)} · {formatDuration(s.duracaoMs)} ·{" "}
                      {s.logs.filter((l) => l.concluida).length} séries
                    </p>
                    <ul className="mt-2 grid gap-1 text-sm">
                      {s.logs
                        .filter((l) => l.concluida)
                        .map((l, i) => (
                          <li key={i} className="text-muted-foreground">
                            {l.exercicioNome}: série {l.serie} · {l.carga} {l.unidade} ×{" "}
                            {l.repeticoes}
                          </li>
                        ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}

            {aba === "fichas" && (
              <>
                <ul className="mt-4 grid gap-3">
                  {!fichas.length && (
                    <p className="text-sm text-muted-foreground">
                      O aluno ainda não enviou fichas.
                    </p>
                  )}
                  {fichas.map((f, fi) => (
                    <li
                      key={f.id}
                      className="rounded-2xl border border-border bg-card p-4"
                    >
                      <input
                        value={f.nome}
                        onChange={(e) =>
                          setFichas((prev) =>
                            prev.map((x, i) =>
                              i === fi ? { ...x, nome: e.target.value } : x,
                            ),
                          )
                        }
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 font-bold uppercase"
                        aria-label="Nome da ficha"
                      />
                      <ul className="mt-3 grid gap-3">
                        {f.exercicios.map((e, ei) => (
                          <li key={e.id} className="rounded-xl border border-border p-3">
                            <p className="font-bold uppercase">{e.nome}</p>
                            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                              <label className="grid gap-1">
                                <span className="text-xs text-muted-foreground">
                                  Séries
                                </span>
                                <input
                                  type="number"
                                  min={1}
                                  value={e.series}
                                  onChange={(ev) =>
                                    patchExercicio(fi, ei, {
                                      series: Number(ev.target.value),
                                    })
                                  }
                                  className="rounded-lg border border-border bg-background px-2 py-2"
                                />
                              </label>
                              <label className="grid gap-1">
                                <span className="text-xs text-muted-foreground">Reps</span>
                                <input
                                  value={e.repeticoes}
                                  onChange={(ev) =>
                                    patchExercicio(fi, ei, {
                                      repeticoes: ev.target.value,
                                    })
                                  }
                                  className="rounded-lg border border-border bg-background px-2 py-2"
                                />
                              </label>
                              <label className="grid gap-1">
                                <span className="text-xs text-muted-foreground">Carga</span>
                                <input
                                  type="number"
                                  step="0.5"
                                  value={e.carga}
                                  onChange={(ev) =>
                                    patchExercicio(fi, ei, {
                                      carga: Number(ev.target.value),
                                    })
                                  }
                                  className="rounded-lg border border-border bg-background px-2 py-2"
                                />
                              </label>
                            </div>
                            <label className="mt-2 grid gap-1 text-sm">
                              <span className="text-xs text-muted-foreground">
                                Observações do personal
                              </span>
                              <input
                                value={e.observacoes ?? ""}
                                onChange={(ev) =>
                                  patchExercicio(fi, ei, {
                                    observacoes: ev.target.value,
                                  })
                                }
                                className="rounded-lg border border-border bg-background px-2 py-2"
                              />
                            </label>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
                {!!fichas.length && (
                  <button
                    type="button"
                    onClick={() => void salvar()}
                    className="mt-4 w-full rounded-2xl bg-primary py-4 font-black text-primary-foreground"
                  >
                    SALVAR FICHAS DO ALUNO
                  </button>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </main>
  );
}
