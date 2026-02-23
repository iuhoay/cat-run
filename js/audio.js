export const soundManager = {
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

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(50, this.audioContext.currentTime);

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

        const bufferSize = this.audioContext.sampleRate * 0.5;
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
