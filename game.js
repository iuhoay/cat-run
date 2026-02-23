const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const instructionsElement = document.getElementById('instructions');

// Sound Manager using Web Audio API
const soundManager = {
    audioContext: null,
    initialized: false,

    init() {
        if (this.initialized) return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported, sounds disabled');
        }
    },

    ensureContext() {
        if (!this.initialized) {
            this.init();
        }
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    },

    playJump() {
        this.ensureContext();
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.15);

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.15);
    },

    playGameOver() {
        this.ensureContext();
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.5);

        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    },

    playScore() {
        this.ensureContext();
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.05);
    }
};

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game constants
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const GROUND_HEIGHT = 100;
const CAT_X = 150;
const BASE_SPEED = 5;
const SPEED_INCREMENT = 0.001;

// Game state
let gameState = 'running'; // 'running', 'gameover'
let score = 0;
let gameSpeed = BASE_SPEED;
let frameCount = 0;

// Cat object
const cat = {
    x: CAT_X,
    y: 0,
    width: 50,
    height: 50,
    vy: 0,
    state: 'running', // 'running', 'jumping', 'falling'
    animationFrame: 0,
    animationTimer: 0,
    onGround: false
};

// Obstacles array
let obstacles = [];

// Background layers for parallax
const backgroundLayers = [
    { speed: 0.2, offset: 0, color: '#87CEEB', height: 1 }, // Sky
    { speed: 0.1, offset: 0, clouds: [], color: null }, // Clouds
    { speed: 0.3, offset: 0, color: '#5a7d7c', height: 0.4 }, // Mountains
    { speed: 0.8, offset: 0, color: '#4a5d4f', height: 0.15 }  // Ground decoration
];

// Initialize clouds
for (let i = 0; i < 5; i++) {
    backgroundLayers[1].clouds.push({
        x: Math.random() * canvas.width,
        y: 50 + Math.random() * 150,
        width: 60 + Math.random() * 40,
        speed: 0.5 + Math.random() * 0.5
    });
}

// Initialize cat position
function initCat() {
    cat.y = canvas.height - GROUND_HEIGHT - cat.height;
    cat.vy = 0;
    cat.state = 'running';
    cat.animationFrame = 0;
    cat.onGround = true;
}

// Jump function
function jump() {
    if (gameState === 'running' && cat.onGround) {
        cat.vy = JUMP_FORCE;
        cat.state = 'jumping';
        cat.onGround = false;
        instructionsElement.classList.add('hidden');
        soundManager.playJump();
    }
}

// Restart game
function restart() {
    gameState = 'running';
    score = 0;
    gameSpeed = BASE_SPEED;
    frameCount = 0;
    obstacles = [];
    initCat();
    gameOverElement.classList.add('hidden');
    instructionsElement.classList.remove('hidden');
}

// Input handling
window.addEventListener('keydown', (e) => {
    soundManager.init();
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
    } else if (e.code === 'KeyR' && gameState === 'gameover') {
        restart();
    }
});

window.addEventListener('pointerdown', () => {
    soundManager.init();
    if (gameState === 'running') {
        jump();
    } else if (gameState === 'gameover') {
        restart();
    }
});

window.addEventListener('touchstart', (e) => {
    e.preventDefault();
    soundManager.init();
    if (gameState === 'running') {
        jump();
    } else if (gameState === 'gameover') {
        restart();
    }
});

