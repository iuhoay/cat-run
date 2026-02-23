import {
    BASE_SPEED,
    MAX_STAT,
    CAT_X
} from './constants.js';

export const game = {
    state: 'start',
    score: 0,
    speed: BASE_SPEED,
    frameCount: 0
};

export const cat = {
    x: CAT_X,
    y: 0,
    width: 50,
    height: 50,
    vy: 0,
    state: 'running',
    animationFrame: 0,
    animationTimer: 0,
    onGround: false,
    targetX: null,
    targetY: null,
    facingRight: true,
    walkSpeed: 2,
    currentAction: null,
    actionTimer: 0
};

export const catStats = {
    hunger: 80,
    thirst: 80,
    energy: 80,
    happiness: 80,
    hygiene: 80
};

export let lastStatUpdate = 0;

export function setLastStatUpdate(value) {
    lastStatUpdate = value;
}

export const roomObjects = {
    foodBowl: { x: 0, y: 0, width: 60, height: 30, full: true },
    waterBowl: { x: 0, y: 0, width: 60, height: 30, full: true },
    bed: { x: 0, y: 0, width: 120, height: 80 },
    door: { x: 0, y: 0, width: 80, height: 120 },
    litterBox: { x: 0, y: 0, width: 70, height: 50, clean: true },
    bathtub: { x: 0, y: 0, width: 100, height: 60, full: true }
};

export let obstacles = [];

export const backgroundLayers = [
    { speed: 0.2, offset: 0, color: '#87CEEB', height: 1 },
    { speed: 0.1, offset: 0, clouds: [], color: null },
    { speed: 0.3, offset: 0, color: '#5a7d7c', height: 0.4 },
    { speed: 0.8, offset: 0, color: '#4a5d4f', height: 0.15 }
];

export let startButton = null;

export function setStartButton(value) {
    startButton = value;
}

export let canvas = null;
export let ctx = null;

export function setCanvas(canvasEl, context) {
    canvas = canvasEl;
    ctx = context;
}
