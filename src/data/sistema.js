// src/data/sistema.js

export const CLASSES = {
  Combatente: {
    trilhas: ["Soldado", "Comandante", "Linha de Frente", "Suporte de Campo", "Invocador"],
    habilidades: [
      { nome: "Armamento Pesado", desc: "Recebe proficiência com armas pesadas." },
      { nome: "Combate Desarmado", desc: "Ataques desarmados causam mais 1d8 de DANO, podendo causar DANO LETAL." },
      { nome: "Golpe Pesado", desc: "O DANO de suas armas leves de curto alcance aumentam +1 dado de DANO do mesmo tipo da arma." },
      { nome: "Combater com Duas Armas", desc: "Se estiver empunhando duas armas (uma delas precisa ser leve) pode realizar um ataque com cada arma." },
      { nome: "Proteção Pesada", desc: "Recebe proficiência com proteções pesadas." },
      { nome: "Instinto de Batalha", desc: "Por cena, quando receber um DANO que reduza seus PV, some sua AGILIDADE na resistência." },
      { nome: "Postura de Combate", desc: "Adota uma postura defensiva, aumentando sua Defesa em +2 por turno." },
      { nome: "Ímpeto", desc: "Pode gastar 2 PE para realizar um movimento extra e atacar no mesmo turno." },
      { nome: "Resistência Brutal", desc: "Reduz o dano recebido em 2 pontos por turno." },
      { nome: "Contra-ataque", desc: "Quando esquiva com sucesso, pode realizar um ataque imediato sem custo de ação." },
    ],
    passivas: [
      { nome: "Potente", desc: "Você recebe +3 de DANO adicional usando armas corpo a corpo." },
      { nome: "Pele Grossa", desc: "Reduz 1 ponto de qualquer dano recebido." },
      { nome: "Marcado pela Guerra", desc: "Começa cada cena com +1d6 de PV temporários." },
    ]
  },
  Especialista: {
    trilhas: ["Armamentista", "Técnico", "Médico", "Negociador", "Invocador"],
    habilidades: [
      { nome: "Eclético", desc: "Gaste 1 PE para ser treinado em uma perícia. Ganhe +5 pontos na soma." },
      { nome: "Perito", desc: "Gaste 1 PE para adicionar +1d6 nas rolagens de atributo." },
      { nome: "Celebridade", desc: "Uma vez por cena você pode gastar 2 PE para determinar que um personagem envolvido no ambiente te reconheça. Você recebe +5 em testes de perícia interpessoais até o final da cena." },
      { nome: "Tiro Preciso", desc: "Seus ataques à distância ignoram penalidades de cobertura parcial." },
      { nome: "Sombra", desc: "Pode se mover sem fazer barulho, ganhando +5 em Furtividade." },
      { nome: "Hackear Avançado", desc: "Pode hackear sistemas complexos com metade do tempo normal." },
      { nome: "Reflexo Apurado", desc: "Adiciona +2 na Esquiva contra ataques de distância." },
      { nome: "Explosivo", desc: "Pode criar dispositivos explosivos improvisados com materiais comuns." },
      { nome: "Análise Tática", desc: "Gaste 1 PE para identificar o ponto fraco de um inimigo, causando +2d6 no próximo ataque." },
    ],
    passivas: [
      { nome: "Treinamento em Perícias", desc: "Escolha DUAS Perícias para se tornar Treinado, ganhando +5 pontos. Ao chegar no Nível 35, passe a ser Veterano, ganhando +10 pontos." },
      { nome: "Olho Clínico", desc: "Pode identificar fraquezas e doenças com um olhar." },
      { nome: "Adaptação Rápida", desc: "Reduz em 1 turno o tempo para se adaptar a novos ambientes." },
    ]
  },
  Bruxo: {
    trilhas: ["Ocultista", "Peregrino", "Eremita", "Ilusionista", "Flagelador"],
    habilidades: [
      { nome: "Canal Elemental", desc: "Pode canalizar seu elemento causando +1d6 de dano elemental nos ataques." },
      { nome: "Ritual Sombrio", desc: "Realiza rituais que afetam o campo de batalha, como criar zonas de escuridão ou veneno." },
      { nome: "Cura Arcana", desc: "Gaste 2 PE para restaurar 1d8+2 PV em si mesmo ou em um aliado adjacente." },
      { nome: "Barreira Mágica", desc: "Gaste 3 PE para criar uma barreira que absorve até 10 de dano." },
      { nome: "Invocar Familiar", desc: "Invoca uma criatura menor para auxiliar em combate ou exploração." },
      { nome: "Visão Mística", desc: "Pode ver auras e detectar magias ativas em um raio de 10 metros." },
    ],
    passivas: [
      { nome: "Aura Sensível", desc: "Detecta automaticamente presenças sobrenaturais próximas." },
      { nome: "Memória Arcana", desc: "Nunca esquece magias ou rituais que aprendeu." },
      { nome: "Foco Espiritual", desc: "Recebe +2 PE por nível." },
    ]
  },
  Espião: {
    trilhas: ["Assassino", "Tranqueira", "Atirador de Elite", "Assaltante", "Invocador"],
    habilidades: [
      { nome: "Disfarce Perfeito", desc: "Pode se disfarçar de qualquer pessoa que tenha observado por pelo menos 1 minuto." },
      { nome: "Desaparecer", desc: "Gaste 2 PE para se tornar invisível por 1 turno." },
      { nome: "Quebrar Vontade", desc: "Através de interrogatório, pode fazer um alvo revelar informações com um teste de Intimidação." },
      { nome: "Rede de Contatos", desc: "Possui contatos em diversas organizações que podem fornecer informações ou ajuda." },
      { nome: "Veneno Sutil", desc: "Pode aplicar veneno em armas sem ser notado." },
      { nome: "Leitura de Ambiente", desc: "Ao entrar em qualquer local, identifica automaticamente saídas, ameaças e itens úteis." },
    ],
    passivas: [
      { nome: "Paranoia Treinada", desc: "Nunca é surpreendido, sempre age no primeiro turno." },
      { nome: "Face Neutra", desc: "Recebe +5 em testes para esconder emoções e intenções." },
      { nome: "Saída de Emergência", desc: "Uma vez por cena, pode se mover para qualquer lugar adjacente sem custo de ação." },
    ]
  }
}

