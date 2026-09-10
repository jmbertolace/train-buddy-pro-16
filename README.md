# Gigante Pro Trainer 

JB TRAINING PRO — APLICATIVO COMPLETO DE TREINO DE ACADEMIA

Crie um aplicativo completo, funcional e multiplataforma chamado JB TRAINING PRO, em português do Brasil, desenvolvido prioritariamente para smartphones Android, mas responsivo para tablets e computadores.

O aplicativo deve funcionar como um assistente digital de treino, seguindo exatamente a ficha cadastrada pelo usuário e conduzindo-o durante toda a sessão.

IMPORTANTE: não criar apenas um protótipo ou demonstração visual. Os recursos descritos abaixo devem funcionar de verdade, com armazenamento persistente dos dados e funcionamento offline.

1. TELA INICIAL

Criar uma tela inicial moderna, limpa e profissional.

Mostrar:

JB TRAINING PRO

Botões principais:

🏋️ INICIAR TREINO

📋 MINHAS FICHAS

📊 MEU PROGRESSO

🕘 HISTÓRICO

⚙️ CONFIGURAÇÕES

Mostrar também:

última ficha utilizada;

último treino realizado;

data do último treino;

duração do último treino.

2. CADASTRO DAS FICHAS

Permitir criar quantas fichas o usuário quiser.

Exemplos:

TREINO A – PEITO/TRÍCEPS

TREINO B – COSTAS/BÍCEPS

TREINO C – PERNAS

TREINO D – OMBROS

Cada ficha deve permitir adicionar vários exercícios.

Cada exercício deve possuir:

Nome;

Grupo muscular;

Número de séries;

Número de repetições;

Carga;

Unidade da carga;

Tempo de descanso entre séries;

Tempo de descanso entre exercícios;

Observações;

Imagem/animação do exercício;

Campo indicando se a carga é por lado ou carga total.

Exemplo:

SUPINO RETO

4 séries × 10 repetições
Carga: 20 kg
Descanso entre séries: 60 segundos
Descanso entre exercícios: 90 segundos

3. NOVO RECURSO OBRIGATÓRIO — INFORMAÇÕES DO EXERCÍCIO

TODOS os exercícios adicionados a uma ficha devem possuir um botão visível chamado:

ℹ️ SOBRE O EXERCÍCIO

Esse botão deve funcionar de verdade.

Ao tocar nele, abrir uma janela ou tela com informações detalhadas sobre o exercício.

Mostrar:

Nome do exercício

Exemplo:

SUPINO RETO

Para que serve?

Explicar de forma simples qual é a finalidade do exercício e quais grupos musculares são principalmente trabalhados.

Exemplo:

Principal objetivo: trabalhar principalmente a musculatura do peito, com participação de tríceps e ombros.

Músculos trabalhados

Mostrar:

Peitoral maior;

Tríceps;

Deltoide anterior.

Como executar

Apresentar instruções simples, objetivas e seguras sobre a execução correta do movimento.

Exemplo:

Posicionar-se corretamente no banco.

Segurar a barra com as mãos em posição adequada.

Descer a barra de maneira controlada.

Empurrar a carga mantendo controle do movimento.

Evitar movimentos bruscos.

🎞️ DEMONSTRAÇÃO DO EXERCÍCIO

Adicionar uma área específica para mostrar um GIF/animação ou vídeo curto demonstrativo da execução do exercício.

O aplicativo deve permitir:

reproduzir;

pausar;

repetir automaticamente;

visualizar em tela maior.

A animação deve demonstrar claramente o movimento correto.

IMPORTANTE: não utilizar animações meramente decorativas. A demonstração deve estar relacionada ao exercício selecionado.

Quando houver uma biblioteca de exercícios disponível, associar automaticamente o GIF/animação correspondente.

Quando o usuário criar um exercício personalizado, permitir:

adicionar imagem;

adicionar GIF;

adicionar vídeo curto;

ou deixar a demonstração vazia.

⚠️ Observações de segurança

Adicionar uma pequena seção com orientações gerais de execução segura, sem substituir orientação de um profissional de Educação Física ou avaliação individual.

Não prescrever cargas automaticamente.

Não afirmar que determinada carga é segura para o usuário.

4. ACESSO À INFORMAÇÃO DURANTE O TREINO

