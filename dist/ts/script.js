import { pause } from "./helpers.js";
const getCardsPositions = () => {
    const cards = [...document.querySelectorAll(".card")].map((card) => {
        return {
            top: getComputedStyle(card).top,
            left: getComputedStyle(card).left,
        };
    });
    return cards;
};
document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.querySelector(".start-game-btn");
    const cards = [...document.querySelectorAll(".card")];
    const positions = getCardsPositions();
    if (!startButton)
        return;
    startButton.addEventListener("click", () => {
        startGame(positions, cards);
    });
});
const shuffleCards = (array) => {
    if (array.length === 0)
        return array;
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
const startGame = async (positions, cardsArr) => {
    const cards = cardsArr;
    assignNumbersToCards(cards);
    moveCardsToOneTarget(cards);
    await pause(2000);
    placeCardsOnBoard(cards, positions);
    await pause(1500);
    addAnimation(cards);
    await pause(1000);
    addAnimation(cards);
};
const moveCardsToOneTarget = (cards) => {
    cards.forEach((card) => {
        card.style.top = "285px";
        card.style.left = "225px";
    });
};
const placeCardsOnBoard = (cardsArr, positions) => {
    const shuffledCards = shuffleCards(positions);
    cardsArr.forEach((card, index) => {
        card.style.top = shuffledCards[index].top;
        card.style.left = shuffledCards[index].left;
    });
};
const setNumbersRange = (cardsArr) => {
    let numbers = [];
    let maxNumber = cardsArr.length / 2;
    for (let i = 1; i <= maxNumber; i++) {
        numbers.push(i);
    }
    return numbers;
};
const assignNumbersToCards = (cardsArr) => {
    const numbers = setNumbersRange(cardsArr);
    let index = 0;
    cardsArr.forEach((card) => {
        card.dataset.match = String(numbers[index]);
        index++;
        if (index >= numbers.length) {
            index = 0;
        }
    });
};
const addAnimation = (cardsArr) => {
    cardsArr.forEach((card) => {
        card.classList.toggle("animate-(--zoom)");
    });
};
