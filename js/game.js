import { game, cat, obstacles, catStats, canvas, setStartButton } from 'game/state';
import { BASE_SPEED, SPEED_INCREMENT, MAX_STAT, GROUND_HEIGHT, CAT_X } from 'game/constants';
import { soundManager } from 'game/audio';
import { initRoomObjects } from 'game/room/objects';
import { initCatInRoom, updateRoomCat, clearRoomTimeouts } from 'game/room/cat';
import { drawRoom } from 'game/room/renderer';
import { initCat } from 'game/runner/cat';
import { checkGameOver } from 'game/runner/logic';
import { drawStartScreen } from 'game/ui/screens';
import { updateUI, updateStatBars, uiElements } from 'game/ui/dom';
import { updateStats } from 'game/stats';
import { drawBackground, updateBackground } from 'game/background';
import { drawObstacles, updateObstacles } from 'game/obstacles';
import { drawCat, updateCat } from 'game/runner/cat';
import { setGameFunctions } from 'game/input';

export function enterRoom() {
    game.state = 'room';
    initRoomObjects();
    initCatInRoom();
    soundManager.playRoomEnter();
    if (uiElements.statBarsElement) uiElements.statBarsElement.classList.remove('hidden');
    if (uiElements.resetBtnElement) uiElements.resetBtnElement.classList.remove('hidden');
    updateStatBars(catStats);
}

export function startRunning() {
    if (catStats.energy < 10) {
        cat.state = 'idle';
        return;
    }
    game.state = 'running';
    game.score = 0;
    game.speed = BASE_SPEED;
    game.frameCount = 0;
    obstacles.length = 0;
    clearRoomTimeouts();
    initCat();
    if (uiElements.instructionsElement) uiElements.instructionsElement.classList.remove('hidden');
    if (uiElements.statBarsElement) uiElements.statBarsElement.classList.add('hidden');
}

export function returnToRoom() {
    game.state = 'room';
    initCatInRoom();
    catStats.energy = Math.max(0, catStats.energy - 20);
    soundManager.playRoomEnter();
    if (uiElements.statBarsElement) uiElements.statBarsElement.classList.remove('hidden');
    if (uiElements.gameOverElement) uiElements.gameOverElement.classList.add('hidden');
    if (uiElements.instructionsElement) uiElements.instructionsElement.classList.add('hidden');
    updateStatBars(catStats);
}

export function fullReset() {
    game.state = 'start';
    game.score = 0;
    game.speed = BASE_SPEED;
    game.frameCount = 0;
    obstacles.length = 0;
    catStats.hunger = 80;
    catStats.thirst = 80;
    catStats.energy = 80;
    catStats.happiness = 80;
    catStats.hygiene = 80;
    clearRoomTimeouts();
    if (uiElements.gameOverElement) uiElements.gameOverElement.classList.add('hidden');
    if (uiElements.instructionsElement) uiElements.instructionsElement.classList.add('hidden');
    if (uiElements.statBarsElement) uiElements.statBarsElement.classList.add('hidden');
    if (uiElements.resetBtnElement) uiElements.resetBtnElement.classList.add('hidden');
    initCat();
}

setGameFunctions({
    enterRoom,
    startRunning,
    returnToRoom,
    fullReset
});

export function gameLoop() {
    if (!canvas) return;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    game.frameCount++;

    if (game.state === 'start') {
        drawStartScreen();
    } else if (game.state === 'room') {
        updateStats();
        updateRoomCat();
        drawRoom();
        updateStatBars(catStats);
    } else if (game.state === 'running') {
        game.speed += SPEED_INCREMENT;
        game.score += Math.floor(game.speed * 0.1);

        updateBackground();
        updateCat();
        updateObstacles(cat);

        drawBackground();
        drawObstacles();
        drawCat();

        if (checkGameOver()) {
            game.state = 'gameover';
            soundManager.playGameOver();
            if (uiElements.finalScoreElement) uiElements.finalScoreElement.textContent = game.score;
            if (uiElements.gameOverElement) uiElements.gameOverElement.classList.remove('hidden');
            if (uiElements.instructionsElement) {
                uiElements.instructionsElement.textContent = 'Click or Press Enter to Return to Room';
                uiElements.instructionsElement.classList.remove('hidden');
            }
            if (uiElements.statBarsElement) uiElements.statBarsElement.classList.remove('hidden');
        }

        updateUI(game);
    } else if (game.state === 'gameover') {
        drawBackground();
        drawObstacles();
        drawCat();
        updateUI(game);
    }

    requestAnimationFrame(gameLoop);
}
