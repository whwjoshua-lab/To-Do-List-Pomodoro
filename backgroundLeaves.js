class LeavesTheme {
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
        const leafCount = Math.floor(this.width * 0.05);
        for (let i = 0; i < leafCount; i++) {
            this.leaves.push(this.createLeaf());
        }
    }

    createLeaf() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Math.random() * 15 + 10,
            speedY: Math.random() * 1 + 0.5,
            speedX: Math.random() * 1 - 0.5,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 2 - 1,
            color: this.getRandomColor()
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

    drawLeaf(ctx, x, y, size, rotation, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.fillStyle = color;
        ctx.beginPath();
        // Simple leaf shape using bezier curves
        ctx.moveTo(0, -size);
        ctx.bezierCurveTo(size / 2, -size / 2, size / 2, size / 2, 0, size);
        ctx.bezierCurveTo(-size / 2, size / 2, -size / 2, -size / 2, 0, -size);
        ctx.fill();
        ctx.restore();
    }

    animate() {
        if (!this.isActive) return;

        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let l of this.leaves) {
            this.drawLeaf(this.ctx, l.x, l.y, l.size, l.rotation, l.color);

            l.y += l.speedY;
            l.x += l.speedX;
            l.rotation += l.rotationSpeed;

            if (l.y > this.height + 20) {
                l.y = -20;
                l.x = Math.random() * this.width;
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}
