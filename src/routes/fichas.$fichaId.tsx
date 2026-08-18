import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import { Container, EmptyState, PageHeader } from "@/components/app-ui";
import { ExerciseInfoModal } from "@/components/ExerciseInfoModal";
import { ExercisePicker, toFichaExercise } from "@/components/ExercisePicker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { estimarMinutos, totalSeries } from "@/lib/session";
import { setExercicios, uid, updateFicha, useAppData } from "@/lib/store";
import type { FichaExercise, LoadUnit } from "@/lib/types";

export const Route = createFileRoute("/fichas/$fichaId")({
  head: () => ({
    meta: [
      { title: "Editor de ficha — JB Training Pro" },
      {
        name: "description",
        content:
          "Adicione, edite, duplique e reordene exercícios com séries, repetições, carga e descansos.",
      },
      { property: "og:title", content: "Editor de ficha — JB Training Pro" },
      {
        property: "og:description",
        content: "Monte sua ficha de treino exercício por exercício.",
      },
    ],
  }),
  component: EditorFicha,
});

function EditorFicha() {
  const { fichaId } = Route.useParams();
  const data = useAppData();
  const ficha = data.fichas.find((f) => f.id === fichaId);
  const [picker, setPicker] = useState(false);
  const [arrastando, setArrastando] = useState<number | null>(null);

  if (!ficha) {
    return (
      <main className="min-h-dvh">
        <PageHeader titulo="Ficha" voltarPara="/fichas" />
        <Container>
          <EmptyState titulo="Ficha não encontrada" descricao="Ela pode ter sido excluída." />
        </Container>
      </main>
    );
  }

  const ex = ficha.exercicios;

  function salvar(lista: FichaExercise[]) {
    setExercicios(fichaId, lista);
  }

  function mover(from: number, to: number) {
    if (to < 0 || to >= ex.length) return;
    const lista = [...ex];
    const [item] = lista.splice(from, 1);
    if (item) lista.splice(to, 0, item);
    salvar(lista);
  }

  return (
    <main className="min-h-dvh">
      <PageHeader
        titulo={ficha.nome}
        voltarPara="/fichas"
        acao={
          <button
            type="button"
            onClick={() => {
              const nome = window.prompt("Renomear ficha", ficha.nome);
              if (nome) updateFicha(fichaId, { nome });
            }}
            className="rounded-xl bg-secondary px-3 py-2 text-sm font-semibold"
          >
            Renomear
          </button>
        }
      />
      <Container>
        <p className="py-3 text-sm text-muted-foreground">
          {ex.length} exercícios · {totalSeries(ex)} séries · tempo estimado ~
          {estimarMinutos(ex)} min
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPicker(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 font-bold text-primary-foreground"
          >
            <Plus className="size-5" /> ADICIONAR EXERCÍCIO
          </button>
          <Link
            to="/treino"
            search={{ ficha: fichaId }}
            className="rounded-2xl bg-secondary px-4 py-4 font-bold"
          >
            ▶ TREINAR
          </Link>
        </div>

        {!ex.length ? (
          <EmptyState
            titulo="Ficha vazia"
            descricao="Adicione exercícios da biblioteca ou crie exercícios personalizados."
          />
        ) : (
          <ul className="mt-4 space-y-3">
            {ex.map((item, i) => (
              <li
                key={item.id}
                draggable
                onDragStart={() => setArrastando(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (arrastando !== null && arrastando !== i) mover(arrastando, i);
                  setArrastando(null);
                }}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-start gap-2">
                  <GripVertical className="mt-1 size-5 shrink-0 cursor-grab text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold uppercase">{item.nome}</p>
                    <p className="text-xs text-muted-foreground">{item.grupo}</p>
                    <p className="mt-1 text-sm">
                      {item.series} séries × {item.repeticoes} reps · {item.carga}{" "}
                      {item.unidade}
                      {item.porLado ? " (por lado)" : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Descanso: {item.descansoSeries}s entre séries ·{" "}
                      {item.descansoExercicios}s entre exercícios
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => mover(i, i - 1)}
                      className="rounded-lg bg-secondary p-2"
                      aria-label="Subir"
                    >
                      <ChevronUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => mover(i, i + 1)}
                      className="rounded-lg bg-secondary p-2"
                      aria-label="Descer"
                    >
                      <ChevronDown className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid gap-2">
                  <ExerciseInfoModal exercicio={item} />
                  <div className="flex gap-2">
                    <EditarExercicio
                      exercicio={item}
                      onSave={(novo) =>
                        salvar(ex.map((e) => (e.id === item.id ? novo : e)))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const lista = [...ex];
                        lista.splice(i + 1, 0, { ...item, id: uid() });
                        salvar(lista);
                      }}
                      className="rounded-xl bg-secondary px-4 py-3 text-sm font-semibold"
                      aria-label="Duplicar exercício"
                    >
                      <Copy className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => salvar(ex.filter((e) => e.id !== item.id))}
                      className="rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-destructive"
                      aria-label="Excluir exercício"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Container>

      <Dialog open={picker} onOpenChange={setPicker}>
        <DialogContent className="max-h-[85dvh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar exercício</DialogTitle>
          </DialogHeader>
          <ExercisePicker
            onSelect={(lib) => {
              salvar([
                ...ex,
                toFichaExercise(
                  lib,
                  uid(),
                  data.settings.descansoPadrao,
                  data.settings.descansoExerciciosPadrao,
                ),
              ]);
              setPicker(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}

function EditarExercicio({
  exercicio,
  onSave,
}: {
  exercicio: FichaExercise;
  onSave: (e: FichaExercise) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(exercicio);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setForm(exercicio);
          setOpen(true);
        }}
        className="flex-1 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold"
      >
        EDITAR
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85dvh] max-w-md overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{exercicio.nome}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <Campo label="Nome">
              <input
                className={inputCls}
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </Campo>
            <Campo label="Grupo muscular">
              <input
                className={inputCls}
                value={form.grupo}
                onChange={(e) => setForm({ ...form, grupo: e.target.value })}
              />
            </Campo>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Séries">
                <input
                  type="number"
                  min={1}
                  className={inputCls}
                  value={form.series}
                  onChange={(e) =>
                    setForm({ ...form, series: Math.max(1, Number(e.target.value)) })
                  }
                />
              </Campo>
              <Campo label="Repetições">
                <input
                  className={inputCls}
                  value={form.repeticoes}
                  onChange={(e) => setForm({ ...form, repeticoes: e.target.value })}
                />
              </Campo>
              <Campo label="Carga">
                <input
                  type="number"
                  step="0.5"
                  className={inputCls}
                  value={form.carga}
                  onChange={(e) => setForm({ ...form, carga: Number(e.target.value) })}
                />
              </Campo>
              <Campo label="Unidade">
                <select
                  className={inputCls}
                  value={form.unidade}
                  onChange={(e) =>
                    setForm({ ...form, unidade: e.target.value as LoadUnit })
                  }
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                  <option value="placas">placas</option>
                  <option value="peso do corpo">peso do corpo</option>
                </select>
              </Campo>
              <Campo label="Descanso entre séries (s)">
                <input
                  type="number"
                  className={inputCls}
                  value={form.descansoSeries}
                  onChange={(e) =>
                    setForm({ ...form, descansoSeries: Number(e.target.value) })
                  }
                />
              </Campo>
              <Campo label="Descanso entre exercícios (s)">
                <input
                  type="number"
                  className={inputCls}
                  value={form.descansoExercicios}
                  onChange={(e) =>
                    setForm({ ...form, descansoExercicios: Number(e.target.value) })
                  }
                />
              </Campo>
            </div>
            <label className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.porLado}
                onChange={(e) => setForm({ ...form, porLado: e.target.checked })}
                className="size-5"
              />
              Carga por lado (desmarcado = carga total)
            </label>
            <Campo label="Imagem / GIF (URL)">
              <input
                className={inputCls}
                value={form.gifUrl ?? ""}
                placeholder="https://..."
                onChange={(e) => setForm({ ...form, gifUrl: e.target.value })}
              />
            </Campo>
            <Campo label="Vídeo curto (URL)">
              <input
                className={inputCls}
                value={form.videoUrl ?? ""}
                placeholder="https://..."
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              />
            </Campo>
            <Campo label="Observações">
              <textarea
                className={inputCls}
                rows={3}
                value={form.observacoes ?? ""}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              />
            </Campo>
            <button
              type="button"
              onClick={() => {
                onSave(form);
                setOpen(false);
              }}
              className="rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground"
            >
              SALVAR
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
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