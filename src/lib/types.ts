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
  gifUrl?: string;
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
  gifUrl?: string;
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

export interface AppData {
  fichas: Ficha[];
  personalizados: LibraryExercise[];
  historico: WorkoutSession[];
  sessaoAtiva: WorkoutSession | null;
  settings: Settings;
  ultimaFichaId: string | null;
  playlists: SpotifyPlaylist[];
  sync: SyncState;
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
}

export const defaultSync: SyncState = {
  autorizado: false,
  enviarAutomatico: false,
  ultimoEnvioEm: null,
  pendente: false,
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