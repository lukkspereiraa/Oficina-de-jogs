import { GameState, CLASSES } from './game.js';

const game = new GameState();

// Elementos DOM
const selectionScreen = document.getElementById('selection-screen');
const selectionTitle = document.getElementById('selection-title');
const charGrid = document.getElementById('character-grid');
const gameContainer = document.getElementById('game-container');
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const scoreboardEl = document.getElementById('scoreboard');

// Elementos do Modal de Vitória e Regras
const victoryScreen = document.getElementById('victory-screen');
const victoryMessage = document.getElementById('victory-message');
const restartBtn = document.getElementById('restart-btn');
const helpBtn = document.getElementById('help-btn');
const rulesModal = document.getElementById('rules-modal');
const closeModal = document.getElementById('close-modal');

function renderSelection() {
    charGrid.innerHTML = '';
    selectionTitle.innerText = game.phase === 'SELECT_P1' 
        ? 'Jogador 1: Escolha sua Classe' 
        : 'Jogador 2: Escolha sua Classe';

    CLASSES.forEach(charClass => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.innerHTML = `
            <div class="char-icon">${charClass.icon}</div>
            <div class="char-name" style="color: ${charClass.color}">${charClass.name}</div>
        `;
        
        card.addEventListener('click', () => {
            game.selectClass(charClass);
            updateUI();
        });
        
        charGrid.appendChild(card);
    });
}

function renderBoard() {
    boardEl.innerHTML = '';
    const validMoves = game.getValidMoves();
    const currentHero = game.currentPlayer === 1 ? game.p1Class : game.p2Class;

    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            if (validMoves.some(m => m.x === x && m.y === y)) {
                cell.classList.add('valid-move');
                
                if (game.usingAbility) {
                    if (currentHero.id === 'mago') cell.classList.add('magic-glow');
                    else cell.style.backgroundColor = '#16a085'; 
                }

                cell.addEventListener('click', () => {
                    const wasUsingAbility = game.usingAbility;
                    
                    if (game.executeMove(x, y)) {
                        if (wasUsingAbility && (currentHero.id === 'guerreiro' || currentHero.id === 'viking')) {
                            document.body.classList.remove('shake');
                            void document.body.offsetWidth; 
                            document.body.classList.add('shake');
                        }
                        updateUI();
                    }
                });
            }

            if (game.p1.x === x && game.p1.y === y && game.winner !== 2) {
                cell.innerHTML = game.p1Class.icon;
                cell.style.textShadow = `0 0 10px ${game.p1Class.color}`;
            }
            if (game.p2.x === x && game.p2.y === y && game.winner !== 1) {
                cell.innerHTML += game.p2Class.icon;
                cell.style.textShadow = `0 0 10px ${game.p2Class.color}`;
            }

            const trap = game.traps.find(t => t.x === x && t.y === y);
            if (trap) {
                const trapIcon = document.createElement('div');
                trapIcon.className = 'trap-indicator';
                trapIcon.innerText = '🕸️';
                cell.appendChild(trapIcon);
            }

            boardEl.appendChild(cell);
        }
    }

    renderHand('p1-hand', game.p1Hand, 1);
    renderHand('p2-hand', game.p2Hand, 2);
    renderHeroPanel('p1-hero', 1);
    renderHeroPanel('p2-hero', 2);

    // Atualiza o Placar Fixo
    scoreboardEl.innerText = `PLACAR: P1 (${game.p1Score}) x (${game.p2Score}) P2`;

    // VERIFICAÇÕES DE FIM DE ROUND E FIM DE PARTIDA
    if (game.matchWinner) {
        statusEl.innerText = "";
        // Aciona a TELA DE PARABÉNS!
        const winnerHero = game.matchWinner === 1 ? game.p1Class : game.p2Class;
        victoryMessage.innerHTML = `O Jogador ${game.matchWinner} (${winnerHero.name} ${winnerHero.icon}) Venceu!`;
        victoryScreen.classList.remove('hidden');
        document.body.classList.add('shake');

    } else if (game.winner) {
        // Alguém ganhou 1 Round, mas a partida não acabou
        statusEl.innerHTML = `⚔️ JOGADOR ${game.winner} VENCEU O ROUND! ⚔️<br><span style="font-size:14px; color:#aaa;">Limpando arena para a próxima batalha...</span>`;
        statusEl.style.color = '#e74c3c';
        document.body.classList.add('shake');
        
        // Pausa de 2.5 segundos e reinicia o Round automaticamente
        setTimeout(() => {
            if (game.winner && !game.matchWinner) {
                game.resetRoundState();
                updateUI();
            }
        }, 2500);

    } else {
        // Jogo Correndo Normal
        statusEl.innerHTML = `Turno do Jogador ${game.currentPlayer} (${currentHero.name} ${currentHero.icon})`;
        statusEl.style.color = '#fff';
    }
}

