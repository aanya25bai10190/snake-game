import { randomGrid } from "./utils.js";

export class Food {
    constructor(canvas, grid) {
        this.canvas = canvas;
        this.grid = grid;
    }

    spawn(snake) {
        let valid = false;

        while (!valid) {
            const pos = randomGrid(this.canvas, this.grid);
            this.x = pos.x;
            this.y = pos.y;

            valid = !snake.some(s => s.x === this.x && s.y === this.y);
        }
    }

    draw(ctx) {
        const cx = this.x + 10;
        const cy = this.y + 10;

        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#ffb703";

        ctx.fillStyle = "#ffb703";

        ctx.beginPath();
        ctx.moveTo(cx, this.y+2);
        ctx.lineTo(this.x+18, cy);
        ctx.lineTo(cx, this.y+18);
        ctx.lineTo(this.x+2, cy);
        ctx.closePath();

        ctx.fill();
        ctx.restore();
    }
}