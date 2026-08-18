import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { Container, EmptyState, PageHeader } from "@/components/app-ui";
import { createFicha, deleteFicha, duplicateFicha, useAppData } from "@/lib/store";
import { estimarMinutos, totalSeries } from "@/lib/session";

export const Route = createFileRoute("/fichas")({
  head: () => ({
    meta: [
      { title: "Minhas fichas — JB Training Pro" },
      {
        name: "description",
        content: "Crie, edite, duplique e organize suas fichas de treino de academia.",
      },
      { property: "og:title", content: "Minhas fichas — JB Training Pro" },
      {
        property: "og:description",
        content: "Gerencie suas fichas de treino com exercícios, séries, cargas e descansos.",
      },
    ],
  }),
  component: FichasPage,
});

function FichasPage() {
  const data = useAppData();
  const navigate = useNavigate();

  function nova() {
    const nome = window.prompt("Nome da ficha", "TREINO A – PEITO/TRÍCEPS");
    if (!nome) return;
    const f = createFicha(nome);
    void navigate({ to: "/fichas/$fichaId", params: { fichaId: f.id } });
  }

  return (
    <main className="min-h-dvh">
      <PageHeader titulo="Minhas fichas" />
      <Container>
        <button
          type="button"
          onClick={nova}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 font-bold text-primary-foreground"
        >
          <Plus className="size-5" /> NOVA FICHA
        </button>

        {!data.fichas.length ? (
          <EmptyState
            titulo="Nenhuma ficha cadastrada"
            descricao="Crie sua primeira ficha (ex.: TREINO A – PEITO/TRÍCEPS) e adicione exercícios da biblioteca."
          />
        ) : (
          <ul className="mt-4 space-y-3">
            {data.fichas.map((f) => (
              <li key={f.id} className="rounded-2xl border border-border bg-card p-4">
                <Link
                  to="/fichas/$fichaId"
                  params={{ fichaId: f.id }}
                  className="block"
                >
                  <p className="text-lg font-bold">{f.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {f.exercicios.length} exercícios · {totalSeries(f.exercicios)} séries ·
                    ~{estimarMinutos(f.exercicios)} min
                  </p>
                </Link>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to="/treino"
                    search={{ ficha: f.id }}
                    className="flex-1 rounded-xl bg-primary px-3 py-3 text-center text-sm font-bold text-primary-foreground"
                  >
                    ▶ INICIAR
                  </Link>
                  <Link
                    to="/fichas/$fichaId"
                    params={{ fichaId: f.id }}
                    className="rounded-xl bg-secondary px-3 py-3 text-sm font-semibold"
                    aria-label="Editar ficha"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => duplicateFicha(f.id)}
                    className="rounded-xl bg-secondary px-3 py-3 text-sm font-semibold"
                    aria-label="Duplicar ficha"
                  >
                    <Copy className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Excluir "${f.nome}"?`)) deleteFicha(f.id);
                    }}
                    className="rounded-xl bg-secondary px-3 py-3 text-sm font-semibold text-destructive"
                    aria-label="Excluir ficha"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </main>
  );
}