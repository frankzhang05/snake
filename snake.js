// Variable Declarations
let snkBD = 'RoyalBlue';
let snkBG = 'DodgerBlue';
let score = 0;
let changingDirection = false;
let foodX;
let foodY;
let dx = 10;
let dy = 0;
let dv = 0;
let gamePaused = false;
let gameSpeed = 100;
let button = false;

// Constant Declarations
const CNVS_BD = 'Black';
const CNVS_BG = 'White';
const FOOD_BD = 'DarkRed';
const FOOD_BG = 'Red';
const CNVS = document.getElementById("mainCanvas");
const CTX = CNVS.getContext("2d");
const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;
const PAUSE_BTN = document.getElementById("pausePlay");
const COLOR_SEL_BD = document.getElementById("bdColor");
const COLOR_SEL_BG = document.getElementById("bgColor");
const COLOR_SEL_STYLE = document.getElementById("custom-color").style;

// Theme Selector
function changeTheme() {
    let theme = document.getElementById("themeSelect").value;
    if (theme === "red") {
        COLOR_SEL_STYLE.display= "none";
        snkBD = "IndianRed";
        snkBG = "PaleVioletRed";
    }
    else if (theme === "green") {
        COLOR_SEL_STYLE.display = "none";
        snkBD = "DarkSeaGreen";
        snkBG = "LightSeaGreen";
    }
    else if (theme === "blue") {
        COLOR_SEL_STYLE.display = "none";
        snkBD = "RoyalBlue";
        snkBG = "DodgerBlue";
    }
    else if (theme === "custom") {
        COLOR_SEL_STYLE.display = "inline-block";
        snkBD = "RoyalBlue";
        snkBG = "DodgerBlue";
        COLOR_SEL_BD.addEventListener("change", function customBD(){
            snkBD = COLOR_SEL_BD.value;
            clearCanvas();
            drawFood();
            drawSnake();
        });
        COLOR_SEL_BG.addEventListener("change", function customBG(){
            snkBG = COLOR_SEL_BG.value;
            clearCanvas();
            drawFood();
            drawSnake();
        });
    }
    else {
        snkBD = 'Red';
        snkBG = 'Yellow';
    }
    clearCanvas();
    drawFood();
    drawSnake();
}

// Level Selector
function changeLevel() {
    let usrLevel = document.getElementById("levelSelect").value;
    if (usrLevel === "low") dv = -5;
    else if (usrLevel === "high") dv = -15;
    else if (usrLevel === "og") dv = 0;
    else dv = 999;
}

// Pause Button
PAUSE_BTN.addEventListener("click", function playPause() {
    if (PAUSE_BTN.value === "Start") {
        PAUSE_BTN.value = "Pause";
        main();
        createFood();
        document.addEventListener("keydown", changeDirection);
    }
    else if (PAUSE_BTN.value === "Pause") {
        PAUSE_BTN.value = "Resume";
        gamePaused = true;
        main();
    }
    else if (PAUSE_BTN.value === "Resume") {
        PAUSE_BTN.value = "Pause";
        gamePaused = false;
        main();
    }
    else if (PAUSE_BTN.value === "Restart") {
        window.location.reload();
    }
    else {
        PAUSE_BTN.value = "Impossible";
    }
});

// Snake Coordinates
let snkLoc = [
    {
        x: 150,
        y: 150
    },
    {
        x: 140,
        y: 150
    },
    {
        x: 130,
        y: 150
    },
    {
        x: 120,
        y: 150
    },
    {
        x: 110,
        y: 150
    },
];

// Functions
function main() {
    if (gameEnd()) {
        PAUSE_BTN.value = "Restart";
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
        }, gameSpeed)
    }
}
function clearCanvas() {
    CTX.fillStyle = CNVS_BG;
    CTX.strokeStyle = CNVS_BD;
    CTX.fillRect(0, 0, CNVS.width, CNVS.height);
    CTX.strokeRect(0, 0, CNVS.width, CNVS.height);
}
function drawFood() {
    CTX.fillStyle = FOOD_BG;
    CTX.strokeStyle = FOOD_BD;
    CTX.fillRect(foodX, foodY, 10, 10);
    CTX.strokeRect(foodX, foodY, 10, 10);
}
function advanceSnake() {
    const head = {
        x: snkLoc[0].x + dx,
        y: snkLoc[0].y + dy
    };
    snkLoc.unshift(head);
    const eatFood = snkLoc[0].x === foodX && snkLoc[0].y === foodY;
    if (eatFood) {
        score += 10;
        document.getElementById("score").innerHTML = score;
        gameSpeed += dv;
        if (gameSpeed < 0)
            gameSpeed = 0;
        createFood()
    }
    else {
        snkLoc.pop();
    }
}
function gameEnd() {
    for (let i = 4; i < snkLoc.length; i++) {
        if (snkLoc[i].x === snkLoc[0].x && snkLoc[i].y === snkLoc[0].y)
            return true;
    }

    const leftWall = snkLoc[0].x < 0;
    const rightWall = snkLoc[0].x > CNVS.width - 10;
    const topWall = snkLoc[0].y < 0;
    const bottomWall = snkLoc[0].y > CNVS.height - 10;

    return leftWall || rightWall || topWall || bottomWall;
}
function random(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}
function createFood() {
    foodX = random(0, CNVS.width - 10);
    foodY = random(0, CNVS.height - 10);
    snkLoc.forEach(function foodOnSnake(part) {
        const foodOnSnakeBool = part.x === foodX && part.y === foodY;
        if (foodOnSnakeBool)
            createFood();
    });
}
function drawSnake() {
    snkLoc.forEach(drawSnakePart);
}
function drawSnakePart(snakePart) {
    CTX.fillStyle = snkBG;
    CTX.strokeStyle = snkBD;
    CTX.fillRect(snakePart.x, snakePart.y, 10, 10);
    CTX.strokeRect(snakePart.x, snakePart.y, 10, 10);
}
function changeDirection(event) {
    if (changingDirection)
        return;
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