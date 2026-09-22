import { AVAILABLE_HEROES } from './heroes.js';

export const CLASSES = AVAILABLE_HEROES;

export class GameState {
    constructor() {
        this.phase = 'SELECT_P1'; 
        this.p1Class = null;
        this.p2Class = null;

        // Regra de Negócio: Placar da Melhor de 3
        this.p1Score = 0; 
        this.p2Score = 0; 
        this.matchWinner = null; 
        
        this.resetRoundState();
    }

    // Função que limpa a mesa para um novo round
    resetRoundState() {
        this.p1 = { x: 2, y: 4 };
        this.p2 = { x: 2, y: 0 };
        
        if (this.p1Class) {
            this.p1Hand = this.p1Class.deck.drawCards(4);
            this.p1Class.currentCooldown = 0;
        } else {
            this.p1Hand = [];
        }
        
        if (this.p2Class) {
            this.p2Hand = this.p2Class.deck.drawCards(4);
            this.p2Class.currentCooldown = 0;
        } else {
            this.p2Hand = [];
        }
        
        this.traps = []; 
        this.currentPlayer = 1;
        this.selectedCardIndex = null;
        this.usingAbility = false; 
        this.winner = null; // Vencedor do Round
    }

    selectClass(classData) {
        const heroClone = Object.assign(Object.create(Object.getPrototypeOf(classData)), classData);
        
        if (this.phase === 'SELECT_P1') {
            this.p1Class = heroClone;
            this.phase = 'SELECT_P2';
        } else if (this.phase === 'SELECT_P2') {
            this.p2Class = heroClone;
            this.resetRoundState(); // Puxa as cartas e inicia as posições
            this.phase = 'PLAYING';
        }
    }

    isOccupied(x, y) {
        return (this.p1.x === x && this.p1.y === y) || (this.p2.x === x && this.p2.y === y);
    }

    getValidMoves() {
        if (this.winner || this.matchWinner || this.phase !== 'PLAYING') return [];

        const hero = this.currentPlayer === 1 ? this.p1Class : this.p2Class;

        if (this.usingAbility) return hero.getAbilityTargets(this, this.currentPlayer);
        if (this.selectedCardIndex === null) return [];

        const piece = this.currentPlayer === 1 ? this.p1 : this.p2;
        const hand = this.currentPlayer === 1 ? this.p1Hand : this.p2Hand;
        const card = hand[this.selectedCardIndex];
        const dir = this.currentPlayer === 1 ? -1 : 1;
        
        return card.moves.map(move => ({
            x: piece.x + move[0],
            y: piece.y + (move[1] * dir)
        })).filter(pos => pos.x >= 0 && pos.x < 5 && pos.y >= 0 && pos.y < 5);
    }

    executeMove(targetX, targetY) {
        const validMoves = this.getValidMoves();
        const isValid = validMoves.some(m => m.x === targetX && m.y === targetY);
        if (!isValid) return false;

        const hero = this.currentPlayer === 1 ? this.p1Class : this.p2Class;
        const enemyPlayerNum = this.currentPlayer === 1 ? 2 : 1;

        if (this.usingAbility) {
            hero.executeAbility(this, this.currentPlayer, targetX, targetY);
            hero.currentCooldown = hero.maxCooldown; 
            this.usingAbility = false;
        } else {
            if (this.currentPlayer === 1) {
                this.p1.x = targetX; this.p1.y = targetY;
                if (this.p1.x === this.p2.x && this.p1.y === this.p2.y) this.winner = 1;
            } else {
                this.p2.x = targetX; this.p2.y = targetY;
                if (this.p2.x === this.p1.x && this.p2.y === this.p1.y) this.winner = 2;
            }

            const hand = this.currentPlayer === 1 ? this.p1Hand : this.p2Hand;
            hand.splice(this.selectedCardIndex, 1);
            hand.push(hero.deck.drawCards(1)[0]);
            this.selectedCardIndex = null;
        }

        // Verifica Armadilhas
        if (!this.winner) {
            const piece = this.currentPlayer === 1 ? this.p1 : this.p2;
            const steppedOnTrap = this.traps.find(t => t.x === piece.x && t.y === piece.y && t.owner !== this.currentPlayer);
            if (steppedOnTrap) this.winner = enemyPlayerNum; 
        }

        // LÓGICA DA MELHOR DE 3
        if (this.winner && !this.matchWinner) {
            if (this.winner === 1) this.p1Score++;
            else if (this.winner === 2) this.p2Score++;
            
            // O primeiro a chegar em 2 vitórias vence a partida
            if (this.p1Score === 2) this.matchWinner = 1;
            else if (this.p2Score === 2) this.matchWinner = 2;
        }

        // Só passa o turno se ninguém ganhou o round ainda
        if (!this.winner) {
            this.endTurn();
        }

        return true;
    }

    endTurn() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        const nextHero = this.currentPlayer === 1 ? this.p1Class : this.p2Class;
        if (nextHero.currentCooldown > 0) nextHero.currentCooldown--;
        
        this.traps.forEach(t => t.duration--);
        this.traps = this.traps.filter(t => t.duration > 0);
    }
}