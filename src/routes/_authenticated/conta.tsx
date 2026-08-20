import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Container, PageHeader, formatDate } from "@/components/app-ui";
import { supabase } from "@/integrations/supabase/client";
import {
  apagarDadosEnviados,
  baixarMeusDados,
  definirPapel,
  enviarDados,
  garantirPerfil,
  meusPapeis,
  meusVinculos,
  responderVinculo,
  type Vinculo,
} from "@/lib/cloud";
import { replaceFichas, updateSync, useAppData } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta e personal — JB Training Pro" },
      {
        name: "description",
        content:
          "Autorize seu personal trainer a ver seu histórico e receba fichas atualizadas por ele.",
      },
      { property: "og:title", content: "Minha conta e personal" },
      {
        property: "og:description",
        content: "Controle total sobre quem vê seus treinos.",
      },
    ],
  }),
  component: ContaPage,
});

function ContaPage() {
  const data = useAppData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [papeis, setPapeis] = useState<string[]>([]);
  const [ocupado, setOcupado] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const [v, p] = await Promise.all([meusVinculos(), meusPapeis()]);
      setVinculos(v);
      setPapeis(p);
    } catch {
      toast.error("Não foi possível carregar seus vínculos.");
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  useEffect(() => {
    if (user?.email)
      void garantirPerfil(
        (user.user_metadata?.["nome"] as string) ?? user.email,
        user.email,
      );
  }, [user]);

  const meusConvites = vinculos.filter(
    (v) => v.aluno_email === (user?.email ?? "").toLowerCase(),
  );
  const ativos = meusConvites.filter((v) => v.status === "ativo");

  async function sincronizar() {
    setOcupado(true);
    try {
      await enviarDados(data.fichas, data.historico);
      updateSync({ ultimoEnvioEm: Date.now(), pendente: false, autorizado: true });
      toast.success("Dados enviados ao seu personal.");
    } catch {
      toast.error("Falha ao enviar. Tente novamente com internet.");
    } finally {
      setOcupado(false);
    }
  }

  async function baixarFichas() {
    setOcupado(true);
    try {
      const d = await baixarMeusDados();
      if (!d?.fichas?.length) {
        toast.info("Nenhuma ficha disponível na nuvem.");
        return;
      }
      replaceFichas(d.fichas);
      toast.success("Fichas do personal aplicadas no aparelho.");
    } catch {
      toast.error("Não foi possível baixar as fichas.");
    } finally {
      setOcupado(false);
    }
  }

  return (
    <main className="min-h-dvh">
      <PageHeader titulo="Meu personal trainer" />
      <Container>
        <section className="mt-4 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs tracking-widest text-muted-foreground">CONECTADO COMO</p>
          <p className="font-bold">{user?.email}</p>
          <div className="mt-3 flex gap-2">
            {!papeis.includes("personal") && (
              <button
                type="button"
                onClick={async () => {
                  await definirPapel("personal");
                  await carregar();
                  toast.success("Modo personal ativado.");
                }}
                className="rounded-xl bg-secondary px-3 py-2 text-sm font-bold"
              >
                SOU PERSONAL
              </button>
            )}
            {papeis.includes("personal") && (
              <Link
                to="/personal"
                className="rounded-xl bg-primary px-3 py-2 text-sm font-black text-primary-foreground"
              >
                MEUS ALUNOS
              </Link>
            )}
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                void navigate({ to: "/" });
              }}
              className="rounded-xl border border-border px-3 py-2 text-sm font-bold"
            >
              SAIR
            </button>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-border bg-card p-4">
          <h2 className="font-bold uppercase">Convites do personal</h2>
          {!meusConvites.length && (
            <p className="mt-2 text-sm text-muted-foreground">
              Nenhum personal cadastrou seu e-mail ainda. Peça para ele adicionar{" "}
              <strong>{user?.email}</strong>.
            </p>
          )}
          <ul className="mt-3 grid gap-2">
            {meusConvites.map((v) => (
              <li
                key={v.id}
                className="rounded-xl border border-border p-3 text-sm"
              >
                <p className="font-bold">Cadastrado como: {v.apelido}</p>
                <p className="text-muted-foreground">Status: {v.status}</p>
                <div className="mt-2 flex gap-2">
                  {v.status !== "ativo" && (
                    <button
                      type="button"
                      onClick={async () => {
                        await responderVinculo(v.id, "ativo");
                        updateSync({ autorizado: true });
                        await carregar();
                        toast.success("Acesso autorizado.");
                      }}
                      className="rounded-lg bg-primary px-3 py-2 font-bold text-primary-foreground"
                    >
                      AUTORIZAR
                    </button>
                  )}
                  {v.status === "ativo" && (
                    <button
                      type="button"
                      onClick={async () => {
                        await responderVinculo(v.id, "revogado");
                        await carregar();
                        toast.success("Acesso revogado.");
                      }}
                      className="rounded-lg bg-secondary px-3 py-2 font-bold"
                    >
                      REVOGAR ACESSO
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-4 rounded-2xl border border-border bg-card p-4">
          <h2 className="font-bold uppercase">Compartilhar meus treinos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Nada sai do aparelho sem você tocar em enviar.
          </p>
          <p className="mt-2 text-sm">
            Último envio:{" "}
            {data.sync.ultimoEnvioEm ? formatDate(data.sync.ultimoEnvioEm) : "nunca"}
          </p>
          <div className="mt-3 grid gap-2">
            <button
              type="button"
              disabled={ocupado || !ativos.length}
              onClick={() => void sincronizar()}
              className="rounded-xl bg-primary py-4 font-black text-primary-foreground disabled:opacity-50"
            >
              ENVIAR FICHAS E HISTÓRICO
            </button>
            <button
              type="button"
              disabled={ocupado}
              onClick={() => void baixarFichas()}
              className="rounded-xl bg-secondary py-3 font-bold disabled:opacity-50"
            >
              BAIXAR FICHAS DO PERSONAL
            </button>
            <button
              type="button"
              disabled={ocupado}
              onClick={async () => {
                if (!window.confirm("Apagar todos os dados enviados à nuvem?")) return;
                await apagarDadosEnviados();
                updateSync({ ultimoEnvioEm: null });
                toast.success("Dados removidos da nuvem.");
              }}
              className="rounded-xl border border-border py-3 text-sm font-semibold text-muted-foreground"
            >
              APAGAR MEUS DADOS DA NUVEM
            </button>
          </div>
          {!ativos.length && (
            <p className="mt-2 text-xs text-muted-foreground">
              Autorize um personal acima para liberar o envio.
            </p>
          )}
        </section>
      </Container>
    </main>
  );
}