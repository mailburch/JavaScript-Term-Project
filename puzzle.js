const puzzleBoard = document.getElementById("puzzle-board");
const shuffleButton = document.getElementById("shuffle");
const winMessage = document.getElementById("win-message");

const imageSrc = "media/puzzle-image.png"; // Your puzzle image
const gridSize = 3; // 3x3 grid
let tiles = [];
let firstSelection = null;
let timerInterval;
let startTime;

// Initialize the game
function initPuzzle() {
    tiles = [];
    puzzleBoard.innerHTML = "";
    winMessage.textContent = ""; // Reset win message
    stopTimer(); // Reset timer
    startTimer(); // Start a new timer

    let positions = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    shuffleArray(positions);

    positions.forEach((pos, index) => {
        let tile = document.createElement("div");
        tile.classList.add("puzzle-piece");
        tile.style.backgroundImage = `url(${imageSrc})`;
        tile.style.backgroundPosition = `${-(pos % gridSize) * 100}px ${-Math.floor(pos / gridSize) * 100}px`;
        tile.dataset.correctIndex = pos;
        tile.dataset.currentIndex = index;
        tile.addEventListener("click", selectTile);
        tiles.push(tile);
        puzzleBoard.appendChild(tile);
    });
}

// Shuffle array (Fisher-Yates Algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Handle tile selection
function selectTile() {
    if (!firstSelection) {
        firstSelection = this;
        this.style.border = "3px solid yellow";
    } else {
        if (firstSelection === this) {
            firstSelection.style.border = "1px solid white";
            firstSelection = null;
            return;
        }

        swapTiles(firstSelection, this);
        firstSelection.style.border = "1px solid white";
        firstSelection = null;
        checkWin();
    }
}

// Swap two tiles
function swapTiles(tile1, tile2) {
    let tempIndex = tile1.dataset.currentIndex;
    tile1.dataset.currentIndex = tile2.dataset.currentIndex;
    tile2.dataset.currentIndex = tempIndex;

    let parent = tile1.parentNode;
    let tile1Clone = tile1.cloneNode(true);
    let tile2Clone = tile2.cloneNode(true);

    tile1Clone.addEventListener("click", selectTile);
    tile2Clone.addEventListener("click", selectTile);

    parent.replaceChild(tile1Clone, tile2);
    parent.replaceChild(tile2Clone, tile1);

    updateTileArray();
}

// Update tile order in memory
function updateTileArray() {
    tiles = Array.from(document.querySelectorAll(".puzzle-piece"));
}

// **Check if the puzzle is solved**
function checkWin() {
    let isSolved = tiles.every(tile => parseInt(tile.dataset.currentIndex) === parseInt(tile.dataset.correctIndex));

    if (isSolved) {
        stopTimer(); // Stop the timer
        let timeTaken = getElapsedTime(); // Get the formatted time
        winMessage.textContent = `🎉 Congrats! You won in ${timeTaken}! 🎉`;
        disableTileClicks();
    }
}

// Disable clicks after solving
function disableTileClicks() {
    tiles.forEach(tile => tile.removeEventListener("click", selectTile));
}

// **TIMER FUNCTIONS**
function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function getElapsedTime() {
    let endTime = new Date();
    let totalSeconds = Math.floor((endTime - startTime) / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`; // Format as mm:ss
}

function updateTimerDisplay() {
    let elapsedTime = getElapsedTime();
    winMessage.textContent = `Time: ${elapsedTime}`;
}

// Shuffle button event
shuffleButton.addEventListener("click", initPuzzle);

// Start the game
initPuzzle();
