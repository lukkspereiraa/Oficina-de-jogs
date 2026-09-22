// Classe Base da Carta
class Card {
    constructor(id, name, type, description, icon, color) {
        this.id = id;
        this.name = name;
        this.type = type;             
        this.description = description; 
        this.icon = icon;             
        this.color = color;           
    }
}

// Carta de Movimento
export class MovementCard extends Card {
    constructor(id, name, type, description, icon, color, moves) {
        super(id, name, type, description, icon, color);
        this.moves = moves; // Ex: [[0, 1], [-1, 1]]
    }
}

// O Deck que recebe as cartas no construtor
export class Deck {
    constructor(cardsArray) {
        this.cards = cardsArray;
    }

    drawCards(count) {
        const drawn = [];
        for(let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * this.cards.length);
            const cardCopy = Object.assign(Object.create(Object.getPrototypeOf(this.cards[randomIndex])), this.cards[randomIndex]);
            drawn.push(cardCopy);
        }
        return drawn;
    }
}

// DECKS EXCLUSIVOS
// DECKS EXCLUSIVOS
export const warriorCards = [
    // Movimentação Base e Defesa
    new MovementCard('w1', 'Investida Feroz', 'Ataque Físico', 'Avança quebrando as linhas frontais.', '🐗', '#c0392b', [[0, 1], [0, 2]]),
    new MovementCard('w2', 'Corte Giratório', 'Golpe Amplo', 'Ataca todos os flancos ao mesmo tempo.', '🌪️', '#e74c3c', [[-1, 0], [1, 0], [-1, 1], [1, 1]]),
    new MovementCard('w3', 'Erguer Escudo', 'Defesa', 'Passo curto e preparação para impacto.', '🛡️', '#c0392b', [[0, 1], [0, -1]]),
    new MovementCard('w4', 'Pisada Colossal', 'Físico / Pesado', 'Um passo destruidor em diagonal.', '🥾', '#e74c3c', [[-1, 1], [1, 1]]),
    
    // Novas Cartas Avançadas
    new MovementCard('w5', 'Golpe de Misericórdia', 'Ataque Brutal', 'Um salto longo e arriscado para finalizar.', '⚔️', '#c0392b', [[0, 3]]),
    new MovementCard('w6', 'Muralha de Ferro', 'Defesa Absoluta', 'Movimento lateral longo para interceptar o alvo.', '🧱', '#e74c3c', [[-1, 0], [1, 0], [-2, 0], [2, 0]]),
    new MovementCard('w7', 'Avanço Implacável', 'Físico', 'Avança de forma imprevisível para frente.', '🚶‍♂️', '#c0392b', [[0, 1], [-1, 2], [1, 2]]),
    new MovementCard('w8', 'Quebra-Ossos', 'Corpo a Corpo', 'Um ataque direto e muito próximo.', '🦴', '#e74c3c', [[-1, 1], [1, 1], [0, 1]]),
    new MovementCard('w9', 'Recuo Estratégico', 'Tático', 'Dois passos largos para trás para respirar.', '🔙', '#c0392b', [[0, -1], [0, -2]]),
    new MovementCard('w10', 'Grito de Guerra', 'Mobilidade', 'Pronto para ir a qualquer direção próxima.', '🗣️', '#e74c3c', [[-1, 1], [0, 1], [1, 1], [0, -1]])
];

export const mageCards = [
    // Magias Básicas
    new MovementCard('m1', 'Passo Etéreo', 'Magia / Ilusão', 'Desliza pelas dobras da realidade.', '🌀', '#8e44ad', [[-1, 1], [1, 1], [-1, -1], [1, -1]]),
    new MovementCard('m2', 'Salto Arcano', 'Teleporte Menor', 'Um salto mágico ignorando a casa da frente.', '✨', '#9b59b6', [[0, 2], [-2, 0], [2, 0]]),
    new MovementCard('m3', 'Chama Guiada', 'Magia / Fogo', 'Avança como uma labareda frontal.', '🔥', '#8e44ad', [[0, 1], [-1, 1], [1, 1]]),
    new MovementCard('m4', 'Brisa de Fuga', 'Magia / Ar', 'Recua agilmente com o vento.', '💨', '#9b59b6', [[0, -1], [0, -2]]),
    
    // Novas Magias Avançadas
    new MovementCard('m5', 'Levitação', 'Magia Espacial', 'Salto em "L" imprevisível, como o Cavalo do Xadrez.', '🔮', '#8e44ad', [[-1, 2], [1, 2], [-2, 1], [2, 1]]),
    new MovementCard('m6', 'Ilusão de Ótica', 'Truque', 'Teleporta rapidamente de um flanco ao outro.', '👁️', '#9b59b6', [[-2, 0], [2, 0]]),
    new MovementCard('m7', 'Clarão Arcano', 'Luz / Ataque', 'Avanço fulminante cruzando as diagonais extremas.', '⚡', '#8e44ad', [[-2, 2], [2, 2]]),
    new MovementCard('m8', 'Distorção Temporal', 'Tempo', 'Volta no tempo fugindo para as diagonais traseiras.', '⏳', '#9b59b6', [[-1, -1], [1, -1], [-2, -1], [2, -1]]),
    new MovementCard('m9', 'Chuva de Meteoros', 'Magia Destrutiva', 'Um rastro de destruição reto ou nas pontas.', '☄️', '#8e44ad', [[0, 2], [0, 3], [-2, 2], [2, 2]]),
    new MovementCard('m10', 'Vórtice', 'Teleporte', 'Controle absoluto sobre qualquer casa ao redor.', '🌌', '#9b59b6', [[-1, 1], [1, 1], [-1, -1], [1, -1], [0, 1], [0, -1], [-1, 0], [1, 0]])
];

