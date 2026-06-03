import { Snake } from "./snake.js";
import { Food } from "./food.js";
import { Particle } from "./particles.js";
import { handleControls } from "./controls.js";
import { collide } from "./utils.js";

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.grid = 20;

        this.snake = new Snake(this.grid);
        this.food = new Food(canvas, this.grid);

        this.particles = [];
        this.powerUps = [];

        this.score = 0;
        this.high = localStorage.getItem("high") || 0;

        this.running = false;

        this.eatSound = new Audio("assets/eat.mp3");

        this.speed = 100;
        this.shake = 0;

        this.activeEffects = { slow: 0, ghost: 0 };

        handleControls(this);

        this.food.spawn(this.snake.body);

        this.scoreEl = document.getElementById("score");
        this.highEl = document.getElementById("high-score");

        this.overlay = document.getElementById("overlay");
        this.scoreBox = document.querySelector(".score-box");
    }

    start() {
        this.reset();
        this.running = true;
        this.overlay.classList.add("hidden");
        requestAnimationFrame(this.loop.bind(this));
    }

    reset() {
        this.snake.reset();
        this.food.spawn(this.snake.body);
        this.score = 0;
        this.particles = [];
        this.powerUps = [];
        this.activeEffects = { slow: 0, ghost: 0 };
        this.speed = 100;
    }

    loop() {
        if (!this.running) return;

        this.update();
        this.draw();

        const speedMod = this.activeEffects.slow > 0 ? 1.8 : 1;

        setTimeout(() => {
            requestAnimationFrame(this.loop.bind(this));
        }, this.speed * speedMod);
    }

    update() {
        const head = this.snake.body[0];

        // ✅ CALCULATE NEXT POSITION (CRITICAL FIX)
        let nextHead = {
            x: head.x + this.snake.dx,
            y: head.y + this.snake.dy
        };

        // 🚧 WALL COLLISION (BEFORE MOVE)
        if (!this.activeEffects.ghost) {
            if (
                nextHead.x < 0 ||
                nextHead.x >= this.canvas.width ||
                nextHead.y < 0 ||
                nextHead.y >= this.canvas.height
            ) {
                return this.gameOver();
            }
        } else {
            // wrap ONLY in ghost mode
            if (nextHead.x < 0) nextHead.x = this.canvas.width - this.grid;
            if (nextHead.x >= this.canvas.width) nextHead.x = 0;
            if (nextHead.y < 0) nextHead.y = this.canvas.height - this.grid;
            if (nextHead.y >= this.canvas.height) nextHead.y = 0;
        }

        // 🐍 SELF COLLISION (BEFORE MOVE)
        for (let i = 0; i < this.snake.body.length; i++) {
            if (collide(nextHead, this.snake.body[i])) {
                if (!this.activeEffects.ghost) {
                    return this.gameOver();
                }
            }
        }

        // ✅ NOW ACTUALLY MOVE
        this.snake.body.unshift(nextHead);

        // FOOD
        if (collide(nextHead, this.food)) {
            this.spawnParticles(this.food.x, this.food.y);

            this.eatSound.currentTime = 0;
            this.eatSound.play().catch(() => {});

            this.food.spawn(this.snake.body);

            this.score += 10;
            this.triggerScorePop();

            this.shake = 10;

            if (Math.random() < 0.3) this.spawnPowerUp();

            if (this.speed > 50) this.speed -= 2;

        } else {
            // remove tail only if not eating
            this.snake.body.pop();
        }

        // POWERUPS
        this.powerUps = this.powerUps.filter(p => {
            p.life--;

            if (collide(nextHead, p)) {
                if (p.type === "slow") {
                    this.activeEffects.slow = 200;
                    this.score += 5;
                }

                if (p.type === "ghost") {
                    this.activeEffects.ghost = 200;
                    this.score += 5;
                }

                this.triggerScorePop();
                return false;
            }

            return p.life > 0;
        });

        if (this.activeEffects.slow > 0) this.activeEffects.slow--;
        if (this.activeEffects.ghost > 0) this.activeEffects.ghost--;

        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => p.update());

        if (this.shake > 0) this.shake--;

        this.updateUI();
    }

    triggerScorePop() {
        this.scoreBox.classList.add("score-pop");
        setTimeout(() => {
            this.scoreBox.classList.remove("score-pop");
        }, 150);
    }

    spawnPowerUp() {
        const types = ["slow", "ghost"];
        const type = types[Math.floor(Math.random() * types.length)];

        const x = Math.floor(Math.random() * (this.canvas.width / this.grid)) * this.grid;
        const y = Math.floor(Math.random() * (this.canvas.height / this.grid)) * this.grid;

        this.powerUps.push({ x, y, type, life: 100 });
    }

    spawnParticles(x, y) {
        for (let i = 0; i < 25; i++) {
            this.particles.push(new Particle(x + 10, y + 10));
        }
    }

    draw() {
        this.ctx.save();

        if (this.shake > 0) {
            const dx = (Math.random() - 0.5) * this.shake;
            const dy = (Math.random() - 0.5) * this.shake;
            this.ctx.translate(dx, dy);
        }

        this.ctx.fillStyle = "#143d44";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2,
            this.canvas.height / 2,
            50,
            this.canvas.width / 2,
            this.canvas.height / 2,
            400
        );

        gradient.addColorStop(0, "rgba(255,255,255,0.05)");
        gradient.addColorStop(1, "rgba(0,0,0,0.4)");

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.food.draw(this.ctx);

        this.powerUps.forEach(p => {
            const pulse = Math.sin(Date.now() * 0.01) * 2;

            this.ctx.fillStyle = p.type === "slow" ? "#9b5de5" : "#00bbf9";
            this.ctx.beginPath();
            this.ctx.arc(p.x + 10, p.y + 10, 6 + pulse, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.snake.draw(this.ctx);

        this.particles.forEach(p => p.draw(this.ctx));

        this.ctx.restore();
    }

    gameOver() {
        this.running = false;

        if (this.score > this.high) {
            this.high = this.score;
            localStorage.setItem("high", this.high);
        }

        this.overlay.classList.remove("hidden");
    }

    updateUI() {
        this.scoreEl.textContent = String(this.score).padStart(5, "0");
        this.highEl.textContent = String(this.high).padStart(5, "0");
    }
}