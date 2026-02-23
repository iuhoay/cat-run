import { cat, canvas, ctx, game } from 'game/state';
import { GRAVITY, GROUND_HEIGHT, JUMP_FORCE } from 'game/constants';
import { soundManager } from 'game/audio';

export function initCat() {
    if (!canvas) return;

    cat.y = canvas.height - GROUND_HEIGHT - cat.height;
    cat.vy = 0;
    cat.state = 'running';
    cat.animationFrame = 0;
    cat.onGround = true;
    cat.targetX = null;
    cat.targetY = null;
    cat.facingRight = true;
    cat.currentAction = null;
    cat.actionTimer = 0;
}

export function updateCat() {
    cat.vy += GRAVITY;
    cat.y += cat.vy;

    const groundY = canvas.height - GROUND_HEIGHT - cat.height;
    if (cat.y >= groundY) {
        cat.y = groundY;
        cat.vy = 0;
        cat.state = 'running';
        cat.onGround = true;
    } else {
        cat.state = cat.vy < 0 ? 'jumping' : 'falling';
        cat.onGround = false;
    }

    if (cat.state === 'running') {
        cat.animationTimer++;
        if (cat.animationTimer > 8) {
            cat.animationTimer = 0;
            cat.animationFrame = (cat.animationFrame + 1) % 4;
        }
    }
}

export function drawCat() {
    if (!canvas || !ctx) return;

    ctx.save();
    ctx.translate(cat.x + cat.width / 2, cat.y + cat.height / 2);

    ctx.fillStyle = '#ff8c42';

    if (cat.state === 'running') {
        const bounce = Math.sin(game.frameCount * 0.3) * 3;
        ctx.translate(0, bounce);
    }

    ctx.beginPath();
    ctx.roundRect(-20, -15, 40, 30, 10);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(15, -20, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff8c42';
    ctx.beginPath();
    ctx.moveTo(5, -32);
    ctx.lineTo(0, -45);
    ctx.lineTo(12, -35);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(20, -35);
    ctx.lineTo(25, -48);
    ctx.lineTo(30, -32);
    ctx.fill();

    ctx.fillStyle = '#ffb088';
    ctx.beginPath();
    ctx.moveTo(6, -33);
    ctx.lineTo(3, -40);
    ctx.lineTo(10, -35);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(20, -22, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    ctx.arc(28, -18, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, -18);
    ctx.lineTo(38, -20);
    ctx.moveTo(30, -18);
    ctx.lineTo(38, -16);
    ctx.stroke();

    const tailWag = Math.sin(game.frameCount * 0.2) * 0.3;
    ctx.strokeStyle = '#ff8c42';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.quadraticCurveTo(-35, -10 + tailWag * 10, -40, -25 + tailWag * 5);
    ctx.stroke();

    ctx.strokeStyle = '#ff8c42';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    if (cat.state === 'running') {
        const legOffset1 = Math.sin(game.frameCount * 0.3) * 10;
        const legOffset2 = Math.sin(game.frameCount * 0.3 + Math.PI) * 10;

        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(10 + legOffset1, 22);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(5, 10);
        ctx.lineTo(5 + legOffset2, 22);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-10, 10);
        ctx.lineTo(-10 + legOffset2, 22);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-15, 10);
        ctx.lineTo(-15 + legOffset1, 22);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(12, 18);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(5, 10);
        ctx.lineTo(2, 16);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-10, 10);
        ctx.lineTo(-15, 5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-15, 10);
        ctx.lineTo(-20, 5);
        ctx.stroke();
    }

    ctx.restore();
}

export function jump(instructionsElement) {
    if (cat.onGround) {
        cat.vy = JUMP_FORCE;
        cat.state = 'jumping';
        cat.onGround = false;
        if (instructionsElement) {
            instructionsElement.classList.add('hidden');
        }
        soundManager.playJump();
    }
}
