const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const instructionsElement = document.getElementById('instructions');
const statBarsElement = document.getElementById('statBars');
const resetBtnElement = document.getElementById('resetBtn');

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
    },

    playEat() {
        this.ensureContext();
        if (!this.audioContext) return;

        // Crunching sound
        for (let i = 0; i < 3; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(150 + Math.random() * 100, this.audioContext.currentTime + i * 0.1);

            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime + i * 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + i * 0.1 + 0.05);

            oscillator.start(this.audioContext.currentTime + i * 0.1);
            oscillator.stop(this.audioContext.currentTime + i * 0.1 + 0.05);
        }
    },

    playDrink() {
        this.ensureContext();
        if (!this.audioContext) return;

        // Lapping water sound
        for (let i = 0; i < 5; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(200 + Math.random() * 50, this.audioContext.currentTime + i * 0.08);

            gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime + i * 0.08);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + i * 0.08 + 0.06);

            oscillator.start(this.audioContext.currentTime + i * 0.08);
            oscillator.stop(this.audioContext.currentTime + i * 0.08 + 0.06);
        }
    },

    playSleep() {
        this.ensureContext();
        if (!this.audioContext) return;

        // Soft purring sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(50, this.audioContext.currentTime);

        // Modulate for purring effect
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        lfo.connect(lfoGain);
        lfoGain.connect(gainNode.gain);

        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(25, this.audioContext.currentTime);
        lfoGain.gain.setValueAtTime(0.05, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);

        oscillator.start(this.audioContext.currentTime);
        lfo.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 2);
        lfo.stop(this.audioContext.currentTime + 2);
    },

    playRoomEnter() {
        this.ensureContext();
        if (!this.audioContext) return;

        // Door opening sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(150, this.audioContext.currentTime + 0.3);

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    },

    playLitter() {
        this.ensureContext();
        if (!this.audioContext) return;

        // Scratching/digging sound - noise-like texture
        const bufferSize = this.audioContext.sampleRate * 0.5; // 0.5 seconds
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        // Lowpass filter to make it sound like sand
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.audioContext.currentTime);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        noise.start(this.audioContext.currentTime);
        noise.stop(this.audioContext.currentTime + 0.5);
    },

    playBath() {
        this.ensureContext();
        if (!this.audioContext) return;

        // Water splash sound
        const bufferSize = this.audioContext.sampleRate * 0.8;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.max(0, 1 - i / bufferSize) * 0.5;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.8);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        noise.start(this.audioContext.currentTime);
        noise.stop(this.audioContext.currentTime + 0.8);
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
const MAX_STAT = 100;
const STAT_DECAY_RATE = 0.02; // Slow decay per frame

// Game state
let gameState = 'start'; // 'start', 'room', 'running', 'gameover'
let score = 0;
let gameSpeed = BASE_SPEED;
let frameCount = 0;

// Cat stats
const catStats = {
    hunger: 80,    // 0 = starving, 100 = full
    thirst: 80,    // 0 = dehydrated, 100 = quenched
    energy: 80,    // 0 = exhausted, 100 = energized
    happiness: 80, // 0 = sad, 100 = happy
    hygiene: 80    // 0 = dirty, 100 = clean
};

let lastStatUpdate = 0;

// Room objects
const roomObjects = {
    foodBowl: { x: 0, y: 0, width: 60, height: 30, full: true },
    waterBowl: { x: 0, y: 0, width: 60, height: 30, full: true },
    bed: { x: 0, y: 0, width: 120, height: 80 },
    door: { x: 0, y: 0, width: 80, height: 120 },
    litterBox: { x: 0, y: 0, width: 70, height: 50, clean: true },
    bathtub: { x: 0, y: 0, width: 100, height: 60, full: true }
};

