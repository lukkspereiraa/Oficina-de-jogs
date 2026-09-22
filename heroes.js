import { Deck, warriorCards, mageCards, assassinCards, vikingCards } from './cards.js';

// Classe base do Herói
class Hero {
    constructor(id, name, icon, color, abilityName, description, cooldown, deckCards) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.color = color;
        this.abilityName = abilityName;
        this.description = description;
        this.maxCooldown = cooldown;
        this.currentCooldown = 0;
        this.deck = new Deck(deckCards); 
    }
    getAbilityTargets(game, playerNum) { return []; }
    executeAbility(game, playerNum, targetX, targetY) {}
}

export class Mage extends Hero {
    constructor() {
        super('mago', 'Mago', '🔮', '#9b59b6', 'Teleporte', 'Move-se para qualquer casa vazia.', 3, mageCards);
    }
    getAbilityTargets(game, playerNum) {
        const targets = [];
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                if (!game.isOccupied(x, y)) targets.push({x, y});
            }
        }
        return targets;
    }
    executeAbility(game, playerNum, targetX, targetY) {
        const p = playerNum === 1 ? game.p1 : game.p2;
        p.x = targetX;
        p.y = targetY;
    }
}

export class Assassin extends Hero {
    constructor() {
        super('assassino', 'Assassino', '🗡️', '#2ecc71', 'Armadilha', 'Planta armadilha (raio de 2 blocos, dura 3 turnos).', 3, assassinCards);
    }
    getAbilityTargets(game, playerNum) {
        const p = playerNum === 1 ? game.p1 : game.p2;
        const targets = [];
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                if (Math.abs(p.x - x) <= 2 && Math.abs(p.y - y) <= 2 && !game.isOccupied(x, y)) {
                    targets.push({x, y});
                }
            }
        }
        return targets;
    }
    executeAbility(game, playerNum, targetX, targetY) {
        game.traps.push({ x: targetX, y: targetY, duration: 3, owner: playerNum });
    }
}

export class Warrior extends Hero {
    constructor() {
        super('guerreiro', 'Guerreiro', '⚔️', '#e74c3c', 'Salto Feroz', 'Avança 2 casas ignorando armadilhas.', 2, warriorCards);
    }
    getAbilityTargets(game, playerNum) {
        const p = playerNum === 1 ? game.p1 : game.p2;
        const dir = playerNum === 1 ? -1 : 1;
        const targets = [];
        if (p.y + (2 * dir) >= 0 && p.y + (2 * dir) < 5) {
            targets.push({x: p.x, y: p.y + (2 * dir)});
        }
        return targets;
    }
    executeAbility(game, playerNum, targetX, targetY) {
        const p = playerNum === 1 ? game.p1 : game.p2;
        p.x = targetX;
        p.y = targetY;
        const enemy = playerNum === 1 ? game.p2 : game.p1;
        if (p.x === enemy.x && p.y === enemy.y) game.winner = playerNum;
    }
}

export class Viking extends Hero {
    constructor() {
        super('viking', 'Viking', '🪓', '#e67e22', 'Arremesso', 'Mata o inimigo a 1 bloco de distância sem andar.', 3, vikingCards);
    }
    getAbilityTargets(game, playerNum) {
        const p = playerNum === 1 ? game.p1 : game.p2;
        const targets = [];
        const dirs = [[0,1],[1,0],[0,-1],[-1,0], [1,1],[-1,-1],[1,-1],[-1,1]];
        for(let d of dirs) {
            const nx = p.x + d[0], ny = p.y + d[1];
            if(nx >=0 && nx < 5 && ny >=0 && ny < 5) targets.push({x: nx, y: ny});
        }
        return targets;
    }
    executeAbility(game, playerNum, targetX, targetY) {
        const enemy = playerNum === 1 ? game.p2 : game.p1;
        if (enemy.x === targetX && enemy.y === targetY) game.winner = playerNum; 
        game.traps = game.traps.filter(t => t.x !== targetX || t.y !== targetY);
    }
}

export const AVAILABLE_HEROES = [
    new Warrior(), new Mage(), new Viking(), new Assassin()
];