export const PERICIAS = {
  Domínio: ["Observar", "Ouvir", "Ocultismo", "Intuição", "Intimidação", "Charme", "Lábia", "Enganação", "Diplomacia", "Vontade", "Percepção", "Religião", "Acalmar", "Disfarce", "Adestramento", "Detectar Aura", "Identificar Criatura", "Identificar Magia"],
  Força: ["Luta", "Atletismo", "Agarrar", "Desarmar"],
  Vigor: ["Fortitude", "Sanidade"],
  Intelecto: ["Tática", "Analisar Terreno", "Outra Língua", "Tecnologia", "Hacker", "Localizar", "Atualidade", "Operar Dispositivos Amaldiçoados", "Profissão", "Orientar", "Sobrevivência", "Cozinhar", "Acampar", "Medicina", "Primeiros Socorros", "Investigação"],
  Agilidade: ["Pilotagem", "Pontaria", "Arremessar", "Reflexo", "Esconder", "Furtividade", "Seguir", "Iniciativa", "Crime", "Arrombar", "Artes", "Nadar", "Cavalgar"]
}

export const GENESES = [
  "Sofredor", "Estudante", "Agricultor", "Golpista", "Programador",
  "Militar", "Médico", "Artista", "Psicólogo", "Teórico",
  "Afortunado", "Policial", "Funcionário", "Autônomo", "Místico",
  "Mendigo", "Administrador", "Bandido", "Treinador", "Sem Gênese"
]