function renderHeroPanel(elementId, playerNum) {
    const heroEl = document.getElementById(elementId);
    const hero = playerNum === 1 ? game.p1Class : game.p2Class;
    
    heroEl.className = 'hero-panel';
    if (hero.currentCooldown > 0) heroEl.classList.add('on-cooldown');
    if (game.usingAbility && game.currentPlayer === playerNum) heroEl.classList.add('active-ability');

    heroEl.innerHTML = `
        <div class="icon">${hero.icon}</div>
        <div class="ability-name">${hero.abilityName}</div>
        <div class="cd-text">${hero.currentCooldown > 0 ? `CD: ${hero.currentCooldown}` : 'Pronto!'}</div>
    `;

    heroEl.onclick = () => {
        if (game.currentPlayer === playerNum && !game.winner && !game.matchWinner && hero.currentCooldown === 0) {
            game.usingAbility = true;
            game.selectedCardIndex = null; 
            updateUI();
        }
    };
}

function renderHand(elementId, hand, playerNum) {
    const handEl = document.getElementById(elementId);
    handEl.innerHTML = '';
    
    hand.forEach((card, index) => {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'mtg-card card-enter'; 
        cardContainer.style.animationDelay = `${index * 0.1}s`;
        cardContainer.style.backgroundColor = card.color;

        if (game.currentPlayer === playerNum && game.selectedCardIndex === index) {
            cardContainer.classList.add('selected');
        }

        cardContainer.innerHTML = `
            <div class="card-inner-frame" style="background-color: ${card.color}40;">
                <div class="card-header">${card.name}</div>
                <div class="card-art">${card.icon}</div>
                <div class="card-type-line">${card.type}</div>
                <div class="card-text-box">
                    <i>"${card.description}"</i>
                </div>
            </div>
        `;

        cardContainer.addEventListener('click', () => {
            if (game.currentPlayer === playerNum && !game.winner && !game.matchWinner) {
                game.selectedCardIndex = index;
                game.usingAbility = false; 
                updateUI();
            }
        });

        handEl.appendChild(cardContainer);
    });
}

function updateUI() {
    if (game.phase === 'PLAYING') {
        selectionScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        
        const currentHero = game.currentPlayer === 1 ? game.p1Class : game.p2Class;
        if (game.usingAbility && currentHero.id === 'assassino') {
            document.body.classList.add('vignette-dark');
        } else {
            document.body.classList.remove('vignette-dark');
        }

        renderBoard();
    } else {
        selectionScreen.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        renderSelection();
    }
}

// Botão de Jogar Novamente (Reseta tudo recarregando a página)
restartBtn.addEventListener('click', () => {
    location.reload(); 
});

// Controle do Modal de Regras
if (helpBtn && rulesModal && closeModal) {
    helpBtn.addEventListener('click', () => { rulesModal.classList.remove('hidden'); });
    closeModal.addEventListener('click', () => { rulesModal.classList.add('hidden'); });
    rulesModal.addEventListener('click', (event) => {
        if (event.target === rulesModal) rulesModal.classList.add('hidden');
    });
}

// Inicializa a interface
updateUI();