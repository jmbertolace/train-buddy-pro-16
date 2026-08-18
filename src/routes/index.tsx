import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  Dumbbell,
  History,
  ListChecks,
  Settings as SettingsIcon,
  UserRoundCog,
  Zap,
} from "lucide-react";
import { Container, SpotifyButton, formatDate, formatDuration } from "@/components/app-ui";
import { useAppData } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JB Training Pro — Assistente de treino de academia" },
      {
        name: "description",
        content:
          "Monte fichas, siga séries com cronômetro e voz, registre cargas e acompanhe sua evolução. Funciona offline.",
      },
      { property: "og:title", content: "JB Training Pro" },
      {
        property: "og:description",
        content: "Seu assistente digital de treino: fichas, cronômetro, voz e progresso.",
      },
    ],
  }),
  component: Index,
});

const menu = [
  { to: "/treino", label: "INICIAR TREINO", icon: Dumbbell, emoji: "🏋️", destaque: true },
  { to: "/fichas", label: "MINHAS FICHAS", icon: ListChecks, emoji: "📋" },
  { to: "/progresso", label: "MEU PROGRESSO", icon: BarChart3, emoji: "📊" },
  { to: "/historico", label: "HISTÓRICO", icon: History, emoji: "🕘" },
  { to: "/biblioteca", label: "BIBLIOTECA", icon: Zap, emoji: "📚" },
  { to: "/configuracoes", label: "CONFIGURAÇÕES", icon: SettingsIcon, emoji: "⚙️" },
] as const;

function Index() {
  const data = useAppData();
  const ultimoTreino = data.historico[0];
  const ultimaFicha =
    data.fichas.find((f) => f.id === data.ultimaFichaId) ?? data.fichas[0];

  return (
    <main className="min-h-dvh">
      <Container>
        <header className="pt-10 pb-6 text-center">
          <p className="text-xs font-bold tracking-[0.35em] text-primary">JB</p>
          <h1 className="text-3xl font-black tracking-tight">TRAINING PRO</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Seu assistente digital de treino
          </p>
        </header>

        {data.sessaoAtiva && (
          <Link
            to="/treino"
            className="mb-4 block rounded-2xl border border-primary bg-primary/10 p-4"
          >
            <p className="text-xs font-bold tracking-widest text-primary">
              TREINO EM ANDAMENTO
            </p>
            <p className="mt-1 text-lg font-bold">{data.sessaoAtiva.fichaNome}</p>
            <p className="text-sm text-muted-foreground">
              Toque para continuar exatamente de onde parou
            </p>
          </Link>
        )}

        <section className="mb-5 grid gap-3 rounded-2xl border border-border bg-card p-4">
          <Info titulo="Última ficha utilizada" valor={ultimaFicha?.nome ?? "—"} />
          <Info titulo="Último treino realizado" valor={ultimoTreino?.fichaNome ?? "—"} />
          <Info
            titulo="Data do último treino"
            valor={ultimoTreino ? formatDate(ultimoTreino.inicioEm) : "—"}
          />
          <Info
            titulo="Duração do último treino"
            valor={ultimoTreino ? formatDuration(ultimoTreino.duracaoMs) : "—"}
          />
          <Info titulo="Personal Trainer" valor="Não conectado" />
        </section>

        <nav className="grid gap-3">
          {menu.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-4 rounded-2xl px-5 py-5 text-left font-bold transition active:scale-[0.99] ${
                item.destaque
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-card-foreground"
              }`}
            >
              <item.icon className="size-6 shrink-0" />
              <span className="flex-1 text-lg tracking-wide">{item.label}</span>
              <span aria-hidden>{item.emoji}</span>
            </Link>
          ))}
          <Link
            to="/rapido"
            className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-5 font-bold"
          >
            <Zap className="size-6 shrink-0" />
            <span className="flex-1 text-lg tracking-wide">TREINO RÁPIDO</span>
            <span aria-hidden>⚡</span>
          </Link>
          <div className="flex items-center gap-4 rounded-2xl border border-dashed border-border px-5 py-5 text-muted-foreground">
            <UserRoundCog className="size-6 shrink-0" />
            <span className="flex-1 text-sm">
              👨‍🏫 MEU PERSONAL TRAINER — em breve (requer conta online)
            </span>
          </div>
          <SpotifyButton />
        </nav>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Dados salvos no próprio aparelho. Funciona sem internet. Conteúdo educativo,
          não substitui a orientação de um profissional de Educação Física.
        </p>
      </Container>
    </main>
  );
}

function Info({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs tracking-wide text-muted-foreground uppercase">
        {titulo}
      </span>
      <span className="truncate text-sm font-semibold">{valor}</span>
    </div>
  );
}