export const ELEMENTOS = [
  { nome: "Nenhum", bloqueado: false },
  { nome: "Terra", bloqueado: false },
  { nome: "Fogo", bloqueado: false },
  { nome: "Água", bloqueado: false },
  { nome: "Ar", bloqueado: false },
  { nome: "Sangue", bloqueado: false },
  { nome: "Morte", bloqueado: false },
  { nome: "Combustão", bloqueado: false },
  { nome: "Energia", bloqueado: false },
  { nome: "Benção", bloqueado: false },
  { nome: "Medo", bloqueado: false },
  { nome: "Alma", bloqueado: false },
  { nome: "Ignição", bloqueado: false },
  { nome: "Gelo", bloqueado: false },
  { nome: "Areia", bloqueado: false },
  { nome: "Lava", bloqueado: false },
  { nome: "Planta", bloqueado: false },
  { nome: "Caos", bloqueado: true },
  { nome: "Vidro", bloqueado: false },
  { nome: "Sangue Refinado", bloqueado: false },
  { nome: "Maldição", bloqueado: false },
  { nome: "Raio", bloqueado: false },
  { nome: "Metal", bloqueado: false },
]

export const TIPOS_ARMA = ["Leve", "Média", "Tática", "Pesada", "Improvisada"]

// Catálogo completo de armas do livro
export const CATALOGO_ARMAS = {
  Leve: [
    { nome: "Faca", dano: "1d3+2", municao: "x", espaco: 1, alcance: "Corpo a Corpo", critico: "19-20(x2)", pericia: "Luta" },
    { nome: "Pé de Cabra", dano: "1d6", municao: "x", espaco: 1, alcance: "Corpo a Corpo", critico: "19-20(2x)", pericia: "Luta" },
    { nome: "Soco-inglês", dano: "1d3+1", municao: "x", espaco: 1, alcance: "Corpo a Corpo", critico: "20(3x)", pericia: "Luta" },
    { nome: "Machete", dano: "1d4+2", municao: "x", espaco: 2, alcance: "Corpo a Corpo", critico: "19-20(x2)", pericia: "Luta" },
    { nome: "Luva", dano: "1d3", municao: "x", espaco: 1, alcance: "Corpo a Corpo", critico: "18-19-20(2x)", pericia: "Luta" },
    { nome: "Porrete", dano: "1d4+1", municao: "x", espaco: 2, alcance: "Corpo a Corpo", critico: "19-20(2x)", pericia: "Luta" },
    { nome: "Punhal", dano: "1d4+2", municao: "x", espaco: 1, alcance: "Corpo a Corpo", critico: "19-20(x3)", pericia: "Luta" },
    { nome: "Agulha", dano: "1d4+1", municao: "x", espaco: 1, alcance: "Curto Alcance", critico: "20(2x)", pericia: "Pontaria" },
    { nome: "Shuko", dano: "1d3+1", municao: "x", espaco: 1, alcance: "Corpo a Corpo", critico: "18-19-20", pericia: "Luta" },
    { nome: "Cutelo", dano: "1d6+2", municao: "x", espaco: 3, alcance: "Corpo a Corpo", critico: "20(x3)", pericia: "Luta" },
    { nome: "Mangual", dano: "1d6+2", municao: "x", espaco: 4, alcance: "Curto Alcance", critico: "19-20(x2)", pericia: "Luta" },
    { nome: "Pistola", dano: "1d12", municao: "20", espaco: 2, alcance: "Médio Alcance", critico: "19-20", pericia: "Pontaria" },
    { nome: "Estilingue", dano: "1d6+2", municao: "1", espaco: 1, alcance: "Médio Alcance", critico: "20(x3)", pericia: "Pontaria" },
    { nome: "Zarabatana", dano: "2d3+1", municao: "1", espaco: 1, alcance: "Médio Alcance", critico: "19-20(x2)", pericia: "Pontaria" },
    { nome: "Revólver", dano: "2d6", municao: "6", espaco: 3, alcance: "Médio Alcance", critico: "20(x2)", pericia: "Pontaria" },
    { nome: "Mini Metralhadora", dano: "3d6", municao: "30", espaco: 4, alcance: "Médio Alcance", critico: "18-19-20", pericia: "Pontaria" },
    { nome: "Besta Pistola", dano: "2d6+2", municao: "1", espaco: 4, alcance: "Médio Alcance", critico: "20(x2)", pericia: "Pontaria" },
    { nome: "Bumerangue", dano: "1d4", municao: "x", espaco: 2, alcance: "Curto Alcance", critico: "20(x2)", pericia: "Arremessar" },
    { nome: "Derringer", dano: "1d6", municao: "2", espaco: 1, alcance: "Curto Alcance", critico: "20(3x)", pericia: "Pontaria" },
    { nome: "Spray de Pimenta", dano: "1d3+1", municao: "x", espaco: 1, alcance: "Curto Alcance", critico: "20(x2)", pericia: "Pontaria" },
    { nome: "Maçarico", dano: "1d8+3", municao: "x", espaco: 3, alcance: "Curto Alcance", critico: "18-19-20(x2)", pericia: "Pontaria" },
    { nome: "Pistola de Choque", dano: "1d8", municao: "1", espaco: 1, alcance: "Médio Alcance", critico: "18-19-20", pericia: "Pontaria" },
    { nome: "Pistola de Pregos", dano: "1d3+3", municao: "1", espaco: 1, alcance: "Curto Alcance", critico: "20(x2)", pericia: "Pontaria" },
    { nome: "Sinalizador", dano: "1d3+1", municao: "1", espaco: 1, alcance: "Longo Alcance", critico: "18-19-20", pericia: "Pontaria" },
  ],
  Média: [
    { nome: "Espada", dano: "1d8+3", municao: "x", espaco: 4, alcance: "Curto Alcance", critico: "18-19-20(2x)", pericia: "Luta" },
    { nome: "Cajado", dano: "1d6+2", municao: "x", espaco: 3, alcance: "Médio Alcance", critico: "18-19-20(x2)", pericia: "Atletismo" },
    { nome: "Martelo", dano: "3d4", municao: "x", espaco: 5, alcance: "Curto Alcance", critico: "19-20(2x)", pericia: "Luta" },
    { nome: "Machado", dano: "2d6", municao: "x", espaco: 6, alcance: "Curto Alcance", critico: "20(x3)", pericia: "Luta" },
    { nome: "Azagaia", dano: "1d6+2", municao: "x", espaco: 5, alcance: "Médio Alcance", critico: "20(x3)", pericia: "Arremessar" },
    { nome: "Mini Motoserra", dano: "3d6", municao: "x", espaco: 6, alcance: "Corpo a Corpo", critico: "18-19-20(x2)", pericia: "Luta" },
    { nome: "Massa", dano: "1d8+2", municao: "x", espaco: 7, alcance: "Curto Alcance", critico: "19-20(x3)", pericia: "Luta" },
    { nome: "Tridente Curto", dano: "1d6+4", municao: "x", espaco: 3, alcance: "Curto Alcance", critico: "19-20(x2)", pericia: "Luta" },
    { nome: "Tekko-kagi", dano: "1d8+3", municao: "x", espaco: 3, alcance: "Curto Alcance", critico: "18-19-20(x2)", pericia: "Luta" },
    { nome: "Picareta", dano: "1d8+2", municao: "x", espaco: 3, alcance: "Médio Alcance", critico: "20(x3)", pericia: "Luta" },
    { nome: "Meat Hook", dano: "1d6+5", municao: "x", espaco: 6, alcance: "Curto Alcance", critico: "19-20(x2)", pericia: "Luta" },
    { nome: "Alabarda Curta", dano: "1d10+2", municao: "x", espaco: 4, alcance: "Curto Alcance", critico: "20(x2)", pericia: "Luta" },
    { nome: "Arco", dano: "1d10+2", municao: "1", espaco: 5, alcance: "Longo Alcance", critico: "20(2x)", pericia: "Pontaria" },
    { nome: "Crossbow", dano: "1d12+3", municao: "2", espaco: 5, alcance: "Médio Alcance", critico: "19-20(2x)", pericia: "Pontaria" },
    { nome: "Calibre 12", dano: "4d6", municao: "2", espaco: 7, alcance: "Curto Alcance", critico: "20(x2)", pericia: "Pontaria" },
    { nome: "Sniper Médio", dano: "2d10", municao: "5", espaco: 10, alcance: "Longo Alcance", critico: "20(x3)", pericia: "Pontaria" },
    { nome: "Fuzil", dano: "2d12", municao: "20", espaco: 10, alcance: "Médio Alcance", critico: "18-19-20", pericia: "Tática" },
    { nome: "Metralhadora", dano: "2d6+2", municao: "1", espaco: 4, alcance: "Médio Alcance", critico: "19-20(x2)", pericia: "Tática" },
    { nome: "Espingarda de Caça", dano: "1d12+5", municao: "1", espaco: 5, alcance: "Longo Alcance", critico: "20(x2)", pericia: "Pontaria" },
    { nome: "Rifle Ácido", dano: "1d6+4", municao: "5", espaco: 4, alcance: "Médio Alcance", critico: "18-19-20", pericia: "Pontaria" },
    { nome: "Rifle Raygun", dano: "3d6", municao: "3", espaco: 1, alcance: "Longo Alcance", critico: "18-19-20", pericia: "Pontaria" },
    { nome: "Canhão de Plasma", dano: "2d8", municao: "1", espaco: 7, alcance: "Médio Alcance", critico: "20(x2)", pericia: "Tática" },
  ],
  Tática: [
    { nome: "Corrente", dano: "1d8+5", municao: "x", espaco: 5, alcance: "Médio Alcance", critico: "19-20(2x)", pericia: "Atletismo" },
    { nome: "Katana", dano: "1d12+5", municao: "x", espaco: 8, alcance: "Curto Alcance", critico: "20(x3)", pericia: "Artes" },
    { nome: "Machadinha Tática", dano: "2d6+3", municao: "x", espaco: 4, alcance: "Curto Alcance", critico: "18-19-20(2x)", pericia: "Arremessar" },
    { nome: "Arco Tático", dano: "1d12+4", municao: "x", espaco: 8, alcance: "Extremo Alcance", critico: "19-20(3x)", pericia: "Tática" },
    { nome: "Nunchaku", dano: "1d8+2", municao: "x", espaco: 1, alcance: "Curto Alcance", critico: "18-19-20(2x)", pericia: "Luta" },
    { nome: "Bastão", dano: "1d12", municao: "x", espaco: 6, alcance: "Curto Alcance", critico: "19-20(2x)", pericia: "Atletismo" },
    { nome: "Chicote", dano: "1d12", municao: "x", espaco: 4, alcance: "Médio Alcance", critico: "20(x3)", pericia: "Pontaria" },
    { nome: "Fuzil de Assalto", dano: "1d12+5", municao: "10", espaco: 8, alcance: "Longo Alcance", critico: "19-20(x2)", pericia: "Tática" },
    { nome: "Espada Gancho", dano: "1d12+2", municao: "x", espaco: 8, alcance: "Médio Alcance", critico: "19-20(x2)", pericia: "Luta" },
    { nome: "Kusarigama", dano: "1d10", municao: "x", espaco: 7, alcance: "Médio Alcance", critico: "18-19-20", pericia: "Reflexo" },
    { nome: "Fuma Shuriken", dano: "2d6+2", municao: "x", espaco: 7, alcance: "Longo Alcance", critico: "19-20(x2)", pericia: "Arremessar" },
    { nome: "Kunai", dano: "1d6", municao: "x", espaco: 1, alcance: "Médio Alcance", critico: "19-20(x2)", pericia: "Arremessar" },
    { nome: "Espada de Lâmina Dupla", dano: "1d12+3", municao: "x", espaco: 7, alcance: "Médio Alcance", critico: "18-19-20(x2)", pericia: "Atletismo" },
    { nome: "Espada Chicote", dano: "2d6+5", municao: "x", espaco: 7, alcance: "Médio Alcance", critico: "19-20(x2)", pericia: "Arremessar" },
  ],
  Pesada: [
    { nome: "Espada", dano: "2d12+6", municao: "x", espaco: 12, alcance: "Médio Alcance", critico: "19-20(x2)", pericia: "Luta" },
    { nome: "Lança", dano: "3d10", municao: "x", espaco: 14, alcance: "Longo Alcance", critico: "20(x2)", pericia: "Luta" },
    { nome: "Machado", dano: "2d10+2", municao: "x", espaco: 13, alcance: "Médio Alcance", critico: "19-20(x3)", pericia: "Luta" },
    { nome: "Martelo", dano: "1d20", municao: "x", espaco: 12, alcance: "Médio Alcance", critico: "20(x3)", pericia: "Luta" },
    { nome: "Alabarda", dano: "2d12", municao: "x", espaco: 13, alcance: "Longo Alcance", critico: "19-20(x2)", pericia: "Luta" },
    { nome: "Foice", dano: "1d20+4", municao: "x", espaco: 11, alcance: "Longo Alcance", critico: "19-20(x2)", pericia: "Luta" },
    { nome: "Clava", dano: "1d20+5", municao: "x", espaco: 13, alcance: "Médio Alcance", critico: "19-20(x2)", pericia: "Luta" },
    { nome: "Manopla", dano: "2d10", municao: "x", espaco: 9, alcance: "Corpo a Corpo", critico: "18-19-20(x2)", pericia: "Luta" },
    { nome: "Motoserra", dano: "3d20", municao: "x", espaco: 17, alcance: "Curto Alcance", critico: "19-20(x3)", pericia: "Luta" },
    { nome: "Aríete Portátil", dano: "2d12+5", municao: "x", espaco: 20, alcance: "Corpo a Corpo", critico: "20(x3)", pericia: "Luta" },
    { nome: "Bazuka", dano: "4d20", municao: "1", espaco: 17, alcance: "Extremo Alcance", critico: "19-20(x2)", pericia: "Tática" },
    { nome: "Super Metralhadora", dano: "4d12", municao: "30", espaco: 19, alcance: "Longo Alcance", critico: "18-19-20(x2)", pericia: "Tática" },
    { nome: "Balestra", dano: "6d12", municao: "1", espaco: 15, alcance: "Longo Alcance", critico: "19-20(x2)", pericia: "Tática" },
    { nome: "Sniper", dano: "3d20+5", municao: "3", espaco: 18, alcance: "Extremo Alcance", critico: "20(x3)", pericia: "Pontaria" },
    { nome: "Granada", dano: "10d12", municao: "1", espaco: 1, alcance: "x", critico: "18-19-20", pericia: "Arremessar" },
    { nome: "M2.50", dano: "5d12+3", municao: "1", espaco: 21, alcance: "Longo Alcance", critico: "19-20(x2)", pericia: "Tática" },
    { nome: "FGM-148 Javelin", dano: "1d100+3d20", municao: "1", espaco: 30, alcance: "Extremo Alcance", critico: "20(x3)", pericia: "Tática" },
    { nome: "Arco Canhão Eletromagnético", dano: "5d10", municao: "1", espaco: 10, alcance: "Longo Alcance", critico: "20(x2)", pericia: "Tática" },
    { nome: "Rifles Recoilless", dano: "5d20", municao: "1", espaco: 20, alcance: "Extremo Alcance", critico: "18-19-20", pericia: "Tática" },
  ],
  Improvisada: []
}