// Spawn obstacles
function spawnObstacle() {
    const minGap = 250;
    const maxGap = 500;
    const gap = minGap + Math.random() * (maxGap - minGap);

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

// Update cat
function updateCat() {
    // Apply gravity
    cat.vy += GRAVITY;
    cat.y += cat.vy;

    // Ground collision
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

    // Animation
    if (cat.state === 'running') {
        cat.animationTimer++;
        if (cat.animationTimer > 8) {
            cat.animationTimer = 0;
            cat.animationFrame = (cat.animationFrame + 1) % 4;
        }
    }
}

// Draw cat
function drawCat() {
    ctx.save();
    ctx.translate(cat.x + cat.width / 2, cat.y + cat.height / 2);

    // Body color
    ctx.fillStyle = '#ff8c42';

    if (cat.state === 'running') {
        // Running animation - body bounces
        const bounce = Math.sin(frameCount * 0.3) * 3;
        ctx.translate(0, bounce);
    }

    // Draw body
    ctx.beginPath();
    ctx.roundRect(-20, -15, 40, 30, 10);
    ctx.fill();

    // Draw head
    ctx.beginPath();
    ctx.arc(15, -20, 18, 0, Math.PI * 2);
    ctx.fill();

    // Ears
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

    // Inner ears
    ctx.fillStyle = '#ffb088';
    ctx.beginPath();
    ctx.moveTo(6, -33);
    ctx.lineTo(3, -40);
    ctx.lineTo(10, -35);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(20, -22, 3, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    ctx.arc(28, -18, 2, 0, Math.PI * 2);
    ctx.fill();

    // Whiskers
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, -18);
    ctx.lineTo(38, -20);
    ctx.moveTo(30, -18);
    ctx.lineTo(38, -16);
    ctx.stroke();

    // Tail - animated
    const tailWag = Math.sin(frameCount * 0.2) * 0.3;
    ctx.strokeStyle = '#ff8c42';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.quadraticCurveTo(-35, -10 + tailWag * 10, -40, -25 + tailWag * 5);
    ctx.stroke();

    // Legs - animated based on state
    ctx.strokeStyle = '#ff8c42';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    if (cat.state === 'running') {
        const legOffset1 = Math.sin(frameCount * 0.3) * 10;
        const legOffset2 = Math.sin(frameCount * 0.3 + Math.PI) * 10;

        // Front legs
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(10 + legOffset1, 22);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(5, 10);
        ctx.lineTo(5 + legOffset2, 22);
        ctx.stroke();

        // Back legs
        ctx.beginPath();
        ctx.moveTo(-10, 10);
        ctx.lineTo(-10 + legOffset2, 22);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-15, 10);
        ctx.lineTo(-15 + legOffset1, 22);
        ctx.stroke();
    } else {
        // Jumping/falling pose
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

// Draw obstacles
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.save();

        if (obstacle.type === 'box') {
            // Draw box
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

            // Box border/details
            ctx.strokeStyle = '#5a2d0c';
            ctx.lineWidth = 3;
            ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

            // Box cross pattern
            ctx.beginPath();
            ctx.moveTo(obstacle.x, obstacle.y);
            ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
            ctx.moveTo(obstacle.x + obstacle.width, obstacle.y);
            ctx.lineTo(obstacle.x, obstacle.y + obstacle.height);
            ctx.stroke();
        } else if (obstacle.type === 'spike') {
            // Draw spike
            ctx.fillStyle = '#666';
            ctx.beginPath();
            ctx.moveTo(obstacle.x, obstacle.y + obstacle.height);
            ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y);
            ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
            ctx.closePath();
            ctx.fill();

            // Highlight
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

// Update obstacles
function updateObstacles() {
    // Spawn new obstacles
    if (obstacles.length === 0 || canvas.width - obstacles[obstacles.length - 1].x > 300 + Math.random() * 200) {
        if (Math.random() < 0.02) {
            spawnObstacle();
        }
    }

    // Update existing obstacles
    obstacles = obstacles.filter(obstacle => {
        obstacle.x -= gameSpeed;

        // Score when passing obstacle
        if (!obstacle.passed && obstacle.x + obstacle.width < cat.x) {
            obstacle.passed = true;
            score += 10;
            soundManager.playScore();
        }

        return obstacle.x + obstacle.width > 0;
    });
}

// Draw background
function drawBackground() {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw clouds
    backgroundLayers[1].clouds.forEach(cloud => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.width / 2, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.width * 0.3, cloud.y - 10, cloud.width * 0.4, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.width * 0.5, cloud.y, cloud.width * 0.35, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw mountains
    ctx.fillStyle = backgroundLayers[2].color;
    const mountainOffset = backgroundLayers[2].offset;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let x = 0; x <= canvas.width + 100; x += 50) {
        const height = 100 + Math.sin((x + mountainOffset) * 0.01) * 50 + Math.sin((x + mountainOffset) * 0.02) * 30;
        ctx.lineTo(x, canvas.height - GROUND_HEIGHT - height);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.fill();

    // Draw ground
    ctx.fillStyle = '#3d5c3d';
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);

    // Ground texture
    ctx.fillStyle = '#4a6b4a';
    for (let x = 0; x < canvas.width; x += 20) {
        const textureX = (x - backgroundLayers[3].offset) % canvas.width;
        const drawX = textureX < 0 ? textureX + canvas.width : textureX;
        ctx.fillRect(drawX, canvas.height - GROUND_HEIGHT + 10, 3, 10);
        ctx.fillRect(drawX + 10, canvas.height - GROUND_HEIGHT + 25, 2, 8);
    }

    // Ground top border
    ctx.fillStyle = '#5a7d5a';
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, 5);
}

// Update background (parallax)
function updateBackground() {
    // Update clouds
    backgroundLayers[1].clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.width < 0) {
            cloud.x = canvas.width + cloud.width;
            cloud.y = 50 + Math.random() * 150;
        }
    });

    // Update parallax offsets
    backgroundLayers[2].offset += gameSpeed * backgroundLayers[2].speed;
    backgroundLayers[3].offset += gameSpeed * backgroundLayers[3].speed;
}

// Collision detection (AABB)
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Check game over
function checkGameOver() {
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

// Update score display
function updateUI() {
    scoreElement.textContent = `Score: ${score}`;
}

// Main game loop
function gameLoop() {
    if (gameState === 'running') {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update
        frameCount++;
        gameSpeed += SPEED_INCREMENT;
        score += Math.floor(gameSpeed * 0.1);

        updateBackground();
        updateCat();
        updateObstacles();

        // Draw
        drawBackground();
        drawObstacles();
        drawCat();

        // Check collisions
        if (checkGameOver()) {
            gameState = 'gameover';
            soundManager.playGameOver();
            finalScoreElement.textContent = score;
            gameOverElement.classList.remove('hidden');
            instructionsElement.textContent = 'Click or Press R to Restart';
            instructionsElement.classList.remove('hidden');
        }

        updateUI();
    }

    requestAnimationFrame(gameLoop);
}

// Initialize game
initCat();
gameLoop();