// Cat object
const cat = {
    x: CAT_X,
    y: 0,
    width: 50,
    height: 50,
    vy: 0,
    state: 'running', // 'running', 'jumping', 'falling', 'idle', 'walking', 'eating', 'drinking', 'sleeping', 'using_litter', 'bathing'
    animationFrame: 0,
    animationTimer: 0,
    onGround: false,
    // Room-specific properties
    targetX: null,
    targetY: null,
    facingRight: true,
    walkSpeed: 2,
    currentAction: null, // 'eat', 'drink', 'sleep', null
    actionTimer: 0
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

// Initialize room object positions
function initRoomObjects() {
    const centerY = canvas.height / 2 + 50;
    roomObjects.foodBowl.x = canvas.width * 0.2;
    roomObjects.foodBowl.y = centerY + 80;
    roomObjects.waterBowl.x = canvas.width * 0.2 + 80;
    roomObjects.waterBowl.y = centerY + 80;
    roomObjects.bed.x = canvas.width * 0.7;
    roomObjects.bed.y = centerY + 20;
    roomObjects.door.x = canvas.width * 0.5 - 40;
    roomObjects.door.y = centerY - 80;
    roomObjects.litterBox.x = canvas.width * 0.85;
    roomObjects.litterBox.y = centerY + 90;
    roomObjects.litterBox.clean = true;
    roomObjects.bathtub.x = canvas.width * 0.08;
    roomObjects.bathtub.y = centerY + 70;
    roomObjects.bathtub.full = true;
}

// Initialize cat position
function initCat() {
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

// Initialize cat in room
function initCatInRoom() {
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

// Update cat stats
function updateStats() {
    const now = Date.now();
    if (now - lastStatUpdate < 100) return; // Update every 100ms
    lastStatUpdate = now;

    // Decay stats slowly
    if (catStats.hunger > 0) catStats.hunger -= STAT_DECAY_RATE;
    if (catStats.thirst > 0) catStats.thirst -= STAT_DECAY_RATE;
    if (catStats.energy > 0 && gameState === 'running') catStats.energy -= STAT_DECAY_RATE * 2;
    if (catStats.hygiene > 0) catStats.hygiene -= STAT_DECAY_RATE * 0.5; // Hygiene decays slower

    // Happiness based on other stats
    const avgStats = (catStats.hunger + catStats.thirst + catStats.energy + catStats.hygiene) / 4;
    catStats.happiness = avgStats;

    // Clamp stats
    catStats.hunger = Math.max(0, Math.min(MAX_STAT, catStats.hunger));
    catStats.thirst = Math.max(0, Math.min(MAX_STAT, catStats.thirst));
    catStats.energy = Math.max(0, Math.min(MAX_STAT, catStats.energy));
    catStats.happiness = Math.max(0, Math.min(MAX_STAT, catStats.happiness));
    catStats.hygiene = Math.max(0, Math.min(MAX_STAT, catStats.hygiene));

    // Update HTML stat bars
    updateStatBars();
}

// Get stat bar elements
const hungerBar = document.getElementById('hungerBar');
const thirstBar = document.getElementById('thirstBar');
const energyBar = document.getElementById('energyBar');
const hygieneBar = document.getElementById('hygieneBar');

// Update HTML stat bars
function updateStatBars() {
    if (hungerBar) hungerBar.style.width = `${catStats.hunger}%`;
    if (thirstBar) thirstBar.style.width = `${catStats.thirst}%`;
    if (energyBar) energyBar.style.width = `${catStats.energy}%`;
    if (hygieneBar) hygieneBar.style.width = `${catStats.hygiene}%`;
}

// Draw start screen
function drawStartScreen() {
    // Cozy gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative circles (stars)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 20; i++) {
        const x = (frameCount * 0.5 + i * 50) % canvas.width;
        const y = 50 + Math.sin(frameCount * 0.01 + i) * 30;
        ctx.beginPath();
        ctx.arc(x, y, 2 + Math.sin(frameCount * 0.05 + i) * 1, 0, Math.PI * 2);
        ctx.fill();
    }

    // Title
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 64px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Cat Runner', canvas.width / 2, canvas.height / 2 - 150);

    // Subtitle
    ctx.font = '24px Arial';
    ctx.fillStyle = '#aaa';
    ctx.fillText('Your virtual cat companion', canvas.width / 2, canvas.height / 2 - 100);

    // Draw animated cat
    drawStartScreenCat();

    // Draw "Enter Room" button
    const btnX = canvas.width / 2 - 100;
    const btnY = canvas.height / 2 + 80;
    const btnWidth = 200;
    const btnHeight = 50;

    // Button glow
    const glowIntensity = 0.3 + Math.sin(frameCount * 0.05) * 0.1;
    ctx.shadowColor = '#ff8c42';
    ctx.shadowBlur = 20;

    // Button background
    ctx.fillStyle = `rgba(255, 140, 66, ${glowIntensity + 0.3})`;
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnWidth, btnHeight, 10);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Button border
    ctx.strokeStyle = '#ff8c42';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Button text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Enter Room', canvas.width / 2, btnY + 28);

    // Store button position for click detection
    startButton = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
}

// Draw animated cat for start screen
function drawStartScreenCat() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.save();
    ctx.translate(centerX, centerY);

    // Bouncing animation
    const bounce = Math.sin(frameCount * 0.05) * 5;
    ctx.translate(0, bounce);

    // Body
    ctx.fillStyle = '#ff8c42';
    ctx.beginPath();
    ctx.roundRect(-25, -15, 50, 30, 10);
    ctx.fill();

    // Head
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

    // Blinking eyes
    ctx.fillStyle = '#000';
    if (Math.sin(frameCount * 0.03) > 0.9) {
        // Closed eyes
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(17, -22);
        ctx.lineTo(23, -22);
        ctx.stroke();
    } else {
        // Open eyes
        ctx.beginPath();
        ctx.arc(20, -22, 3, 0, Math.PI * 2);
        ctx.fill();
    }

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

    // Tail animation
    const tailWag = Math.sin(frameCount * 0.1) * 0.5;
    ctx.strokeStyle = '#ff8c42';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.quadraticCurveTo(-35, -15 + tailWag * 10, -45, -25 + tailWag * 5);
    ctx.stroke();

    ctx.restore();
}

