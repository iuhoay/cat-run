import { game, startButton, roomObjects, cat, catStats } from 'game/state';
import { pointInRect } from 'game/utils';
import { soundManager } from 'game/audio';

let enterRoomFn, startRunningFn, returnToRoomFn, fullResetFn;

export function setGameFunctions(functions) {
    enterRoomFn = functions.enterRoom;
    startRunningFn = functions.startRunning;
    returnToRoomFn = functions.returnToRoom;
    fullResetFn = functions.fullReset;
}

function handleJump(instructionsElement) {
    if (game.state === 'running') {
        import('game/runner/cat').then(module => {
            module.jump(instructionsElement);
        });
    }
}

function handleInteraction(x, y) {
    if (game.state === 'start' && startButton) {
        if (pointInRect(x, y, startButton)) {
            if (enterRoomFn) enterRoomFn();
        }
    } else if (game.state === 'room') {
        handleRoomClick(x, y);
    } else if (game.state === 'running') {
        const instructionsElement = document.getElementById('instructions');
        handleJump(instructionsElement);
    } else if (game.state === 'gameover') {
        if (returnToRoomFn) returnToRoomFn();
    }
}

export function initInput() {
    const canvas = document.getElementById('gameCanvas');
    const instructionsElement = document.getElementById('instructions');
    const resetBtnElement = document.getElementById('resetBtn');

    window.addEventListener('keydown', (e) => {
        soundManager.init();
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            handleJump(instructionsElement);
        } else if (e.code === 'KeyR') {
            if (fullResetFn) fullResetFn();
        } else if (e.code === 'Enter' && game.state === 'start') {
            if (enterRoomFn) enterRoomFn();
        } else if (e.code === 'Enter' && game.state === 'gameover') {
            if (returnToRoomFn) returnToRoomFn();
        }
    });

    window.addEventListener('pointerdown', (e) => {
        soundManager.init();
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        handleInteraction(x, y);
    });

    window.addEventListener('touchstart', (e) => {
        e.preventDefault();
        soundManager.init();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        handleInteraction(x, y);
    });

    if (resetBtnElement) {
        resetBtnElement.addEventListener('click', () => {
            if (fullResetFn) fullResetFn();
        });
    }
}

function handleRoomClick(x, y) {
    if (pointInRect(x, y, roomObjects.foodBowl)) {
        if (roomObjects.foodBowl.full) {
            cat.targetX = roomObjects.foodBowl.x + roomObjects.foodBowl.width / 2;
            cat.targetY = roomObjects.foodBowl.y - 20;
            cat.currentAction = 'eat';
            soundManager.playEat();
        }
    } else if (pointInRect(x, y, roomObjects.waterBowl)) {
        if (roomObjects.waterBowl.full) {
            cat.targetX = roomObjects.waterBowl.x + roomObjects.waterBowl.width / 2;
            cat.targetY = roomObjects.waterBowl.y - 20;
            cat.currentAction = 'drink';
            soundManager.playDrink();
        }
    } else if (pointInRect(x, y, roomObjects.bed)) {
        cat.targetX = roomObjects.bed.x + roomObjects.bed.width / 2;
        cat.targetY = roomObjects.bed.y + roomObjects.bed.height / 2;
        cat.currentAction = 'sleep';
        soundManager.playSleep();
    } else if (pointInRect(x, y, roomObjects.bathtub)) {
        if (roomObjects.bathtub.full) {
            cat.targetX = roomObjects.bathtub.x + roomObjects.bathtub.width / 2;
            cat.targetY = roomObjects.bathtub.y + roomObjects.bathtub.height / 2 - 10;
            cat.currentAction = 'bathe';
            soundManager.playBath();
        }
    } else if (pointInRect(x, y, roomObjects.litterBox)) {
        cat.targetX = roomObjects.litterBox.x + roomObjects.litterBox.width / 2;
        cat.targetY = roomObjects.litterBox.y + roomObjects.litterBox.height / 2 - 10;
        cat.currentAction = 'use_litter';
        soundManager.playLitter();
    } else if (pointInRect(x, y, roomObjects.door)) {
        if (startRunningFn) startRunningFn();
    }
}
