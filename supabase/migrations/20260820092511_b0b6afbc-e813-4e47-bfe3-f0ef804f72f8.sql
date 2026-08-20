-- ROLES
CREATE TYPE public.app_role AS ENUM ('personal', 'aluno');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  criado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own roles select" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own roles insert" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own roles delete" ON public.user_roles FOR DELETE TO authenticated USING (user_id = auth.uid());

-- VINCULOS
CREATE TABLE public.vinculos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  personal_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  aluno_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  aluno_email text NOT NULL,
  apelido text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pendente',
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX vinculos_personal_email_idx ON public.vinculos (personal_id, lower(aluno_email));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vinculos TO authenticated;
GRANT ALL ON public.vinculos TO service_role;
ALTER TABLE public.vinculos ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.autorizado(_personal_id uuid, _aluno_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.vinculos
    WHERE personal_id = _personal_id AND aluno_id = _aluno_id AND status = 'ativo'
  )
$$;

CREATE POLICY "personal ve seus vinculos" ON public.vinculos FOR SELECT TO authenticated
  USING (personal_id = auth.uid());
CREATE POLICY "aluno ve convites" ON public.vinculos FOR SELECT TO authenticated
  USING (aluno_id = auth.uid() OR lower(aluno_email) = lower(coalesce(auth.jwt() ->> 'email', '')));
CREATE POLICY "personal cria vinculo" ON public.vinculos FOR INSERT TO authenticated
  WITH CHECK (personal_id = auth.uid() AND public.has_role(auth.uid(), 'personal'));
CREATE POLICY "personal edita vinculo" ON public.vinculos FOR UPDATE TO authenticated
  USING (personal_id = auth.uid()) WITH CHECK (personal_id = auth.uid());
CREATE POLICY "aluno responde convite" ON public.vinculos FOR UPDATE TO authenticated
  USING (aluno_id = auth.uid() OR lower(aluno_email) = lower(coalesce(auth.jwt() ->> 'email', '')))
  WITH CHECK (aluno_id = auth.uid() OR lower(aluno_email) = lower(coalesce(auth.jwt() ->> 'email', '')));
CREATE POLICY "personal remove vinculo" ON public.vinculos FOR DELETE TO authenticated
  USING (personal_id = auth.uid());

-- PROFILES policies (depois de autorizado())
CREATE POLICY "perfil proprio select" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());
CREATE POLICY "perfil de aluno autorizado" ON public.profiles FOR SELECT TO authenticated
  USING (public.autorizado(auth.uid(), id));
CREATE POLICY "perfil proprio insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
CREATE POLICY "perfil proprio update" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- DADOS DO ALUNO
CREATE TABLE public.dados_aluno (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  fichas jsonb NOT NULL DEFAULT '[]'::jsonb,
  historico jsonb NOT NULL DEFAULT '[]'::jsonb,
  enviado_em timestamptz NOT NULL DEFAULT now(),
  fichas_atualizadas_em timestamptz,
  fichas_atualizadas_por uuid
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dados_aluno TO authenticated;
GRANT ALL ON public.dados_aluno TO service_role;
ALTER TABLE public.dados_aluno ENABLE ROW LEVEL SECURITY;

CREATE POLICY "aluno gerencia seus dados" ON public.dados_aluno FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "personal le dados autorizados" ON public.dados_aluno FOR SELECT TO authenticated
  USING (public.autorizado(auth.uid(), user_id));
CREATE POLICY "personal edita fichas autorizadas" ON public.dados_aluno FOR UPDATE TO authenticated
  USING (public.autorizado(auth.uid(), user_id)) WITH CHECK (public.autorizado(auth.uid(), user_id));