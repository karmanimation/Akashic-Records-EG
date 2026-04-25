// src/data/sistema.js

// ─── ACESSÓRIOS DE ARMA ───────────────────────────────────────
export const ACESSORIOS_ARMA = [
  { nome: "Silenciador", desc: "Permite realizar disparos furtivos sem que inimigos achem sua posição.", peso: 1 },
  { nome: "Pente Alongado", desc: "Tem a capacidade aumentada para um municiador e meio.", peso: 2 },
  { nome: "Mira Laser", desc: "Aumenta a capacidade de acerto em +2 pontos.", peso: 1 },
  { nome: "Mira de Calor", desc: "Não sofre penalidade no acerto por terreno difícil, se o alvo possuir calor.", peso: 2 },
  { nome: "Lanterna", desc: "Não sofre penalidade no acerto em cenas com baixa luminosidade.", peso: 1 },
  { nome: "Suporte", desc: "Aumenta a precisão da arma em +1 ponto em acerto.", peso: 1 },
  { nome: "Baleiro", desc: "Permite recarregar de forma ágil, não gastando a ação padrão por completo.", peso: 1 },
  { nome: "Kit Conversão", desc: "Permite modificar uma arma manual em semiautomática causando +1 dado de DANO da arma.", peso: 3 },
  { nome: "Empunhadura", desc: "Diminui o recuo e estabiliza a arma, ganhando +1 ponto no acerto.", peso: 1 },
]

// ─── TIPOS DE MUNIÇÃO ─────────────────────────────────────────
export const TIPOS_MUNICAO = [
  { nome: "Padrão", desc: "Relativo para todas as categorias das armas. Se usada como categoria leve em armas de calibre mais altos o DANO é reduzido, causando DANO da categoria inferior.", peso: "Padrão" },
  { nome: "Pesada", desc: "Aumenta em +1 dado de DANO da arma disparada.", peso: "1 por bala" },
  { nome: "Perfurante", desc: "Concede 50% de perfuração em seus disparos, causando metade do DANO da arma utilizada.", peso: "1 por bala" },
  { nome: "Impacto", desc: "Aumenta a DISTÂNCIA que a arma dispara para uma categoria acima.", peso: "1/2 por bala" },
]