A função SOBRE O EXERCÍCIO também deve estar disponível durante o treino.

Na tela do exercício, mostrar um pequeno botão:

ℹ️ INFORMAÇÕES

Ao tocar, o usuário poderá consultar:

finalidade;

músculos trabalhados;

execução;

demonstração em GIF/animação;

observações.

O usuário deve conseguir fechar a janela e retornar exatamente para a série em que estava.

O cronômetro e o estado do treino não podem ser perdidos ao abrir as informações.

5. MODO TREINO

Ao selecionar uma ficha, mostrar um resumo:

TREINO A

7 exercícios
24 séries
Tempo estimado: 55 minutos

Botão:

▶ INICIAR TREINO

Ao iniciar, começar automaticamente o cronômetro geral do treino.

6. TELA DO EXERCÍCIO

Durante o treino, deixar a interface extremamente simples.

Mostrar em destaque:

SUPINO RETO

Peito

SÉRIE 2 / 4

10 REPETIÇÕES

20 KG

Mostrar:

Última vez: 18 kg

Botões grandes:

✓ CONCLUÍDA

⏭ PULAR

⏸ PAUSAR

Adicionar também:

ℹ️ INFORMAÇÕES

para abrir a explicação e a demonstração do exercício.

7. ASSISTENTE POR VOZ

Adicionar comandos e avisos por voz.

Quando iniciar uma série:

"Supino reto. Série 2 de 4. Dez repetições."

Quando a série for concluída:

"Série concluída. Descanso de 60 segundos."

Durante o descanso:

"Faltam 30 segundos."

"Faltam 10 segundos."

"5... 4... 3... 2... 1."

Ao terminar:

"Descanso concluído. Próxima série."

Ao mudar de exercício:

"Próximo exercício: supino inclinado. Três séries de dez repetições."

Permitir ativar/desativar a voz nas configurações.

8. CRONÔMETRO INTELIGENTE

Após concluir uma série, iniciar automaticamente o descanso.

Exibir:

DESCANSO

01:00

Adicionar:

+15 segundos;

-15 segundos;

PAUSAR;

PULAR.

Quando chegar a zero:

emitir som;

vibrar;

falar "Descanso concluído";

mostrar "PRÓXIMA SÉRIE".

O usuário poderá pausar o cronômetro.

9. CONTROLE AUTOMÁTICO DAS SÉRIES

O aplicativo deve controlar automaticamente:

Exercício 1
Série 1/4
↓
Descanso
↓
Série 2/4
↓
Descanso
↓
Série 3/4
↓
Descanso
↓
Série 4/4
↓
Descanso entre exercícios
↓
Próximo exercício

O aplicativo não deve perder a sequência mesmo que:

o usuário pause;

abra as informações do exercício;

bloqueie a tela;

minimize o aplicativo;

saia temporariamente do aplicativo.

10. REGISTRO DA CARGA REAL

Durante cada série, permitir alterar a carga realizada.

Exemplo:

Ficha: 20 kg

Série 1: 20 kg
Série 2: 20 kg
Série 3: 22 kg
Série 4: 22 kg

Salvar cada série individualmente.

Adicionar:

−1 kg

+1 kg

edição manual.

Permitir registrar cargas diferentes em cada série.

11. MEMÓRIA DA ÚLTIMA CARGA

Ao iniciar um exercício, mostrar:

ÚLTIMO TREINO

22 kg × 10

CARGA PROGRAMADA

20 kg × 10

Isso permite consultar rapidamente o desempenho anterior.

12. MEU PROGRESSO

Criar uma área:

MEU PROGRESSO

Permitir visualizar a evolução de cada exercício.

Exemplo:

SUPINO RETO

Data Carga Repetições 01/08 18 kg 10 05/08 20 kg 10 10/08 22 kg 10

Criar gráficos simples mostrando a evolução da carga ao longo do tempo.

Mostrar:

maior carga registrada;

última carga;

número de treinos realizados;

melhor desempenho registrado.

Deixar claro que esses dados representam apenas o histórico registrado pelo usuário e não constituem recomendação profissional de treino.

13. HISTÓRICO DE TREINOS

Salvar automaticamente cada treino.

Exemplo:

10/08/2026

TREINO A

Duração: 54 min
7 exercícios
24 séries

