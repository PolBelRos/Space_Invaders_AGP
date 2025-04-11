const OBJETIVE = 10;
const SPEED = 5;
const SPEED_BULLET = 25;
const SPEED_ENEMY_BULLET = 15;
const BULLET_WIDTH = 10;
const NR_ENEMY_ROW = 20;
const ENEMY_SPEED = 1.2;
const PLAYER_LIFES = 5;
const PLAYER_SPAWN = 400;
const CANVAS_WIDTH = 1500;
const PLAYER_WIDTH = 70;

var lastShotPlayerOne = 0;
var lastShotPlayerTwo = 0;
var lastShotEnemy = 0;

var cooldown = 600;
var enemyCooldown = 200;

var bullets = [];
var enemyBullets = [];
var enemies = [];

var gameLoaded = true;

function StartGame(){
    PlayerOne = new component(PLAYER_WIDTH, 70, "https://i.ibb.co/zV5x1hZK/player-1.gif", PLAYER_SPAWN, 700, 1);
    PlayerTwo = new component(PLAYER_WIDTH, 70, "https://i.ibb.co/Q3LjjXmc/player-2.gif", (CANVAS_WIDTH - PLAYER_SPAWN - PLAYER_WIDTH), 700, 2);
    createEnemies(50, 10, "https://i.ibb.co/fYGZWYsp/invader-4.png");
    createEnemies(50, 80, "https://i.ibb.co/5ypDzPg/invader-2.gif");
    createEnemies(50, 150, "https://i.ibb.co/5ypDzPg/invader-2.gif");
    createEnemies(50, 220, "https://i.ibb.co/S7P0gwMq/invader-1.gif");
    createEnemies(50, 290, "https://i.ibb.co/S7P0gwMq/invader-1.gif");
    createEnemies(50, 360, "https://i.ibb.co/3599fFLn/invader-3.gif");
    createEnemies(50, 430, "https://i.ibb.co/3599fFLn/invader-3.gif");
    GameArea.start();
}

function RestartGame(){
    while(enemies.length > 0){
        enemies.pop();
    }
    StartGame();
}

function ResumeGame(){
    GameArea.start();
}

function StopGame(){
    GameArea.stop();
}   

var GameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = 800;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e){
            GameArea.keys = (GameArea.keys || []);
            GameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e){
            GameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, numPlayer) {
    this.numPlayer = numPlayer;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.numHit = 0;
    this.lifes = PLAYER_LIFES;
    this.isDead = false;
    this.image = new Image();
    this.image.src = color;
    this.image.onload = () => {
        this.loaded = true;
    }
    this.loaded = false;
    
    this.update = function(){
        ctx = GameArea.context;
        if (this.loaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = "gray";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        if(this.isDead == true){
            document.getElementById("victoryMessage").textContent = `Victoria ${this.numPlayer}`;
            document.getElementById("restartBtn").style.display = "inline-block";
            GameArea.stop();
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.hitBorder();
    }
    this.itCrashed = function(){
        if(this.lifes == 1){
            this.width = 0;
            this.height = 0;
            this.x = 0;
            this.y = 0;
            this.speedX = 0;
            this.isDead = true;
            document.getElementById("life5player" + this.numPlayer).src="img/sprites/hearts/heart_hollow.png";

        }
        else{
            this.lifes -= 1;
            this.numHit++;
            this.id = "life" + this.numHit + "player" + this.numPlayer;
            document.getElementById(this.id).src="img/sprites/hearts/heart_hollow.png";
        }
    }
    this.hitBorder = function() {
        var limitRight = GameArea.canvas.width - this.width;

        if (this.x > limitRight) {
            this.x = limitRight;
        }
        if (this.x < 0) {
            this.x = 0;
        }

    }

    
}

function enemyComponent(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = -1 * ENEMY_SPEED;
    //this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = color;
    this.image.onload = () => {
        this.loaded = true;
    }
    this.loaded = false;

    this.image = new Image();
    this.image.src = color;
    this.image.onload = () => {
        this.loaded = true;
    }
    this.loaded = false;

    this.update = function(){
        ctx = GameArea.context;
        if (this.loaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = "gray";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        if (this.loaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = "gray";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.hitBorder();
    }
    this.itCrashed = function(){
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.speedX = 0;
    }
    this.hitBorder = function() {
        var limitRight = GameArea.canvas.width - this.width;

        if (this.x > limitRight) {
            for(let i = 0; i < enemies.length; i++){
                enemies[i].speedX *= -1;
                enemies[i].y += 5;
            }
        }
        if (this.x < 0) {
            for(let i = 0; i < enemies.length; i++){
                enemies[i].speedX *= -1;
                enemies[i].y += 5;
            }
        }
    }
}

function bulletComponent(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.player = 0;
    this.fromEnemy = false;
    this.image = new Image();
    this.image.src = color;
    this.image.onload = () => {
        this.loaded = true;
    }
    this.loaded = false;
    this.update = function(){
        ctx = GameArea.context;
        if (this.loaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = "gray";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        for(let i = 0; i < enemies.length; i++){
            if(this.fromEnemy == false){
                if(this.crashObject(enemies[i])){
                    this.width = 0;
                    this.height = 0;
                    this.x = 0;
                    this.y = 0;
                    enemies[i].itCrashed();
                    addScore(this.player);
                }
            }
            else if (this.fromEnemy == true){
                if(this.crashObject(PlayerOne)){
                    this.width = 0;
                    this.height = 0;
                    this.x = 0;
                    this.y = 0;
                    PlayerOne.itCrashed();
                }
                if(this.crashObject(PlayerTwo)){
                    this.width = 0;
                    this.height = 0;
                    this.x = 0;
                    this.y = 0;
                    PlayerTwo.itCrashed();
                }
            }
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashObject = function(enemy) {
        var left = this.x;
        var right = this.x + (this.width);
        var top = this.y;
        var bottom = this.y + (this.height);
        var crashLeft = enemy.x;
        var crashRight = enemy.x + (enemy.width);
        var crashTop = enemy.y;
        var crashBottom = enemy.y + (enemy.height);
        var crash = true;
        if((bottom < crashTop) || (top > crashBottom) || (right < crashLeft) || (left > crashRight)){
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    GameArea.clear();

    if(gameLoaded == true){
        StopGame();
        gameLoaded = false;
    }

    stopMove();

    if(GameArea.keys && GameArea.keys[65]){
        leftMove(PlayerOne);
    }
    if(GameArea.keys && GameArea.keys[68]){
        rightMove(PlayerOne);
    }
    if(GameArea.keys && GameArea.keys[37]){
        leftMove(PlayerTwo);
    }
    if(GameArea.keys && GameArea.keys[39]){
        rightMove(PlayerTwo);
    }

    PlayerOne.newPos();
    PlayerTwo.newPos();
    PlayerOne.update();
    PlayerTwo.update();
    PlayerShoot();

    for (let i = 0; i < enemies.length; i++){
        ShootEnemy(i);
    }

    for (let i = 0; i < enemies.length; i++){
        enemies[i].newPos();
        enemies[i].update();
    }

    for (let i = 0; i < bullets.length; i++){
        bullets[i].newPos();
        bullets[i].update();
    }

    for (let i = 0; i < enemyBullets.length; i++){
        enemyBullets[i].newPos();
        enemyBullets[i].update();
    }
    

}

function leftMove(player){
    player.speedX -= 1 * SPEED;
}

function rightMove(player){
    player.speedX += 1 * SPEED;
}

function stopMove(){
    PlayerOne.speedX = 0;
    PlayerTwo.speedX = 0;
}

function PlayerShoot(){
    let currentTime = new Date().getTime();
    if(GameArea.keys && GameArea.keys[32]){
        if(currentTime - lastShotPlayerOne >= cooldown){
            let Bullet = new bulletComponent(BULLET_WIDTH, 20, "https://i.ibb.co/0p6HWWZr/rayo-aliado.png", PlayerOne.x + (PlayerOne.width/2 - (BULLET_WIDTH / 2)), PlayerOne.y);
            Bullet.speedY = -1 * SPEED_BULLET;
            Bullet.player = 1;
            bullets.push(Bullet);
            lastShotPlayerOne = currentTime;
        }
    }
    if(GameArea.keys && GameArea.keys[96]){
        if(currentTime - lastShotPlayerTwo >= cooldown){
            let Bullet = new bulletComponent(BULLET_WIDTH, 20, "https://i.ibb.co/0p6HWWZr/rayo-aliado.png", PlayerTwo.x + (PlayerTwo.width/2 - (BULLET_WIDTH / 2)), PlayerTwo.y);
            Bullet.speedY = -1 * SPEED_BULLET;
            Bullet.player = 2;
            bullets.push(Bullet);
            lastShotPlayerTwo = currentTime;
        }
    }

}

let score = {
    1: 0,
    2: 0
};

function addScore(player){
    if (score[1] >= OBJETIVE || score[2] >= OBJETIVE) return;

    score[player]++;
    document.getElementById(`score${player}`).textContent = score[player];

    if (score[player] === OBJETIVE){
        document.getElementById("victoryMessage").textContent = `Victoria ${player}`;
        document.getElementById("restartBtn").style.display = "inline-block";
        GameArea.stop();
    }
}



function restartGame(){
    score[1] = 0;
    score[2] = 0;

    document.getElementById("score1").textContent = "0";

    document.getElementById("score2").textContent = "0";

    document.getElementById("victoryMessage").textContent = "";

    document.getElementById("restartBtn").style.display = "none";

    document.getElementById("life1player1").src = "img/sprites/hearts/heart_full.png"
    document.getElementById("life2player1").src = "img/sprites/hearts/heart_full.png"
    document.getElementById("life3player1").src = "img/sprites/hearts/heart_full.png"
    document.getElementById("life4player1").src = "img/sprites/hearts/heart_full.png"
    document.getElementById("life5player1").src = "img/sprites/hearts/heart_full.png"

    document.getElementById("life1player2").src = "img/sprites/hearts/heart_full.png"
    document.getElementById("life2player2").src = "img/sprites/hearts/heart_full.png"
    document.getElementById("life3player2").src = "img/sprites/hearts/heart_full.png"
    document.getElementById("life4player2").src = "img/sprites/hearts/heart_full.png"
    document.getElementById("life5player2").src = "img/sprites/hearts/heart_full.png"

    PlayerOne.lifes = PLAYER_LIFES;
    PlayerOne.numHit = 0;
    PlayerTwo.lifes = PLAYER_LIFES;
    PlayerTwo.numHit = 0;


    StopGame();
    RestartGame();
}

function createEnemies(x, y, color){
    var pos = x;
    for(let i = 0; i < NR_ENEMY_ROW; i++){
        enemy = new enemyComponent(50, 50, color, pos, y);
        enemies.push(enemy);

        pos += 70;
    }
}

function ShootEnemy(i) {
    let currentTime = new Date().getTime();
    var randomNum = Math.random() * 1000;

    if(enemies[i].width != 0 && enemies.height != 0){
        if(randomNum >= 999){
            if(currentTime - lastShotEnemy >= enemyCooldown){
                let Bullet = new bulletComponent(BULLET_WIDTH, 20, "https://i.ibb.co/qLsLr9zf/rayo-enemigo.png", enemies[i].x + (enemies[i].width/2 - (BULLET_WIDTH / 2)), enemies[i].y + enemies[i].height);
                Bullet.speedY = 1 * SPEED_ENEMY_BULLET;
                Bullet.fromEnemy = true;
                enemyBullets.push(Bullet);
                lastShotEnemy = currentTime;
            }
        }
    }
}