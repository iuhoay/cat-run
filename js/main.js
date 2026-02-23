import { initCanvas } from 'game/canvas';
import { initInput } from 'game/input';
import { initClouds } from 'game/background';
import { gameLoop } from 'game/game';
import { initCat } from 'game/runner/cat';

function init() {
    initCanvas();
    initClouds();
    initInput();
    initCat();
    gameLoop();
}

init();
