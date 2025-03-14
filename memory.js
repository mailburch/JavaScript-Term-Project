const gameBoard = document.getElementById("game-board");
const restartButton = document.getElementById("restart");
const winMessage = document.getElementById("win-message");

const cardSymbols = ["🍕", "🍕", "🚀", "🚀", "🎸", "🎸", "🐱", "🐱", "🌎", "🌎", "🔥", "🔥", "👾", "👾", "🎮", "🎮"];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;

// Initialize game
function initGame() {
    gameBoard.innerHTML = "";
    winMessage.textContent = "";
    matchedPairs = 0;
    flippedCards = [];
    cards = [];

    let shuffledSymbols = shuffleArray(cardSymbols);

    shuffledSymbols.forEach(symbol => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${symbol}</div>
                <div class="card-back"></div>
            </div>
        `;
        card.addEventListener("click", flipCard);
        cards.push(card);
        gameBoard.appendChild(card);
    });
}

// Shuffle array (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Flip card logic
function flipCard() {
    if (this.classList.contains("flipped") || flippedCards.length >= 2) return;

    this.classList.add("flipped");
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 800);
    }
}

// Check for match
function checkMatch() {
    let [card1, card2] = flippedCards;
    let symbol1 = card1.querySelector(".card-front").textContent;
    let symbol2 = card2.querySelector(".card-front").textContent;

    if (symbol1 === symbol2) {
        matchedPairs++;
        flippedCards = [];

        if (matchedPairs === cardSymbols.length / 2) {
            winMessage.textContent = "🎉 Congrats! You matched all pairs! 🎉";
        }
    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            flippedCards = [];
        }, 800);
    }
}

// Restart game
restartButton.addEventListener("click", initGame);

// Start the game
initGame();