export const assassinCards = [
    // Movimentação Furtiva Base
    new MovementCard('a1', 'Dança das Sombras', 'Furtividade', 'Move-se rapidamente pelos lados.', '👥', '#27ae60', [[-1, 0], [1, 0], [-2, 0], [2, 0]]),
    new MovementCard('a2', 'Bote da Serpente', 'Ataque Rápido', 'Um salto letal em diagonal.', '🐍', '#2ecc71', [[-1, 2], [1, 2]]),
    new MovementCard('a3', 'Passo Falso', 'Enganação', 'Recua em diagonal deixando o inimigo cego.', '🥷', '#27ae60', [[-1, -1], [1, -1]]),
    new MovementCard('a4', 'Corte Preciso', 'Ataque Físico', 'Avanço reto cirúrgico.', '🗡️', '#2ecc71', [[0, 1], [-1, 1], [1, 1]]),
    
    // Novas Cartas Avançadas
    new MovementCard('a5', 'Salto das Sombras', 'Ataque Furtivo', 'Aparece subitamente longe no campo inimigo.', '🌑', '#27ae60', [[0, 3], [-1, 3], [1, 3]]),
    new MovementCard('a6', 'Lâmina Envenenada', 'Ataque Letal', 'Movimento contido, focando em alvos ao redor.', '🧪', '#2ecc71', [[-1, 1], [1, 1], [0, 1], [-1, 0], [1, 0]]),
    new MovementCard('a7', 'Esquiva Perfeita', 'Tático', 'Recuo longo em salto lateral para evitar a morte.', '💨', '#27ae60', [[-1, -2], [1, -2]]),
    new MovementCard('a8', 'Caminho Invisível', 'Furtividade', 'Pula por cima do perigo atingindo o arco médio.', '👣', '#2ecc71', [[-2, 1], [2, 1], [0, 2]]),
    new MovementCard('a9', 'Acuar Alvo', 'Flanco', 'Fecha o cerco pelas beiradas do mapa.', '🕸️', '#27ae60', [[-2, 2], [2, 2], [-2, 0], [2, 0]]),
    new MovementCard('a10', 'Ataque Fantasma', 'Ilusão', 'Move-se uma ou três casas para frente instantaneamente.', '👻', '#2ecc71', [[0, 1], [0, 3]])
];

export const vikingCards = [
    // Agressividade Base
    new MovementCard('v1', 'Fúria Nórdica', 'Ataque Brutal', 'Marcha da morte sem olhar para trás.', '👹', '#d35400', [[-1, 1], [0, 1], [1, 1]]),
    new MovementCard('v2', 'Arremesso de Corpo', 'Físico', 'Joga o próprio corpo duas casas à frente.', '☄️', '#e67e22', [[0, 2]]),
    new MovementCard('v3', 'Golpe de Machado', 'Corte Pesado', 'Ataque cruzado destruidor.', '🪓', '#d35400', [[-2, 1], [2, 1]]),
    new MovementCard('v4', 'Marcha Gelada', 'Físico / Neve', 'Avanço lento mas imparável.', '❄️', '#e67e22', [[0, 1], [-1, 0], [1, 0]]),
    
    // Novas Cartas Avançadas
    new MovementCard('v5', 'Salto do Berserker', 'Ataque Suicida', 'Um pulo massivo e irresponsável para frente.', '🔥', '#d35400', [[0, 3]]),
    new MovementCard('v6', 'Golpe Rachador', 'Destruição', 'Avanço que limpa a coluna central inteira.', '🔨', '#e67e22', [[0, 1], [0, 2], [0, -1]]),
    new MovementCard('v7', 'Dança dos Machados', 'Caos', 'Gira espalhando o terror ao redor e à frente.', '🌀', '#d35400', [[-1, 1], [1, 1], [-1, 0], [1, 0], [0, 2]]),
    new MovementCard('v8', 'Investida Sanguinária', 'Ataque Brutal', 'Corre cortando tudo pelas diagonais.', '🩸', '#e67e22', [[-2, 2], [2, 2], [-1, 1], [1, 1]]),
    new MovementCard('v9', 'Grito de Valhalla', 'Inspiração', 'Movimenta-se agressivamente pelas pontas traseiras.', '🛡️', '#d35400', [[-2, -1], [2, -1], [0, 1]]),
    new MovementCard('v10', 'Sede de Sangue', 'Frenesi', 'Avanço em foice; é matar ou morrer.', '🐺', '#e67e22', [[0, 2], [-1, 3], [1, 3]])
];