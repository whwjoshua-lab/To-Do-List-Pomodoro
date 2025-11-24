class PixelLeavesTheme {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.leaves = [];
        this.isActive = false;
        this.resize();
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    init() {
        this.leaves = [];
        const leafCount = Math.floor(this.width * 0.03);
        for (let i = 0; i < leafCount; i++) {
            this.leaves.push(this.createLeaf());
        }
    }

    createLeaf() {
        return {
            x: Math.floor(Math.random() * this.width),
            y: Math.floor(Math.random() * this.height),
            size: 4, // Base pixel size multiplier
            speedY: Math.floor(Math.random() * 2 + 1) * 2,
            speedX: (Math.floor(Math.random() * 3) - 1) * 2,
            color: this.getRandomColor(),
            frame: 0 // For simple animation if needed
        };
    }

    getRandomColor() {
        const colors = ['#e55039', '#f6b93b', '#fa983a', '#e58e26'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    start() {
        this.isActive = true;
        this.init();
        this.animate();
    }

    stop() {
        this.isActive = false;
    }

    drawPixelLeaf(ctx, x, y, size, color) {
        ctx.fillStyle = color;
        // Simple 5x5 pixel leaf shape
        //   X
        //  XXX
        // XXXXX
        //  XXX
        //   X
        const s = size;

        // Row 1
        ctx.fillRect(x + s * 2, y, s, s);
        // Row 2
        ctx.fillRect(x + s, y + s, s * 3, s);
        // Row 3
        ctx.fillRect(x, y + s * 2, s * 5, s);
        // Row 4
        ctx.fillRect(x + s, y + s * 3, s * 3, s);
        // Row 5
        ctx.fillRect(x + s * 2, y + s * 4, s, s);
    }

    animate() {
        if (!this.isActive) return;

        setTimeout(() => {
            if (!this.isActive) return;
            requestAnimationFrame(() => this.animate());
        }, 1000 / 15); // 15 FPS for retro feel

        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let l of this.leaves) {
            this.drawPixelLeaf(this.ctx, l.x, l.y, l.size, l.color);

            l.y += l.speedY;
            l.x += l.speedX;

            if (l.y > this.height + 20) {
                l.y = -20;
                l.x = Math.floor(Math.random() * this.width);
            }
        }
    }
}
