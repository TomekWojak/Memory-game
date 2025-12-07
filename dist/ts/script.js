import { pause } from "./helpers.js";
import { categories } from "./categories.js";
const TIME_TO_SHOW_CARDS = 500;
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
    const choosenCards = [];
    if (!startButton)
        return;
    startButton.addEventListener("click", () => {
        startButton.disabled = true;
        startGame(positions, cards);
    });
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (choosenCards.includes(card) || choosenCards.length === 2)
                return;
            handleMatch(card, choosenCards);
        });
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
    moveCardsToOneTarget(cards);
    await pause(2000);
    placeCardsOnBoard(cards, positions);
    await pause(1500);
    addAnimation(cards);
    await pause(1000);
    addAnimation(cards);
    assignNumbersToCards(cards);
    giveCardsImages(cards);
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
    for (let i = 0; i < maxNumber; i++) {
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
const showCardBack = (card) => {
    card.classList.add("animate-flip-card");
};
const handleMatch = async (card, choosenCards) => {
    const cardMatchNumber = parseInt(card.dataset.match || "");
    if (card.dataset.match == null)
        return;
    showCardBack(card);
    choosenCards.push(card);
    if (choosenCards.length === 2) {
        if (choosenCards[0]?.dataset.match === choosenCards[1]?.dataset.match) {
            await pause(TIME_TO_SHOW_CARDS);
            removeCardsAnimation(choosenCards);
            await hideMatchedCards(choosenCards);
        }
        else {
            await pause(TIME_TO_SHOW_CARDS);
            resetCards(choosenCards);
        }
        checkIfGameOver();
        choosenCards.length = 0;
    }
};
const resetCards = (cards) => {
    cards.forEach((card) => {
        card.classList.remove("animate-flip-card");
    });
};
const hideMatchedCards = async (choosenCards) => {
    for (const card of choosenCards) {
        await pause(500);
        card.remove();
    }
};
const removeCardsAnimation = (choosenCards) => {
    choosenCards.forEach((card) => {
        card.classList.add("hide-matched-card");
    });
};
const checkIfGameOver = () => {
    const remainingCards = document.querySelectorAll(".card");
    if (remainingCards.length === 0) {
        console.log("Game Over! All cards matched.");
    }
};
const giveCardsImages = (cardsArr, category = "animals") => {
    cardsArr.forEach((card) => {
        const matchNumber = parseInt(card.dataset.match || "0");
        const img = card.querySelector("img");
        if (!img)
            return;
        img.src = categories[category]?.[matchNumber] ?? "";
    });
};
