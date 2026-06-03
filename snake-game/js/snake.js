export class Snake {
    constructor(grid) {
        this.grid = grid;
        this.reset();
    }

    reset() {
        this.body = [
            { x: 100, y: 100 },
            { x: 80, y: 100 },
            { x: 60, y: 100 }
        ];
        this.dx = this.grid;
        this.dy = 0;
    }

    move() {
        const head = {
            x: this.body[0].x + this.dx,
            y: this.body[0].y + this.dy
        };

        this.body.unshift(head);
        this.body.pop();
    }

    grow() {
        this.body.push({ ...this.body[this.body.length - 1] });
    }

    draw(ctx) {
        this.body.forEach((p, i) => {
            ctx.save();

            ctx.shadowBlur = i === 0 ? 15 : 8;
            ctx.shadowColor = i === 0 ? "#64dfdf" : "#ff758f";

            const grad = ctx.createLinearGradient(p.x, p.y, p.x+20, p.y+20);
            grad.addColorStop(0, "#64dfdf");
            grad.addColorStop(1, "#ff758f");

            ctx.fillStyle = grad;

            ctx.beginPath();
            ctx.roundRect(p.x+1, p.y+1, 18, 18, 8);
            ctx.fill();

            if (i === 0) {
                ctx.fillStyle = "#fff";
                ctx.shadowBlur = 0;
                ctx.fillRect(p.x+12, p.y+5, 3, 3);
                ctx.fillRect(p.x+12, p.y+12, 3, 3);
            }

            ctx.restore();
        });
    }
}