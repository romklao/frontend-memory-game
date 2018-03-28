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

const moveCount = document.querySelector('.moves');
let deck = document.querySelector('.deck');
const stars = document.querySelectorAll('.fa-star');
const matchedCard = document.getElementsByClassName('match');
const close = document.querySelector('#close');
const overlay = document.querySelector('.overlay');
const restart = document.querySelector('.restart');
const playAgain = document.getElementById('play-again');
const timeRecord = document.querySelector('.time-record');
const timer = document.querySelector('.timer');

let moves = 0;
let min = 0, sec = 0, hr = 0;
let interval;
let openedCards = [];
let card,
    cards

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

function displayCard() {
    this.classList.add('open', 'show', 'disabled');
}

function disable() {
    cards.forEach(card => card.classList.add('disabled'));
}

function enable() {
    deck.childNodes.forEach(card => card.classList.remove('disabled'));
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
    overlay.classList.remove('show-modal');
    startGame();
}

function addPlayAgainListener() {
    overlay.classList.remove('show-modal');
    startGame();
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
}

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

document.addEventListener('DOMContentLoaded', function(){
    createCardDeck();
});

})();

