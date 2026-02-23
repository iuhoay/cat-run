import { obstacles, game, canvas, ctx, cat } from 'game/state';
import { GROUND_HEIGHT } from 'game/constants';
import { soundManager } from 'game/audio';

const MIN_OBSTACLE_GAP = 300;
const MAX_OBSTACLE_GAP = 500;
const SPAWN_CHANCE = 0.02;

export function spawnObstacle() {
    if (!canvas) return;

    const gap = MIN_OBSTACLE_GAP + Math.random() * (MAX_OBSTACLE_GAP - MIN_OBSTACLE_GAP);

    const types = ['box', 'spike'];
    const type = types[Math.floor(Math.random() * types.length)];

    let obstacle = {
        x: canvas.width,
        type: type,
        passed: false
    };

    if (type === 'box') {
        const size = 40 + Math.random() * 30;
        obstacle.width = size;
        obstacle.height = size;
        obstacle.y = canvas.height - GROUND_HEIGHT - size;
    } else if (type === 'spike') {
        obstacle.width = 40;
        obstacle.height = 50;
        obstacle.y = canvas.height - GROUND_HEIGHT - obstacle.height;
    }

    obstacles.push(obstacle);
}

export function drawObstacles() {
    if (!ctx) return;

    obstacles.forEach(obstacle => {
        ctx.save();

        if (obstacle.type === 'box') {
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

            ctx.strokeStyle = '#5a2d0c';
            ctx.lineWidth = 3;
            ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

            ctx.beginPath();
            ctx.moveTo(obstacle.x, obstacle.y);
            ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
            ctx.moveTo(obstacle.x + obstacle.width, obstacle.y);
            ctx.lineTo(obstacle.x, obstacle.y + obstacle.height);
            ctx.stroke();
        } else if (obstacle.type === 'spike') {
            ctx.fillStyle = '#666';
            ctx.beginPath();
            ctx.moveTo(obstacle.x, obstacle.y + obstacle.height);
            ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y);
            ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#999';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y);
            ctx.lineTo(obstacle.x + obstacle.width / 2 - 5, obstacle.y + obstacle.height / 2);
            ctx.stroke();
        }

        ctx.restore();
    });
}

export function updateObstacles(cat) {
    if (!canvas) return;

    if (obstacles.length === 0 || canvas.width - obstacles[obstacles.length - 1].x > MIN_OBSTACLE_GAP + Math.random() * 200) {
        if (Math.random() < SPAWN_CHANCE) {
            spawnObstacle();
        }
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.x -= game.speed;

        if (!obstacle.passed && obstacle.x + obstacle.width < cat.x) {
            obstacle.passed = true;
            game.score += 10;
            soundManager.playScore();
        }

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
        }
    }
}