// Catálogo de poderes por elemento
export const CATALOGO_PODERES = {
  Energia: [
    { nome: "Campo Caótico", desc: "Você consegue gerar um campo de Energia que o protege de perigos. Quando usa a ação esquiva, você pode gastar 1 PE para receber +5 em Defesa." },
    { nome: "Golpe de Sorte", desc: "Seus ataques recebem +1 na margem de ameaça. (Capacidade de up)" },
    { nome: "Troca de Faísca", desc: "Ao olhar para um alvo, você pode trocar de lugar com ele imediatamente sem que ele possa reagir. (Capacidade de up)" },
    { nome: "Forçar Músculos", desc: "Solte uma descarga em seus músculos dando +1d12+5 de bônus em rolagens de Força e Agilidade. Se falhar, o corpo sofre (1d10); desastre (2d10); se passar (1d6)." },
    { nome: "Aragem", desc: "Manipule pequenas brisas de vento dando desvantagem no acerto de inimigos que forem lançar um ataque ao invocador (-7p na rolagem do alvo). (Capacidade de up)" },
  ],
  Morte: [
    { nome: "Encarar a Morte", desc: "Sua conexão com a Morte faz com que você não hesite em situações de perigo. Durante cenas de ação, seus PE aumentam em +2d12." },
    { nome: "Escapar da Morte", desc: "A Morte tem um interesse especial em sua caminhada. Uma vez por cena, quando receber dano que o deixaria com 0 PV, você fica com 1 PV. Não funciona em caso de dano massivo. (Capacidade de up)" },
    { nome: "Potencial Aprimorado", desc: "Morte lhe concede potencial latente de momentos roubados de outro lugar. Você recebe +1 ponto de esforço por NEX." },
    { nome: "Surto Temporal", desc: "A sua percepção temporal se torna distorcida. Uma vez por cena, durante seu turno, você pode gastar 3 PE para realizar uma ação padrão adicional." },
    { nome: "Técnica das Sombras", desc: "Faça novos aliados sejam eles animais, pessoas, criaturas. Assim que um Laço for feito o invocador pode pedir ajuda dessas criaturas, as invocando automaticamente para atacarem por ele. (Capacidade de up)" },
  ],
  Benção: [
    { nome: "Transcender — EXPANSÃO", desc: "Faça com que criaturas graciosas dos céus purifiquem uma área onde só pessoas que o invocador permitir conseguem passar por essa barreira. (Somente elemento Benção tem poder dentro desse raio)" },
    { nome: "Sensitivo", desc: "Consegue sentir as emoções e intenções de outros personagens, como medo, raiva ou malícia, recebendo +5 em testes de Diplomacia, Intimidação e Intuição." },
    { nome: "Corrente do Infinito", desc: "Correntes saem de suas costas podendo lançar ataques múltiplos (3 por turno, 1d10). Se todas focarem em um alvo e o segurarem, o alvo perde aos poucos todos seus pontos a cada turno. Requisito: 1 ou 2 PV restantes." },
  ],
  Sangue: [
    { nome: "Anatomia Insana", desc: "O seu corpo é transfigurado e parece desenvolver um instinto próprio. Você tem 50% de chance (resultado par em 1d4) de ignorar o dano adicional de um acerto crítico ou ataque furtivo. (Capacidade de up)" },
    { nome: "Arma de Sangue", desc: "Você pode gastar uma ação de movimento e 2 PE para produzir garras, chifres ou uma lâmina de sangue cristalizado. É considerada uma arma simples corpo a corpo e leve que causa 1d6 de dano de Sangue. (Capacidade de up)" },
    { nome: "Sangue de Ferro", desc: "O seu sangue flui de forma paranormal, concedendo vigor não natural. Você recebe +2 pontos de vida por NEX." },
    { nome: "Sangue Vivo", desc: "Na primeira vez que ficar machucado durante uma cena, você começa a se regenerar curando sempre 1/3 da sua vida a cada final de turno. Dura até a cena acabar." },
    { nome: "Helmintos", desc: "Crie parasitas da sua carne que entram em alvos sugando o sangue deles e enviando para o invocador. Para cada 9 PV perdidos do alvo: 1d4-1 de cura. (3 PE por parasita)" },
  ],
  Medo: [
    { nome: "Laço Sombrio", desc: "Enquanto um aliado estiver em estado de morrendo, fale coisas que o tornariam um obsessor, o amaldiçoando nessa terra para que possa te ajudar em combates." },
    { nome: "Cópia Perfeita", desc: "Pegue uma parte que tenha o DNA de uma pessoa e a coma/beba, podendo se transformar nessa pessoa copiando todo seu kit por 2d12 rodadas." },
    { nome: "Decremento", desc: "Diminua objetos a nível molecular e os faça voltar ao tamanho normal quando quiser. Pode ser aplicado também ao invocador." },
    { nome: "Contra Golpe Paranormal", desc: "Se estiver vindo ataque em sua direção ou souber a próxima ação do oponente, você pode mandar contra o próprio invocador o poder invocando ou o ritual feito contra você." },
    { nome: "Olhos de Shinrra", desc: "Fique corpo a corpo com o alvo fazendo-o olhar em seus olhos fixamente, caindo em uma ilusão onde na realidade ele está em transe." },
    { nome: "Tecer Fios", desc: "O invocador pode colocar fios imperceptíveis em qualquer objeto, dando possibilidade de criar emboscadas ou diversas formas de causar dano em combate. (Capacidade de up)" },
  ],
  Combustão: [
    { nome: "Hellflame", desc: "Após perder quase todos seus PV, você pode embuir fogo em seu corpo causando o dano que já sofreu no combate ao seu dano que irá causar na ação. Após o fim do combate o alvo cai em morrendo." },
    { nome: "Guardar Impacto", desc: "Após receber ataques físicos, anote todo tipo de rolagem que lhe causou dano e some todo dado de dano físico acumulado em um ataque que for realizar." },
    { nome: "Controle de Fonte", desc: "Use das mãos como revólver de fogo, podendo disparar pequenas labaredas (1d6+2 + queimar 1d4-1 a cada turno). (Capacidade de up)" },
    { nome: "Chama Lemniscata", desc: "Faça um disparo de chama que deixa o alvo queimando sem possibilidade de apagar (2d6). A única forma de apagar a chama é com elemento Benção. (Capacidade de up)" },
  ],
}

