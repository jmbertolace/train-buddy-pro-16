import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Container, EmptyState, PageHeader, formatDate } from "@/components/app-ui";
import { allExerciseNames, exerciseHistory, useAppData } from "@/lib/store";

export const Route = createFileRoute("/progresso")({
  head: () => ({
    meta: [
      { title: "Meu progresso — JB Training Pro" },
      {
        name: "description",
        content:
          "Acompanhe a evolução da carga por exercício com tabela e gráfico do seu histórico registrado.",
      },
      { property: "og:title", content: "Meu progresso — JB Training Pro" },
      {
        property: "og:description",
        content: "Maior carga, última carga e evolução ao longo do tempo.",
      },
    ],
  }),
  component: ProgressoPage,
});

function ProgressoPage() {
  const data = useAppData();
  const nomes = allExerciseNames(data);
  const [sel, setSel] = useState<string>(nomes[0] ?? "");
  const nome = nomes.includes(sel) ? sel : (nomes[0] ?? "");
  const linhas = nome ? exerciseHistory(data, nome) : [];
  const maior = linhas.reduce((m, l) => Math.max(m, l.carga), 0);
  const ultima = linhas.at(-1);

  return (
    <main className="min-h-dvh">
      <PageHeader titulo="Meu progresso" />
      <Container>
        {!nomes.length ? (
          <EmptyState
            titulo="Ainda sem dados"
            descricao="Conclua treinos registrando as cargas para ver sua evolução aqui."
          />
        ) : (
          <>
            <select
              value={nome}
              onChange={(e) => setSel(e.target.value)}
              className="mt-4 w-full rounded-xl border border-border bg-card px-3 py-3 text-base"
            >
              {nomes.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Card titulo="Maior carga" valor={`${maior} kg`} />
              <Card titulo="Última carga" valor={ultima ? `${ultima.carga} kg` : "—"} />
              <Card titulo="Treinos realizados" valor={String(data.historico.length)} />
              <Card
                titulo="Melhor desempenho"
                valor={
                  linhas.length
                    ? `${maior} kg × ${
                        linhas.find((l) => l.carga === maior)?.repeticoes ?? ""
                      }`
                    : "—"
                }
              />
            </div>

            <section className="mt-4 rounded-2xl border border-border bg-card p-3">
              <h2 className="mb-2 text-xs font-bold tracking-widest text-muted-foreground">
                EVOLUÇÃO DA CARGA
              </h2>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={linhas.map((l) => ({
                      data: formatDate(l.data),
                      carga: l.carga,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="data" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="carga"
                      stroke="var(--color-primary)"
                      strokeWidth={3}
                      dot
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="mt-4 overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-left">
                  <tr>
                    <th className="px-3 py-2">Data</th>
                    <th className="px-3 py-2">Carga</th>
                    <th className="px-3 py-2">Repetições</th>
                  </tr>
                </thead>
                <tbody>
                  {[...linhas].reverse().map((l) => (
                    <tr key={l.data} className="border-t border-border">
                      <td className="px-3 py-2">{formatDate(l.data)}</td>
                      <td className="px-3 py-2">{l.carga} kg</td>
                      <td className="px-3 py-2">{l.repeticoes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <p className="mt-4 text-xs text-muted-foreground">
              Estes dados representam apenas o histórico registrado por você e não
              constituem recomendação profissional de treino.
            </p>
          </>
        )}
      </Container>
    </main>
  );
}

function Card({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
        {titulo}
      </p>
      <p className="text-xl font-black">{valor}</p>
    </div>
  );
}