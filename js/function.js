var PlayerOne;
const SPEED = 5;
const SPEED_BULLET = 25;
const BULLET_WIDTH = 10;

var bullets = [];

function StartGame(){
    PlayerOne = new component(50, 30, "blue", 10, 720);
    PlayerTwo = new component(50, 30, "red", 740, 720);
    
    GameArea.start();
    
}

var GameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
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

    PlayerShoot(PlayerOne, 32); 
    PlayerShoot(PlayerTwo, 96);

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

function PlayerShoot(player, key){
    if(GameArea.keys && GameArea.keys[key]){
        //Falta poner un timer para la creacion de balas

        let Bullet = new component(BULLET_WIDTH, 20, "orange", player.x + (player.width/2 - (BULLET_WIDTH / 2)), player.y);
        Bullet.speedY = -1 * SPEED_BULLET;
        bullets.push(Bullet);
    }
}