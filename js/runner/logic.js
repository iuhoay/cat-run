import { game, cat, obstacles, canvas } from 'game/state';
import { checkCollision } from 'game/utils';

export function checkGameOver() {
    if (!canvas) return false;

    const catHitbox = {
        x: cat.x + 10,
        y: cat.y + 10,
        width: cat.width - 20,
        height: cat.height - 15
    };

    for (let obstacle of obstacles) {
        const obstacleHitbox = {
            x: obstacle.x + 5,
            y: obstacle.y + 5,
            width: obstacle.width - 10,
            height: obstacle.height - 10
        };

        if (checkCollision(catHitbox, obstacleHitbox)) {
            return true;
        }
    }
    return false;
}