// ─── CLASSES — habilidades (gastam PE) e passivas (não gastam PE) ──
export const CLASSES = {
  Combatente: {
    trilhas: ["Soldado", "Comandante", "Linha de Frente", "Suporte de Campo", "Invocador"],
    habilidades: [
      { nome: "Armamento Pesado", desc: "Recebe proficiência com armas pesadas.\n(Requisito: Força 2)" },
      { nome: "Artista Marcial", desc: "Ataques desarmados causam +1d8 de DANO, podendo causar DANO LETAL. As mãos passam a ser consideradas ARMAS LEVES. Se tirar CRÍTICO e a diferença da DT for superior a 10 pontos, pode quebrar um membro do adversário, gerando desvantagem ao alvo." },
      { nome: "Ataque de Oportunidade", desc: "Sempre que um alvo sair VOLUNTARIAMENTE de um espaço adjacente ao seu, gaste 1 PE para realizar um ataque corpo a corpo contra ele." },
      { nome: "Combater com Duas Armas", desc: "Ao atacar empunhando duas armas (uma delas precisa ser leve), pode realizar DOIS ataques, um com cada arma.\n(Requisito: Agilidade 3, Treinado em Luta ou Pontaria)" },
      { nome: "Combate Defensivo", desc: "Ao atacar, pode combater defensivamente: o ataque não recebe bônus de DANO, mas até o próximo turno nenhum atacante adiciona bônus de DANO contra você, e você recebe +5 de DEFESA BASE.\n(Requisito: Intelecto 2)" },
      { nome: "Fúria Alternanda", desc: "Altera o estilo de jogabilidade PADRÃO (curto para longo alcance, atacante para suporte, ou atacante para invocador), causando Fúria e concedendo +6 pontos em rolagens de perícias de Domínio, Agilidade e Intelecto até retornar ao estado normal.\n(Requisito: Combo de Habilidades, Itens e Passivas)" },
      { nome: "Golpe Demolidor", desc: "Ao realizar uma manobra ou arremessar algo, gaste 1 PE para causar +2 dados do mesmo tipo de DANO causado.\n(Requisito: Força 2, Treinado em Luta)" },
      { nome: "Golpe Pesado", desc: "O DANO das suas armas leves de curto alcance aumenta em +1 dado do mesmo tipo da arma." },
      { nome: "Incansável", desc: "Uma vez por CENA, gaste 2 PE para realizar uma ação de Fortitude adicional, podendo alterar o atributo-base para FORÇA ou AGILIDADE.\n(Requisito: Treinado em Fortitude)" },
      { nome: "Instinto de Batalha", desc: "Por CENA, ao receber DANO que reduza metade dos seus pontos de vida, acumule 3 pontos adicionais em rolagens (máximo 9 pontos). Gaste 2 PE para usar esse bônus em QUALQUER rolagem.\n(Requisito: Intelecto 3)" },
      { nome: "Prestreza Atlética", desc: "Ao realizar um teste de Investigação, gaste 3 PE para alterar o atributo-base para FORÇA ou AGILIDADE. Se passar, o próximo aliado que realizar um teste de Investigação pode usar a mesma rolagem.\n(Requisito: Treinado em Investigação)" },
      { nome: "Proteção Pesada", desc: "Recebe proficiência com proteções pesadas." },
      { nome: "Reflexo Defensivo", desc: "Recebe +2 de defesa base e em testes de resistência, fortitude, intuição, ocultismo, sanidade, etc.\n(Requisito: Agilidade 2)" },
      { nome: "Saque Rápido", desc: "Permite sacar e guardar armas com uma AÇÃO LIVRE, e recarregar armas com uma AÇÃO DE MOVIMENTO.\n(Requisito: Treinado em Iniciativa)" },
      { nome: "Segurar o Gatilho", desc: "Ao acertar um disparo com arma de fogo, pode realizar disparos adicionais contra o mesmo alvo, gastando 2 PE por disparo (escalando: 2 PE, 4 PE, 6 PE...), até errar ou atingir o limite de PE por RODADA." },
      { nome: "Sentido Tático", desc: "Gaste uma ação de movimento e 2 PE para ter +3 de defesa base e bônus igual ao Intelecto em perícias de resistência.\n(Requisito: Intelecto 2, Treinado em Tática e Percepção)" },
      { nome: "Tanque de Guerra", desc: "Ao usar uma proteção pesada, sua defesa e resistência a DANO aumentam em +3.\n(Requisito: Proteção Pesada)" },
      { nome: "Tiro Certeiro", desc: "Ao disparar com arma de fogo, não sofre penalidade por disparar em alvo corpo a corpo com um aliado. Adiciona AGILIDADE na rolagem de DANO.\n(Requisito: Treinado em Pontaria)" },
      { nome: "Tiro de Cobertura", desc: "Ao atacar um alvo, gaste 2 PE para forçá-lo a se defender, impedindo-o de se mover até a próxima rodada. O alvo rola Vontade contra sua Pontaria; se você ganhar, além de imóvel, o alvo sofre -5 em rolagens de Pontaria e Luta." },
      { nome: "Transcender", desc: "Permite escolher um PODER SOBRENATURAL do seu Elemento, sem ganhar pontos de SANIDADE nesse nível." },
      { nome: "Último Fôlego", desc: "Quando estiver prestes a sucumbir à loucura, gaste 2 PE para recuperar BREVEMENTE a consciência e realizar uma ação para se salvar.\n(Requisito: Vigor 3)" },
      { nome: "Ataque Especial", desc: "Gaste 1 PE para ter +4 de DANO ou +4 nas rolagens de acerto. (Disponível a partir do Nível 10)" },
    ],
    passivas: [
      { nome: "Potente", desc: "Recebe +3 de DANO adicional usando armas corpo a corpo." },
      { nome: "Pele Grossa", desc: "Reduz 1 ponto de qualquer dano recebido." },
      { nome: "Marcado pela Guerra", desc: "Começa cada cena com +1d6 de PV temporários." },
    ]
  },
  Especialista: {
    trilhas: ["Armamentista", "Técnico", "Médico", "Negociador", "Invocador"],
    habilidades: [
      { nome: "Análise Instantânea", desc: "Uma vez por CENA, gaste 2 PE para passar o turno analisando uma ação, ataque, habilidade ou passiva do inimigo. Na próxima RODADA, todos os aliados ganham +10 pontos para resistir àquela ação.\n(Requisito: Treinado em Analisar Criatura)" },
      { nome: "Artista Marcial", desc: "Ataques desarmados causam +1d6 de DANO, podendo causar DANO LETAL. Se tirar CRÍTICO e a diferença da DT for superior a 10 pontos, pode quebrar um membro do adversário, gerando desvantagem ao alvo." },
      { nome: "Balística Avançada", desc: "Recebe proficiência com armas Táticas e +4 de DANO com armas de fogo." },
      { nome: "Calculado", desc: "Durante CENAS DE INTERLÚDIO (DESCANSO), ao se preparar estudando, praticando ou investigando, gaste 2 PE para ter +1d6 em todas as rolagens até concluir seu objetivo.\n(Requisito: Intelecto 3, Treinado em Atualidade)" },
      { nome: "Conhecimento Aplicado", desc: "Ao realizar um teste de perícia (exceto luta e pontaria), gaste 2 PE para alterar o atributo-base para Intelecto.\n(Requisito: Intelecto 2)" },
      { nome: "Eclético", desc: "Gaste 2 PE para adicionar +5 em qualquer rolagem de perícia. (Disponível a partir do Nível 10)" },
      { nome: "Engenhoca", desc: "Ao portar um Equipamento DEFENSIVO, gaste 2 PE mais materiais para criar um reforço no objeto, concedendo +3 de Defesa Base até o fim da CENA.\n(Requisito: Treinado em Tática e possuir algo Defensivo)" },
      { nome: "Hacker", desc: "Ao realizar uma AÇÃO relacionada a hackear, gaste 2 PE para receber +5 pontos em Hacker e Tecnologia até o final da CENA. A ação consome apenas METADE DA AÇÃO PADRÃO.\n(Requisito: Treinado em Tecnologia)" },
      { nome: "Improviso Rápido", desc: "Uma vez por CENA, gaste 3 PE para ganhar a AÇÃO: BUSCAR. Procure o objeto ideal para resolver um problema ou completar a CENA.\n(Requisito: Treinado em Tática)" },
      { nome: "Indução ao Erro", desc: "Sempre que sofrer consequências de ações ou ataques originados por outra pessoa, gaste 3 PE para reduzir em -5 qualquer rolagem que tenha você como alvo.\n(Requisito: Treinado em Reflexo)" },
      { nome: "Mãos Rápidas", desc: "Ao realizar uma rolagem da perícia Crime, gaste 1 PE para realizá-la como uma AÇÃO LIVRE.\n(Requisito: Agilidade 3, Treinado em Crime)" },
      { nome: "Mochila de Utilidades", desc: "Escolha um item (exceto armas): diminua sua categoria uma vez e reduza seu espaço em -2." },
      { nome: "Movimento Tático", desc: "Ao entrar em uma CENA com terreno difícil, gaste 1 PE para ignorar QUALQUER desvantagem do terreno.\n(Requisito: Treinado em Atletismo)" },
      { nome: "Na Trilha Certa", desc: "Ao ter sucesso em testes de perícias de investigação, gaste 1 PE para ter +5 no próximo teste. Custo e bônus são acumulativos." },
      { nome: "Nerd", desc: "Uma vez por CENA, gaste 2 PE para rolar Atualidade (DT 20). Se passar, recebe uma informação útil para a CENA." },
      { nome: "Ninja Urbano", desc: "Recebe proficiência com armas médias e +3 pontos em rolagens de Furtividade." },
      { nome: "Pensamento Ágil", desc: "Uma vez por CENA, durante CENAS DE INVESTIGAÇÃO, gaste 2 PE para realizar uma ação de investigação adicional como rolagem bônus." },
      { nome: "Perito", desc: "Gaste 1 PE para adicionar 1d6 em rolagens de atributo puro (sem perícia). (Disponível a partir do Nível 10)" },
      { nome: "Perito em Explosivos", desc: "Resistência aos seus próprios Explosivos igual ao seu Intelecto. Pode excluir um número de pessoas das suas Explosões também igual ao seu Intelecto.\n(Requisito: Intelecto 2)" },
      { nome: "Plano de Contingência", desc: "Ao observar uma rolagem com resultado 1 de um aliado, gaste 2 PE para impedir o desastre e refazer a rolagem.\n(Requisito: Treinado em Reflexo)" },
      { nome: "Primeira Impressão", desc: "Na primeira interação com alguém da CENA, gaste 2 PE para ter +6 em uma rolagem de qualquer perícia Interpessoal.\n(Requisito: Domínio 2)" },
      { nome: "Transcender", desc: "Permite escolher um PODER SOBRENATURAL do seu Elemento, sem ganhar pontos de SANIDADE nesse nível." },
      { nome: "Treinamento em Perícias", desc: "Escolha DUAS perícias para se tornar Treinado, ganhando +5 pontos. Ao atingir o Nível 35, torna-se Veterano nessas perícias, ganhando +10 pontos." },
    ],
    passivas: [
      { nome: "Na Trilha Certa (Passiva)", desc: "Ao ter sucesso em testes de perícias relacionadas à investigação, o bônus acumulado persiste até o final da cena." },
      { nome: "Olho Clínico", desc: "Pode identificar fraquezas e doenças com um olhar." },
      { nome: "Adaptação Rápida", desc: "Reduz em 1 turno o tempo para se adaptar a novos ambientes." },
    ]
  },
  Bruxo: {
    trilhas: ["Ocultista", "Peregrino", "Eremita", "Ilusionista", "Flagelador"],
    habilidades: [
      { nome: "Camuflar Ocultismo", desc: "Ao realizar rolagens de Esconder para objetos sobrenaturais, camufle a energia do item/alvo (número de alvos igual à quantidade de pontos em DOMÍNIO). Gaste 2 PE para lançar qualquer ritual sem componentes nem movimentação. Inimigos só perceberão o ritual se passarem em Ocultismo DT 25.\n(Requisito: Agilidade 3)" },
      { nome: "Criar Selo", desc: "Permite desenhar selos de rituais conhecidos. Custo: PE do ritual + uma AÇÃO PADRÃO COMPLETA. Número de selos ativos simultâneos igual à quantidade de pontos em DOMÍNIO.\n(Requisito: Domínio 2, Treinado em Ocultismo)" },
      { nome: "Deslumbre", desc: "Permite escolher um ritual de outro elemento que não o seu, de PRIMEIRA ou SEGUNDA Trava." },
      { nome: "Empalador", desc: "Rituais DISPARÁVEIS ignoram proteções e BARREIRAS MÁGICAS. Gaste 3 PE para miniaturizar o golpe, tornando-o PEQUENO e PERFURANTE: causa METADE do DANO em objetos e pessoas com proteções mágicas, ignorando resistência ao elemento." },
      { nome: "Escolhido", desc: "Você ganha +2 rituais de 1ª trava do seu elemento. (Disponível a partir do Nível 10)" },
      { nome: "Ferramenta Sobrenatural", desc: "Reduza uma categoria de um item sobrenatural à sua escolha e não precisa gastar PE para ativá-lo." },
      { nome: "Fluxo de Poder", desc: "Permite manter até DOIS rituais ao mesmo tempo, gastando sua AÇÃO PADRÃO e o PE de cada um separadamente.\n(Requisito: Vigor 2, Domínio 2)" },
      { nome: "Fluxo Vital", desc: "Ao notar um projétil vindo em sua direção, gaste 3 PE para reduzir o DANO em -6.\n(Requisito: Agilidade 2)" },
      { nome: "Fúria Alternada", desc: "Altera o estilo de jogabilidade PADRÃO (longo para curto alcance, atacante para suporte, ou invocador para atacante), causando Fúria e concedendo +6 pontos em rolagens de perícias de Força, Vigor e Agilidade até retornar ao estado normal. Requer descanso após o uso.\n(Requisito: Combo de Habilidades, Itens e Passivas)" },
      { nome: "Guiado Pelo Sobrenatural", desc: "Uma vez por CENA, gaste 2 PE para realizar uma rolagem de Investigação adicional.\n(Requisito: Treinado em Investigação)" },
      { nome: "Identificação Paranormal", desc: "Recebe +6 em testes de IDENTIFICAR CRIATURA, OCULTISMO e OPERAR DISPOSITIVOS.\n(Requisito: Domínio 3)" },
      { nome: "Improvisar Componentes", desc: "Uma vez por CENA, gaste uma AÇÃO PADRÃO para rolar Investigação (DT 15). Se passar, encontra objetos que funcionam como COMPONENTES RITUALÍSTICOS de um elemento à sua escolha.\n(Requisito: Treinado em Investigar)" },
      { nome: "Mestre do Elemento", desc: "Escolha um elemento. O custo de PE para realizar rituais desse elemento diminui em -3.\n(Requisito: Treinado apenas em um elemento)" },
      { nome: "Presença do Pacto", desc: "Uma vez por CENA, gaste 2 PE para identificar rituais, energias, habilidades, criaturas e intenções de forma rápida e automática.\n(Requisito: Domínio 3)" },
      { nome: "Reservatório do Além", desc: "Sempre que tiver um acerto crítico em rolagens sobrenaturais, ganhe +2 PE excedentes armazenados com a Entidade do seu elemento. Máximo de 10 PE excedentes.\n(Requisito: Ter um Elemento principal)" },
      { nome: "Ritual Potente", desc: "O Invocador soma seu Intelecto em rolagens de DANO e CURA por RITUAIS.\n(Requisito: Intelecto 2)" },
      { nome: "Ritual Predileto", desc: "Escolha um ritual que possua e diminua seu custo de PE em -5.\n(Requisito: Intelecto 2)" },
      { nome: "Tatuagem Ritualista", desc: "Marque símbolos elementais na pele para aprisionar magias, armas e itens sobrenaturais, facilitando a execução de rituais e o transporte de itens.\n(Requisito: Domínio 3)" },
      { nome: "Transcender", desc: "Permite escolher um PODER SOBRENATURAL do seu Elemento, sem ganhar pontos de SANIDADE nesse nível." },
      { nome: "Treinamento em Perícias", desc: "Escolha DUAS perícias para se tornar Treinado, ganhando +5 pontos. Ao atingir o Nível 35, torna-se Veterano nessas perícias, ganhando +10 pontos." },
    ],
    passivas: [
      { nome: "Especialista em Elemento", desc: "Escolha um elemento. Sua resistência a esse elemento aumenta em +5." },
      { nome: "Envolto em Mistério", desc: "Recebe +5 em Enganação e Intimidação contra pessoas não treinadas em Ocultismo. O MESTRE define os limites.\n(Requisito: Domínio 3)" },
      { nome: "Intuição Sobrenatural", desc: "Sempre que auxiliar um aliado em Investigação, ele soma Intelecto + Domínio do Invocador na rolagem.\n(Requisito: Domínio 2)" },
    ]
  },
  Espião: {
    trilhas: ["Assassino", "Atirador de Elite", "Tranqueira", "Assaltante", "Invocador"],
    habilidades: [
      { nome: "Análise", desc: "Em CENAS, gaste 3 PE para passar um turno analisando o alvo, reduzindo sua DEFESA BASE em -4 até o final da CENA.\n(Requisito: Intelecto 2)" },
      { nome: "Armamento Pesado", desc: "Recebe proficiência com armas pesadas.\n(Requisito: Força 2)" },
      { nome: "Ataque Perfurante", desc: "Ao atacar um alvo com armaduras, escudos ou qualquer tipo de defesa, metade do DANO é SEMPRE aplicado diretamente aos pontos de vida do alvo." },
      { nome: "Conhecimento", desc: "Ao realizar uma rolagem de perícia (exceto luta e pontaria), gaste 2 PE para mudar o atributo-base da perícia à sua escolha.\n(Requisito: Intelecto 3)" },
      { nome: "Detetive", desc: "Uma vez por CENA, gaste 2 PE para realizar uma ação de investigação SEM possibilidade de falha em branco.\n(Requisito: Agilidade 2)" },
      { nome: "Furto", desc: "Ao realizar uma ação relacionada a roubar, furtar, agarrar ou esconder, gaste 2 PE para realizá-la como ação livre na CENA.\n(Requisito: Agilidade 2, Treinado em Crime)" },
      { nome: "Fúria Alternada", desc: "Altera o estilo de jogabilidade PADRÃO (longo para curto alcance, atacante para suporte, ou suporte para atacante), causando Fúria e concedendo +6 pontos em rolagens de perícias de Força, Vigor, Domínio e Intelecto até retornar ao estado normal. Requer descanso após o uso.\n(Requisito: Combo de Habilidades, Itens e Passivas)" },
      { nome: "Incessante", desc: "Sempre que acertar uma rolagem de arremesso, pode arremessar novamente contra o mesmo alvo, escalando o DANO acumulado. Custo: 2 PE por acerto adicional, até errar ou atingir o limite de PE por turno.\n(Requisito: Vigor 2)" },
      { nome: "Invisibilidade Certeira", desc: "Sempre que um alvo em alcance curto tirar o foco de você, gaste 2 PE para realizar um teste de Furtividade contra ele.\n(Requisito: Agilidade 2)" },
      { nome: "Item Predileto", desc: "Escolha uma ARMA e diminua sua CATEGORIA uma vez, reduzindo consequentemente sua desvantagem." },
      { nome: "Lâmina Afiada", desc: "Sempre que tiver um ACERTO CRÍTICO com armas de curto alcance no NÍVEL DE AMEAÇA 2, o alvo rola Fortitude (DT 13) para não desmaiar.\n(Requisito: Força 3)" },
      { nome: "Mestre das Armas", desc: "Ataques com armas leves causam +1d12 de DANO, podendo causar DANO LETAL. Quando FURTIVO e o acerto for CRÍTICO contra um alvo com baixo PERCEPÇÃO (diferença de 10 pontos), causa mais um dado de DANO da arma utilizada." },
      { nome: "Na Mira", desc: "Gaste 2 PE para se concentrar (1 rodada) e ter +1 DADO de vantagem em qualquer rolagem à sua escolha.\n(Requisito: Domínio 3)" },
      { nome: "Nas Sombras", desc: "Ao se mover pelo cenário, gaste 2 PE para ganhar mais uma AÇÃO DE MOVIMENTO e realizar UM ataque sem perder sua FURTIVIDADE.\n(Requisito: Agilidade 3)" },
      { nome: "Oculto", desc: "Pode gastar 2 PE para ter +6 em furtividade ou dano. (Disponível a partir do Nível 10)" },
      { nome: "Passos", desc: "Ao tentar passar imperceptível, gaste 3 PE para esconder sua presença e aura, tornando-se completamente imperceptível a ouvidos, narizes e percepções de presença.\n(Requisito: Agilidade 3, Treinado em Furtividade)" },
      { nome: "Persona", desc: "Uma vez por CENA, gaste 3 PE para se passar por outra pessoa completamente, com outra história, traumas e objetivos, enganando a todos — inclusive seu próprio cérebro.\n(Requisito: Domínio 3)" },
      { nome: "Primeira Impressão", desc: "Na primeira interação com alguém da CENA, gaste 2 PE para ter +4 em qualquer rolagem de perícia Interpessoal.\n(Requisito: Domínio 3)" },
      { nome: "Proteções Médias", desc: "Recebe proficiência com proteções médias.\n(Requisito: Força 2)" },
      { nome: "Reflexo", desc: "Gaste 3 PE para receber +2 pontos em rolagens de perícias com base em Agilidade até o fim da CENA.\n(Requisito: Agilidade 2)" },
      { nome: "Terreno Tático", desc: "Gaste sua AÇÃO PADRÃO e 4 PE para percorrer a cena: você e seus aliados ganham +3 em DEFESA BASE, ACERTOS e rolagens com base em Agilidade até o fim da CENA.\n(Requisito: Treinado em Tática e Analisar Terreno)" },
      { nome: "Transcender", desc: "Permite escolher um PODER SOBRENATURAL do seu Elemento, sem ganhar pontos de SANIDADE nesse nível." },
      { nome: "Vulnerável", desc: "Gaste sua AÇÃO PADRÃO e 1 PE para preparar um ataque que, no próximo turno, desarme o alvo. Se o acerto for crítico, a arma do alvo se QUEBRA.\n(Requisito: Força 2)" },
    ],
    passivas: [
      { nome: "Prático e Rápido", desc: "Ações rápidas, arremessos, saques e uso de armas leves NÃO SÃO consideradas AÇÕES PADRÕES. Pode realizar duas ações leves por turno sem perder suas outras ações.\n(Requisito: Vigor 3)" },
      { nome: "Paranoia Treinada", desc: "Nunca é surpreendido, sempre age no primeiro turno." },
      { nome: "Face Neutra", desc: "Recebe +5 em testes para esconder emoções e intenções." },
    ]
  }
}

