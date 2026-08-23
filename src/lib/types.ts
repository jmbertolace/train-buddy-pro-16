export type LoadUnit = "kg" | "lb" | "placas" | "peso do corpo";

export interface ExerciseInfo {
  finalidade: string;
  musculos: string[];
  execucao: string[];
  seguranca: string[];
}

export interface LibraryExercise {
  id: string;
  nome: string;
  grupo: string;
  equipamento: string;
  descricao: string;
  info: ExerciseInfo;
  /** movimento usado pela animação demonstrativa offline */
  padrao: DemoPattern;
  imagem?: string;
  videoUrl?: string;
  personalizado?: boolean;
}

export type DemoPattern =
  | "supino"
  | "remada"
  | "puxada"
  | "agachamento"
  | "levantamento"
  | "rosca"
  | "triceps"
  | "desenvolvimento"
  | "elevacao"
  | "panturrilha"
  | "abdominal"
  | "gluteo";

export interface FichaExercise {
  id: string;
  libraryId?: string;
  nome: string;
  grupo: string;
  series: number;
  repeticoes: string;
  carga: number;
  unidade: LoadUnit;
  porLado: boolean;
  descansoSeries: number;
  descansoExercicios: number;
  observacoes?: string;
  imagem?: string;
  videoUrl?: string;
  info?: ExerciseInfo;
  padrao?: DemoPattern;
}

export interface Ficha {
  id: string;
  nome: string;
  exercicios: FichaExercise[];
  criadaEm: number;
  atualizadaEm: number;
}

export interface SetLog {
  exercicioId: string;
  exercicioNome: string;
  serie: number;
  repeticoes: string;
  carga: number;
  unidade: LoadUnit;
  porLado: boolean;
  concluida: boolean;
  pulada?: boolean;
  emMs: number;
}

export interface WorkoutSession {
  id: string;
  fichaId: string | null;
  fichaNome: string;
  exercicios: FichaExercise[];
  inicioEm: number;
  fimEm?: number;
  duracaoMs: number;
  /** ms acumulados antes da última retomada */
  acumuladoMs: number;
  retomadoEm: number | null;
  indiceExercicio: number;
  serieAtual: number;
  cargaAtual: number;
  logs: SetLog[];
  descanso: RestState | null;
  pausado: boolean;
  observacoes?: string;
  concluido: boolean;
}

export interface RestState {
  tipo: "serie" | "exercicio";
  totalSeg: number;
  terminaEm: number;
  restanteMs: number;
  pausado: boolean;
}

export interface Settings {
  vozAtiva: boolean;
  vozVolume: number;
  avisosDescanso: boolean;
  avisoInicioSerie: boolean;
  vibracao: boolean;
  somFinalCronometro: boolean;
  descansoPadrao: number;
  descansoExerciciosPadrao: number;
  contagemRegressiva: boolean;
  tema: "escuro" | "claro";
  mostrarCargaAnterior: boolean;
  mostrarHistorico: boolean;
  confirmarPular: boolean;
  spotifyAtivo: boolean;
  spotifyNoTreino: boolean;
  spotifyAutoAbrir: boolean;
  abaixarMusicaAlerta: boolean;
  comandoVozAtivo: boolean;
}

export interface Notificacao {
  id: string;
  tipo: "ficha" | "vinculo" | "dados";
  titulo: string;
  mensagem: string;
  em: number;
  lida: boolean;
}

export interface AppData {
  fichas: Ficha[];
  personalizados: LibraryExercise[];
  historico: WorkoutSession[];
  sessaoAtiva: WorkoutSession | null;
  settings: Settings;
  ultimaFichaId: string | null;
  playlists: SpotifyPlaylist[];
  sync: SyncState;
  notificacoes: Notificacao[];
}

export interface SpotifyPlaylist {
  id: string;
  nome: string;
  url: string;
}

export interface SyncState {
  /** o usuário autorizou o envio de dados ao personal */
  autorizado: boolean;
  enviarAutomatico: boolean;
  ultimoEnvioEm: number | null;
  pendente: boolean;
  /** ISO da última atualização de ficha feita pelo personal já vista */
  fichaVistaEm: string | null;
  /** ISO da última mudança de vínculo já vista */
  vinculoVistoEm: string | null;
  /** por aluno (lado personal): ISO do último envio já visto */
  envioAlunoVisto: Record<string, string>;
}

export const defaultSync: SyncState = {
  autorizado: false,
  enviarAutomatico: false,
  ultimoEnvioEm: null,
  pendente: false,
  fichaVistaEm: null,
  vinculoVistoEm: null,
  envioAlunoVisto: {},
};

export const defaultSettings: Settings = {
  vozAtiva: true,
  vozVolume: 1,
  avisosDescanso: true,
  avisoInicioSerie: true,
  vibracao: true,
  somFinalCronometro: true,
  descansoPadrao: 60,
  descansoExerciciosPadrao: 90,
  contagemRegressiva: true,
  tema: "escuro",
  mostrarCargaAnterior: true,
  mostrarHistorico: true,
  confirmarPular: true,
  spotifyAtivo: true,
  spotifyNoTreino: true,
  spotifyAutoAbrir: false,
  abaixarMusicaAlerta: true,
  comandoVozAtivo: false,
};