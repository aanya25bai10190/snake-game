export class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.active = true;
    }

    draw(ctx) {
        ctx.fillStyle =
            this.type === "slow" ? "blue" :
            this.type === "fast" ? "red" :
            "yellow";

        ctx.fillRect(this.x, this.y, 20, 20);
    }

    apply(game) {
        if (this.type === "slow") game.speed += 40;
        if (this.type === "fast") game.speed -= 30;
        if (this.type === "double") game.scoreMultiplier = 2;

        setTimeout(() => {
            game.scoreMultiplier = 1;
        }, 4000);
    }
}