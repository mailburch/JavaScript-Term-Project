
let deck = [];
const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];

let playerHand = [];
let dealerHand = [];

document.getElementById("hit").addEventListener("click", hit);
document.getElementById("stand").addEventListener("click", stand);
document.getElementById("restart").addEventListener("click", startGame);

function startGame() {
    deck = createDeck();
    shuffleDeck(deck);

    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];

    
    document.getElementById("game-message").textContent = ""; 
    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;

    updateUI();
    checkForBlackjack();
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
    playerHand.push(drawCard());
    updateUI();

    let playerScore = calculateScore(playerHand);

    if (playerScore > 21) {
        document.getElementById("game-message").textContent = "You busted! Dealer wins.";
        disableButtons();
    } else if (playerScore === 21) {
        stand(); 
    }
}


function stand() {
    while (calculateScore(dealerHand) < 17) {
        dealerHand.push(drawCard());
    }

    updateUI();
    checkWinner();
}

function checkForBlackjack() {
    let playerScore = calculateScore(playerHand);
    let dealerScore = calculateScore(dealerHand);

    if (playerScore === 21 && dealerScore === 21) {
        document.getElementById("game-message").textContent = "It's a tie! Both got Blackjack.";
        disableButtons();
    } else if (playerScore === 21) {
        document.getElementById("game-message").textContent = "Blackjack! You win!";
        disableButtons();
    } else if (dealerScore === 21) {
        document.getElementById("game-message").textContent = "Dealer has Blackjack. You lose.";
        disableButtons();
    }
}

function checkWinner() {
    let playerScore = calculateScore(playerHand);
    let dealerScore = calculateScore(dealerHand);

    if (dealerScore > 21) {
        document.getElementById("game-message").textContent = "Dealer busted! You win!";
    } else if (playerScore > dealerScore) {
        document.getElementById("game-message").textContent = "You win!";
    } else if (playerScore < dealerScore) {
        document.getElementById("game-message").textContent = "Dealer wins!";
    } else {
        document.getElementById("game-message").textContent = "It's a tie!";
    }
    disableButtons();
}

function disableButtons() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
}

startGame();
