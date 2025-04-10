var PlayerOne;
const OBJETIVE = 10;
const SPEED = 5;
const SPEED_BULLET = 25;
const BULLET_WIDTH = 10;
const NR_ENEMY_ROW = 20;
const ENEMY_SPEED = 1.5;

var lastShotPlayerOne = 0;
var lastShotPlayerTwo = 0;
var cooldown = 500;

var bullets = [];
var enemies = [];

let score = {
    1: 0,
    2: 0
};

function StartGame(){
    PlayerOne = new component(50, 30, "blue", 10, 720);
    PlayerTwo = new component(50, 30, "red", 740, 720);
    createEnemies(50,50,"purple");
    createEnemies(50,120,"purple");
    GameArea.start();
}

var GameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1515;
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
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = GameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.hitBorder();
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
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = GameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
                enemies[i].y += 10;
            }
        }
        if (this.x < 0) {
            for(let i = 0; i < enemies.length; i++){
                enemies[i].speedX *= -1;
                enemies[i].y += 10;
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
    this.fromEnemy = false;
    this.update = function(){
        ctx = GameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        
        for(let i = 0; i < enemies.length; i++){
            if(this.fromEnemy == false){
                if(this.crashObject(enemies[i])){
                    this.width = 0;
                    this.height = 0;
                    this.x = 0;
                    this.y = 0;
                    enemies[i].itCrashed();
                    addScore(1);
                }
            }
            else if (this.fromEnemy == true){
                if(this.crashObject(PlayerOne) || this.crashObject(PlayerTwo)){
                    this.width = 0;
                    this.height = 0;
                    this.x = 0;
                    this.y = 0;
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
        enemies[i].newPos();
        enemies[i].update();
    }

    for (let i = 0; i < bullets.length; i++){
        bullets[i].newPos();
        bullets[i].update();
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
            let Bullet = new bulletComponent(BULLET_WIDTH, 20, "orange", PlayerOne.x + (PlayerOne.width/2 - (BULLET_WIDTH / 2)), PlayerOne.y);
            Bullet.speedY = -1 * SPEED_BULLET;
            bullets.push(Bullet);
            lastShotPlayerOne = currentTime;
        }
    }
    if(GameArea.keys && GameArea.keys[32]){
        if(currentTime - lastShotPlayerTwo >= cooldown){
            let Bullet = new bulletComponent(BULLET_WIDTH, 20, "orange", PlayerTwo.x + (PlayerTwo.width/2 - (BULLET_WIDTH / 2)), PlayerTwo.y);
            Bullet.speedY = -1 * SPEED_BULLET;
            bullets.push(Bullet);
            lastShotPlayerTwo = currentTime;
        }
    }
}

function addScore(player){
    if (score[1] >= OBJETIVE || score[2] >= OBJETIVE) {
        return;
    }

    score[player]++;
    document.getElementById(`score${player}`).textContent = score[player];

    if (score[player] === OBJETIVE){
        document.getElementById("victoryMessage").textContent = `Victoria ${player}`;
        document.getElementById("restartBtn").style.display = "inline-block";
    }
}

function restartGame(){
    score[1] = 0;
    score[2] = 0;

    document.getElementById("score1").textContent = "0";

    document.getElementById("score2").textContent = "0";

    document.getElementById("victoryMessage").textContent = "";

    document.getElementById("restartBtn").style.display = "none";

    if(GameArea.keys && GameArea.keys[96]){
        if(currentTime - lastShotPlayerTwo >= cooldown){
            let Bullet = new bulletComponent(BULLET_WIDTH, 20, "orange", PlayerTwo.x + (PlayerTwo.width/2 - (BULLET_WIDTH / 2)), PlayerTwo.y);
            Bullet.speedY = -1 * SPEED_BULLET;
            bullets.push(Bullet);
            lastShotPlayerTwo = currentTime;
        }
    }
}

function createEnemies(x, y, color){
    var pos = x;
    for(let i = 0; i < NR_ENEMY_ROW; i++){
        enemy = new enemyComponent(50, 50, color, pos, y);
        enemies.push(enemy);

        pos += 70;
    }
}