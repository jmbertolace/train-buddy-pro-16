import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Container, PageHeader } from "@/components/app-ui";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { garantirPerfil } from "@/lib/cloud";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — JB Training Pro" },
      {
        name: "description",
        content:
          "Acesse sua conta para compartilhar treinos com seu personal trainer com segurança.",
      },
      { property: "og:title", content: "Entrar — JB Training Pro" },
      {
        property: "og:description",
        content: "Conta online opcional para sincronizar treinos com o personal.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (user) void navigate({ to: "/conta" });
  }, [user, navigate]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    try {
      if (modo === "criar") {
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
            emailRedirectTo: `${window.location.origin}/conta`,
            data: { nome },
          },
        });
        if (error) throw error;
        await garantirPerfil(nome, email);
        toast.success("Conta criada! Se pedir confirmação, verifique seu e-mail.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível continuar.");
    } finally {
      setCarregando(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Não foi possível entrar com o Google.");
      return;
    }
  }

  return (
    <main className="min-h-dvh">
      <PageHeader titulo="Conta online" />
      <Container>
        <p className="mt-4 text-sm text-muted-foreground">
          O app funciona 100% offline. A conta serve apenas para você autorizar o
          envio das suas fichas e do seu histórico ao seu personal trainer.
        </p>

        <form onSubmit={enviar} className="mt-5 grid gap-3">
          {modo === "criar" && (
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="rounded-xl border border-border bg-card px-4 py-3"
              required
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            autoComplete="email"
            className="rounded-xl border border-border bg-card px-4 py-3"
            required
          />
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            autoComplete={modo === "criar" ? "new-password" : "current-password"}
            minLength={6}
            className="rounded-xl border border-border bg-card px-4 py-3"
            required
          />
          <button
            type="submit"
            disabled={carregando}
            className="rounded-xl bg-primary py-4 font-black text-primary-foreground disabled:opacity-60"
          >
            {modo === "criar" ? "CRIAR CONTA" : "ENTRAR"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => void google()}
          className="mt-3 w-full rounded-xl border border-border bg-card py-4 font-bold"
        >
          Continuar com Google
        </button>

        <button
          type="button"
          onClick={() => setModo(modo === "criar" ? "entrar" : "criar")}
          className="mt-4 w-full text-sm text-muted-foreground underline"
        >
          {modo === "criar"
            ? "Já tenho conta — entrar"
            : "Não tenho conta — criar agora"}
        </button>
      </Container>
    </main>
  );
}