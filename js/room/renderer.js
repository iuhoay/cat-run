import { ctx, canvas, cat, game, catStats } from 'game/state';
import { drawFurniture } from 'game/room/objects';
import { updateStatBars } from 'game/ui/dom';

export function drawRoom() {
    if (!ctx || !canvas) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#f5e6d3');
    gradient.addColorStop(1, '#e8d5c4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const floorY = canvas.height / 2 + 100;
    ctx.fillStyle = '#8b6914';
    ctx.fillRect(0, floorY, canvas.width, canvas.height - floorY);

    ctx.strokeStyle = '#6b510f';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, floorY);
        ctx.lineTo(x + 20, canvas.height);
        ctx.stroke();
    }

    const windowX = canvas.width * 0.1;
    const windowY = canvas.height * 0.1;
    const windowW = 150;
    const windowH = 120;

    ctx.fillStyle = '#4a3c28';
    ctx.fillRect(windowX - 10, windowY - 10, windowW + 20, windowH + 20);

    const skyGradient = ctx.createLinearGradient(0, windowY, 0, windowY + windowH);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(windowX, windowY, windowW, windowH);

    ctx.strokeStyle = '#4a3c28';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(windowX + windowW / 2, windowY);
    ctx.lineTo(windowX + windowW / 2, windowY + windowH);
    ctx.moveTo(windowX, windowY + windowH / 2);
    ctx.lineTo(windowX + windowW, windowY + windowH / 2);
    ctx.stroke();

    drawFurniture();
    drawRoomCat();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.font = '14px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Click on objects to interact • Click door to go running', canvas.width / 2, canvas.height - 30);
}

export function drawRoomCat() {
    if (!ctx) return;

    ctx.save();
    ctx.translate(cat.x, cat.y);

    if (!cat.facingRight) {
        ctx.scale(-1, 1);
    }

    ctx.fillStyle = '#ff8c42';

    let bounce = 0;
    if (cat.state === 'idle') {
        bounce = Math.sin(game.frameCount * 0.05) * 2;
    } else if (cat.state === 'walking') {
        bounce = Math.abs(Math.sin(game.frameCount * 0.2)) * 3;
    }
    ctx.translate(0, bounce);

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
    if (catStats.happiness < 30) {
        ctx.beginPath();
        ctx.arc(20, -20, 3, 0, Math.PI, false);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.arc(20, -22, 3, 0, Math.PI * 2);
        ctx.fill();
    }

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

    let tailWag = 0;
    if (cat.state === 'idle') {
        tailWag = Math.sin(game.frameCount * 0.1) * 0.2;
    } else if (cat.state === 'walking') {
        tailWag = Math.sin(game.frameCount * 0.3) * 0.4;
    }

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

    if (cat.state === 'walking') {
        const legOffset1 = Math.sin(game.frameCount * 0.3) * 8;
        const legOffset2 = Math.sin(game.frameCount * 0.3 + Math.PI) * 8;

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
    } else if (cat.state === 'sleeping') {
        ctx.fillStyle = '#ff8c42';
        ctx.beginPath();
        ctx.arc(-10, 10, 12, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(10, 22);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(5, 10);
        ctx.lineTo(5, 22);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-10, 10);
        ctx.lineTo(-10, 22);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-15, 10);
        ctx.lineTo(-15, 22);
        ctx.stroke();
    }

    if (cat.state === 'eating') {
        ctx.fillStyle = '#8b0000';
        ctx.font = '16px Nunito, sans-serif';
        ctx.fillText('🍖', 0, -50);
    } else if (cat.state === 'drinking') {
        ctx.fillStyle = '#4682b4';
        ctx.font = '16px Nunito, sans-serif';
        ctx.fillText('💧', 0, -50);
    } else if (cat.state === 'sleeping') {
        ctx.fillStyle = '#666';
        ctx.font = 'bold 12px Nunito, sans-serif';
        ctx.fillText('z', 20, -40);
        ctx.fillText('z', 25, -50);
        ctx.fillText('z', 30, -60);
    } else if (cat.state === 'using_litter') {
        ctx.fillStyle = '#8b7355';
        ctx.font = 'bold 14px Nunito, sans-serif';
        ctx.fillText('🐾', 0, -45);
        ctx.fillText('dig dig...', 15, -55);
    } else if (cat.state === 'bathing') {
        ctx.fillStyle = '#4dabf7';
        ctx.font = 'bold 14px Nunito, sans-serif';
        ctx.fillText('🫧', -20, -45);
        ctx.fillText('🫧', 10, -55);
        ctx.fillText('splash...', 5, -65);
    }

    ctx.restore();
}