// Draw room
function drawRoom() {
    // Room background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#f5e6d3');
    gradient.addColorStop(1, '#e8d5c4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Floor
    const floorY = canvas.height / 2 + 100;
    ctx.fillStyle = '#8b6914';
    ctx.fillRect(0, floorY, canvas.width, canvas.height - floorY);

    // Floor planks
    ctx.strokeStyle = '#6b510f';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, floorY);
        ctx.lineTo(x + 20, canvas.height);
        ctx.stroke();
    }

    // Window
    const windowX = canvas.width * 0.1;
    const windowY = canvas.height * 0.1;
    const windowW = 150;
    const windowH = 120;

    // Window frame
    ctx.fillStyle = '#4a3c28';
    ctx.fillRect(windowX - 10, windowY - 10, windowW + 20, windowH + 20);

    // Sky through window
    const skyGradient = ctx.createLinearGradient(0, windowY, 0, windowY + windowH);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(windowX, windowY, windowW, windowH);

    // Window cross
    ctx.strokeStyle = '#4a3c28';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(windowX + windowW / 2, windowY);
    ctx.lineTo(windowX + windowW / 2, windowY + windowH);
    ctx.moveTo(windowX, windowY + windowH / 2);
    ctx.lineTo(windowX + windowW, windowY + windowH / 2);
    ctx.stroke();

    // Draw furniture
    drawFurniture();

    // Draw cat
    drawRoomCat();

    // Update stat bars
    updateStatBars();

    // Draw instructions
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Click on objects to interact • Click door to go running', canvas.width / 2, canvas.height - 30);
}

