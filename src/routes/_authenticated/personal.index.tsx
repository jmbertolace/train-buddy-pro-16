import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Container, EmptyState, PageHeader } from "@/components/app-ui";
import {
  cadastrarAluno,
  listarAlunos,
  removerAluno,
  type Vinculo,
} from "@/lib/cloud";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/personal/")({
  head: () => ({
    meta: [
      { title: "Meus alunos — JB Training Pro" },
      {
        name: "description",
        content:
          "Cadastre alunos, acompanhe o histórico de treinos de cada um e ajuste as fichas.",
      },
      { property: "og:title", content: "Meus alunos — JB Training Pro" },
      {
        property: "og:description",
        content: "Painel do personal trainer com histórico e fichas dos alunos.",
      },
    ],
  }),
  component: PersonalPage,
});

function PersonalPage() {
  const { user } = useAuth();
  const [alunos, setAlunos] = useState<Vinculo[]>([]);
  const [apelido, setApelido] = useState("");
  const [email, setEmail] = useState("");

  const carregar = useCallback(async () => {
    try {
      const v = await listarAlunos();
      setAlunos(v.filter((x) => x.personal_id === user?.id));
    } catch {
      toast.error("Não foi possível carregar seus alunos.");
    }
  }, [user?.id]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  return (
    <main className="min-h-dvh">
      <PageHeader titulo="Meus alunos" voltarPara="/conta" />
      <Container>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await cadastrarAluno(apelido, email);
              setApelido("");
              setEmail("");
              await carregar();
              toast.success("Aluno cadastrado. Ele precisa autorizar no app dele.");
            } catch {
              toast.error("Não foi possível cadastrar esse aluno.");
            }
          }}
          className="mt-4 grid gap-2 rounded-2xl border border-border bg-card p-4"
        >
          <h2 className="font-bold uppercase">Cadastrar aluno</h2>
          <input
            value={apelido}
            onChange={(e) => setApelido(e.target.value)}
            placeholder="Nome do aluno (ex.: Cliente 1)"
            className="rounded-xl border border-border bg-background px-4 py-3"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail da conta do aluno"
            className="rounded-xl border border-border bg-background px-4 py-3"
            required
          />
          <button
            type="submit"
            className="rounded-xl bg-primary py-3 font-black text-primary-foreground"
          >
            ADICIONAR
          </button>
        </form>

        {!alunos.length ? (
          <EmptyState
            titulo="Nenhum aluno cadastrado"
            descricao="Adicione o e-mail do aluno acima. Ele autoriza o acesso pelo próprio app."
          />
        ) : (
          <ul className="mt-4 grid gap-2">
            {alunos.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold uppercase">{a.apelido}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {a.aluno_email} · {a.status}
                  </p>
                </div>
                {a.status === "ativo" && a.aluno_id ? (
                  <Link
                    to="/personal/$alunoId"
                    params={{ alunoId: a.aluno_id }}
                    className="rounded-xl bg-primary px-3 py-2 text-sm font-black text-primary-foreground"
                  >
                    ABRIR
                  </Link>
                ) : (
                  <span className="text-xs text-muted-foreground">aguardando</span>
                )}
                <button
                  type="button"
                  onClick={async () => {
                    if (!window.confirm("Remover este aluno?")) return;
                    await removerAluno(a.id);
                    await carregar();
                  }}
                  className="rounded-xl border border-border px-3 py-2 text-xs"
                >
                  REMOVER
                </button>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </main>
  );
}