Ao tocar no treino, mostrar:

todos os exercícios;

séries;

repetições;

cargas utilizadas;

duração;

data;

horário;

observações.

14. PAUSAR E RETOMAR

Criar:

PAUSAR TREINO

Ao pausar:

TREINO PAUSADO

[ RETOMAR ]

[ ENCERRAR TREINO ]

Se o usuário fechar o aplicativo acidentalmente, salvar automaticamente o estado atual e permitir continuar exatamente de onde parou.

15. FINALIZAÇÃO

Ao completar todos os exercícios:

TREINO CONCLUÍDO! 💪

Mostrar:

Tempo total;

Exercícios realizados;

Séries realizadas;

Carga total movimentada, quando for possível calcular;

Data;

Horário.

Botões:

VER RESUMO

FINALIZAR

16. EDITOR DE FICHAS

Permitir:

adicionar exercícios;

excluir exercícios;

editar exercícios;

duplicar exercícios;

alterar ordem;

duplicar fichas;

renomear fichas.

Usar arrastar e soltar para reorganizar exercícios.

17. BIBLIOTECA DE EXERCÍCIOS

Criar uma biblioteca inicial separada por:

PEITO;

COSTAS;

OMBROS;

BÍCEPS;

TRÍCEPS;

QUADRÍCEPS;

POSTERIOR DE COXA;

GLÚTEOS;

PANTURRILHAS;

ABDÔMEN.

Permitir pesquisar pelo nome.

Cada exercício da biblioteca deve possuir, quando disponível:

nome;

grupo muscular;

descrição;

músculos envolvidos;

instruções de execução;

imagem;

GIF/animação demonstrativa;

observações de segurança.

Permitir criar exercícios personalizados.

18. CONFIGURAÇÕES

Áudio

Voz ligada/desligada;

Volume;

Avisos durante o descanso;

Aviso de início de série.

Vibração

Ligada/desligada.

Cronômetro

Som ao terminar;

Descanso padrão;

Contagem regressiva.

Aparência

Tema claro;

Tema escuro.

Treino

Mostrar carga anterior;

Mostrar histórico;

Confirmar antes de pular exercício.

19. MODO TREINO RÁPIDO

Criar opção para iniciar um treino sem cadastrar uma ficha completa.

O usuário escolhe:

Exercício;

Séries;

Repetições;

Carga;

Descanso.

E começa imediatamente.

O exercício selecionado também deve disponibilizar o botão:

ℹ️ SOBRE O EXERCÍCIO

com as informações e demonstração disponíveis.

20. DESCANSO ENTRE EXERCÍCIOS

Diferenciar:

DESCANSO ENTRE SÉRIES

e

DESCANSO ENTRE EXERCÍCIOS

Permitir configurar tempos diferentes.

Exemplo:

Entre séries: 60 segundos.

Entre exercícios: 90 segundos.

21. SEGURANÇA E USABILIDADE

O aplicativo não deve incentivar o usuário a ultrapassar seus limites.

Não sugerir automaticamente aumento de carga como se fosse orientação médica ou profissional.

As informações sobre exercícios devem ter caráter educativo.

Não substituir avaliação ou orientação de profissional de Educação Física.

Durante o treino, priorizar uma interface simples.

Os botões devem ser grandes e fáceis de tocar.

22. FUNCIONAMENTO OFFLINE

As seguintes funções devem continuar funcionando sem internet:

fichas;

exercícios;

biblioteca;

informações dos exercícios;

GIFs/animações previamente armazenados;

histórico;

progresso;

cronômetros;

registros de carga;

treino em andamento.

Sincronização online poderá ser adicionada posteriormente.

23. DESIGN

Usar visual moderno de aplicativo fitness.

Interface predominantemente escura, profissional e limpa.

Usar cartões grandes.

Durante o descanso, o cronômetro deve ser o elemento principal.

Exemplo:

┌─────────────────────────┐
│        DESCANSO         │
│                         │
│          00:42          │
│                         │
│      PRÓXIMA SÉRIE      │
│                         │
│  [-15] [PAUSAR] [+15]  │
└─────────────────────────┘


Durante o exercício:

┌─────────────────────────┐
│      SUPINO RETO        │
│                         │
│       SÉRIE 3/4         │
│                         │
│       10 REPETIÇÕES     │
│                         │
│         22 KG           │
│                         │
│     [✓ CONCLUÍDA]       │
│                         │
│   [ℹ️ SOBRE O EXERCÍCIO] │
└─────────────────────────┘


24. BANCO DE DADOS

Criar estrutura para armazenar:

usuário;

fichas;

exercícios;

informações dos exercícios;

imagens;

GIFs/animações;

vídeos, quando utilizados;

séries;

repetições;

cargas;

tempos de descanso;

treinos realizados;

datas;

duração;

histórico de desempenho;

estado de treino interrompido.

Os dados não podem desaparecer quando o aplicativo for fechado.

25. RESPONSIVIDADE

Desenvolver primeiro pensando em smartphones.

Também funcionar adequadamente em:

tablets;

telas maiores;

computadores.

26. REQUISITO FUNDAMENTAL

Não criar somente uma demonstração visual.

Os seguintes recursos precisam funcionar de verdade:

cadastro de fichas;

cadastro de exercícios;

edição;

exclusão;

duplicação;

reorganização;

sequência automática;

controle de séries;

cronômetro de descanso;

cronômetro geral;

avisos sonoros;

síntese de voz;

vibração;

registro de cargas;

histórico;

progresso;

gráficos;

armazenamento persistente;

pausa;

retomada;

funcionamento offline;

informações dos exercícios;

demonstrações em GIF/animação;

exercícios personalizados.

27. ARQUITETURA DO RECURSO "SOBRE O EXERCÍCIO"

Implementar esse recurso como um componente reutilizável.

Cada exercício deverá possuir uma estrutura semelhante a:

Exercise

id

nome

grupoMuscular

descricao

finalidade

musculosTrabalhados

instrucoesExecucao

observacoesSeguranca

imagem

gifUrl ou arquivoGif

videoUrl opcional

equipamento

exercicioPersonalizado

Ao clicar em SOBRE O EXERCÍCIO, abrir o componente:

ExerciseInfoModal

com:

Nome;

Imagem/GIF;

Para que serve;

Músculos trabalhados;

Como executar;

Observações;

Botão fechar.

O componente deve funcionar tanto:

na biblioteca de exercícios;

no editor de fichas;

na tela de resumo;

durante o treino;

no modo treino rápido.

Ao abrir esse componente durante um treino, preservar integralmente:

exercício atual;

série atual;

carga;

cronômetro;

descanso;

progresso da sessão.

28. OTIMIZAÇÃO PARA CELULAR

Como o aplicativo será utilizado durante o treino, priorizar:

botões grandes;

textos grandes;

alto contraste;

poucas informações simultâneas;

navegação rápida;

operação com uma mão;

feedback visual imediato;

feedback sonoro;

vibração;

possibilidade de usar o aplicativo sem internet.

Evitar menus excessivamente complexos durante o treino.

29. TECNOLOGIA E DESENVOLVIMENTO

Priorizar tecnologias gratuitas e adequadas para criar um aplicativo multiplataforma.

A solução deve permitir posteriormente gerar uma versão instalável para Android.

Priorizar:

armazenamento local;

banco de dados local;

funcionamento offline;

arquitetura preparada para sincronização futura;

componentes reutilizáveis;

código organizado;

facilidade de manutenção.

30. ENTREGA

Primeiro construir a versão funcional completa do JB TRAINING PRO.

Depois fornecer instruções simples e objetivas explicando:

Como executar o projeto;

Como testar no navegador;

Como testar no celular;

Como instalar no Android;

Como gerar uma versão APK, quando a tecnologia escolhida permitir;

Como adicionar novos exercícios;

Como adicionar imagens e GIFs;

Como testar o cronômetro;

Como testar voz e vibração;

Como testar o armazenamento offline.

Prioridade máxima: funcionamento real dos recursos, simplicidade durante o treino, armazenamento dos dados e experiência de uso no celular.

O resultado final deve ser um verdadeiro assistente digital de treino chamado JB TRAINING PRO, e não apenas uma interface demonstrativa.

31. INTEGRAÇÃO COM SPOTIFY



Adicionar um botão de acesso rápido ao Spotify no JB TRAINING PRO.



Na tela inicial, incluir:



🎵 SPOTIFY