// ─── CAPACIDADES AUTOMÁTICAS POR CLASSE/TRILHA/NÍVEL ──────────
export const CAPACIDADES_AUTOMATICAS = {
  Combatente: {
    base: {
      habilidades: [],
      passivas: [{ nome: "Base do Combatente", desc: "12 PV · 3 PE · 6 SAN\n3 pontos em atributos\n1 em Luta ou Pontaria\n1 em Fortitude ou Reflexo\n3 em qualquer outra perícia\nA cada nível 1,2,3: +3 PV por nível (até nível 20)\nProficiências: armas leves, táticas e armaduras leves" }]
    },
    trilhas: {
      "Soldado": {
        nivel30: { nome: "Passiva de Soldado (Estágio 1)", desc: "Quando for imobilizado, entra em estado de fúria, ganhando 1d12 em todas as suas rolagens, além de +15 em teste de Força, Agilidade e Vigor." },
        nivel50: { nome: "Passiva de Soldado (Estágio 2)", desc: "Ao tomar um alto dano de sanidade (+ de sua metade), o indivíduo ganha +1 dado em todos os atributos, além de +1 ação em todas as suas cenas de combate." }
      },
      "Comandante": {
        nivel30: { nome: "Passiva de Comandante (Estágio 1)", desc: "Em cenas de Combate, perseguição e investigação, você ganha +2 pontos em rolagens de atributos por cada aliado na cena." },
        nivel50: { nome: "Passiva de Comandante (Estágio 2)", desc: "Usar armas de disparo e/ou armas brancas concedem +3 dados de DANO do mesmo tipo da arma." }
      },
      "Linha de Frente": {
        nivel30: { nome: "Passiva de Linha de Frente (Estágio 1)", desc: "Ganha +10 pontos em Defesa Base." },
        nivel50: { nome: "Passiva de Linha de Frente (Estágio 2)", desc: "O indivíduo só poderá cair morrendo se falhar em um teste de Fortitude. DT 20." }
      },
      "Suporte de Campo": {
        nivel30: { nome: "Passiva de Suporte de Campo (Estágio 1)", desc: "Sempre que for realizar um teste de Vigor ou Intelecto, você ganha +2 por cada aliado na cena." },
        nivel50: { nome: "Passiva de Suporte de Campo (Estágio 2)", desc: "Fique livre em batalha podendo escolher no turno sua posição na fila de rodadas." }
      },
      "Invocador": {
        nivel30: { nome: "Passiva de Invocador (Estágio 1)", desc: "Você pode escolher um PODER PARANORMAL do seu próprio elemento." },
        nivel50: { nome: "Passiva de Invocador (Estágio 2)", desc: "Pode aprimorar um poder paranormal (aqueles com capacidade de up) ou escolher outro poder paranormal do seu próprio elemento." }
      }
    }
  },
  Especialista: {
    base: {
      habilidades: [],
      passivas: [{ nome: "Base do Especialista", desc: "8 PV · 5 PE · 10 SAN\n4 pontos em atributos\n10 pontos em qualquer perícia\nA cada nível 1,2,3: +1 PV e +2 pontos em perícia por nível (até nível 20)\nProficiências: armas leves e armaduras leves" }]
    },
    trilhas: {
      "Armamentista": {
        nivel30: { nome: "Passiva de Armamentista (Estágio 1)", desc: "Quando for mexer em armas, tenha +6 em rolagens de Intelecto." },
        nivel50: { nome: "Passiva de Armamentista (Estágio 2)", desc: "Com conhecimento suficiente, poderá aprimorar, misturar armas e criá-las com capacidade de aprisionar demônios." }
      },
      "Técnico": {
        nivel30: { nome: "Passiva de Técnico (Estágio 1)", desc: "Sempre que o indivíduo for montar algo, recebe +7 de bônus em suas respectivas perícias." },
        nivel50: { nome: "Passiva de Técnico (Estágio 2)", desc: "Com aprimoramento, o indivíduo consegue invadir qualquer coisa, podendo extrair qualquer capacidade. Requisito: Passar em teste de Tecnologia DT 20." }
      },
      "Médico": {
        nivel30: { nome: "Passiva de Médico (Estágio 1)", desc: "Em cenas que utilizar primeiros socorros ou qualquer ação de cura, pode usar armas, e o dano da arma é convertido em cura no final do tratamento." },
        nivel50: { nome: "Passiva de Médico (Estágio 2)", desc: "Quando um aliado cair morrendo, o indivíduo ganha uma ação bônus em seguida do aliado caído. Essas ações bônus, se utilizar cura, têm os valores dobrados." }
      },
      "Negociador": {
        nivel30: { nome: "Passiva de Negociador (Estágio 1)", desc: "Após interagir com um alvo que não passou contra sua perícia interpessoal, o alvo recebe -5 pontos em perícias relacionadas a você." },
        nivel50: { nome: "Passiva de Negociador (Estágio 2)", desc: "Sempre que realizar uma troca de itens, escolha algum atributo do item trocado para mudar: peso, nível de ameaça, classe ou utilidade." }
      },
      "Invocador": {
        nivel30: { nome: "Passiva de Invocador (Estágio 1)", desc: "Você pode escolher um PODER PARANORMAL do seu próprio elemento." },
        nivel50: { nome: "Passiva de Invocador (Estágio 2)", desc: "Pode aprimorar um poder paranormal (aqueles com capacidade de up) ou escolher outro poder paranormal do seu próprio elemento." }
      }
    }
  },
  Bruxo: {
    base: {
      habilidades: [],
      passivas: [{ nome: "Base do Bruxo", desc: "6 PV · 7 PE · 13 SAN\n3 pontos em atributo\n1 ponto em Ocultismo e Vontade\n+4 pontos em qualquer perícia\nA cada nível 1,2,3: +1 PV e +1 PE por nível (até nível 20)\nProficiências: armas leves" }]
    },
    trilhas: {
      "Ocultista": {
        nivel30: { nome: "Passiva Ocultista (Estágio 1)", desc: "Rituais que consomem itens ritualísticos aumentam sua capacidade em +1, podendo ser utilizados 2 vezes. Se o elemento não consume o item, o item se torna imortal." },
        nivel50: { nome: "Passiva Ocultista (Estágio 2)", desc: "Ganha a capacidade de mesclar rituais de 1ª trava com rituais de 2ª trava e de 3ª trava de outro elemento." }
      },
      "Peregrino": {
        nivel30: { nome: "Passiva Peregrino (Estágio 1)", desc: "Passar 1 rodada se concentrando em um ritual faz com que ele ganhe 1d6 de dano, duração e efeito por rodada. É acumulativo." },
        nivel50: { nome: "Passiva Peregrino (Estágio 2)", desc: "Tem a capacidade de pegar 2 habilidades de outras classes." }
      },
      "Eremita": {
        nivel30: { nome: "Passiva Eremita (Estágio 1)", desc: "O indivíduo consegue realizar magias gastando suas ações de movimento ao invés de ação padrão." },
        nivel50: { nome: "Passiva Eremita (Estágio 2)", desc: "Alvos imobilizados ficam vulneráveis para o Eremita, tendo metade de sua armadura ou reflexo reduzidos. Os pontos reduzidos vêm como pontos para o bruxo, como acerto OU dano." }
      },
      "Ilusionista": {
        nivel30: { nome: "Passiva Ilusionista (Estágio 1)", desc: "Sempre que quiser, pode usar magias em objetos para ajudar a realizar ações específicas e tem a capacidade de alterar a função do objeto." },
        nivel50: { nome: "Passiva Ilusionista (Estágio 2)", desc: "O indivíduo pode realizar testes interpessoais em qualquer ocasião. Se o alvo cair, suas próximas 3 ações naquele alvo recebem vantagem em todas as rolagens." }
      },
      "Flagelador": {
        nivel30: { nome: "Passiva Flagelador (Estágio 1)", desc: "Você pode escolher um PODER PARANORMAL do seu próprio elemento." },
        nivel50: { nome: "Passiva Flagelador (Estágio 2)", desc: "Ganha um contra ataque mágico e adiciona Ocultismo em sua Defesa Base. Se o alvo não passar, o indivíduo pode fazer qualquer magia de 1ª ou 2ª trava como contra ataque." }
      }
    }
  },
  Espião: {
    base: {
      habilidades: [],
      passivas: [{ nome: "Base do Espião", desc: "4 PV · 5 PE · 9 SAN\n5 pontos em atributo\n1 ponto em Furtividade e Tática\n+4 pontos em qualquer perícia\nA cada nível 1,2,3: +1 PV e +1 ponto em perícia por nível (até nível 20)\nProficiências: armas táticas e armas leves" }]
    },
    trilhas: {
      "Assassino": {
        nivel30: { nome: "Passiva Assassino (Estágio 1)", desc: "Acertar ataques furtivos ignora a armadura do alvo causando dano direto na vida." },
        nivel50: { nome: "Passiva Assassino (Estágio 2)", desc: "Quando estiver furtivo e o alvo não passar na DT de acerto, o indivíduo consegue dar crítico causando +2x (além do crítico natural)." }
      },
      "Atirador de Elite": {
        nivel30: { nome: "Passiva Atirador de Elite (Estágio 1)", desc: "Acertos com armas de disparo causam sangramento dobrado." },
        nivel50: { nome: "Passiva Atirador de Elite (Estágio 2)", desc: "O primeiro disparo feito pelo indivíduo na cena, se for crítico, o multiplicador é +x3 (além do crítico natural)." }
      },
      "Tranqueira": {
        nivel30: { nome: "Passiva Tranqueira (Estágio 1)", desc: "Quando o indivíduo realizar uma manobra corpo a corpo, recebe +10 de bônus em suas rolagens." },
        nivel50: { nome: "Passiva Tranqueira (Estágio 2)", desc: "Torne-se ligeiro e imprevisível: habilidades, rituais ou ações que fazem ficar parado são feitas com desvantagem, pegando sempre o pior resultado." }
      },
      "Assaltante": {
        nivel30: { nome: "Passiva Assaltante (Estágio 1)", desc: "Escolha até 3 itens para se transformar em seus preferidos sentimentais, que mesmo com desastre não podem quebrar ou falhar." },
        nivel50: { nome: "Passiva Assaltante (Estágio 2)", desc: "Os itens de pessoas em suas mãos não perdem as habilidades, rituais e modificações, e funcionam como se estivessem na mão do próprio dono." }
      },
      "Invocador": {
        nivel30: { nome: "Passiva de Invocador (Estágio 1)", desc: "Você pode escolher um PODER PARANORMAL do seu próprio elemento." },
        nivel50: { nome: "Passiva de Invocador (Estágio 2)", desc: "Pode aprimorar um poder paranormal (aqueles com capacidade de up) ou escolher outro poder paranormal do seu próprio elemento." }
      }
    }
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
    { nome: "Espada Pesada", dano: "2d12+6", municao: "x", espaco: 12, alcance: "Médio Alcance", critico: "19-20(x2)", pericia: "Luta" },
    { nome: "Lança", dano: "3d10", municao: "x", espaco: 14, alcance: "Longo Alcance", critico: "20(x2)", pericia: "Luta" },
    { nome: "Machado Pesado", dano: "2d10+2", municao: "x", espaco: 13, alcance: "Médio Alcance", critico: "19-20(x3)", pericia: "Luta" },
    { nome: "Martelo Pesado", dano: "1d20", municao: "x", espaco: 12, alcance: "Médio Alcance", critico: "20(x3)", pericia: "Luta" },
    { nome: "Alabarda", dano: "2d12", municao: "x", espaco: 13, alcance: "Longo Alcance", critico: "19-20(x2)", pericia: "Luta" },
    { nome: "Foice", dano: "1d20+4", municao: "x", espaco: 11, alcance: "Longo Alcance", critico: "19-20(x2)", pericia: "Luta" },
    { nome: "Clava", dano: "1d20+5", municao: "x", espaco: 13, alcance: "Médio Alcance", critico: "19-20(x2)", pericia: "Luta" },
    { nome: "Manopla", dano: "2d10", municao: "x", espaco: 9, alcance: "Corpo a Corpo", critico: "18-19-20(x2)", pericia: "Luta" },
    { nome: "Motoserra", dano: "3d20", municao: "x", espaco: 17, alcance: "Curto Alcance", critico: "19-20(x3)", pericia: "Luta" },
    { nome: "Aríete Portátil", dano: "2d12+5", municao: "x", espaco: 20, alcance: "Corpo a Corpo", critico: "20(x3)", pericia: "Luta" },
    { nome: "Bazuka", dano: "4d20", municao: "1", espaco: 17, alcance: "Extremo Alcance", critico: "19-20(x2)", pericia: "Tática" },
    { nome: "Super Metralhadora", dano: "4d12", municao: "30", espaco: 19, alcance: "Longo Alcance", critico: "18-19-20(x2)", pericia: "Tática" },
    { nome: "Balestra", dano: "6d12", municao: "1", espaco: 15, alcance: "Longo Alcance", critico: "19-20(x2)", pericia: "Tática" },
    { nome: "Sniper Pesado", dano: "3d20+5", municao: "3", espaco: 18, alcance: "Extremo Alcance", critico: "20(x3)", pericia: "Pontaria" },
    { nome: "Granada", dano: "10d12", municao: "1", espaco: 1, alcance: "—", critico: "18-19-20", pericia: "Arremessar" },
    { nome: "M2.50", dano: "5d12+3", municao: "1", espaco: 21, alcance: "Longo Alcance", critico: "19-20(x2)", pericia: "Tática" },
    { nome: "FGM-148 Javelin", dano: "1d100+3d20", municao: "1", espaco: 30, alcance: "Extremo Alcance", critico: "20(x3)", pericia: "Tática" },
    { nome: "Arco Canhão Eletromagnético", dano: "5d10", municao: "1", espaco: 10, alcance: "Longo Alcance", critico: "20(x2)", pericia: "Tática" },
    { nome: "Rifles Recoilless", dano: "5d20", municao: "1", espaco: 20, alcance: "Extremo Alcance", critico: "18-19-20", pericia: "Tática" },
  ],
  Improvisada: []
}

