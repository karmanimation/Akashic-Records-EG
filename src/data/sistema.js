// src/data/sistema.js
export const CLASSES = {
  Combatente: {
    trilhas: ["Protetor", "Berserker", "Duelista"],
    habilidades: ["Golpe Brutal", "Postura de Combate", "Ímpeto", "Resistência Brutal", "Contra-ataque", "Fúria Controlada"],
    passivas: ["Pele Grossa", "Instinto de Sobrevivência", "Marcado pela Guerra"]
  },
  Especialista: {
    trilhas: ["Atirador", "Infiltrador", "Tecnomante", "Invocador"],
    habilidades: ["Tiro Preciso", "Sombra", "Hackear Avançado", "Reflexo Apurado", "Explosivo", "Análise Tática", "Eclético", "Perito", "Celebridade"],
    passivas: ["Treinamento em Perícias", "Olho Clínico", "Adaptação Rápida"]
  },
  Bruxo: {
    trilhas: ["Elementalista", "Ocultista", "Curandeiro"],
    habilidades: ["Canal Elemental", "Ritual Sombrio", "Cura Arcana", "Barreira Mágica", "Invocar Familiar", "Visão Mística"],
    passivas: ["Aura Sensível", "Memória Arcana", "Foco Espiritual"]
  },
  Espião: {
    trilhas: ["Manipulador", "Fantasma", "Interrogador"],
    habilidades: ["Disfarce Perfeito", "Desaparecer", "Quebrar Vontade", "Rede de Contatos", "Veneno Sutil", "Leitura de Ambiente"],
    passivas: ["Paranoia Treinada", "Face Neutra", "Saída de Emergência"]
  }
}

export const PERICIAS = {
  Domínio: ["Observar", "Ouvir", "Ocultismo", "Intuição", "Intimidação", "Charme", "Lábia", "Enganação", "Diplomacia", "Vontade", "Percepção", "Religião", "Acalmar", "Disfarce", "Adestramento", "Detectar Aura", "Identificar Criatura", "Identificar Magia"],
  Força: ["Luta", "Atletismo", "Agarrar", "Desarmar"],
  Vigor: ["Fortitude", "Sanidade"],
  Intelecto: ["Tática", "Analisar Terreno", "Outra Língua", "Tecnologia", "Hacker", "Localizar", "Atualidade", "Operar Dispositivos Amaldiçoados", "Profissão", "Orientar", "Sobrevivência", "Cozinhar", "Acampar", "Medicina", "Primeiros Socorros", "Investigação"],
  Agilidade: ["Pilotagem", "Pontaria", "Arremessar", "Reflexo", "Esconder", "Furtividade", "Seguir", "Iniciativa", "Crime", "Arrombar", "Artes", "Nadar", "Cavalgar"]
}

export const GENESES = ["Sofredor", "Estudante", "Agricultor", "Golpista", "Programador", "Militar", "Médico", "Artista", "Psicólogo", "Comerciante", "Mecânico", "Detetive", "Atleta", "Criminoso", "Religioso", "Nômade", "Cientista", "Político", "Aventureiro", "Sem Gênese"]
export const ELEMENTOS = ["Nenhum", "Terra", "Fogo", "Água", "Ar", "Sangue", "Morte", "Combustão", "Energia", "Benção", "Medo", "Alma", "Ignição"]
export const PERSONALIDADES = ["Bravo", "Triste", "Alegre", "Frio", "Medroso", "Aventureiro"]
export const TIPOS_ARMA = ["Leve", "Média", "Tática", "Pesada", "Improvisada"]

export const fichaInicial = () => ({
  nome: "", nivel: 1, classe: "Combatente", trilha: "", genese: "Estudante",
  personalidade: "Aventureiro", elemento: "Nenhum", raca: "", modificacao: "",
  xp: 0, fotoURL: "", notas: "",
  focos: { Força: 0, Agilidade: 0, Intelecto: 0, Vigor: 0, Domínio: 0 },
  reservas: {
    vida: { atual: 10, bonus: 0 },
    esforco: { atual: 5, bonus: 0 },
    sanidade: { atual: 10, bonus: 0 }
  },
  combate: { resistencia: 0, defesa: 0, contraAtaque: 0, esquiva: 0, armaduraBase: 0, movimento: 0, traumas: "" },
  pericias: Object.fromEntries(Object.values(PERICIAS).flat().map(p => [p, 0])),
  habilidades: [], magias: [], passivas: [], poderes: [],
  armas: [],
  protecao: { colete: "", escudo: "", acessorioPessoal: "", acessorioBelico: "" },
  capacidadeCarga: 0,
  inventario: []
})