Durante o treino, o botão também poderá ficar disponível de forma discreta na interface, sem atrapalhar os controles principais.



A função deve permitir:



- abrir o aplicativo Spotify instalado no celular;

- abrir o Spotify Web quando estiver utilizando uma plataforma compatível;

- retornar ao JB TRAINING PRO sem perder o treino em andamento;

- manter o cronômetro e o estado do treino funcionando corretamente;

- não interromper o treino ao abrir o Spotify;

- permitir que o usuário controle sua música enquanto realiza o treino.



CONTROLE DE MÚSICA



Quando tecnicamente possível, disponibilizar controles rápidos:



- ⏮ Música anterior

- ▶️/⏸ Reproduzir/Pausar

- ⏭ Próxima música



O controle de música deve ser separado dos controles do treino.



IMPORTANTE: o aplicativo não deve armazenar, reproduzir ou distribuir músicas do Spotify. Deve utilizar os recursos oficiais disponíveis do Spotify e/ou abrir o aplicativo oficial.



Adicionar nas configurações:



MÚSICA



- Botão Spotify ativado/desativado;

- Mostrar botão durante o treino;

- Abrir Spotify automaticamente ao iniciar treino — opcional.



---



32. MÓDULO DE ACOMPANHAMENTO COM PERSONAL TRAINER



Criar uma área específica:



👨‍🏫 MEU PERSONAL TRAINER



O objetivo é permitir que o usuário tenha acompanhamento de um Personal Trainer dentro do aplicativo.



Criar dois tipos de perfil:



ALUNO



e



PERSONAL TRAINER



O aluno poderá vincular sua conta a um Personal Trainer através de:



- código de convite;

- código de vinculação;

- QR Code;

- convite enviado pelo aplicativo.



---



33. ÁREA DO PERSONAL TRAINER



Criar um painel específico para o profissional.



O Personal Trainer poderá visualizar seus alunos vinculados.



Exemplo:



MEUS ALUNOS



- João

- Carlos

- Pedro

- Maria



Ao selecionar um aluno, mostrar:



- fichas atuais;

- exercícios;

- séries;

- repetições;

- cargas registradas;

- histórico de treinos;

- frequência de treino;

- evolução das cargas;

- treinos realizados;

- treinos não realizados;

- observações.



---



34. CRIAÇÃO DE FICHA PELO PERSONAL TRAINER



O Personal Trainer poderá criar e enviar fichas diretamente para o aluno.



Permitir:



- criar ficha;

- adicionar exercícios;

- alterar ordem dos exercícios;

- definir séries;

- definir repetições;

- definir carga;

- definir descanso;

- definir descanso entre exercícios;

- adicionar observações;

- adicionar orientações específicas;

- adicionar imagem/GIF demonstrativo;

- alterar a ficha posteriormente.



Quando o aluno receber uma nova ficha, mostrar uma notificação:



📋 NOVA FICHA RECEBIDA



"Seu Personal Trainer enviou uma nova ficha de treino."



Botões:



VISUALIZAR



ACEITAR



---



35. FEEDBACK DO PERSONAL TRAINER



Permitir que o Personal Trainer deixe observações sobre:



- exercícios;

- treinos;

- evolução;

- execução;

- frequência.



Exemplo:



SUPINO RETO



"Manter controle na descida e evitar acelerar o movimento."



O aluno poderá visualizar essa observação ao tocar em:



ℹ️ ORIENTAÇÃO DO PERSONAL



---



36. REGISTRO DO DESEMPENHO PARA O PERSONAL



Depois de cada treino, o aplicativo poderá enviar/sincronizar os dados autorizados pelo aluno.



Exemplo:



TREINO A — 18/08/2026



Duração: 52 minutos



Supino reto:



- Série 1: 20 kg × 10

- Série 2: 20 kg × 10

- Série 3: 22 kg × 10

- Série 4: 22 kg × 8



O Personal Trainer poderá acompanhar esses registros para avaliar a evolução do aluno.



---



37. COMUNICAÇÃO ENTRE ALUNO E PERSONAL



Criar uma área:



💬 MENSAGENS



Permitir comunicação entre aluno e Personal Trainer.



O aluno poderá enviar:



- dúvidas;

- observações;

- dificuldades;

- comentários sobre o treino.



O Personal Trainer poderá responder.



