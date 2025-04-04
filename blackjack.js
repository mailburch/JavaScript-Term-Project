let deck = [];
const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];

let playerMoney = 1000;
let betAmount = 0;
let playerHand = [];
let dealerHand = [];
let splitHand = null;
let isSplit = false;
let activeHand = "main";

window.onload = function () {
    document.getElementById("place-bet").addEventListener("click", placeBet);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stand);
    document.getElementById("double-down").addEventListener("click", doubleDown);
    document.getElementById("split").addEventListener("click", split);
    document.getElementById("restart").addEventListener("click", startGame);
};


function startGame() {
    if (betAmount <= 0) {
        document.getElementById("game-message").textContent = "Place a bet before starting!";
        return;
    }

    deck = createDeck();
    shuffleDeck(deck);

    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];
    splitHand = null;
    isSplit = false;
    activeHand = "main";

    document.getElementById("game-message").textContent = "";
    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;
    document.getElementById("double-down").disabled = false;
    document.getElementById("split").disabled = !canSplit();

    updateUI();
    checkForBlackjack();
}

function placeBet() {
    betAmount = parseInt(document.getElementById("bet-amount").value);
    if (betAmount > playerMoney || betAmount <= 0) {
        document.getElementById("game-message").textContent = "Invalid bet amount!";
        return;
    }
    playerMoney -= betAmount;
    document.getElementById("player-money").textContent = playerMoney;
    startGame();
}

function createDeck() {
    let newDeck = [];
    for (let suit of suits) {
        for (let value of values) {
            newDeck.push({ value, suit });
        }
    }
    return newDeck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function drawCard() {
    return deck.pop();
}

function calculateScore(hand) {
    let score = 0;
    let aceCount = 0;

    hand.forEach(card => {
        if (["jack", "queen", "king"].includes(card.value)) {
            score += 10;
        } else if (card.value === "ace") {
            score += 11;
            aceCount++;
        } else {
            score += parseInt(card.value);
        }
    });

    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }

    return score;
}

function updateUI() {
    document.getElementById("player-cards").innerHTML = playerHand.map(card => getCardImage(card)).join("");
    document.getElementById("dealer-cards").innerHTML = dealerHand.map(card => getCardImage(card)).join("");
    document.getElementById("player-score").textContent = "Score: " + calculateScore(playerHand);
    document.getElementById("dealer-score").textContent = "Score: " + calculateScore(dealerHand);
}

function getCardImage(card) {
    return `<img src="media/cards/${card.value}_of_${card.suit}.png" alt="${card.value} of ${card.suit}">`;
}

function hit() {
    if (isSplit && activeHand === "split") {
        splitHand.push(drawCard());
    } else {
        playerHand.push(drawCard());
    }
    updateUI();

    if (calculateScore(playerHand) > 21) {
        document.getElementById("game-message").textContent = "You busted! Dealer wins.";
        disableButtons();
    }
}

function stand() {
    while (calculateScore(dealerHand) < 17) {
        dealerHand.push(drawCard());
    }
    updateUI();
    determineOutcome();
}

function doubleDown() {
    if (playerMoney < betAmount) {
        document.getElementById("game-message").textContent = "Not enough money to double down!";
        return;
    }

    playerMoney -= betAmount;
    betAmount *= 2;
    document.getElementById("player-money").textContent = playerMoney;
    playerHand.push(drawCard());
    updateUI();
    stand();
}

function canSplit() {
    return playerHand.length === 2 && playerHand[0].value === playerHand[1].value && playerMoney >= betAmount;
}

function split() {
    if (!canSplit()) return;

    playerMoney -= betAmount;
    document.getElementById("player-money").textContent = playerMoney;
    splitHand = [playerHand.pop()];
    isSplit = true;
    activeHand = "split";
    updateUI();
}

function checkForBlackjack() {
    let playerScore = calculateScore(playerHand);
    let dealerScore = calculateScore(dealerHand);

    if (playerScore === 21) {
        document.getElementById("game-message").textContent = "Blackjack! You win!";
        playerMoney += Math.floor(betAmount * 2.5);
        document.getElementById("player-money").textContent = playerMoney;
        disableButtons();
    } else if (dealerScore === 21) {
        document.getElementById("game-message").textContent = "Dealer has Blackjack. You lose.";
        disableButtons();
    }
}

function determineOutcome() {
    let playerScore = calculateScore(playerHand);
    let dealerScore = calculateScore(dealerHand);

    if (playerScore > 21) {
        document.getElementById("game-message").textContent = "You busted! Dealer wins.";
    } else if (dealerScore > 21 || playerScore > dealerScore) {
        document.getElementById("game-message").textContent = "You win!";
        playerMoney += betAmount * 2;
    } else if (playerScore < dealerScore) {
        document.getElementById("game-message").textContent = "Dealer wins!";
    } else {
        document.getElementById("game-message").textContent = "It's a tie! Bet refunded.";
        playerMoney += betAmount;
    }

    document.getElementById("player-money").textContent = playerMoney;
    disableButtons();
}

function disableButtons() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
    document.getElementById("double-down").disabled = true;
    document.getElementById("split").disabled = true;
}

console.log("Place Bet button is:", document.getElementById("place-bet"));
