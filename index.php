<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tap2Earn</title>
    <link rel="stylesheet" href="style.css">
    <script>
        // Função para obter o token do Telegram
        function getTelegramToken() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('tgWebApp');
        }

        // Inicializa o bot
        window.onload = function() {
            const token = getTelegramToken();
            // Aqui você pode fazer algo com o token se necessário
        };
    </script>
</head>
<body>
    <div class="container">
        <h1>Tap2Earn</h1>
        <div id="levelDisplay">Nível: 1</div>
        <div id="coinDisplay">
            <img src="assets/coin.webp" alt="Moeda" class="coin-icon" aria-hidden="true"> Moedas: 100
        </div>
        
        <div id="earningsDisplay">Ganho automático: 0 Moedas/segundo</div>
        <img src="assets/viral-character.png" alt="Personagem Viral" class="viral-character tap-button" aria-label="Toque para ganhar moedas" tabindex="0">
        
        <div id="upgrades">
            <h2>Upgrades</h2>
            <button id="upgrade2" disabled aria-label="Upgrade para ganhar 1 moeda por segundo" tabindex="0">
                <img src="assets/upgrade2.webp" alt="Imagem do Upgrade 2" class="upgrade-icon" aria-hidden="true"> +1 Moeda/segundo
            </button>
            <div id="upgradeCost"> (Custo: 100 Moedas)</div>
        </div>
        
        <div id="goals">
            <h2>Objetivos</h2>
            <div id="progressBarContainer" aria-hidden="true">
                <div id="progressBar"></div>
            </div>
            <p id="goalDisplay">Objetivo: 100 Moedas</p>
        </div>
        
        <button id="claimRewardButton" style="display: none;" aria-label="Clique para reivindicar a recompensa" tabindex="0">Reivindicar Recompensa</button>
        <button id="multiplierButton" style="display: none;" aria-label="Ativar multiplicador de moedas" tabindex="0">Ativar Multiplicador</button>
        
        <div id="musicControl">
            <h2>Controle de Música</h2>
            <button id="toggleMusicButton">Ativar Música</button>
        </div>
    </div>

    <!-- Elementos de áudio -->
    <audio id="coinSound" src="assets/coin_sound.mp3" preload="auto"></audio>
    <audio id="multiplierSound" src="assets/multiplier_sound.mp3" preload="auto"></audio>
    <audio id="upgradeSound" src="assets/upgrade_sound.mp3" preload="auto"></audio>
    <audio id="backgroundMusic" src="assets/background_music.mp3" preload="auto" loop></audio>

    <script src="script.js"></script>
</body>
</html>
