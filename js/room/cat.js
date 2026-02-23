import { cat, canvas, roomObjects, catStats } from 'game/state';
import { MAX_STAT } from 'game/constants';

const IDLE_MOVE_CHANCE = 0.005;
const ACTION_DURATION = 120;
const FOOD_REFILL_DELAY = 10000;
const WATER_REFILL_DELAY = 10000;
const LITTER_CLEAN_DELAY = 15000;
const BATHTUB_REFILL_DELAY = 20000;

const activeTimeouts = new Set();

function scheduleRefill(callback, delay) {
    const timeoutId = setTimeout(() => {
        callback();
        activeTimeouts.delete(timeoutId);
    }, delay);
    activeTimeouts.add(timeoutId);
}

export function clearRoomTimeouts() {
    activeTimeouts.forEach(id => clearTimeout(id));
    activeTimeouts.clear();
}

export function initCatInRoom() {
    if (!canvas) return;

    cat.x = canvas.width * 0.5;
    cat.y = canvas.height / 2 + 100;
    cat.vy = 0;
    cat.state = 'idle';
    cat.animationFrame = 0;
    cat.onGround = true;
    cat.targetX = null;
    cat.targetY = null;
    cat.facingRight = true;
    cat.currentAction = null;
    cat.actionTimer = 0;
}

export function updateRoomCat() {
    if (cat.targetX !== null && cat.state !== 'sleeping') {
        const dx = cat.targetX - cat.x;
        const dy = cat.targetY - cat.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            cat.state = 'walking';
            cat.facingRight = dx > 0;
            cat.x += (dx / distance) * cat.walkSpeed;
            cat.y += (dy / distance) * cat.walkSpeed;
        } else {
            cat.x = cat.targetX;
            cat.y = cat.targetY;
            cat.targetX = null;
            cat.targetY = null;

            if (cat.currentAction) {
                cat.state = cat.currentAction === 'eat' ? 'eating' :
                           cat.currentAction === 'drink' ? 'drinking' :
                           cat.currentAction === 'use_litter' ? 'using_litter' :
                           cat.currentAction === 'bathe' ? 'bathing' : 'sleeping';
                cat.actionTimer = ACTION_DURATION;
            } else {
                cat.state = 'idle';
            }
        }
    } else if (cat.state === 'eating' || cat.state === 'drinking' || cat.state === 'sleeping' || cat.state === 'using_litter' || cat.state === 'bathing') {
        cat.actionTimer--;

        if (cat.actionTimer <= 0) {
            if (cat.state === 'eating') {
                catStats.hunger = Math.min(MAX_STAT, catStats.hunger + 30);
                roomObjects.foodBowl.full = false;
                scheduleRefill(() => { roomObjects.foodBowl.full = true; }, FOOD_REFILL_DELAY);
            } else if (cat.state === 'drinking') {
                catStats.thirst = Math.min(MAX_STAT, catStats.thirst + 30);
                roomObjects.waterBowl.full = false;
                scheduleRefill(() => { roomObjects.waterBowl.full = true; }, WATER_REFILL_DELAY);
            } else if (cat.state === 'sleeping') {
                catStats.energy = Math.min(MAX_STAT, catStats.energy + 40);
            } else if (cat.state === 'using_litter') {
                catStats.hygiene = Math.min(MAX_STAT, catStats.hygiene + 40);
                roomObjects.litterBox.clean = false;
                scheduleRefill(() => { roomObjects.litterBox.clean = true; }, LITTER_CLEAN_DELAY);
            } else if (cat.state === 'bathing') {
                catStats.hygiene = Math.min(MAX_STAT, catStats.hygiene + 60);
                roomObjects.bathtub.full = false;
                scheduleRefill(() => { roomObjects.bathtub.full = true; }, BATHTUB_REFILL_DELAY);
            }

            cat.state = 'idle';
            cat.currentAction = null;
        }
    } else {
        cat.state = 'idle';
    }

    if (cat.state === 'idle' && Math.random() < IDLE_MOVE_CHANCE && canvas) {
        const floorY = canvas.height / 2 + 100;
        cat.targetX = 100 + Math.random() * (canvas.width - 200);
        cat.targetY = floorY + 20 + Math.random() * 50;
    }
}
