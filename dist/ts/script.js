import { pause } from "./helpers.js";
import { categories } from "./categories.js";
const TIME_TO_SHOW_CARDS = 500;
let timerInterval;
const selectedCategory = document.querySelector(".selected-category");
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
    const categoryBox = document.querySelector(".category-box");
    const cards = [...document.querySelectorAll(".card")];
    const time = document.querySelector(".time");
    const positions = getCardsPositions();
    const choosenCards = [];
    if (!startButton || !time || !categoryBox)
        return;
    startButton.addEventListener("click", () => {
        startButton.disabled = true;
        startGame(positions, cards, time);
    });
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (choosenCards.includes(card) || choosenCards.length === 2)
                return;
            handleMatch(card, choosenCards);
        });
    });
    categoryBox.addEventListener("click", (e) => {
        if (!(e.target instanceof HTMLElement))
            return;
        if (e.target.matches(".category-select")) {
            showCategories();
        }
        else if (e.target.matches("li[role='option']")) {
            changeCategory(e, cards);
        }
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
const startGame = async (positions, cardsArr, time) => {
    const cards = cardsArr;
    moveCardsToOneTarget(cards);
    await pause(2000);
    placeCardsOnBoard(cards, positions);
    await pause(1500);
    addAnimation(cards);
    await pause(1000);
    addAnimation(cards);
    assignNumbersToCards(cards);
    giveCardsImages(cards, selectedCategory?.textContent || "animals");
    countUpTimer(time);
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
const giveCardsImages = (cardsArr, category) => {
    cardsArr.forEach((card) => {
        const matchNumber = parseInt(card.dataset.match || "0");
        const img = card.querySelector("img");
        if (!img || !selectedCategory)
            return;
        if (selectedCategory.textContent === "Select category") {
            img.src = categories["animals"]?.[matchNumber] ?? "";
            return;
        }
        img.src = categories[category.toLowerCase()]?.[matchNumber] ?? "";
    });
};
const countUpTimer = (time) => {
    let secondsCount = 0;
    let minutesCount = 0;
    const minutes = time.querySelector(".minutes");
    const seconds = time.querySelector(".seconds");
    if (!minutes || !seconds)
        return;
    timerInterval = setInterval(() => {
        secondsCount++;
        if (secondsCount === 60) {
            minutesCount++;
            secondsCount = 0;
        }
        seconds.textContent = String(secondsCount).padStart(2, "0");
        minutes.textContent = String(minutesCount).padStart(2, "0");
    }, 1000);
};
const changeCategory = (e, cards) => {
    const category = e.target.textContent;
    selectedCategory.textContent = category || "Selected category";
    showCategories();
    giveCardsImages(cards, category);
};
const showCategories = () => {
    const categoryBox = document.querySelector(".category-box");
    if (!categoryBox)
        return;
    categoryBox.classList.toggle("select-visible");
};
