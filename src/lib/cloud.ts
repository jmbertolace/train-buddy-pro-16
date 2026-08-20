import { supabase } from "@/integrations/supabase/client";
import type { Ficha, WorkoutSession } from "./types";

export type VinculoStatus = "pendente" | "ativo" | "revogado";

export interface Vinculo {
  id: string;
  personal_id: string;
  aluno_id: string | null;
  aluno_email: string;
  apelido: string;
  status: string;
  criado_em: string;
  atualizado_em: string;
}

export interface DadosAluno {
  user_id: string;
  fichas: Ficha[];
  historico: WorkoutSession[];
  enviado_em: string;
  fichas_atualizadas_em: string | null;
  fichas_atualizadas_por: string | null;
}

export async function garantirPerfil(nome: string, email: string) {
  const { data } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (!id) return;
  await supabase.from("profiles").upsert({ id, nome, email });
}

export async function meusPapeis(): Promise<string[]> {
  const { data } = await supabase.from("user_roles").select("role");
  return (data ?? []).map((r) => r.role as string);
}

export async function definirPapel(role: "personal" | "aluno") {
  const { data } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (!id) return;
  await supabase.from("user_roles").insert({ user_id: id, role });
}

/* ---------------- lado do personal ---------------- */

export async function listarAlunos(): Promise<Vinculo[]> {
  const { data, error } = await supabase
    .from("vinculos")
    .select("*")
    .order("criado_em", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Vinculo[];
}

export async function cadastrarAluno(apelido: string, email: string) {
  const { data } = await supabase.auth.getUser();
  const personalId = data.user?.id;
  if (!personalId) throw new Error("Sessão expirada.");
  const { error } = await supabase.from("vinculos").insert({
    personal_id: personalId,
    aluno_email: email.trim().toLowerCase(),
    apelido: apelido.trim() || email.trim(),
  });
  if (error) throw error;
}

export async function removerAluno(id: string) {
  const { error } = await supabase.from("vinculos").delete().eq("id", id);
  if (error) throw error;
}

export async function dadosDoAluno(alunoId: string): Promise<DadosAluno | null> {
  const { data, error } = await supabase
    .from("dados_aluno")
    .select("*")
    .eq("user_id", alunoId)
    .maybeSingle();
  if (error) throw error;
  return (data as DadosAluno | null) ?? null;
}

export async function salvarFichasDoAluno(alunoId: string, fichas: Ficha[]) {
  const { data } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("dados_aluno")
    .update({
      fichas: fichas as unknown as never,
      fichas_atualizadas_em: new Date().toISOString(),
      fichas_atualizadas_por: data.user?.id ?? null,
    })
    .eq("user_id", alunoId);
  if (error) throw error;
}

/* ---------------- lado do aluno ---------------- */

export async function meusVinculos(): Promise<Vinculo[]> {
  const { data, error } = await supabase
    .from("vinculos")
    .select("*")
    .order("criado_em", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Vinculo[];
}

export async function responderVinculo(id: string, status: VinculoStatus) {
  const { data } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("vinculos")
    .update({
      status,
      atualizado_em: new Date().toISOString(),
      ...(status === "ativo" ? { aluno_id: data.user?.id ?? null } : {}),
    })
    .eq("id", id);
  if (error) throw error;
}

export async function enviarDados(fichas: Ficha[], historico: WorkoutSession[]) {
  const { data } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (!id) throw new Error("Sessão expirada.");
  const { error } = await supabase.from("dados_aluno").upsert({
    user_id: id,
    fichas: fichas as unknown as never,
    historico: historico as unknown as never,
    enviado_em: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function apagarDadosEnviados() {
  const { data } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (!id) return;
  const { error } = await supabase.from("dados_aluno").delete().eq("user_id", id);
  if (error) throw error;
}

export async function baixarMeusDados(): Promise<DadosAluno | null> {
  const { data } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (!id) return null;
  const res = await supabase
    .from("dados_aluno")
    .select("*")
    .eq("user_id", id)
    .maybeSingle();
  if (res.error) throw res.error;
  return (res.data as DadosAluno | null) ?? null;
}