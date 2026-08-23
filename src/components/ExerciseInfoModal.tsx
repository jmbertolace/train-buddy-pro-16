import { useState } from "react";
import { Info, Maximize2, Pause, Play, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExerciseDemo } from "./ExerciseDemo";
import type { DemoPattern, ExerciseInfo } from "@/lib/types";

export interface InfoTarget {
  nome: string;
  grupo?: string;
  info?: ExerciseInfo;
  padrao?: DemoPattern;
  imagem?: string;
  videoUrl?: string;
  observacoes?: string;
  equipamento?: string;
}

const fallbackSeguranca = [
  "Execute o movimento de forma controlada e dentro da sua amplitude confortável.",
  "Não aumente a carga por impulso: progressão deve ser avaliada individualmente.",
  "Conteúdo educativo — não substitui a orientação de um profissional de Educação Física.",
];

export function ExerciseInfoModal({
  exercicio,
  children,
  label = "SOBRE O EXERCÍCIO",
  compact = false,
}: {
  exercicio: InfoTarget;
  children?: React.ReactNode;
  label?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [full, setFull] = useState(false);
  const info = exercicio.info;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <button
            type="button"
            className={`inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary font-semibold text-secondary-foreground transition active:scale-[0.98] ${
              compact ? "px-3 py-2 text-sm" : "w-full px-4 py-3 text-base"
            }`}
          >
            <Info className="size-4 shrink-0" />
            {label}
          </button>
        )}
      </DialogTrigger>
      <DialogContent
        className="max-h-[90dvh] max-w-lg overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl leading-tight uppercase">
            {exercicio.nome}
          </DialogTitle>
          {exercicio.grupo && (
            <p className="text-sm text-muted-foreground">
              {exercicio.grupo}
              {exercicio.equipamento ? ` · ${exercicio.equipamento}` : ""}
            </p>
          )}
        </DialogHeader>

        <section className="space-y-2">
          <h3 className="text-xs font-bold tracking-widest text-muted-foreground">
            🎥 VÍDEO EXPLICATIVO DO EXERCÍCIO
          </h3>
          <div className={full ? "fixed inset-0 z-50 bg-background p-4" : ""}>
            {full && (
              <button
                type="button"
                onClick={() => setFull(false)}
                className="absolute top-4 right-4 rounded-lg bg-secondary p-2"
                aria-label="Fechar tela cheia"
              >
                <X className="size-5" />
              </button>
            )}
            <ExerciseDemo
              nome={exercicio.nome}
              padrao={exercicio.padrao}
              imagem={exercicio.imagem}
              videoUrl={exercicio.videoUrl}
              playing={playing}
              className={full ? "h-[70dvh]" : "aspect-[10/7]"}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPlaying((v) => !v)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-semibold"
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
              {playing ? "Pausar" : "Reproduzir"}
            </button>
            <button
              type="button"
              onClick={() => setFull(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-semibold"
            >
              <Maximize2 className="size-4" /> Tela maior
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Os vídeos demonstrativos duram de 5 a 10 segundos. Sem vídeo, o app mostra
            a animação offline do padrão de movimento.
          </p>
        </section>

        <Bloco titulo="PARA QUE SERVE?">
          <p className="text-sm">
            {info?.finalidade ??
              "Exercício personalizado — descrição não informada no cadastro."}
          </p>
        </Bloco>

        {!!info?.musculos?.length && (
          <Bloco titulo="MÚSCULOS TRABALHADOS">
            <ul className="flex flex-wrap gap-2">
              {info.musculos.map((m) => (
                <li
                  key={m}
                  className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                >
                  {m}
                </li>
              ))}
            </ul>
          </Bloco>
        )}

        {!!info?.execucao?.length && (
          <Bloco titulo="COMO EXECUTAR">
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              {info.execucao.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
          </Bloco>
        )}

        {exercicio.observacoes && (
          <Bloco titulo="OBSERVAÇÕES DA FICHA">
            <p className="text-sm">{exercicio.observacoes}</p>
          </Bloco>
        )}

        <Bloco titulo="⚠️ OBSERVAÇÕES DE SEGURANÇA">
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {(info?.seguranca ?? fallbackSeguranca).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Bloco>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground"
        >
          FECHAR
        </button>
      </DialogContent>
    </Dialog>
  );
}

function Bloco({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2 rounded-xl border border-border bg-card p-4">
      <h3 className="text-xs font-bold tracking-widest text-muted-foreground">
        {titulo}
      </h3>
      {children}
    </section>
  );
}