export const CATALOGO_MAGIAS = {
  Energia: {
    "1° Círculo": [
      { nome: "Amaldiçoar Arma", desc: "2 PE + 2 aparelhos eletrônicos. Amaldiçoa uma arma por 1d6 rodadas dando 2d4 de dano adicional mágico (energia). Se o alvo for do elemento de medo ou benção: 3d4. (Toque)" },
      { nome: "Luz", desc: "1 PE + 1 aparelho. Faz o aparelho criar uma luz forte que ilumina a sala (cena)." },
      { nome: "Amaldiçoar Tecnologia", desc: "4 PE + 2 aparelhos. Aprimore a capacidade de algum aparelho eletrônico (cena). (Toque)" },
      { nome: "Coincidência", desc: "3 PE + 3 aparelhos. Tenha +1 dado adicional em suas rolagens de atributos por 2d6 rodadas. (Toque)" },
      { nome: "Dissonância", desc: "2 PE + 4 aparelhos. Escolha uma área de 18m onde todos que ficarem dentro não conseguirão ouvir nada. (Disparo)" },
    ],
    "2° Círculo": [
      { nome: "Polarização", desc: "5 PE + 2 aparelhos. Atraia objetos metálicos ou os repele conforme sua vontade. (Cena) (Toque)" },
      { nome: "Embaralhar", desc: "4 PE + mínimo 2 eletrônicos. Crie duplicatas suas para confundir inimigos (cada duplicata: -1 ponto do inimigo em rolagens de acerto). Terá +1 dado em rolagens de furtividade até se expor." },
      { nome: "Eletrecussão", desc: "5 PE + 3 aparelhos. Eletrocute um alvo dando 5d6 de dano mágico (energia). 6d6 em medo e benção. (Disparo)" },
      { nome: "Conhecidir", desc: "6 PE + 5 aparelhos. Ao forçar uma rolagem com esse ritual ativo, passe imediatamente. (Ação única) (Toque)" },
      { nome: "Contenção", desc: "3 PE + 3 aparelhos. Uma onda elétrica prende até três inimigos (inimigos rolam presença contra ocultismo do invocador para sair). (Disparo)" },
      { nome: "Tela", desc: "6 PE + 4 aparelhos. Crie uma tela que protege contra ataques mágicos disparáveis, dando +20 de defesa (dura até os 20 pontos acabarem)." },
    ],
    "3° Círculo": [
      { nome: "Salto", desc: "10 PE + 7 aparelhos eletrônicos. Teletransporte até 5 pessoas para até onde a vista do invocador alcance. (Toque)" },
      { nome: "Figura Caótica", desc: "10 PE + 8 aparelhos tecnológicos. Dê vida a objetos inanimados. (Cena) (Toque)" },
      { nome: "Deflagração", desc: "10 PE + 10 aparelhos eletrônicos. Cause uma explosão de energia bruta dando 7d12, acabando com tudo no alcance de 20 metros. (Disparo)" },
      { nome: "Contragolpe", desc: "7 PE + 8 aparelhos. Crie um pequeno espelho que reflete magias disparadas em sua direção de volta para o invocador, a magia retorna com o dobro de poder." },
    ]
  },
  Combustão: {
    "1° Círculo": [
      { nome: "Amaldiçoar Arma", desc: "2 PE + uma chama média (tocha). Amaldiçoa uma arma por 1d6 rodadas dando 3d4 de dano mágico (combustão). Em alvos com elemento de energia e sangue: 5d4. (Toque)" },
      { nome: "Vagalumos", desc: "1 PE + 1 chama pequena. Faz 4 pequenas criaturas que iluminam o campo ou seguem alvos dando -1 dado em testes de furtividade (cena). (Invocação)" },
      { nome: "Círculo de Ódio", desc: "1 PE + 2 chamas médias. Toda magia de combustão feita com o invocador nesse círculo tem mais 1d10 adicional em rolagem de acerto (cena). (Toque)" },
      { nome: "Incendiar", desc: "2 PE + 3 chamas médias + sangue do alvo. Queime o alvo dando 1d6+3 de dano mágico. Em energia e sangue: 2d6+3. (Disparo)" },
      { nome: "Brazarias", desc: "1 PE + 1 chama pequena. Manipule as labaredas formando desenhos para fortificar seus testes de enganação, lábia etc. +1d10 adicional. (Disparo)" },
      { nome: "Faíscar", desc: "2 PE + 1 chama média. Faz fogo em seus pés que dão +1 ação de movimento (cena). (Toque)" },
      { nome: "Simulação", desc: "1 PE + 1 chama pequena. Faz uma capa de fumaça em seu torno dando +7 PE (cena). (Toque)" },
      { nome: "Nevoeiro", desc: "3 PE + 4 chamas médias. Faz uma pequena brisa de fumaça de alcance médio (18m) dando +2d6 adicional em qualquer dano sofrido dentro dessa área. (Cena) (Invocação)" },
    ],
    "2° Círculo": [
      { nome: "Devastar", desc: "4 PE + 5 tochas. Faz um incêndio no campo para não se limitar às quantidades de fogo dos rituais (cena). (Toque)" },
      { nome: "Agilidade nos Pés", desc: "3 PE + 3 tochas. Cria fogo em seus pés dando +1 dado em teste de Agilidade por 3d6 rodadas. (Toque)" },
      { nome: "Celo de Manoplas", desc: "4 PE + 5 tochas. Faz duas cabeças de criaturas que vão se prender nas mãos de um alvo, impedindo que pegue em armas por 2d8 rodadas. Caso tente, suas mãos sofrem 3d12 de dano mágico. (Disparo)" },
      { nome: "Lâmina Vulcânica", desc: "5 PE + 3 tochas. Faz lâminas em suas mãos como armas (dano: 1d10 + queimação 1d3). Em alvos de energia e sangue: 2d10 + 2d3 de queimação. (Toque)" },
    ],
    "3° Círculo": [
      { nome: "Incinerar", desc: "8 PE + 7 tochas. Após usar o ritual Incendiar 2 vezes em um alvo, pode Incinerá-lo dando novamente o dano dos dois rituais + 6d8. Em alvos de energia e sangue: 7d8. (Disparo)" },
      { nome: "Corrente Fervente", desc: "10 PE + 6 tochas. Arremessa uma aura em forma de corrente em um alvo fazendo-o ficar com -2 dados em todos seus atributos por 2d12 rodadas. (Disparo)" },
    ]
  },
  Sangue: {
    "1° Círculo": [
      { nome: "Amaldiçoar Arma", desc: "2 PE + 4 pontos de vida. Amaldiçoa uma arma por 1d6 rodadas dando +2d4 adicional de dano mágico (sangue). Se o alvo for de elemento energia ou benção: 3d4. (Toque)" },
      { nome: "Arma Artrox", desc: "2 PE + 1 PV. Aumenta o dano de uma arma corpo a corpo em +1d6 e +2 casas abaixo no nível de ameaça. (Disparo)" },
      { nome: "Adaptação", desc: "3 PE + 3 PV. Escolha um alvo (ou o próprio invocador) para que o corpo se adapte à situação em que está. (Toque)" },
      { nome: "Sensorial", desc: "1 PE + 2 PV. Aumenta seus sentidos e percepção: +2d6 em testes de percepção (cena)." },
      { nome: "Distorcer", desc: "4 PE + 3 PV. Mude sua aparência ou de um aliado (máximo duas pessoas) (cena). (Toque)" },
    ],
    "2° Círculo": [
      { nome: "Armadura de Sangue", desc: "4 PE + 5 PV. Escolha um alvo para receber uma armadura de sangue que fornece +10 de defesa. (Disparo)" },
      { nome: "Aprimorar Físico", desc: "3 PE + 4 PV. Fornece +1 dado em testes de Força e Agilidade por 2d12 rodadas. (Toque)" },
      { nome: "Descamar", desc: "5 PE + 3 PV. Abre a pele do alvo deixando-o exposto (+2d8 ao toque). Em energia e benção: 3d8. (Toque)" },
      { nome: "Flagelo", desc: "2 PE + 6 PV. Faça algo obedecer uma ordem (cena). (Disparo)" },
      { nome: "Transfusão", desc: "7 PE. O invocador transfere de seu próprio sangue para um alvo. Pode escolher até 3d10 para sofrer de dano; o dano sofrido será convertido em cura para o alvo." },
    ],
    "3° Círculo": [
      { nome: "Forma Monstruosa", desc: "10 PE + 13 PV. Assuma a forma de uma criatura de sangue, dando +1 dado em todas suas rolagens de ataque, +3d10 de dano adicional. Em alvos de energia e benção: 4d10." },
      { nome: "Invólucro", desc: "10 PE + 10 PV. Crie um clone de um alvo que lutará ao lado do invocador com os mesmos pontos, atributos e magias do alvo." },
      { nome: "Elo Carmezim", desc: "15 PE + 5 PV do invocador e do alvo. Marque um alvo com símbolo de sangue, fazendo com que tudo que o invocador sofrer, o alvo também sofrerá. (Cena)" },
      { nome: "Sarcófago de Sangue", desc: "6 PE + 3 PV invocador e 6 PV alvo. Invoque um Sarcófago de sangue que irá prender o alvo. O alvo poderá tentar sair após 24 horas, rolando sua presença contra a do invocador." },
    ]
  },
  Morte: {
    "1° Círculo": [
      { nome: "Amaldiçoar Arma", desc: "2 PE + 1 cadáver. Amaldiçoa uma arma por 1d6 rodadas dando +2d4 de dano adicional mágico (morte). Em alvos de elemento combustão e energia: 3d4. (Toque)" },
      { nome: "Cicatriz", desc: "2 PE + 2 cadáveres. Faz o tempo de um local ferido passar mais rápido: 2d6 de cura. (Toque)" },
      { nome: "Definhar", desc: "1 PE + 3 cadáveres. Escolha um alvo para deixá-lo vulnerável por 1d10 rodadas (vulnerável: o alvo sofre +2d6 adicional por cada dano sofrido). (Disparo)" },
      { nome: "Espiral", desc: "2 PE + 1 cadáver. Escolha um alvo para ser marcado com o símbolo de morte. Esse alvo tem -1 dado de qualquer tipo de acerto de ataques (cena). (Toque)" },
      { nome: "Impacto", desc: "2 PE + 1 cadáver. Diminua o dano de impactos e projéteis em -2d6 (cena). (Toque)" },
    ],
    "2° Círculo": [
      { nome: "Miasma", desc: "4 PE + 3 cadáveres. Conjure uma névoa tóxica de 18m dando enjoo a todos dentro dela. Os alvos rolam presença + ocultismo DT. Enjoo: -1 dado em rolagens de agilidade, não podendo se concentrar. (Invocação)" },
      { nome: "Envelhecer Armadura", desc: "3 PE + 4 cadáveres. Corte a resistência de uma armadura ou escudo pela metade de sua pontuação. (Alvo único) (Toque)" },
      { nome: "Tentáculos", desc: "4 PE + 4 cadáveres. Tentáculos invocados em uma área média (18m) atacam e agarram pessoas no alcance. Dano: 2d3. Agarrar: o alvo rola Força contra presença + ocultismo do invocador. (Invocação)" },
      { nome: "Entropia", desc: "4 PE + 6 cadáveres. Escolha um alvo para não agir por 2d3 rodadas. (Disparo)" },
      { nome: "Consumir Manancial", desc: "4 PE + 5 cadáveres. Consome a vida de qualquer coisa ao redor em 18m, curando a mesma quantidade de dano aplicada. Dano: 3d3 por 2d6 rodadas. Em combustão e energia: 4d3. (Invocação)" },
      { nome: "Nuvem Cinza", desc: "2 PE + 3 cadáveres. Uma nuvem toma conta do campo dando +10 pontos de furtividade para todos na cena por 1d12+3 rodadas. (Invocação)" },
    ],
    "3° Círculo": [
      { nome: "Âncora Mortal", desc: "5 PE + 3 cadáveres. Prenda um alvo a algo; ele não conseguirá ir longe desse local (9m) por 2d12 rodadas. (Toque)" },
      { nome: "Poeira de Podridão", desc: "7 PE + 7 cadáveres. Nuvem de poeira apodrece tudo que toca em alcance longo (25m+). 4d8 de dano mágico (morte). Necessita concentração do invocador. (Invocação)" },
      { nome: "Convocar", desc: "8 PE + 2 cadáveres da cena. Invoca um ser cadavérico que irá atrás de um alvo até o neutralizar. Para o ritual acabar, a criatura tem que ser morta. (Invocação)" },
      { nome: "Distorção", desc: "10 PE + 10 cadáveres. O invocador tem uma ação padrão antes de cada turno de pessoas na cena por 1d8 rodadas." },
      { nome: "Velocidade Mortal", desc: "7 PE + 8 cadáveres. O invocador tem +uma ação padrão até o fim da cena. (Toque)" },
    ]
  },
  Medo: {
    "1° Círculo": [
      { nome: "Amaldiçoar Arma", desc: "2 PE + 2 pontos de sanidade. Amaldiçoa uma arma por 1d6 rodadas dando +2d4 de dano mágico (medo). Em alvos de elemento sangue e combustão: 3d4. (Toque)" },
      { nome: "Presença Caótica", desc: "1 PE + 2 pontos de sanidade. Quando um alvo não for tangível, faz uma pequena camada em torno do alvo deixando-o tocável (cena). (Toque)" },
      { nome: "Sussurros", desc: "1 PE + 2 pontos de sanidade. Amplia a audição do invocador em uma área de 25m. Inimigos que tentarem ficar furtivos terão que fazer a rolagem com desvantagem. (Toque)" },
      { nome: "Tecer Ilusões", desc: "3 PE + 3 pontos de sanidade. Cria ilusões visuais ou sonoras (3 alvos). Para descrer, o alvo rola Intelecto contra presença do invocador. (Disparo)" },
      { nome: "Neblina", desc: "2 PE + 2 pontos de sanidade. Faz uma Neblina de 18m de alcance. Todo ritual feito dentro dessa área tem seus efeitos e dados de dano dobrados. (Invocação)" },
    ],
    "2° Círculo": [
      { nome: "Laço Paranormal", desc: "5 PE + 5 sanidade. O bruxo compartilha todo seu leque de rituais com algum aliado por 1d12 rodadas, passando metade de seus pontos de esforço (1 alvo). (Toque)" },
      { nome: "Noisy", desc: "3 PE + 3 sanidade. Faz um alvo esticar o seu tronco separando-o das pernas por 3d6 rodadas. Alvos com essa magia têm -1 dado em toda rolagem de agilidade, -5 pontos para acertar ataques. Todos que forem atacar o alvo têm +5 pontos nas rolagens. (Toque)" },
      { nome: "Vortex", desc: "4 PE + 4 sanidade. O bruxo ganha a possibilidade de atravessar qualquer coisa por 2d12 rodadas dando +1 dado nas rolagens de furtividade. (Toque)" },
      { nome: "Rejeitar", desc: "3 PE + 3 sanidade. Bruxo fica imune a efeitos negativos de rituais até 3° círculo (cena). (Toque)" },
    ],
    "3° Círculo": [
      { nome: "Zerar Antropia", desc: "8 PE + 7 sanidade. Escolha dois alvos fazendo-os ficarem congelados no tempo por 2d8 rodadas. (Disparo)" },
      { nome: "Fim", desc: "20 PE + 20 sanidade. Abre uma ruptura no espaço que suga tudo ao redor. (Invocação)" },
      { nome: "Canalizar", desc: "7 PE + 6 sanidade. Transfere efeitos negativos de um alvo para todos aliados do alvo. (Disparo)" },
      { nome: "Conhecer o Medo", desc: "10 PE + 9 sanidade. Faz o alvo viver seu maior medo em suas ações (7d8 de dano mágico na Sanidade). Para sair, o alvo rola presença contra a do invocador. (Toque)" },
      { nome: "Lâmina", desc: "12 PE + 17 sanidade. Faz uma aura em sua mão em forma de Lâmina que ignora armadura dos alvos, causando dano na vida máxima do alvo (não podendo ser curado). Dano: 5d10 por 1d12 rodadas. (Invocação)" },
      { nome: "Presença do Medo", desc: "15 PE + 10 sanidade. Assume a aparência de uma criatura que o alvo tema, dando +1 dado em todas as rolagens e +4d8 de dano na Sanidade a cada ataque (cena)." },
    ]
  },
  Benção: {
    "1° Círculo": [
      { nome: "Amaldiçoar Arma", desc: "2 PE + 1 item sentimental. Purifica uma arma por 1d6 rodadas dando +2d4 de dano mágico (benção). Se os alvos forem do elemento morte e medo: 3d4. (Toque)" },
      { nome: "Compreensão", desc: "1 PE + 2 itens. O invocador consegue entender qualquer língua escrita e falada." },
      { nome: "Sussurros", desc: "2 PE + 3 itens. O invocador consegue falar com almas que estão presentes na mesma cena." },
      { nome: "Detecção", desc: "4 PE + 1 item. Localiza monstros, armadilhas e ameaças em um alcance de 18m (médio). (Toque)" },
      { nome: "Voz Divina", desc: "3 PE + 2 itens. Uma voz magnífica acalma o alvo, fazendo-o recuperar a consciência. 1d12 de cura na sanidade. (Disparo)" },
    ],
    "2° Círculo": [
      { nome: "Perturbação", desc: "5 PE + 4 itens. Escolha um alvo e o controle por 1d6 rodadas. (Disparo)" },
      { nome: "Terceiro Olho", desc: "3 PE + 3 itens. Veja qualquer manifestação paranormal. (Cena)" },
      { nome: "Aprimorar Mente", desc: "3 PE + 2 itens. O invocador tem +10 pontos em rolagens de Intelecto (cena). (Toque)" },
      { nome: "Invadir Mente", desc: "6 PE + 5 itens. Conecte-se a um alvo podendo fazer qualquer ação em sua mente. O dano é tirado da sanidade máxima de ambos. O ritual dura até que um desmaie ou o invocador pare. (Disparo)" },
      { nome: "Graça", desc: "4 PE + 4 itens. Tire efeitos negativos de um alvo e o cure (3d8 de cura). (Toque)" },
    ],
    "3° Círculo": [
      { nome: "Inexistir", desc: "40 PE + 10 itens. Toque em um alvo e o apague da existência. (Toque)" },
      { nome: "Possessão", desc: "20 PE + 7 itens. Transfira sua alma para um corpo vivo e tome o controle de suas ações. (Disparo)" },
      { nome: "Tangível", desc: "13 PE + 8 itens. Fique intangível por 2d12 rodadas a todo tipo de material físico (apenas invocador)." },
      { nome: "Alterar Destino", desc: "20 PE + 10 itens. Após uma grande catástrofe, o invocador pode voltar ao passado e reescrever a história. Ao voltar, o invocador não recupera seus pontos perdidos." },
      { nome: "Benção", desc: "15 PE + 15 itens. Doe seus rituais e pontos para um alvo lutar por você (o invocador desmaia e fica vulnerável). (Cena) (Disparo)" },
      { nome: "Laço Inseparável", desc: "20 PE + 20 itens. Junte dois aliados em um corpo fazendo com que somem suas forças para sempre. (Toque)" },
      { nome: "Renascer", desc: "15 PE + 10 itens. Estabilize um alvo e o reviva (cura total). (Toque)" },
      { nome: "Exorcismo", desc: "17 PE + 9 itens. Tire qualquer criatura ou alma que estiver presa ou se apossando de algum corpo que não seja o seu de origem. (Toque)" },
      { nome: "Signare", desc: "16 PE + 4 itens. Prenda criaturas paranormais em objetos (necessário objeto que aguente a presença da criatura). (Toque)" },
    ]
  }
}

