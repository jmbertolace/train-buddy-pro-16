ALTER TABLE public.dados_aluno REPLICA IDENTITY FULL;
ALTER TABLE public.vinculos REPLICA IDENTITY FULL;
DO $$ BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.dados_aluno; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.vinculos; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;