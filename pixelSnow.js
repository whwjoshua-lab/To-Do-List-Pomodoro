class PixelSnowTheme {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.isActive = false;
        this.resize();
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        const particleCount = Math.floor(this.width * 0.1); // Slightly fewer for retro feel
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.floor(Math.random() * this.width),
                y: Math.floor(Math.random() * this.height),
                size: Math.floor(Math.random() * 3 + 2) * 2, // Even numbers for pixel look
                speedY: Math.floor(Math.random() * 2 + 1) * 2, // Fast, choppy speed
                speedX: (Math.floor(Math.random() * 3) - 1) * 2, // -2, 0, or 2
                opacity: Math.random() * 0.5 + 0.5
            });
        }
    }

    start() {
        this.isActive = true;
        this.init();
        this.animate();
    }

    stop() {
        this.isActive = false;
    }

    animate() {
        if (!this.isActive) return;

        // Use setTimeout to throttle FPS for retro feel (e.g., 15-20 FPS)
        setTimeout(() => {
            if (!this.isActive) return;
            requestAnimationFrame(() => this.animate());
        }, 1000 / 20);

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = 'white';

        for (let p of this.particles) {
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillRect(p.x, p.y, p.size, p.size); // Square particles
            this.ctx.globalAlpha = 1.0;

            p.y += p.speedY;
            p.x += p.speedX;

            if (p.y > this.height) {
                p.y = -10;
                p.x = Math.floor(Math.random() * this.width);
            }
        }
    }
}
