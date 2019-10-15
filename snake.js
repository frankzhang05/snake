// Variable Declarations
let SNK_BD = 'RoyalBlue';
let SNK_BG = 'DodgerBlue';
let score = 0;
let changingDirection = false;
let foodX;
let foodY;
let dx = 10;
let dy = 0;
let dv = 0;
let gamePaused = false;
let GAME_SPEED = 100;

// Constant Declarations
const CNVS_BD = 'Black';
const CNVS_BG = 'White';
const FOOD_BD = 'DarkRed';
const FOOD_BG = 'Red';
const gameCanvas = document.getElementById("mainCanvas");
const ctx = gameCanvas.getContext("2d");
const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;
const pauseButton = document.getElementById("pausePlay");

// Theme Selector
function changeTheme() {
    let theme = document.getElementById("themeSelect").value;
    if (theme === "red")
    {
        SNK_BD = 'IndianRed';
        SNK_BG = 'PaleVioletRed';
    }
    else if (theme === "green") {
        SNK_BD = "DarkSeaGreen";
        SNK_BG = "LightSeaGreen";
    }
    else if (theme === "blue") {
        SNK_BD = 'RoyalBlue';
        SNK_BG = 'DodgerBlue';
    }
    else {
        SNK_BD = 'Red';
        SNK_BG = 'Yellow';
    }
    clearCanvas();
    drawFood();
    drawSnake();
}

// Level Selector
function changeLevel() {
    let usrLevel = document.getElementById("levelSelect").value;
    if (usrLevel === "low")
    {
        dv = -5;
    }
    else if (usrLevel === "high") {
        dv = -15;
    }
    else if (usrLevel === "og") {
        dv = 0;
    }
    else {
        dv = 999;
    }
}

// Pause Button
pauseButton.addEventListener("click", function playPause() {
    if (pauseButton.value === "Start"){
        pauseButton.value = "Pause";
        main();
        createFood();
        document.addEventListener("keydown", changeDirection);
    }
    else if (pauseButton.value === "Pause"){
        pauseButton.value = "Resume";
        gamePaused = true;
        main();
    }
    else if (pauseButton.value === "Resume"){
        pauseButton.value = "Pause";
        gamePaused = false;
        main();
    }
    else if (pauseButton.value === "Restart"){
        window.location.reload();
    }
    else {
        pauseButton.value = "Impossible";
    }
});

// Snake Coordinates
let snkLoc = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150},
];

// Functions
function main() {
    if (gameEnd()) {
        pauseButton.value = "Restart";
        return;
    }
    if (!gamePaused) {
        setTimeout(function onTick() {
            changingDirection = false;
            clearCanvas();
            drawFood();
            advanceSnake();
            drawSnake();
            main();
        }, GAME_SPEED)
    }
}
function clearCanvas() {
    ctx.fillStyle = CNVS_BG;
    ctx.strokeStyle = CNVS_BD;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}
function drawFood() {
    ctx.fillStyle = FOOD_BG;
    ctx.strokeStyle = FOOD_BD;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}
function advanceSnake() {
    const head = {x: snkLoc[0].x + dx, y: snkLoc[0].y + dy};
    snkLoc.unshift(head);
    const eatFood = snkLoc[0].x === foodX && snkLoc[0].y === foodY;
    if (eatFood) {
        score += 10;
        document.getElementById("score").innerHTML = score;
        GAME_SPEED += dv;
        if (GAME_SPEED < 0) GAME_SPEED = 0;
        createFood()
    }
    else {
        snkLoc.pop();
    }
}
function gameEnd() {
    for (let i = 4; i < snkLoc.length; i++) {
        if (snkLoc[i].x === snkLoc[0].x && snkLoc[i].y === snkLoc[0].y) return true;
    }

    const leftWall = snkLoc[0].x < 0;
    const rightWall = snkLoc[0].x > gameCanvas.width - 10;
    const topWall = snkLoc[0].y < 0;
    const bottomWall = snkLoc[0].y > gameCanvas.height - 10;

    return leftWall || rightWall || topWall || bottomWall;
}
function random(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}
function createFood() {
    foodX = random(0, gameCanvas.width - 10);
    foodY = random(0, gameCanvas.height - 10);
    snkLoc.forEach(function foodOnSnake(part) {
        const foodOnSnakeBool = part.x === foodX && part.y === foodY;
        if (foodOnSnakeBool) createFood();
    });
}
function drawSnake() {
    snkLoc.forEach(drawSnakePart);
}
function drawSnakePart(snakePart) {
    ctx.fillStyle = SNK_BG;
    ctx.strokeStyle = SNK_BD;
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}
function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;
    const keyPressed = event.keyCode;
    const upDirection = dy === -10;
    const downDirection = dy === 10;
    const rightDirection = dx === 10;
    const leftDirection = dx === -10;
    if (keyPressed === LEFT_KEY && !rightDirection) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !downDirection) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !leftDirection) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !upDirection) {
        dx = 0;
        dy = 10;
    }
}

clearCanvas();
drawFood();
drawSnake();