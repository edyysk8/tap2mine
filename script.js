class Game {
    constructor() {
        this.coins = 100;
        this.automaticCoins = 0;
        this.upgradeCost2 = 100;
        this.goalCount = 0;
        this.rewardAmount = 10;
        this.currentGoal = 100;
        this.level = 1;
        this.multiplier = 1;
        this.multiplierActive = false;
        this.multiplierDuration = 600000; // 10 minutos
        this.nextLevelRequirement = 1000;

        // Referências aos elementos DOM
        this.coinDisplay = document.getElementById('coinDisplay');
        this.viralCharacterButton = document.querySelector('.tap-button');
        this.upgradeButton2 = document.getElementById('upgrade2');
        this.goalDisplay = document.getElementById('goalDisplay');
        this.upgradeCostDisplay = document.getElementById('upgradeCost');
        this.claimRewardButton = document.getElementById('claimRewardButton');
        this.earningsDisplay = document.getElementById('earningsDisplay');
        this.progressBar = document.getElementById('progressBar');
        this.levelDisplay = document.getElementById('levelDisplay');
        this.multiplierButton = document.getElementById('multiplierButton');
        
        // Efeitos sonoros
        this.coinSound = document.getElementById('coinSound');
        this.multiplierSound = document.getElementById('multiplierSound');
        this.upgradeSound = document.getElementById('upgradeSound');
        this.backgroundMusic = document.getElementById('backgroundMusic');

        // Missões
        this.missions = [
            { id: 1, description: "Clique 10 vezes", target: 10, progress: 0, reward: 20, completed: false },
            { id: 2, description: "Ganhe 100 moedas", target: 100, progress: 0, reward: 30, completed: false },
            { id: 3, description: "Ative o multiplicador 3 vezes", target: 3, progress: 0, reward: 50, completed: false }
        ];

        // Inicializar eventos e estado do jogo
        this.loadProgress();
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
        this.checkUpgrades();
        this.startAutoEarnings();
        this.checkMultiplierAvailability(); // Verifica se o botão deve estar disponível
        this.backgroundMusic.volume = 0.5; // Ajusta o volume da música de fundo
        this.backgroundMusic.play(); // Inicia a música de fundo
        this.renderMissions(); // Renderiza as missões ao iniciar o jogo
    }

    bindEvents() {
        this.viralCharacterButton.addEventListener('click', () => this.earnCoin());
        this.claimRewardButton.addEventListener('click', () => this.claimReward());
        this.upgradeButton2.addEventListener('click', () => this.purchaseUpgrade());
        this.multiplierButton.addEventListener('click', () => this.activateMultiplier());
        
        const themeButtons = document.querySelectorAll('.theme-button');
        themeButtons.forEach(button => {
            button.addEventListener('click', () => this.changeTheme(button.dataset.theme));
        });

        // Controle de música
        document.getElementById('toggleMusicButton').addEventListener('click', () => this.toggleMusic());

        window.addEventListener('beforeunload', () => this.saveProgress());
    }

    earnCoin() {
        this.coins += (1 * this.multiplier);
        this.updateDisplay();
        this.animateCoinGain();
        this.coinSound.play(); // Toca o som de ganho de moedas

        // Atualiza o progresso das missões
        this.updateMissions();
    }

    animateCoinGain() {
        this.coinDisplay.classList.add('coin-gain');
        
        // Efeito de partículas simples
        const particle = document.createElement('div');
        particle.className = 'particle';
        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove(); // Remove a partícula após 0.5s
        }, 500);

        setTimeout(() => {
            this.coinDisplay.classList.remove('coin-gain');
        }, 500);
    }

    updateDisplay() {
        this.coinDisplay.textContent = `Moedas: ${this.coins}`;
        this.earningsDisplay.textContent = `Ganho automático: ${this.automaticCoins * this.multiplier} Moedas/segundo`;
        this.levelDisplay.textContent = `Nível: ${this.level}`;
        this.checkUpgrades();
        this.checkGoals();
        this.checkLevelUp();
        this.checkMultiplierAvailability(); // Verificar se o botão de multiplicador deve ser exibido
    }

    checkUpgrades() {
        this.upgradeButton2.disabled = this.coins < this.upgradeCost2;
        this.upgradeCostDisplay.textContent = ` (Custo: ${this.upgradeCost2} Moedas)`;
    }

    purchaseUpgrade() {
        if (this.coins >= this.upgradeCost2) {
            this.coins -= this.upgradeCost2;
            this.automaticCoins += 1;
            this.upgradeSound.play(); // Toca o som de compra de upgrade
            this.upgradeCost2 = Math.floor(this.upgradeCost2 * 1.5);
            this.updateDisplay();
        }
    }

    startAutoEarnings() {
        setInterval(() => {
            this.coins += this.automaticCoins * this.multiplier;
            this.updateDisplay();
        }, 1000);
    }

    checkGoals() {
        const progress = Math.min((this.coins / this.currentGoal) * 100, 100);
        this.progressBar.style.width = `${progress}%`;

        if (this.coins >= this.currentGoal) {
            this.claimRewardButton.style.display = 'inline-block';
            this.goalDisplay.textContent = `Objetivo alcançado! Clique para reivindicar sua recompensa.`;
        } else {
            this.claimRewardButton.style.display = 'none';
            this.goalDisplay.textContent = `Objetivo: ${this.currentGoal} Moedas`;
        }
    }

    claimReward() {
        this.coins += this.rewardAmount;
        this.goalCount += 1;
        this.rewardAmount += 5;
        this.currentGoal = Math.floor(this.currentGoal * 1.5);
        this.updateDisplay();
        this.claimRewardButton.style.display = 'none';
    }

    checkLevelUp() {
        if (this.coins >= this.nextLevelRequirement) {
            this.level++;
            this.nextLevelRequirement = Math.floor(this.nextLevelRequirement * 1.5);
            alert(`Parabéns! Você atingiu o nível ${this.level}!`);
            this.unlockUpgradesOrBonus();
        }
    }

    unlockUpgradesOrBonus() {
        alert(`Novo upgrade desbloqueado no nível ${this.level}!`);
        // Lógica para desbloquear upgrades, novos personagens ou ícones de moeda
    }

    activateMultiplier() {
        if (!this.multiplierActive) {
            this.multiplierActive = true;
            this.multiplier = 2; // Multiplicador temporário
            this.multiplierButton.disabled = true; // Desabilitar botão enquanto o multiplicador está ativo
            this.multiplierSound.play(); // Toca o som de ativação do multiplicador
            setTimeout(() => {
                this.multiplier = 1;
                this.multiplierActive = false;
                this.checkMultiplierAvailability(); // Atualiza a disponibilidade do botão após o tempo
            }, this.multiplierDuration);
        }
    }

    checkMultiplierAvailability() {
        if (this.multiplierActive) {
            this.multiplierButton.style.display = 'none'; // Esconde o botão enquanto o multiplicador está ativo
        } else {
            this.multiplierButton.style.display = 'inline-block'; // Botão disponível
        }
    }

    changeTheme(theme) {
        document.body.className = theme; // Adiciona a classe do tema ao body
    }

    toggleMusic() {
        if (this.backgroundMusic.paused) {
            this.backgroundMusic.play();
            document.getElementById('toggleMusicButton').textContent = 'Desativar Música';
        } else {
            this.backgroundMusic.pause();
            document.getElementById('toggleMusicButton').textContent = 'Ativar Música';
        }
    }

    renderMissions() {
        const missionList = document.getElementById('missionList');
        missionList.innerHTML = ''; // Limpa a lista antes de renderizar
        this.missions.forEach(mission => {
            const missionItem = document.createElement('li');
            missionItem.className = `mission ${mission.completed ? 'completed' : ''}`;
            missionItem.textContent = `${mission.description} - Progresso: ${mission.progress}/${mission.target} (Recompensa: ${mission.reward} Moedas)`;
            missionList.appendChild(missionItem);
        });
    }

    updateMissions() {
        this.missions.forEach(mission => {
            if (!mission.completed) {
                mission.progress++;
                if (mission.progress >= mission.target) {
                    mission.completed = true;
                    this.coins += mission.reward; // Adiciona a recompensa ao jogador
                    alert(`Missão Completa: ${mission.description}! Você ganhou ${mission.reward} moedas.`);
                }
            }
        });
        this.renderMissions(); // Atualiza a visualização das missões
    }

    // Função para salvar o progresso no localStorage
    saveProgress() {
        const gameState = {
            coins: this.coins,
            automaticCoins: this.automaticCoins,
            upgradeCost2: this.upgradeCost2,
            goalCount: this.goalCount,
            rewardAmount: this.rewardAmount,
            currentGoal: this.currentGoal,
            level: this.level,
            nextLevelRequirement: this.nextLevelRequirement,
            multiplierActive: this.multiplierActive,
            missions: this.missions // Salvar o estado das missões
        };
        localStorage.setItem('tap2earnProgress', JSON.stringify(gameState));
    }

    // Função para carregar o progresso do localStorage
    loadProgress() {
        const savedState = JSON.parse(localStorage.getItem('tap2earnProgress'));
        if (savedState) {
            this.coins = savedState.coins;
            this.automaticCoins = savedState.automaticCoins;
            this.upgradeCost2 = savedState.upgradeCost2;
            this.goalCount = savedState.goalCount;
            this.rewardAmount = savedState.rewardAmount;
            this.currentGoal = savedState.currentGoal;
            this.level = savedState.level;
            this.nextLevelRequirement = savedState.nextLevelRequirement;
            this.multiplierActive = savedState.multiplierActive;
            this.missions = savedState.missions; // Carregar o estado das missões
        }
    }
}

// Instância do jogo
const tap2EarnGame = new Game();
