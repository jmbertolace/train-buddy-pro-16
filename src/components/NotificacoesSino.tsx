import { useState } from "react";
import { Bell } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatDate } from "@/components/app-ui";
import { limparNotificacoes, marcarNotificacoesLidas, useNotificacoes } from "@/lib/store";
import { pedirPermissaoNotificacao } from "@/lib/notificacoes";

export function NotificacoesSino() {
  const notificacoes = useNotificacoes();
  const [aberto, setAberto] = useState(false);
  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notificações"
        onClick={() => {
          setAberto((a) => !a);
          if (!aberto) {
            void pedirPermissaoNotificacao();
            marcarNotificacoesLidas();
          }
        }}
        className="relative rounded-xl border border-border bg-card p-3"
      >
        <Bell className="size-5" />
        {naoLidas > 0 && (
          <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[11px] font-black text-primary-foreground">
            {naoLidas > 9 ? "9+" : naoLidas}
          </span>
        )}
      </button>

      {aberto && (
        <div className="absolute right-0 z-30 mt-2 w-80 max-w-[85vw] rounded-2xl border border-border bg-card p-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase">Notificações</h2>
            {notificacoes.length > 0 && (
              <button
                type="button"
                onClick={limparNotificacoes}
                className="text-xs font-semibold text-muted-foreground"
              >
                LIMPAR
              </button>
            )}
          </div>
          {!notificacoes.length && (
            <p className="mt-2 text-sm text-muted-foreground">
              Nenhum aviso ainda. Você será avisado quando seu personal enviar
              uma ficha nova ou alterar os dados autorizados.
            </p>
          )}
          <ul className="mt-2 grid max-h-80 gap-2 overflow-auto">
            {notificacoes.map((n) => (
              <li key={n.id} className="rounded-xl border border-border p-3">
                <p className="text-sm font-bold">{n.titulo}</p>
                <p className="text-xs text-muted-foreground">{n.mensagem}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {formatDate(n.em)}
                </p>
                {n.tipo !== "dados" && (
                  <Link
                    to="/conta"
                    onClick={() => setAberto(false)}
                    className="mt-2 inline-block rounded-lg bg-primary px-3 py-1.5 text-xs font-black text-primary-foreground"
                  >
                    ABRIR MINHA CONTA
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
