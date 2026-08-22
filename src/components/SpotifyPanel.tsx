import { useState } from "react";
import { Music, Play, SkipBack, SkipForward, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { abrirPlayerMusica, abrirPlaylist, mediaKey, openSpotify } from "@/lib/feedback";
import { addPlaylist, removePlaylist, useAppData } from "@/lib/store";

export function SpotifyPanel({ compact = false }: { compact?: boolean }) {
  const data = useAppData();
  const [nome, setNome] = useState("");
  const [url, setUrl] = useState("");

  if (!data.settings.spotifyAtivo) return null;

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Music className="size-5 text-accent" />
        <h2 className="flex-1 font-bold uppercase">Spotify</h2>
        <button
          type="button"
          onClick={openSpotify}
          className="rounded-xl bg-accent px-3 py-2 text-sm font-bold text-accent-foreground"
        >
          SPOTIFY
        </button>
        <button
          type="button"
          onClick={() => {
            if (!abrirPlayerMusica())
              toast.info("Abra o player de MP3 pelo aparelho.");
          }}
          className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm font-bold"
        >
          MP3
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Ctrl acao="prev" label="Anterior">
          <SkipBack className="mx-auto size-5" />
        </Ctrl>
        <Ctrl acao="play" label="Tocar / pausar">
          <Play className="mx-auto size-5" />
        </Ctrl>
        <Ctrl acao="next" label="Próxima">
          <SkipForward className="mx-auto size-5" />
        </Ctrl>
      </div>

      <ul className="mt-3 grid gap-2">
        {data.playlists.map((p) => (
          <li key={p.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => abrirPlaylist(p.url)}
              className="flex-1 truncate rounded-xl border border-border px-3 py-3 text-left text-sm font-bold"
            >
              ▶ {p.nome}
            </button>
            <button
              type="button"
              onClick={() => removePlaylist(p.id)}
              className="rounded-xl border border-border p-3"
              aria-label={`Remover ${p.nome}`}
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
      </ul>

      {!compact && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!url.includes("spotify")) {
              toast.error("Cole um link do Spotify (open.spotify.com/...).");
              return;
            }
            addPlaylist(nome || "Playlist", url.trim());
            setNome("");
            setUrl("");
            toast.success("Playlist salva no aparelho.");
          }}
          className="mt-3 grid gap-2"
        >
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da playlist (ex.: Treino pesado)"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Link do Spotify"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-xl bg-secondary py-3 text-sm font-bold">
            SALVAR PLAYLIST
          </button>
          <p className="text-xs text-muted-foreground">
            As playlists ficam salvas no aparelho e abrem direto no app do Spotify, mesmo
            sem internet no JB Training Pro. Os botões acima usam os controles de mídia do
            sistema.
          </p>
        </form>
      )}
    </section>
  );
}

function Ctrl({
  acao,
  label,
  children,
}: {
  acao: "prev" | "play" | "next";
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        if (!mediaKey(acao))
          toast.info("Use os controles do player do sistema ou do fone.");
      }}
      className="rounded-xl bg-secondary py-3 font-bold"
    >
      {children}
    </button>
  );
}
