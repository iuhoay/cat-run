export const uiElements = {
    scoreElement: document.getElementById('score'),
    gameOverElement: document.getElementById('gameOver'),
    finalScoreElement: document.getElementById('finalScore'),
    instructionsElement: document.getElementById('instructions'),
    statBarsElement: document.getElementById('statBars'),
    resetBtnElement: document.getElementById('resetBtn'),
    hungerBar: document.getElementById('hungerBar'),
    thirstBar: document.getElementById('thirstBar'),
    energyBar: document.getElementById('energyBar'),
    hygieneBar: document.getElementById('hygieneBar')
};

export function updateUI(game) {
    if (uiElements.scoreElement) {
        uiElements.scoreElement.textContent = `Score: ${game.score}`;
    }
}

export function updateStatBars(catStats) {
    if (uiElements.hungerBar) uiElements.hungerBar.style.width = `${catStats.hunger}%`;
    if (uiElements.thirstBar) uiElements.thirstBar.style.width = `${catStats.thirst}%`;
    if (uiElements.energyBar) uiElements.energyBar.style.width = `${catStats.energy}%`;
    if (uiElements.hygieneBar) uiElements.hygieneBar.style.width = `${catStats.hygiene}%`;
}