A comunicação deve ser simples e objetiva.



---



38. ALERTAS PARA O PERSONAL



Opcionalmente, o Personal Trainer poderá receber indicadores como:



- aluno iniciou treino;

- aluno concluiu treino;

- aluno está há vários dias sem treinar;

- nova carga registrada;

- ficha atualizada.



Não enviar informações desnecessárias.



Permitir configurar quais notificações o profissional deseja receber.



---



39. PRIVACIDADE E PERMISSÕES



O aluno deve ter controle sobre seus dados.



Antes de compartilhar informações com um Personal Trainer, solicitar autorização.



Permitir:



COMPARTILHAR MEUS TREINOS



Ligado / Desligado



COMPARTILHAR MEU HISTÓRICO



Ligado / Desligado



COMPARTILHAR MEU PROGRESSO



Ligado / Desligado



COMPARTILHAR CARGAS



Ligado / Desligado



O aluno poderá cancelar a vinculação com o Personal Trainer a qualquer momento.



Ao cancelar, o Personal deixa de ter acesso aos novos dados compartilhados pelo aluno.



---



40. PERSONAL TRAINER + MODO OFFLINE



O aluno deve continuar conseguindo realizar seus treinos offline.



Quando voltar a ter conexão com a internet, os dados poderão ser sincronizados com a conta do Personal Trainer, respeitando as permissões concedidas pelo aluno.



O aplicativo deve evitar perda de dados durante a sincronização.



---



41. TELA INICIAL COM SPOTIFY E PERSONAL



Atualizar a tela inicial para incluir:



JB TRAINING PRO



🏋️ INICIAR TREINO



📋 MINHAS FICHAS



📊 MEU PROGRESSO



🕘 HISTÓRICO



👨‍🏫 MEU PERSONAL TRAINER



🎵 SPOTIFY



⚙️ CONFIGURAÇÕES



Também mostrar:



Última ficha utilizada



Último treino realizado



Personal Trainer: conectado/desconectado



---



42. REQUISITOS IMPORTANTES DO MÓDULO PERSONAL TRAINER



O sistema deve diferenciar claramente:



MODO ALUNO



- realiza os treinos;

- registra cargas;

- consulta evolução;

- recebe fichas;

- recebe orientações;

- conversa com o Personal;

- controla quais dados são compartilhados.



MODO PERSONAL TRAINER



- cadastra alunos;

- cria fichas;

- envia fichas;

- acompanha treinos;

- visualiza evolução autorizada;

- adiciona observações;

- envia orientações;

- conversa com alunos;

- acompanha histórico autorizado.



O módulo deve ser preparado para futuramente suportar vários alunos por Personal Trainer.



---



43. IMPORTANTE SOBRE O PERSONAL TRAINER



O aplicativo deve funcionar tanto:



SEM PERSONAL TRAINER



quanto:



COM PERSONAL TRAINER



O usuário que não possuir Personal Trainer deve conseguir utilizar absolutamente todas as funções principais do aplicativo normalmente.



O módulo de Personal Trainer deve ser um recurso adicional e não uma exigência para utilizar o JB TRAINING PRO.



---



44. ATUALIZAÇÃO DA LISTA DE RECURSOS FUNCIONAIS



A versão completa do JB TRAINING PRO deverá possuir, entre outros:



- Cadastro de usuário;

- Cadastro de fichas;

- Biblioteca de exercícios;

- Exercícios personalizados;

- Informações detalhadas dos exercícios;

- GIF/animação demonstrativa;

- Modo treino;

- Sequência automática;

- Controle de séries;

- Registro de cargas por série;

- Memória da última carga;

- Cronômetro geral;

- Cronômetro de descanso;

- Descanso entre exercícios;

- Voz;

- Sons;

- Vibração;

- Pausar e retomar;

- Histórico;

- Gráficos de progresso;

- Funcionamento offline;

- Modo treino rápido;

- 🎵 Spotify;

- 👨‍🏫 Personal Trainer;

- Compartilhamento autorizado de dados;

- Fichas enviadas pelo Personal;

- Orientações do Personal;

- Comunicação aluno/Personal;

- Painel do Personal Trainer.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://train-buddy-pro-16.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b6fdcf4a-d5f3-4948-8ab8-cc10c96cd317).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
