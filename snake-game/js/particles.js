export class Particle {
    constructor(x,y) {
        this.x=x;
        this.y=y;
        this.vx=Math.random()*4-2;
        this.vy=Math.random()*4-2;
        this.life=30;
    }

    update() {
        this.x+=this.vx;
        this.y+=this.vy;
        this.life--;
    }

    draw(ctx) {
        ctx.fillStyle=`rgba(255,200,100,${this.life/30})`;
        ctx.beginPath();
        ctx.arc(this.x,this.y,2,0,Math.PI*2);
        ctx.fill();
    }
}