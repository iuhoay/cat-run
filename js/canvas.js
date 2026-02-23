import { setCanvas } from 'game/state';
import { initRoomObjects } from 'game/room/objects';

export function resizeCanvas() {
    const canvasEl = document.getElementById('gameCanvas');
    if (canvasEl) {
        canvasEl.width = window.innerWidth;
        canvasEl.height = window.innerHeight;
    }
}

export function initCanvas() {
    const canvasEl = document.getElementById('gameCanvas');
    if (!canvasEl) {
        console.error('Canvas element not found');
        return;
    }

    let context;
    try {
        context = canvasEl.getContext('2d');
        if (!context) {
            throw new Error('Failed to get 2D context');
        }
    } catch (e) {
        console.error('Canvas context initialization failed:', e);
        return;
    }

    setCanvas(canvasEl, context);

    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        initRoomObjects();
    });
}
