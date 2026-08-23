import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { baixarMeusDados, dadosDoAluno, meusVinculos } from "./cloud";
import { getState, pushNotificacao, updateSync } from "./store";
import type { Notificacao } from "./types";

function avisarSistema(titulo: string, mensagem: string) {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification(titulo, { body: mensagem, icon: "/favicon.ico" });
    }
  } catch {
    /* navegador sem suporte */
  }
}

export async function pedirPermissaoNotificacao() {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const r = await Notification.requestPermission();
  return r === "granted";
}

function notificar(n: Omit<Notificacao, "id" | "em" | "lida">) {
  pushNotificacao(n);
  toast.info(n.titulo, { description: n.mensagem });
  avisarSistema(n.titulo, n.mensagem);
}

/** Verifica na nuvem se houve novidades do personal ou dos alunos. */
export async function verificarNovidades(userId: string, email: string) {
  /* --- lado do aluno: ficha atualizada pelo personal --- */
  try {
    const meus = await baixarMeusDados();
    const atualizadaEm = meus?.fichas_atualizadas_em ?? null;
    if (atualizadaEm) {
      const visto = getState().sync.fichaVistaEm;
      if (!visto) {
        updateSync({ fichaVistaEm: atualizadaEm });
      } else if (new Date(atualizadaEm) > new Date(visto)) {
        updateSync({ fichaVistaEm: atualizadaEm });
        notificar({
          tipo: "ficha",
          titulo: "Nova ficha do seu personal",
          mensagem:
            "Seu personal enviou uma versão atualizada da sua ficha. Abra Minha conta e toque em BAIXAR FICHAS DO PERSONAL.",
        });
      }
    }
  } catch {
    /* offline */
  }

  /* --- vínculos: convites e mudanças de autorização --- */
  try {
    const vinculos = await meusVinculos();
    const meuEmail = email.toLowerCase();
    const comoAluno = vinculos.filter((v) => v.aluno_email === meuEmail);
    const ultima = vinculos.reduce<string | null>(
      (max, v) => (!max || v.atualizado_em > max ? v.atualizado_em : max),
      null,
    );
    const visto = getState().sync.vinculoVistoEm;
    if (ultima) {
      if (!visto) {
        updateSync({ vinculoVistoEm: ultima });
      } else if (new Date(ultima) > new Date(visto)) {
        updateSync({ vinculoVistoEm: ultima });
        const novos = vinculos.filter(
          (v) => new Date(v.atualizado_em) > new Date(visto),
        );
        for (const v of novos) {
          const souAluno = v.aluno_email === meuEmail;
          if (souAluno && v.status === "pendente") {
            notificar({
              tipo: "vinculo",
              titulo: "Convite de personal trainer",
              mensagem: `${v.apelido || "Um personal"} pediu acesso aos seus treinos. Autorize em Minha conta.`,
            });
          } else if (!souAluno) {
            notificar({
              tipo: "vinculo",
              titulo: "Autorização atualizada",
              mensagem: `${v.apelido}: acesso agora está ${v.status}.`,
            });
          } else if (souAluno && v.status === "revogado") {
            notificar({
              tipo: "vinculo",
              titulo: "Acesso revogado",
              mensagem: `O acesso de ${v.apelido} aos seus dados foi encerrado.`,
            });
          }
        }
      }
    }

    /* --- lado do personal: aluno enviou dados novos --- */
    const meusAlunos = vinculos.filter(
      (v) => v.personal_id === userId && v.status === "ativo" && v.aluno_id,
    );
    for (const v of meusAlunos) {
      try {
        const d = await dadosDoAluno(v.aluno_id as string);
        if (!d?.enviado_em) continue;
        const mapa = getState().sync.envioAlunoVisto ?? {};
        const anterior = mapa[v.aluno_id as string];
        if (!anterior) {
          updateSync({
            envioAlunoVisto: { ...mapa, [v.aluno_id as string]: d.enviado_em },
          });
        } else if (new Date(d.enviado_em) > new Date(anterior)) {
          updateSync({
            envioAlunoVisto: { ...mapa, [v.aluno_id as string]: d.enviado_em },
          });
          notificar({
            tipo: "dados",
            titulo: "Novos dados de aluno",
            mensagem: `${v.apelido} enviou fichas e histórico atualizados.`,
          });
        }
      } catch {
        /* sem permissão ou offline */
      }
    }
    void comoAluno;
  } catch {
    /* offline */
  }
}

/** Fica de olho em novidades enquanto o app estiver aberto e logado. */
export function useNotificacoesWatcher() {
  const { user } = useAuth();
  const rodando = useRef(false);

  const checar = useCallback(async () => {
    if (!user?.id || rodando.current) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    rodando.current = true;
    try {
      await verificarNovidades(user.id, user.email ?? "");
    } finally {
      rodando.current = false;
    }
  }, [user?.id, user?.email]);

  useEffect(() => {
    if (!user?.id) return;
    void checar();

    const canal = supabase
      .channel("jb-notificacoes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dados_aluno" },
        () => void checar(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vinculos" },
        () => void checar(),
      )
      .subscribe();

    const intervalo = window.setInterval(() => void checar(), 60_000);
    const aoFocar = () => void checar();
    window.addEventListener("focus", aoFocar);

    return () => {
      supabase.removeChannel(canal);
      window.clearInterval(intervalo);
      window.removeEventListener("focus", aoFocar);
    };
  }, [user?.id, checar]);
}
