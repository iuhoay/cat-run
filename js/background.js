import { canvas, ctx, backgroundLayers, game } from 'game/state';

export function initClouds() {
    if (!canvas) return;

    for (let i = 0; i < 5; i++) {
        backgroundLayers[1].clouds.push({
            x: Math.random() * canvas.width,
            y: 50 + Math.random() * 150,
            width: 60 + Math.random() * 40,
            speed: 0.5 + Math.random() * 0.5
        });
    }
}

export function drawBackground() {
    if (!canvas || !ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    backgroundLayers[1].clouds.forEach(cloud => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.width / 2, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.width * 0.3, cloud.y - 10, cloud.width * 0.4, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.width * 0.5, cloud.y, cloud.width * 0.35, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = backgroundLayers[2].color;
    const mountainOffset = backgroundLayers[2].offset;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let x = 0; x <= canvas.width + 100; x += 50) {
        const height = 100 + Math.sin((x + mountainOffset) * 0.01) * 50 + Math.sin((x + mountainOffset) * 0.02) * 30;
        ctx.lineTo(x, canvas.height - 100 - height);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.fill();

    ctx.fillStyle = '#3d5c3d';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

    ctx.fillStyle = '#4a6b4a';
    for (let x = 0; x < canvas.width; x += 20) {
        const textureX = (x - backgroundLayers[3].offset) % canvas.width;
        const drawX = textureX < 0 ? textureX + canvas.width : textureX;
        ctx.fillRect(drawX, canvas.height - 100 + 10, 3, 10);
        ctx.fillRect(drawX + 10, canvas.height - 100 + 25, 2, 8);
    }

    ctx.fillStyle = '#5a7d5a';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 5);
}

export function updateBackground() {
    if (!canvas) return;

    backgroundLayers[1].clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.width < 0) {
            cloud.x = canvas.width + cloud.width;
            cloud.y = 50 + Math.random() * 150;
        }
    });

    backgroundLayers[2].offset += game.speed * backgroundLayers[2].speed;
    backgroundLayers[3].offset += game.speed * backgroundLayers[3].speed;
}
