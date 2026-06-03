export function handleControls(game) {
    window.addEventListener("keydown", e => {
        const s = game.snake;

        if (e.key === "ArrowUp" && s.dy === 0) {
            s.dx = 0; s.dy = -20;
        }
        if (e.key === "ArrowDown" && s.dy === 0) {
            s.dx = 0; s.dy = 20;
        }
        if (e.key === "ArrowLeft" && s.dx === 0) {
            s.dx = -20; s.dy = 0;
        }
        if (e.key === "ArrowRight" && s.dx === 0) {
            s.dx = 20; s.dy = 0;
        }
    });
}