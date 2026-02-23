import { game, setStartButton } from 'game/state';

export function drawStartScreen() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 20; i++) {
        const x = (game.frameCount * 0.5 + i * 50) % canvas.width;
        const y = 50 + Math.sin(game.frameCount * 0.01 + i) * 30;
        ctx.beginPath();
        ctx.arc(x, y, 2 + Math.sin(game.frameCount * 0.05 + i) * 1, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 64px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Cat Runner', canvas.width / 2, canvas.height / 2 - 150);

    ctx.font = '24px Nunito, sans-serif';
    ctx.fillStyle = '#aaa';
    ctx.fillText('Your virtual cat companion', canvas.width / 2, canvas.height / 2 - 100);

    drawStartScreenCat(ctx, canvas);

    const btnX = canvas.width / 2 - 100;
    const btnY = canvas.height / 2 + 80;
    const btnWidth = 200;
    const btnHeight = 50;

    const glowIntensity = 0.3 + Math.sin(game.frameCount * 0.05) * 0.1;
    ctx.shadowColor = '#ff8c42';
    ctx.shadowBlur = 20;

    ctx.fillStyle = `rgba(255, 140, 66, ${glowIntensity + 0.3})`;
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnWidth, btnHeight, 10);
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.strokeStyle = '#ff8c42';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Nunito, sans-serif';
    ctx.fillText('Enter Room', canvas.width / 2, btnY + 28);

    const buttonRect = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
    setStartButton(buttonRect);
}

function drawStartScreenCat(ctx, canvas) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.save();
    ctx.translate(centerX, centerY);

    const bounce = Math.sin(game.frameCount * 0.05) * 5;
    ctx.translate(0, bounce);

    ctx.fillStyle = '#ff8c42';
    ctx.beginPath();
    ctx.roundRect(-25, -15, 50, 30, 10);
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
    if (Math.sin(game.frameCount * 0.03) > 0.9) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(17, -22);
        ctx.lineTo(23, -22);
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

    const tailWag = Math.sin(game.frameCount * 0.1) * 0.5;
    ctx.strokeStyle = '#ff8c42';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.quadraticCurveTo(-35, -15 + tailWag * 10, -45, -25 + tailWag * 5);
    ctx.stroke();

    ctx.restore();
}