export const CATALOGO_PODERES = {
  Energia: [
    { nome: "Campo Caótico", desc: "Você consegue gerar um campo de Energia que o protege de perigos. Quando usa a ação esquiva, pode gastar 1 PE para receber +5 em Defesa." },
    { nome: "Golpe de Sorte", desc: "Seus ataques recebem +1 na margem de ameaça. (Capacidade de up)" },
    { nome: "Troca de Faísca", desc: "Ao olhar para um alvo, você pode trocar de lugar com ele imediatamente sem que ele possa reagir. (Capacidade de up)" },
    { nome: "Forçar Músculos", desc: "Solte uma descarga em seus músculos dando +1d12+5 de bônus em rolagens de Força e Agilidade. Se falhar, o corpo sofre (1d10); desastre (2d10); se passar (1d6)." },
    { nome: "Aragem", desc: "Manipule pequenas brisas de vento dando desvantagem no acerto de inimigos que forem lançar um ataque ao invocador (-7p na rolagem do alvo). (Capacidade de up)" },
  ],
  Morte: [
    { nome: "Encarar a Morte", desc: "Sua conexão com a Morte faz com que você não hesite em situações de perigo. Durante cenas de ação, seus PE aumentam em +2d12." },
    { nome: "Escapar da Morte", desc: "A Morte tem um interesse especial em sua caminhada. Uma vez por cena, quando receber dano que o deixaria com 0 PV, você fica com 1 PV. Não funciona em caso de dano massivo. (Capacidade de up)" },
    { nome: "Potencial Aprimorado", desc: "Morte lhe concede potencial latente de momentos roubados de outro lugar. Você recebe +1 ponto de esforço por NEX." },
    { nome: "Surto Temporal", desc: "A sua percepção temporal se torna distorcida. Uma vez por cena, durante seu turno, pode gastar 3 PE para realizar uma ação padrão adicional." },
    { nome: "Técnica das Sombras", desc: "Faça novos aliados sejam eles animais, pessoas, criaturas. Assim que um Laço for feito, o invocador pode pedir ajuda dessas criaturas, as invocando automaticamente para atacarem por ele. (Capacidade de up)" },
  ],
  Benção: [
    { nome: "Transcender — EXPANSÃO", desc: "Faça com que criaturas graciosas dos céus purifiquem uma área onde só pessoas que o invocador permitir conseguem passar por essa barreira. (Somente elemento Benção tem poder dentro desse raio)" },
    { nome: "Sensitivo", desc: "Consegue sentir as emoções e intenções de outros personagens, como medo, raiva ou malícia, recebendo +5 em testes de Diplomacia, Intimidação e Intuição." },
    { nome: "Corrente do Infinito", desc: "Correntes saem de suas costas podendo lançar ataques múltiplos (3 por turno, 1d10). Se todas focarem em um alvo e o segurarem, o alvo perde aos poucos todos seus pontos a cada turno. Requisito: 1 ou 2 PV restantes." },
  ],
  Sangue: [
    { nome: "Anatomia Insana", desc: "O seu corpo é transfigurado e parece desenvolver um instinto próprio. Você tem 50% de chance (resultado par em 1d4) de ignorar o dano adicional de um acerto crítico ou ataque furtivo. (Capacidade de up)" },
    { nome: "Arma de Sangue", desc: "Você pode gastar uma ação de movimento e 2 PE para produzir garras, chifres ou uma lâmina de sangue cristalizado. É considerada uma arma simples corpo a corpo e leve que causa 1d6 pontos de dano de Sangue. Uma vez por turno, quando usa a ação agredir, pode gastar 1 PE para fazer um ataque adicional. (Capacidade de up)" },
    { nome: "Sangue de Ferro", desc: "O seu sangue flui de forma paranormal e agressiva, concedendo vigor não natural. Você recebe +2 pontos de vida por NEX." },
    { nome: "Sangue Vivo", desc: "Na primeira vez que ficar machucado durante uma cena, você começa a se regenerar curando sempre 1/3 da sua vida a cada final de turno. Dura até a cena acabar." },
    { nome: "Helmintos", desc: "Crie parasitas da sua carne que entram em alvos sugando o sangue deles e enviando para o invocador. Para cada 9 PV perdidos do alvo: 1d4-1 de cura. (3 PE por parasita, cena ou até o parasita ser removido)" },
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
    { nome: "Chama Lemniscata", desc: "Faça um disparo de chama que deixa o alvo queimando sem possibilidade de apagar (2d6). A única forma de apagar é com elemento Benção. (Capacidade de up)" },
  ],
}

