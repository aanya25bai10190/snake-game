import { Game } from "./game.js";

const canvas = document.getElementById("gameCanvas");
const game = new Game(canvas);

document.getElementById("startBtn").onclick = () => game.start();

window.addEventListener("keydown", (e) => {
    if (e.key === " " && !game.running) game.start();
});