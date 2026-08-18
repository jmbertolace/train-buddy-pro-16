import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { GRUPOS, LIBRARY } from "@/lib/library";
import { useAppData } from "@/lib/store";
import type { LibraryExercise } from "@/lib/types";
import { ExerciseInfoModal } from "./ExerciseInfoModal";

export function ExercisePicker({
  onSelect,
  acaoLabel = "ADICIONAR",
}: {
  onSelect: (e: LibraryExercise) => void;
  acaoLabel?: string;
}) {
  const data = useAppData();
  const [busca, setBusca] = useState("");
  const [grupo, setGrupo] = useState<string>("Todos");

  const todos = useMemo(
    () => [...data.personalizados, ...LIBRARY],
    [data.personalizados],
  );

  const filtrados = todos.filter(
    (e) =>
      (grupo === "Todos" || e.grupo === grupo) &&
      e.nome.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-3">
        <Search className="size-5 text-muted-foreground" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar exercício"
          className="w-full bg-transparent text-base outline-none"
        />
      </label>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["Todos", ...GRUPOS].map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGrupo(g)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
              grupo === g
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {g.toUpperCase()}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {filtrados.map((e) => (
          <li
            key={e.id}
            className="rounded-xl border border-border bg-card p-3"
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{e.nome}</p>
                <p className="text-xs text-muted-foreground">
                  {e.grupo} · {e.equipamento}
                  {e.personalizado ? " · personalizado" : ""}
                </p>
              </div>
              <ExerciseInfoModal exercicio={e} compact label="ℹ️" />
              <button
                type="button"
                onClick={() => onSelect(e)}
                className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground"
              >
                {acaoLabel}
              </button>
            </div>
          </li>
        ))}
        {!filtrados.length && (
          <li className="py-6 text-center text-sm text-muted-foreground">
            Nenhum exercício encontrado.
          </li>
        )}
      </ul>
    </div>
  );
}

export function toFichaExercise(
  e: LibraryExercise,
  id: string,
  descansoSeries: number,
  descansoExercicios: number,
) {
  return {
    id,
    libraryId: e.id,
    nome: e.nome,
    grupo: e.grupo,
    series: 3,
    repeticoes: "10",
    carga: 0,
    unidade: "kg" as const,
    porLado: false,
    descansoSeries,
    descansoExercicios,
    info: e.info,
    padrao: e.padrao,
    ...(e.imagem ? { imagem: e.imagem } : {}),
    ...(e.gifUrl ? { gifUrl: e.gifUrl } : {}),
    ...(e.videoUrl ? { videoUrl: e.videoUrl } : {}),
  };
}