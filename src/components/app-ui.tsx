import { Link } from "@tanstack/react-router";
import { ChevronLeft, Music } from "lucide-react";
import { openSpotify } from "@/lib/feedback";
import { useSettings } from "@/lib/store";

export function PageHeader({
  titulo,
  voltarPara = "/",
  acao,
}: {
  titulo: string;
  voltarPara?: string;
  acao?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
      <Link
        to={voltarPara}
        className="rounded-xl bg-secondary p-2 text-secondary-foreground"
        aria-label="Voltar"
      >
        <ChevronLeft className="size-5" />
      </Link>
      <h1 className="flex-1 truncate text-lg font-bold tracking-tight uppercase">
        {titulo}
      </h1>
      {acao}
    </header>
  );
}

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-28">{children}</div>
  );
}

export function SpotifyButton({ compact = false }: { compact?: boolean }) {
  const s = useSettings();
  if (!s.spotifyAtivo) return null;
  return (
    <button
      type="button"
      onClick={openSpotify}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-accent font-bold text-accent-foreground transition active:scale-[0.98] ${
        compact ? "px-3 py-2 text-sm" : "w-full px-4 py-4 text-base"
      }`}
    >
      <Music className="size-5" /> {compact ? "SPOTIFY" : "🎵 SPOTIFY"}
    </button>
  );
}

export function EmptyState({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-border p-8 text-center">
      <h2 className="text-lg font-bold">{titulo}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{descricao}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function formatDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("pt-BR");
}

export function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}