// Graus de ameaça
export const GRAUS_AMEACA = [
  { grau: 1, desc: "Sem multiplicador — considera o dano cheio sem rolagem de dado" },
  { grau: 2, desc: "Multiplicador de 2x no dano" },
  { grau: 3, desc: "Multiplicador de mais de 2x no dano" },
]

// Capacidade de carga por Força
export const CARGA_POR_FORCA = { 0: 1, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 28, 8: 32, 9: 36, 10: 40, 11: 44, 12: 48, 13: 52, 14: 56, 15: 60 }

export const fichaInicial = () => ({
  nome: "", nivel: 1, estagio: 1, classe: "Combatente", trilha: "", genese: "Estudante",
  personalidade: "", elementos: [], raca: "", modificacao: "",
  fotoURL: "", notas: "",
  focos: { Força: 0, Agilidade: 0, Intelecto: 0, Vigor: 0, Domínio: 0 },
  reservas: {
    vida: { atual: 10, max: 10 },
    esforco: { atual: 5, max: 5 },
    sanidade: { atual: 10, max: 10 }
  },
  combate: { resistencia: 0, defesa: 0, contraAtaque: 0, esquiva: 0, armaduraBase: 0, movimento: 0, traumas: "" },
  pericias: Object.fromEntries(Object.values(PERICIAS).flat().map(p => [p, 0])),
  habilidades: [], magias: [], passivas: [], poderes: [],
  armas: [],
  protecao: { colete: "", escudo: "", acessorioPessoal: "", acessorioBelico: "" },
  inventario: []
})
