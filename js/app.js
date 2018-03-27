/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
(function () {

const moveCount = document.querySelector('.moves');
const deck = document.querySelector('.deck');
const stars = document.querySelectorAll('.fa-star');
const matchedCard = document.getElementsByClassName('match');
const close = document.querySelector('#close');
const overlay = document.querySelector('.overlay');
const restart = document.querySelector('.restart');
const playAgain = document.getElementById('play-again');
const timeRecord = document.querySelector('.time-record');
const timer = document.querySelector('.timer');

let card = document.getElementsByClassName("card");
let cards = [...card];
let moves = 0;
let min = 0, sec = 0, hr = 0;
let interval;
let openedCards = [];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function setTimer() {
    sec += 1;
    if (sec === 60) {
        min += 1;
        sec = 0;
    }
    if (min === 60) {
        hr += 1;
        min = 0;
    }
    timer.innerHTML = hr + 'h : ' + min + 'm : ' + sec + 's';
}

function startTimer() {
    interval = setInterval(setTimer, 1000);
}

function startGame() {
    cards = shuffle(cards);
    openedCards = [];
    deck.innerHTML = '';
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove('show', 'open', 'match', 'disabled');
        deck.appendChild(cards[i]);
    }

    moves = 0;
    moveCount.innerHTML = moves;

    for (let i = 0; i < 3; i++) {
        stars[i].style.visibility = 'visible';
    }

    min = 0;
    sec = 0;
    hr = 0;
    timer.innerHTML = hr + 'h : ' + min + 'm : ' + sec + 's';
    clearInterval(interval);
}

function displayCard() {
    this.classList.add('open', 'show', 'disabled');
}

function disable() {
    cards.forEach(function(card) {
        card.classList.add('disabled');
    });
}

function enable() {
    cards.forEach(function(card) {
        card.classList.remove('disabled');
    });
}

function matched() {
    openedCards[0].classList.add('match');
    openedCards[1].classList.add('match');
    openedCards[0].classList.remove('open', 'show', 'disabled');
    openedCards[1].classList.remove('open', 'show', 'disabled');
    openedCards = [];
}

function unmatched() {
    openedCards[0].classList.add('unmatch');
    openedCards[1].classList.add('unmatch');
    disable();
    setTimeout(function() {
        openedCards[0].classList.remove('open', 'show', 'unmatch');
        openedCards[1].classList.remove('open', 'show', 'unmatch');
        enable();
        openedCards = [];
    }, 800);
}

function moveCounter() {
    moves += 1;
    moveCount.innerHTML = moves;
    if (moves === 1) {
        min = 0;
        sec = 0;
        hr = 0;
        startTimer();
    }
    if (moves > 10 && moves < 14) {
        for (let i = 0; i < 3; i++) {
            if (i > 1) {
                stars[i].style.visibility = "collapse";
            }
        }
    }
    else if (moves > 14) {
        for (let i = 0; i < 3; i++) {
            if (i > 0) {
                stars[i].style.visibility = 'collapse';
            }
        }
    }
}

function openCard() {
    openedCards.push(this);
    let len = openedCards.length;
    if (len === 2) {
        moveCounter();
        if (openedCards[0].children[0].className === openedCards[1].children[0].className) {
            matched();
        } else {
            unmatched();
        }
    }
}

function closeModal() {
    close.addEventListener('click', function() {
        overlay.classList.remove('show-modal');
        startGame();
    });
}

function congratulations() {
    if (matchedCard.length === 16) {
        clearInterval(interval);
        timeRecord.innerHTML = timer.innerHTML;

        overlay.classList.add('show-modal');
        let starsRating = document.querySelector('.stars').innerHTML;
        document.querySelector('.moves-record').innerHTML = moves;
        document.querySelector('.rating').innerHTML = starsRating;
    }
    closeModal();
    addPlayAgainListener();
}

function addRestartGameListener() {
    restart.addEventListener('click', startGame);
}

function addPlayAgainListener() {
    playAgain.addEventListener('click', function() {
        overlay.classList.remove('show-modal');
        startGame();
    });
}

for (let i = 0; i < cards.length; i++) {
    let card = cards[i];
    card.addEventListener('click', displayCard);
    card.addEventListener('click', openCard);
    card.addEventListener('click', congratulations);
}

document.addEventListener('DOMContentLoaded', function(){
    addRestartGameListener();
    startGame();
});

})();

