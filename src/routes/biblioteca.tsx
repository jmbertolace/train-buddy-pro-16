import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { Container, PageHeader } from "@/components/app-ui";
import { ExerciseInfoModal } from "@/components/ExerciseInfoModal";
import { ExercisePicker } from "@/components/ExercisePicker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GRUPOS } from "@/lib/library";
import { addPersonalizado, removePersonalizado, uid, useAppData } from "@/lib/store";
import type { DemoPattern, LibraryExercise } from "@/lib/types";

export const Route = createFileRoute("/biblioteca")({
  head: () => ({
    meta: [
      { title: "Biblioteca de exercícios — JB Training Pro" },
      {
        name: "description",
        content:
          "Exercícios por grupo muscular com finalidade, músculos, execução, demonstração e segurança.",
      },
      { property: "og:title", content: "Biblioteca de exercícios — JB Training Pro" },
      {
        property: "og:description",
        content: "Consulte a execução correta e crie exercícios personalizados.",
      },
    ],
  }),
  component: BibliotecaPage,
});

function BibliotecaPage() {
  const data = useAppData();
  const [novo, setNovo] = useState(false);
  const [detalhe, setDetalhe] = useState<LibraryExercise | null>(null);

  return (
    <main className="min-h-dvh">
      <PageHeader titulo="Biblioteca" />
      <Container>
        <button
          type="button"
          onClick={() => setNovo(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 font-bold text-primary-foreground"
        >
          <Plus className="size-5" /> CRIAR EXERCÍCIO PERSONALIZADO
        </button>

        {!!data.personalizados.length && (
          <section className="mt-4">
            <h2 className="mb-2 text-xs font-bold tracking-widest text-muted-foreground">
              MEUS EXERCÍCIOS
            </h2>
            <ul className="space-y-2">
              {data.personalizados.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{e.nome}</p>
                    <p className="text-xs text-muted-foreground">{e.grupo}</p>
                  </div>
                  <ExerciseInfoModal exercicio={e} compact label="ℹ️ SOBRE" />
                  <button
                    type="button"
                    onClick={() => removePersonalizado(e.id)}
                    className="rounded-lg bg-secondary p-2 text-destructive"
                    aria-label="Excluir"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-6">
          <ExercisePicker onSelect={setDetalhe} acaoLabel="VER" />
        </div>
      </Container>

      <Dialog open={!!detalhe} onOpenChange={(o) => !o && setDetalhe(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{detalhe?.nome}</DialogTitle>
          </DialogHeader>
          {detalhe && <ExerciseInfoModal exercicio={detalhe} />}
        </DialogContent>
      </Dialog>

      <NovoExercicio open={novo} onOpenChange={setNovo} />
    </main>
  );
}

function NovoExercicio({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [nome, setNome] = useState("");
  const [grupo, setGrupo] = useState<string>(GRUPOS[0]);
  const [equipamento, setEquipamento] = useState("");
  const [finalidade, setFinalidade] = useState("");
  const [musculos, setMusculos] = useState("");
  const [execucao, setExecucao] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [padrao, setPadrao] = useState<DemoPattern>("supino");

  function salvar() {
    if (!nome.trim()) return;
    addPersonalizado({
      id: uid(),
      nome: nome.trim(),
      grupo,
      equipamento: equipamento || "Livre",
      descricao: finalidade,
      padrao,
      personalizado: true,
      ...(gifUrl ? { gifUrl } : {}),
      ...(videoUrl ? { videoUrl } : {}),
      info: {
        finalidade: finalidade || "Exercício personalizado.",
        musculos: musculos
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean),
        execucao: execucao
          .split("\n")
          .map((m) => m.trim())
          .filter(Boolean),
        seguranca: [
          "Execute o movimento de forma controlada, dentro da amplitude confortável.",
          "Conteúdo educativo — não substitui a orientação de um profissional de Educação Física.",
        ],
      },
    });
    setNome("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo exercício personalizado</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <input
            className={inputCls}
            placeholder="Nome do exercício"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <select
            className={inputCls}
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
          >
            {GRUPOS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <input
            className={inputCls}
            placeholder="Equipamento"
            value={equipamento}
            onChange={(e) => setEquipamento(e.target.value)}
          />
          <textarea
            className={inputCls}
            rows={2}
            placeholder="Para que serve"
            value={finalidade}
            onChange={(e) => setFinalidade(e.target.value)}
          />
          <input
            className={inputCls}
            placeholder="Músculos (separados por vírgula)"
            value={musculos}
            onChange={(e) => setMusculos(e.target.value)}
          />
          <textarea
            className={inputCls}
            rows={4}
            placeholder="Como executar (um passo por linha)"
            value={execucao}
            onChange={(e) => setExecucao(e.target.value)}
          />
          <input
            className={inputCls}
            placeholder="URL do vídeo curto explicativo (mp4, opcional)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <input
            className={inputCls}
            placeholder="URL da imagem de capa (opcional)"
            value={gifUrl}
            onChange={(e) => setGifUrl(e.target.value)}
          />
          <label className="space-y-1">
            <span className="text-xs tracking-wide text-muted-foreground uppercase">
              Animação padrão (usada se não houver vídeo)
            </span>
            <select
              className={inputCls}
              value={padrao}
              onChange={(e) => setPadrao(e.target.value as DemoPattern)}
            >
              {[
                "supino",
                "remada",
                "puxada",
                "agachamento",
                "levantamento",
                "rosca",
                "triceps",
                "desenvolvimento",
                "elevacao",
                "panturrilha",
                "abdominal",
                "gluteo",
              ].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={salvar}
            className="rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground"
          >
            SALVAR EXERCÍCIO
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-3 py-3 text-base outline-none focus:border-primary";