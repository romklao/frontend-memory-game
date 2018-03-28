"use strict";
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

/* Deck hold all cards */
const deck = document.querySelector('.deck');

/* Star icons for rating */
const stars = document.querySelectorAll('.fa-star');

/* MoveCount to track a number of moves when start playing game */
const moveCount = document.querySelector('.moves');

/* Match class when cards are matched */
const matchedCard = document.getElementsByClassName('match');

/* Close icon modal */
const close = document.querySelector('#close');

/* Overlay of congrate messages */
const overlay = document.querySelector('.overlay');

/* Restart icon */
const restart = document.querySelector('.restart');

/* Play again button */
const playAgain = document.getElementById('play-again');

/* Declare timer record when finish playing game */
const timeRecord = document.querySelector('.time-record');

/* Declare timer when start playing game */
const timer = document.querySelector('.timer');

/* Declare move, min, sec and hr to 0 when start playing */
let moves = 0;
let min = 0, sec = 0, hr = 0;

/* Declare openedCards to empty array*/
let openedCards = [];

let interval;
let card,
    cards

/* Shuffle function from http://stackoverflow.com/a/2450976 */
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

/* Set the rule how to count sec, min and hr */
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

/* Start timer when making the first move */
function startTimer() {
    interval = setInterval(setTimer, 1000);
}

/* Initialize variables when start a new game */
function startGame() {
    cards = shuffle(cards);
    openedCards = [];
    deck.innerHTML = '';
    cards.forEach(card => {
        card.classList.remove('show', 'open', 'match', 'disabled');
        deck.appendChild(card);
    });

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

/* Add classes when click to open a card */
function displayCard() {
    this.classList.add('open', 'show', 'disabled');
}

/* Add disable class when click a card */
function disable() {
    cards.forEach(card => card.classList.add('disabled'));
}

/* Remove disable class after categorizing matched or unmatched two cards */
function enable() {
    cards.forEach(card => card.classList.remove('disabled'));
}

/* Add styles to matched cards */
function matched() {
    openedCards[0].classList.add('match');
    openedCards[1].classList.add('match');
    openedCards[0].classList.remove('open', 'show', 'disabled');
    openedCards[1].classList.remove('open', 'show', 'disabled');
    openedCards = [];
}

/* Add styles to unmatched cards */
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

/* Counting moves when start playing a game and set a rule of rating stars depend on a number of moves */
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

/* Set conditions of moves counting and matched or unmatched cards when opening two cards */
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

/* Popup congratulation messages when all cards are opened and matched*/
function congratulations() {
    if (matchedCard.length === 16) {
        clearInterval(interval);
        timeRecord.innerHTML = timer.innerHTML;

        overlay.classList.add('show-modal');
        let starsRating = document.querySelector('.stars').innerHTML;
        document.querySelector('.moves-record').innerHTML = moves;
        document.querySelector('.rating').innerHTML = starsRating;
    }
}

/* Close modal and restart a new game when click X button */
function closeModal() {
    overlay.classList.remove('show-modal');
    startGame();
}

/* Close modal and restart a new game when click play again button */
function addPlayAgainListener() {
    overlay.classList.remove('show-modal');
    startGame();
}

/* Create a deck of 16 cards by creating element <li> and <i> and append them to <ul> in HTML file.
 After creating the deck, add eventlistener when click some elements */
function createCardDeck() {
    let iconClassList = [
        'fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube',
        'fa fa-anchor', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-diamond', 'fa fa-bomb', 'fa fa-leaf',
        'fa fa-bomb', 'fa fa-bolt', 'fa fa-bicycle', 'fa fa-paper-plane-o', 'fa fa-cube'
    ];

    for (let i = 0; i < iconClassList.length; i++) {
        let list = document.createElement('li');
        list.className = 'card';

        let cardImage = document.createElement('i');
        cardImage.className = iconClassList[i];

        list.appendChild(cardImage);
        list.addEventListener('click', displayCard);
        list.addEventListener('click', openCard);
        list.addEventListener('click', congratulations);

        deck.appendChild(list);
    }

    card = document.getElementsByClassName('card');
    cards = [...card];

    close.addEventListener('click', closeModal);
    playAgain.addEventListener('click', addPlayAgainListener);
    restart.addEventListener('click', startGame);
    startGame();
}

/* Run the function when page is refreshed or loaded */
document.addEventListener('DOMContentLoaded', function(){
    createCardDeck();
});

})();

