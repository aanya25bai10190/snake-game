export function randomGrid(canvas, grid) {
    return {
        x: Math.floor(Math.random() * (canvas.width / grid)) * grid,
        y: Math.floor(Math.random() * (canvas.height / grid)) * grid
    };
}

export function collide(a, b) {
    return a.x === b.x && a.y === b.y;
}