import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHeader } from "@/components/app-ui";
import { SpotifyPanel } from "@/components/SpotifyPanel";

import { Switch } from "@/components/ui/switch";
import { beep, speak, vibrate } from "@/lib/feedback";
import { updateSettings, useSettings } from "@/lib/store";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — JB Training Pro" },
      {
        name: "description",
        content:
          "Ajuste voz, vibração, cronômetro, tema, preferências de treino e o atalho do Spotify.",
      },
      { property: "og:title", content: "Configurações — JB Training Pro" },
      {
        property: "og:description",
        content: "Personalize áudio, vibração, descansos e aparência do app.",
      },
    ],
  }),
  component: ConfigPage,
});

function ConfigPage() {
  const s = useSettings();

  return (
    <main className="min-h-dvh">
      <PageHeader titulo="Configurações" />
      <Container>
        <Secao titulo="ÁUDIO">
          <Toggle
            label="Voz ligada"
            checked={s.vozAtiva}
            onChange={(v) => updateSettings({ vozAtiva: v })}
          />
          <label className="block space-y-2 py-2">
            <span className="text-sm">Volume da voz ({Math.round(s.vozVolume * 100)}%)</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={s.vozVolume}
              onChange={(e) => updateSettings({ vozVolume: Number(e.target.value) })}
              className="w-full"
            />
          </label>
          <Toggle
            label="Avisos durante o descanso"
            checked={s.avisosDescanso}
            onChange={(v) => updateSettings({ avisosDescanso: v })}
          />
          <Toggle
            label="Aviso de início de série"
            checked={s.avisoInicioSerie}
            onChange={(v) => updateSettings({ avisoInicioSerie: v })}
          />
          <button
            type="button"
            onClick={() => speak("Supino reto. Série 2 de 4. Dez repetições.", true)}
            className="mt-2 w-full rounded-xl bg-secondary py-3 text-sm font-semibold"
          >
            TESTAR VOZ
          </button>
        </Secao>

        <Secao titulo="VIBRAÇÃO">
          <Toggle
            label="Vibração ligada"
            checked={s.vibracao}
            onChange={(v) => updateSettings({ vibracao: v })}
          />
          <button
            type="button"
            onClick={() => vibrate([120, 80, 120])}
            className="mt-2 w-full rounded-xl bg-secondary py-3 text-sm font-semibold"
          >
            TESTAR VIBRAÇÃO
          </button>
        </Secao>

        <Secao titulo="CRONÔMETRO">
          <Toggle
            label="Som ao terminar"
            checked={s.somFinalCronometro}
            onChange={(v) => updateSettings({ somFinalCronometro: v })}
          />
          <Toggle
            label="Contagem regressiva falada (5 a 1)"
            checked={s.contagemRegressiva}
            onChange={(v) => updateSettings({ contagemRegressiva: v })}
          />
          <Numero
            label="Descanso padrão entre séries (s)"
            value={s.descansoPadrao}
            onChange={(v) => updateSettings({ descansoPadrao: v })}
          />
          <Numero
            label="Descanso padrão entre exercícios (s)"
            value={s.descansoExerciciosPadrao}
            onChange={(v) => updateSettings({ descansoExerciciosPadrao: v })}
          />
          <button
            type="button"
            onClick={() => beep(880, 0.2, 2)}
            className="mt-2 w-full rounded-xl bg-secondary py-3 text-sm font-semibold"
          >
            TESTAR SOM
          </button>
        </Secao>

        <Secao titulo="APARÊNCIA">
          <div className="flex gap-2">
            {(["escuro", "claro"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => updateSettings({ tema: t })}
                className={`flex-1 rounded-xl py-3 font-bold ${
                  s.tema === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                TEMA {t.toUpperCase()}
              </button>
            ))}
          </div>
        </Secao>

        <Secao titulo="TREINO">
          <Toggle
            label="Mostrar carga anterior"
            checked={s.mostrarCargaAnterior}
            onChange={(v) => updateSettings({ mostrarCargaAnterior: v })}
          />
          <Toggle
            label="Mostrar histórico"
            checked={s.mostrarHistorico}
            onChange={(v) => updateSettings({ mostrarHistorico: v })}
          />
          <Toggle
            label="Confirmar antes de pular"
            checked={s.confirmarPular}
            onChange={(v) => updateSettings({ confirmarPular: v })}
          />
        </Secao>

        <Secao titulo="MÚSICA">
          <Toggle
            label="Botão Spotify ativado"
            checked={s.spotifyAtivo}
            onChange={(v) => updateSettings({ spotifyAtivo: v })}
          />
          <Toggle
            label="Mostrar botão durante o treino"
            checked={s.spotifyNoTreino}
            onChange={(v) => updateSettings({ spotifyNoTreino: v })}
          />
          <Toggle
            label="Abrir Spotify ao iniciar treino"
            checked={s.spotifyAutoAbrir}
            onChange={(v) => updateSettings({ spotifyAutoAbrir: v })}
          />
          <Toggle
            label="Abaixar a música nos alertas de descanso"
            checked={s.abaixarMusicaAlerta}
            onChange={(v) => updateSettings({ abaixarMusicaAlerta: v })}
          />
          <Toggle
            label="Comando de voz no treino (diga “concluído”)"
            checked={s.comandoVozAtivo}
            onChange={(v) => updateSettings({ comandoVozAtivo: v })}
          />
          <p className="pt-2 text-xs text-muted-foreground">
            O app abre o Spotify ou o player de MP3 do aparelho — nenhuma música é
            armazenada aqui. Nos avisos, o app assume o áudio do sistema para que a
            música baixe de volume automaticamente.
          </p>

        </Secao>

        <div className="mt-4">
          <SpotifyPanel />
        </div>


        <p className="mt-6 text-xs text-muted-foreground">
          Todos os dados ficam salvos apenas neste aparelho e continuam disponíveis sem
          internet.
        </p>
      </Container>
    </main>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-4 rounded-2xl border border-border bg-card p-4">
      <h2 className="mb-2 text-xs font-bold tracking-widest text-muted-foreground">
        {titulo}
      </h2>
      <div className="divide-y divide-border">{children}</div>
    </section>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Numero({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 rounded-xl border border-border bg-background px-3 py-2 text-right"
      />
    </label>
  );
}