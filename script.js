```javascript
/* ==========================================
   GAME TAHU GEJROT PAKDE BURUNG
   script.js
   BAGIAN 1
========================================== */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* MENU */
const menu = document.getElementById("menu");
const hud = document.getElementById("hud");
const gameOver = document.getElementById("gameOver");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

/* SCORE */
const scoreText = document.getElementById("score");
const lifeText = document.getElementById("life");
const highScoreText = document.getElementById("highScore");
const finalScore = document.getElementById("finalScore");

/* CANVAS */
canvas.width = 420;
canvas.height = 700;

/* GAME DATA */

let score = 0;
let life = 3;
let level = 1;

let running = false;

let foods = [];
let bombs = [];

/* HIGH SCORE */

let highScore =
Number(localStorage.getItem("pakde_highscore")) || 0;

highScoreText.textContent = highScore;

/* PLAYER */

const player = {

    width:90,
    height:35,

    x:canvas.width/2-45,

    y:canvas.height-60,

    speed:8,

    color:"#ff7a00"

};

/* DRAW PLAYER */

function drawPlayer(){

    ctx.fillStyle = player.color;

    ctx.beginPath();

    ctx.roundRect(
        player.x,
        player.y,
        player.width,
        player.height,
        12
    );

    ctx.fill();

}

/* DRAW BACKGROUND */

function drawBackground(){

    ctx.fillStyle="#fff8ef";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}

/* UPDATE HUD */

function updateHUD(){

    scoreText.textContent = score;

    lifeText.textContent = life;

    highScoreText.textContent = highScore;

}

/* RESET */

function resetGame(){

    score = 0;

    level = 1;

    life = 3;

    foods = [];

    bombs = [];

    player.x = canvas.width/2-player.width/2;

    updateHUD();

}

/* START */

function startGame(){

    menu.classList.add("hidden");

    gameOver.classList.add("hidden");

    hud.classList.remove("hidden");

    resetGame();

    running = true;

}

/* GAME OVER */

function endGame(){

    running = false;

    finalScore.textContent = score;

    if(score > highScore){

        highScore = score;

        localStorage.setItem(
            "pakde_highscore",
            highScore
        );

    }

    updateHUD();

    gameOver.classList.remove("hidden");

}

/* BUTTON */

startBtn.addEventListener(

    "click",

    ()=>{

        startGame();

    }

);

restartBtn.addEventListener(

    "click",

    ()=>{

        startGame();

    }

);

/* KEYBOARD */

let moveLeft = false;

let moveRight = false;

document.addEventListener(

    "keydown",

    e=>{

        if(e.key==="ArrowLeft"){

            moveLeft=true;

        }

        if(e.key==="ArrowRight"){

            moveRight=true;

        }

    }

);

document.addEventListener(

    "keyup",

    e=>{

        if(e.key==="ArrowLeft"){

            moveLeft=false;

        }

        if(e.key==="ArrowRight"){

            moveRight=false;

        }

    }

);

/* TOUCH */

canvas.addEventListener(

    "touchmove",

    e=>{

        e.preventDefault();

        const rect =
        canvas.getBoundingClientRect();

        const touch =
        e.touches[0];

        player.x =
        touch.clientX-
        rect.left-
        player.width/2;

    },

    {passive:false}

);

/* MOUSE */

canvas.addEventListener(

    "mousemove",

    e=>{

        const rect =
        canvas.getBoundingClientRect();

        player.x =
        e.clientX-
        rect.left-
        player.width/2;

    }

);

/* UPDATE PLAYER */

function updatePlayer(){

    if(moveLeft){

        player.x -= player.speed;

    }

    if(moveRight){

        player.x += player.speed;

    }

    if(player.x < 0){

        player.x = 0;

    }

    if(player.x + player.width > canvas.width){

        player.x =
        canvas.width-player.width;

    }

}
```
```javascript
/* ==========================================
   GAME TAHU GEJROT PAKDE BURUNG
   script.js
   BAGIAN 2
========================================== */

/* -------------------------
   MEMBUAT TAHU GEJROT
------------------------- */

function createFood(){

    foods.push({

        x:Math.random()*(canvas.width-40),

        y:-40,

        width:40,

        height:40,

        speed:3+level

    });

}

/* -------------------------
   MEMBUAT CABAI BUSUK
------------------------- */

function createBomb(){

    bombs.push({

        x:Math.random()*(canvas.width-35),

        y:-35,

        width:35,

        height:35,

        speed:4+level

    });

}

/* -------------------------
   GAMBAR TAHU
------------------------- */

function drawFoods(){

    foods.forEach(food=>{

        ctx.fillStyle="#f5d08a";

        ctx.beginPath();

        ctx.roundRect(
            food.x,
            food.y,
            food.width,
            food.height,
            10
        );

        ctx.fill();

        /* Kuah */

        ctx.fillStyle="#8B4513";

        ctx.fillRect(
            food.x+5,
            food.y+25,
            30,
            8
        );

    });

}

/* -------------------------
   GAMBAR CABAI
------------------------- */

function drawBombs(){

    bombs.forEach(bomb=>{

        ctx.fillStyle="red";

        ctx.beginPath();

        ctx.arc(

            bomb.x+18,

            bomb.y+18,

            16,

            0,

            Math.PI*2

        );

        ctx.fill();

        ctx.fillStyle="green";

        ctx.fillRect(

            bomb.x+15,

            bomb.y-3,

            6,

            10

        );

    });

}

/* -------------------------
   UPDATE TAHU
------------------------- */

function updateFoods(){

    for(let i=foods.length-1;i>=0;i--){

        foods[i].y+=foods[i].speed;

        /* TERTANGKAP */

        if(

            foods[i].y+foods[i].height>=player.y &&

            foods[i].x<player.x+player.width &&

            foods[i].x+foods[i].width>player.x

        ){

            score+=10;

            foods.splice(i,1);

            updateHUD();

            continue;

        }

        /* JATUH */

        if(foods[i].y>canvas.height){

            foods.splice(i,1);

        }

    }

}

/* -------------------------
   UPDATE CABAI
------------------------- */

function updateBombs(){

    for(let i=bombs.length-1;i>=0;i--){

        bombs[i].y+=bombs[i].speed;

        /* KENA PLAYER */

        if(

            bombs[i].y+bombs[i].height>=player.y &&

            bombs[i].x<player.x+player.width &&

            bombs[i].x+bombs[i].width>player.x

        ){

            life--;

            bombs.splice(i,1);

            updateHUD();

            if(life<=0){

                endGame();

            }

            continue;

        }

        /* LEWAT */

        if(bombs[i].y>canvas.height){

            bombs.splice(i,1);

        }

    }

}

/* -------------------------
   LEVEL
------------------------- */

function updateLevel(){

    level=Math.floor(score/100)+1;

}

/* -------------------------
   SPAWN OBJECT
------------------------- */

setInterval(()=>{

    if(running){

        createFood();

    }

},900);

setInterval(()=>{

    if(running){

        createBomb();

    }

},1700);
```
```javascript id="u3y5kq"
/* ==========================================
   GAME TAHU GEJROT PAKDE BURUNG
   script.js
   BAGIAN 3
========================================== */

/* -------------------------
   RENDER GAME
------------------------- */

function render(){

    drawBackground();

    drawPlayer();

    drawFoods();

    drawBombs();

}

/* -------------------------
   UPDATE GAME
------------------------- */

function update(){

    if(!running){
        return;
    }

    updatePlayer();

    updateFoods();

    updateBombs();

    updateLevel();

    /* Update kecepatan sesuai level */
    foods.forEach(food=>{
        food.speed = 3 + level;
    });

    bombs.forEach(bomb=>{
        bomb.speed = 4 + level;
    });

}

/* -------------------------
   GAME LOOP
------------------------- */

function gameLoop(){

    update();

    render();

    requestAnimationFrame(gameLoop);

}

/* -------------------------
   PESAN LEVEL
------------------------- */

let lastLevel = 1;

setInterval(()=>{

    if(!running){
        return;
    }

    if(level > lastLevel){

        lastLevel = level;

        console.log("Level Naik :", level);

    }

},300);

/* -------------------------
   RESET LEVEL SAAT MAIN LAGI
------------------------- */

const originalStartGame = startGame;

startGame = function(){

    lastLevel = 1;

    originalStartGame();

};

/* -------------------------
   TAMPILKAN HIGH SCORE
------------------------- */

updateHUD();

/* -------------------------
   MULAI ANIMASI
------------------------- */

gameLoop();
```
