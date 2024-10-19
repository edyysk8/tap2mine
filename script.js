class Game {
    constructor() {
        this.coins = 100;
        this.automaticCoins = 0;
        this.upgradeCost = 100;
        this.level = 1;

        // Referências aos elementos DOM
        this.coinDisplay = document.getElementById('coinDisplay');
        this.viralCharacterButton = document.querySelector('.tap-button');
        this.upgradeButton = document.getElementById('upgrade2');
        this.earningsDisplay = document.getElementById('earningsDisplay');
        this.levelDisplay = document.getElementById('levelDisplay');
        
        // Efeitos sonoros
        this.coinSound = document.getElementById('coinSound');
        this.backgroundMusic = document.getElementById('backgroundMusic');

        // Inicializar eventos
        this.bindEvents();
        this.updateDisplay();
        this.startAutoEarnings();
    }

    bindEvents() {
        this.viralCharacterButton.addEventListener('click', () => this.earnCoin());
        this.upgradeButton.addEventListener('click', () => this.purchaseUpgrade());
    }

    earnCoin() {
        this.coins += 1;
        this.updateDisplay();
        this.coinSound.play(); // Toca o som de ganho de moedas
    }

    updateDisplay() {
        this.coinDisplay.textContent = `Moedas: ${this.coins}`;
        this.earningsDisplay.textContent = `Ganho automático: ${this.automaticCoins} Moedas/segundo`;
        this.levelDisplay.textContent = `Nível: ${this.level}`;
        this.checkUpgrades();
    }

    checkUpgrades() {
        this.upgradeButton.disabled = this.coins < this.upgradeCost;
    }

    purchaseUpgrade() {
        if (this.coins >= this.upgradeCost) {
            this.coins -= this.upgradeCost;
            this.automaticCoins += 1; // Aumenta ganho automático
            this.upgradeCost = Math.floor(this.upgradeCost * 1.5); // Aumenta o custo do próximo upgrade
            this.updateDisplay();
        }
    }

    startAutoEarnings() {
        setInterval(() => {
            this.coins += this.automaticCoins;
            this.updateDisplay();
        }, 1000);
    }
}

// Instância do jogo
const tap2EarnGame = new Game();
