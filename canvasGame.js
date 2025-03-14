// Game variables
var myGamePiece;
var myObstacles = [];
var myScore;
var gravity = 0.1;
var jumpStrength = -3;
var gameRunning = false;
var gameMusic, gameOverSound;

// Start button event listener
document.getElementById("startButton").addEventListener("click", function () {
    startGame();
    this.style.display = "none"; // Hide start button
    document.getElementById("jumpButton").style.display = "inline";
});

// Start the game
function startGame() {
    myGamePiece = new component(30, 30, "red", 50, 150);
    myScore = new component("20px", "Consolas", "black", 10, 30, "text");
    gameMusic = new sound("media/background-music.mp3");
    gameOverSound = new sound("media/game_over.mp3");

    gameMusic.play();
    myGameArea.start();
    gameRunning = true;
}

// Game area setup
var myGameArea = {
    canvas: document.getElementById("myCanvas"),
    start: function () {
        this.canvas.width = 500;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
        gameRunning = false;
    }
};

// Create game components
function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedY = 0;

    this.update = function () {
        let ctx = myGameArea.context;
        if (this.type === "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };

    this.newPos = function () {
        this.speedY += gravity;
        this.y += this.speedY;

        // Prevent falling off the screen
        if (this.y > myGameArea.canvas.height - this.height || this.y < 0) {
            myGameArea.stop();
            gameOver();
        }
    };

    this.crashWith = function (obstacle) {
        var myLeft = this.x;
        var myRight = this.x + this.width;
        var myTop = this.y;
        var myBottom = this.y + this.height;
        var otherLeft = obstacle.x;
        var otherRight = obstacle.x + obstacle.width;
        var otherTop = obstacle.y;
        var otherBottom = obstacle.y + obstacle.height;
        return !(myBottom < otherTop || myTop > otherBottom || myRight < otherLeft || myLeft > otherRight);
    };
}

// Function to update game area
function updateGameArea() {
    if (!gameRunning) return;

    // Collision check
    for (var i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            gameOver();
            return;
        }
    }

    myGameArea.clear();
    myGameArea.frameNo += 1;

    // Generate new obstacles every 100 frames
    if (myGameArea.frameNo % 100 === 0) {
        var minHeight = 50;
        var maxHeight = 200;
        var height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        var gap = 100;
        var x = myGameArea.canvas.width;
        myObstacles.push(new component(30, height, "green", x, 0));
        myObstacles.push(new component(30, myGameArea.canvas.height - height - gap, "green", x, height + gap));
    }

    // Move obstacles leftward
    for (i = 0; i < myObstacles.length; i++) {
        myObstacles[i].x -= 2;
        myObstacles[i].update();

        // Score when obstacle is passed
        if (myObstacles[i].x + myObstacles[i].width === myGamePiece.x) {
            myGameArea.frameNo += 1;
        }
    }

    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();

    myGamePiece.newPos();
    myGamePiece.update();
}

// Jump function
document.getElementById("jumpButton").addEventListener("click", function () {
    if (gameRunning) {
        myGamePiece.speedY = jumpStrength;
    }
});

// Game over function
function gameOver() {
    gameMusic.stop();
    gameOverSound.play();
    gameRunning = false;
    myGameArea.clear();
    myScore.text = "GAME OVER - SCORE: " + myGameArea.frameNo;
    myScore.update();
    document.getElementById("restartButton").style.display = "block";
}

// Sound function
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    };
    this.stop = function () {
        this.sound.pause();
    };
}