// Draw furniture
function drawFurniture() {
    // Food bowl
    ctx.fillStyle = roomObjects.foodBowl.full ? '#8b4513' : '#654321';
    ctx.beginPath();
    ctx.ellipse(
        roomObjects.foodBowl.x + roomObjects.foodBowl.width / 2,
        roomObjects.foodBowl.y + roomObjects.foodBowl.height / 2,
        roomObjects.foodBowl.width / 2,
        roomObjects.foodBowl.height / 2,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    // Food in bowl
    if (roomObjects.foodBowl.full) {
        ctx.fillStyle = '#8b0000';
        ctx.beginPath();
        ctx.ellipse(
            roomObjects.foodBowl.x + roomObjects.foodBowl.width / 2,
            roomObjects.foodBowl.y + roomObjects.foodBowl.height / 3,
            roomObjects.foodBowl.width / 3,
            roomObjects.foodBowl.height / 4,
            0, 0, Math.PI * 2
        );
        ctx.fill();
    }

    // Food label
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Food', roomObjects.foodBowl.x + roomObjects.foodBowl.width / 2, roomObjects.foodBowl.y + roomObjects.foodBowl.height + 15);

    // Water bowl
    ctx.fillStyle = '#4682b4';
    ctx.beginPath();
    ctx.ellipse(
        roomObjects.waterBowl.x + roomObjects.waterBowl.width / 2,
        roomObjects.waterBowl.y + roomObjects.waterBowl.height / 2,
        roomObjects.waterBowl.width / 2,
        roomObjects.waterBowl.height / 2,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    // Water shimmer
    if (roomObjects.waterBowl.full) {
        ctx.fillStyle = '#87ceeb';
        ctx.beginPath();
        ctx.ellipse(
            roomObjects.waterBowl.x + roomObjects.waterBowl.width / 2 - 10,
            roomObjects.waterBowl.y + roomObjects.waterBowl.height / 3,
            8, 4, 0, 0, Math.PI * 2
        );
        ctx.fill();
    }

    // Water label
    ctx.fillStyle = '#333';
    ctx.fillText('Water', roomObjects.waterBowl.x + roomObjects.waterBowl.width / 2, roomObjects.waterBowl.y + roomObjects.waterBowl.height + 15);

    // Bed
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(roomObjects.bed.x, roomObjects.bed.y, roomObjects.bed.width, roomObjects.bed.height);

    // Bed cushion
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(roomObjects.bed.x + 10, roomObjects.bed.y + 10, roomObjects.bed.width - 20, roomObjects.bed.height - 20);

    // Bed label
    ctx.fillStyle = '#333';
    ctx.fillText('Bed', roomObjects.bed.x + roomObjects.bed.width / 2, roomObjects.bed.y + roomObjects.bed.height + 15);

    // Door
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(roomObjects.door.x, roomObjects.door.y, roomObjects.door.width, roomObjects.door.height);

    // Door frame
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 8;
    ctx.strokeRect(roomObjects.door.x, roomObjects.door.y, roomObjects.door.width, roomObjects.door.height);

    // Door knob
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(roomObjects.door.x + roomObjects.door.width - 15, roomObjects.door.y + roomObjects.door.height / 2, 5, 0, Math.PI * 2);
    ctx.fill();

    // Door label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('GO RUN', roomObjects.door.x + roomObjects.door.width / 2, roomObjects.door.y + roomObjects.door.height / 2);

    // Bathtub
    const bt = roomObjects.bathtub;
    // Tub body
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(bt.x, bt.y, bt.width, bt.height);

    // Tub border
    ctx.strokeStyle = '#b0b0b0';
    ctx.lineWidth = 4;
    ctx.strokeRect(bt.x, bt.y, bt.width, bt.height);

    // Water inside
    if (bt.full) {
        ctx.fillStyle = '#74c0fc';
        ctx.fillRect(bt.x + 5, bt.y + 15, bt.width - 10, bt.height - 20);

        // Water shimmer
        ctx.fillStyle = '#a5d8ff';
        ctx.beginPath();
        ctx.ellipse(bt.x + 30, bt.y + 25, 15, 5, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Tub label
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('Bath', bt.x + bt.width / 2, bt.y + bt.height + 15);

    // Litter Box
    const lb = roomObjects.litterBox;
    // Box container
    ctx.fillStyle = '#2d5a4a';
    ctx.fillRect(lb.x, lb.y, lb.width, lb.height);

    // Litter/sand inside
    ctx.fillStyle = lb.clean ? '#c4a574' : '#b8956a';
    ctx.fillRect(lb.x + 5, lb.y + 10, lb.width - 10, lb.height - 15);

    // Litter texture (small dots)
    ctx.fillStyle = '#a08060';
    for (let i = 0; i < 15; i++) {
        const lx = lb.x + 10 + (i * 3) % (lb.width - 20);
        const ly = lb.y + 15 + (i * 7) % (lb.height - 25);
        ctx.beginPath();
        ctx.arc(lx, ly, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Show "used" state
    if (!lb.clean) {
        // Draw clumps
        ctx.fillStyle = '#8b7355';
        ctx.beginPath();
        ctx.arc(lb.x + 20, lb.y + 30, 5, 0, Math.PI * 2);
        ctx.arc(lb.x + 35, lb.y + 25, 4, 0, Math.PI * 2);
        ctx.arc(lb.x + 50, lb.y + 32, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    // Litter box label
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('Litter', lb.x + lb.width / 2, lb.y + lb.height + 15);
}

// Draw cat in room
function drawRoomCat() {
    ctx.save();
    ctx.translate(cat.x, cat.y);

    // Flip if facing left
    if (!cat.facingRight) {
        ctx.scale(-1, 1);
    }

    // Body color
    ctx.fillStyle = '#ff8c42';

    // Animation based on state
    let bounce = 0;
    if (cat.state === 'idle') {
        // Idle breathing
        bounce = Math.sin(frameCount * 0.05) * 2;
    } else if (cat.state === 'walking') {
        // Walking bounce
        bounce = Math.abs(Math.sin(frameCount * 0.2)) * 3;
    }
    ctx.translate(0, bounce);

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

    // Eyes (based on happiness)
    ctx.fillStyle = '#000';
    if (catStats.happiness < 30) {
        // Sad eyes
        ctx.beginPath();
        ctx.arc(20, -20, 3, 0, Math.PI, false);
        ctx.stroke();
    } else {
        // Normal eyes
        ctx.beginPath();
        ctx.arc(20, -22, 3, 0, Math.PI * 2);
        ctx.fill();
    }

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
    let tailWag = 0;
    if (cat.state === 'idle') {
        tailWag = Math.sin(frameCount * 0.1) * 0.2;
    } else if (cat.state === 'walking') {
        tailWag = Math.sin(frameCount * 0.3) * 0.4;
    }

    ctx.strokeStyle = '#ff8c42';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.quadraticCurveTo(-35, -10 + tailWag * 10, -40, -25 + tailWag * 5);
    ctx.stroke();

    // Legs
    ctx.strokeStyle = '#ff8c42';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    if (cat.state === 'walking') {
        const legOffset1 = Math.sin(frameCount * 0.3) * 8;
        const legOffset2 = Math.sin(frameCount * 0.3 + Math.PI) * 8;

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
        // Curled up
        ctx.fillStyle = '#ff8c42';
        ctx.beginPath();
        ctx.arc(-10, 10, 12, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Standing legs
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

    // Action indicators
    if (cat.state === 'eating') {
        ctx.fillStyle = '#8b0000';
        ctx.font = '16px Arial';
        ctx.fillText('🍖', 0, -50);
    } else if (cat.state === 'drinking') {
        ctx.fillStyle = '#4682b4';
        ctx.font = '16px Arial';
        ctx.fillText('💧', 0, -50);
    } else if (cat.state === 'sleeping') {
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.fillText('z', 20, -40);
        ctx.fillText('z', 25, -50);
        ctx.fillText('z', 30, -60);
    } else if (cat.state === 'using_litter') {
        ctx.fillStyle = '#8b7355';
        ctx.font = '14px Arial';
        ctx.fillText('🐾', 0, -45);
        ctx.fillText('dig dig...', 15, -55);
    } else if (cat.state === 'bathing') {
        ctx.fillStyle = '#4dabf7';
        ctx.font = '14px Arial';
        ctx.fillText('🫧', -20, -45);
        ctx.fillText('🫧', 10, -55);
        ctx.fillText('splash...', 5, -65);
    }

    ctx.restore();
}

// Update cat in room
function updateRoomCat() {
    // Handle walking to target
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
            // Reached target
            cat.x = cat.targetX;
            cat.y = cat.targetY;
            cat.targetX = null;
            cat.targetY = null;

            // Perform action
            if (cat.currentAction) {
                cat.state = cat.currentAction === 'eat' ? 'eating' :
                           cat.currentAction === 'drink' ? 'drinking' :
                           cat.currentAction === 'use_litter' ? 'using_litter' :
                           cat.currentAction === 'bathe' ? 'bathing' : 'sleeping';
                cat.actionTimer = 120; // 2 seconds at 60fps
            } else {
                cat.state = 'idle';
            }
        }
    } else if (cat.state === 'eating' || cat.state === 'drinking' || cat.state === 'sleeping' || cat.state === 'using_litter' || cat.state === 'bathing') {
        // Handle action timer
        cat.actionTimer--;

        if (cat.actionTimer <= 0) {
            // Action complete
            if (cat.state === 'eating') {
                catStats.hunger = Math.min(MAX_STAT, catStats.hunger + 30);
                roomObjects.foodBowl.full = false;
                setTimeout(() => { roomObjects.foodBowl.full = true; }, 10000);
            } else if (cat.state === 'drinking') {
                catStats.thirst = Math.min(MAX_STAT, catStats.thirst + 30);
                roomObjects.waterBowl.full = false;
                setTimeout(() => { roomObjects.waterBowl.full = true; }, 10000);
            } else if (cat.state === 'sleeping') {
                catStats.energy = Math.min(MAX_STAT, catStats.energy + 40);
            } else if (cat.state === 'using_litter') {
                catStats.hygiene = Math.min(MAX_STAT, catStats.hygiene + 40);
                roomObjects.litterBox.clean = false;
                setTimeout(() => { roomObjects.litterBox.clean = true; }, 15000); // Auto-clean after 15 seconds
            } else if (cat.state === 'bathing') {
                catStats.hygiene = Math.min(MAX_STAT, catStats.hygiene + 60);
                roomObjects.bathtub.full = false;
                setTimeout(() => { roomObjects.bathtub.full = true; }, 20000); // 20秒后水自动变满
            }

            cat.state = 'idle';
            cat.currentAction = null;
        }
    } else {
        cat.state = 'idle';
    }

    // Random idle movement
    if (cat.state === 'idle' && Math.random() < 0.005) {
        const floorY = canvas.height / 2 + 100;
        cat.targetX = 100 + Math.random() * (canvas.width - 200);
        cat.targetY = floorY + 20 + Math.random() * 50;
    }
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
    statBarsElement.classList.add('hidden');
    resetBtnElement.classList.add('hidden');
}

// Reset all (return to start)
function fullReset() {
    gameState = 'start';
    score = 0;
    gameSpeed = BASE_SPEED;
    frameCount = 0;
    obstacles = [];
    catStats.hunger = 80;
    catStats.thirst = 80;
    catStats.energy = 80;
    catStats.happiness = 80;
    catStats.hygiene = 80;
    gameOverElement.classList.add('hidden');
    instructionsElement.classList.add('hidden');
    statBarsElement.classList.add('hidden');
    resetBtnElement.classList.add('hidden');
    initCat();
}

// Go to room from start
function enterRoom() {
    gameState = 'room';
    initRoomObjects();
    initCatInRoom();
    soundManager.playRoomEnter();
    statBarsElement.classList.remove('hidden');
    resetBtnElement.classList.remove('hidden');
    updateStatBars();
}

// Go to running game
function startRunning() {
    if (catStats.energy < 10) {
        // Too tired to run
        cat.state = 'idle';
        return;
    }
    gameState = 'running';
    score = 0;
    gameSpeed = BASE_SPEED;
    frameCount = 0;
    obstacles = [];
    initCat();
    instructionsElement.classList.remove('hidden');
    statBarsElement.classList.add('hidden');
}

// Return to room from game
function returnToRoom() {
    gameState = 'room';
    initCatInRoom();
    catStats.energy = Math.max(0, catStats.energy - 20); // Running is tiring
    soundManager.playRoomEnter();
    statBarsElement.classList.remove('hidden');
    gameOverElement.classList.add('hidden');
    instructionsElement.classList.add('hidden');
    updateStatBars();
}

// Check if point is in rectangle
function pointInRect(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.width &&
           y >= rect.y && y <= rect.y + rect.height;
}

// Handle room clicks
function handleRoomClick(x, y) {
    if (pointInRect(x, y, roomObjects.foodBowl)) {
        if (roomObjects.foodBowl.full) {
            cat.targetX = roomObjects.foodBowl.x + roomObjects.foodBowl.width / 2;
            cat.targetY = roomObjects.foodBowl.y - 20;
            cat.currentAction = 'eat';
            soundManager.playEat();
        }
    } else if (pointInRect(x, y, roomObjects.waterBowl)) {
        if (roomObjects.waterBowl.full) {
            cat.targetX = roomObjects.waterBowl.x + roomObjects.waterBowl.width / 2;
            cat.targetY = roomObjects.waterBowl.y - 20;
            cat.currentAction = 'drink';
            soundManager.playDrink();
        }
    } else if (pointInRect(x, y, roomObjects.bed)) {
        cat.targetX = roomObjects.bed.x + roomObjects.bed.width / 2;
        cat.targetY = roomObjects.bed.y + roomObjects.bed.height / 2;
        cat.currentAction = 'sleep';
        soundManager.playSleep();
    } else if (pointInRect(x, y, roomObjects.bathtub)) {
        if (roomObjects.bathtub.full) {
            cat.targetX = roomObjects.bathtub.x + roomObjects.bathtub.width / 2;
            cat.targetY = roomObjects.bathtub.y + roomObjects.bathtub.height / 2 - 10;
            cat.currentAction = 'bathe';
            soundManager.playBath();
        }
    } else if (pointInRect(x, y, roomObjects.litterBox)) {
        cat.targetX = roomObjects.litterBox.x + roomObjects.litterBox.width / 2;
        cat.targetY = roomObjects.litterBox.y + roomObjects.litterBox.height / 2 - 10;
        cat.currentAction = 'use_litter';
        soundManager.playLitter();
    } else if (pointInRect(x, y, roomObjects.door)) {
        startRunning();
    }
}

// Start button for click detection
let startButton = null;

// Input handling
window.addEventListener('keydown', (e) => {
    soundManager.init();
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameState === 'running') {
            jump();
        }
    } else if (e.code === 'KeyR') {
        fullReset();
    } else if (e.code === 'Enter' && gameState === 'start') {
        enterRoom();
    } else if (e.code === 'Enter' && gameState === 'gameover') {
        returnToRoom();
    }
});

window.addEventListener('pointerdown', (e) => {
    soundManager.init();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (gameState === 'start' && startButton) {
        if (pointInRect(x, y, startButton)) {
            enterRoom();
        }
    } else if (gameState === 'room') {
        handleRoomClick(x, y);
    } else if (gameState === 'running') {
        jump();
    } else if (gameState === 'gameover') {
        returnToRoom();
    }
});

window.addEventListener('touchstart', (e) => {
    e.preventDefault();
    soundManager.init();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (gameState === 'start' && startButton) {
        if (pointInRect(x, y, startButton)) {
            enterRoom();
        }
    } else if (gameState === 'room') {
        handleRoomClick(x, y);
    } else if (gameState === 'running') {
        jump();
    } else if (gameState === 'gameover') {
        returnToRoom();
    }
});

// Reset button click
resetBtnElement.addEventListener('click', () => {
    fullReset();
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

// Draw cat (runner)
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
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;

    if (gameState === 'start') {
        drawStartScreen();
    } else if (gameState === 'room') {
        updateStats();
        updateRoomCat();
        drawRoom();
    } else if (gameState === 'running') {
        // Update
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
            instructionsElement.textContent = 'Click or Press Enter to Return to Room';
            instructionsElement.classList.remove('hidden');
            statBarsElement.classList.remove('hidden');
        }

        updateUI();
    } else if (gameState === 'gameover') {
        // Keep drawing the game state
        drawBackground();
        drawObstacles();
        drawCat();
        updateUI();
    }

    requestAnimationFrame(gameLoop);
}

// Initialize game
initCat();
gameLoop();