export const GRAUS_AMEACA = [
  { grau: 1, desc: "Sem multiplicador — considera o dano cheio sem rolagem de dado" },
  { grau: 2, desc: "Multiplicador de 2x no dano" },
  { grau: 3, desc: "Multiplicador de mais de 2x no dano" },
]

export const CARGA_POR_FORCA = { 0: 1, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 28, 8: 32, 9: 36, 10: 40, 11: 44, 12: 48, 13: 52, 14: 56, 15: 60 }

export const fichaInicial = (classe = 'Combatente') => {
  const base = CAPACIDADES_AUTOMATICAS[classe]?.base || { habilidades: [], passivas: [] }
  return {
    nome: "", nivel: 1, classe, trilha: "", genese: "Estudante",
    personalidade: "", elementos: [], raca: "", modificacao: "",
    fotoURL: "", notas: "",
    finalizada: false,
    camposBloqueados: {},
    focos: { Força: 0, Agilidade: 0, Intelecto: 0, Vigor: 0, Domínio: 0 },
    reservas: { vida: { atual: 10, max: 10 }, esforco: { atual: 5, max: 5 }, sanidade: { atual: 10, max: 10 } },
    combate: { resistencia: 0, defesa: 0, contraAtaque: 0, esquiva: 0, armaduraBase: 0, movimento: 0, traumas: "" },
    pericias: Object.fromEntries(Object.values(PERICIAS).flat().map(p => [p, 0])),
    habilidades: base.habilidades.map(h => ({ id: Date.now() + Math.random(), nome: h.nome, desc: h.desc, automatica: true })),
    magias: [],
    passivas: base.passivas.map(p => ({ id: Date.now() + Math.random(), nome: p.nome, desc: p.desc, automatica: true })),
    poderes: [],
    armas: [],
    protecao: { colete: "", escudo: "", acessorioPessoal: "", acessorioBelico: "" },
    inventario: []
  }
}
