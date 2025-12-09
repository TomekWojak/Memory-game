import { pause } from "./helpers.js";
import { categories } from "./categories.js";

const TIME_TO_SHOW_CARDS = 500;
let timerInterval: number;
const selectedCategory =
	document.querySelector<HTMLElement>(".selected-category");
interface CardPosition {
	top: string;
	left: string;
}

const getCardsPositions = (): CardPosition[] => {
	const cards = [...document.querySelectorAll<HTMLElement>(".card")].map(
		(card) => {
			return {
				top: getComputedStyle(card).top,
				left: getComputedStyle(card).left,
			};
		}
	);
	return cards;
};

document.addEventListener("DOMContentLoaded", function (): void {
	const startButton =
		document.querySelector<HTMLButtonElement>(".start-game-btn");
	const categoryBox = document.querySelector<HTMLElement>(".category-box");
	const cards = [...document.querySelectorAll<HTMLElement>(".card")];
	const time = document.querySelector<HTMLElement>(".time");
	const positions = getCardsPositions();
	const choosenCards: HTMLElement[] = [];

	if (!startButton || !time || !categoryBox) return;

	startButton.addEventListener("click", () => {
		startButton.disabled = true;
		startGame(positions, cards, time);
	});
	cards.forEach((card) => {
		card.addEventListener("click", () => {
			if (choosenCards.includes(card) || choosenCards.length === 2) return;
			handleMatch(card, choosenCards);
		});
	});
	categoryBox.addEventListener("click", (e: MouseEvent) => {
		if (!(e.target instanceof HTMLElement)) return;

		if (e.target.matches(".category-select")) {
			showCategories();
		} else if (e.target.matches("li[role='option']")) {
			changeCategory(e, cards);
		}
	});
});

const shuffleCards = (array: CardPosition[]) => {
	if (array.length === 0) return array;

	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i]!, array[j]!] = [array[j]!, array[i]!];
	}
	return array;
};

const startGame = async (
	positions: CardPosition[],
	cardsArr: HTMLElement[],
	time: HTMLElement
) => {
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

const moveCardsToOneTarget = (cards: HTMLElement[]) => {
	cards.forEach((card) => {
		card.style.top = "285px";
		card.style.left = "225px";
	});
};
const placeCardsOnBoard = (
	cardsArr: HTMLElement[],
	positions: CardPosition[]
) => {
	const shuffledCards = shuffleCards(positions);
	cardsArr.forEach((card, index) => {
		card.style.top = shuffledCards[index]!.top;
		card.style.left = shuffledCards[index]!.left;
	});
};
const setNumbersRange = (cardsArr: HTMLElement[]) => {
	let numbers: number[] = [];

	let maxNumber = cardsArr.length / 2;
	for (let i = 0; i < maxNumber; i++) {
		numbers.push(i);
	}
	return numbers;
};
const assignNumbersToCards = (cardsArr: HTMLElement[]) => {
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
const addAnimation = (cardsArr: HTMLElement[]) => {
	cardsArr.forEach((card) => {
		card.classList.toggle("animate-(--zoom)");
	});
};

const showCardBack = (card: HTMLElement) => {
	card.classList.add("animate-flip-card");
};

const handleMatch = async (card: HTMLElement, choosenCards: HTMLElement[]) => {
	if (card.dataset.match == null) return;

	showCardBack(card);

	choosenCards.push(card);

	if (choosenCards.length === 2) {
		if (choosenCards[0]?.dataset.match === choosenCards[1]?.dataset.match) {
			await pause(TIME_TO_SHOW_CARDS);
			removeCardsAnimation(choosenCards);
			await hideMatchedCards(choosenCards);
		} else {
			await pause(TIME_TO_SHOW_CARDS);
			resetCards(choosenCards);
		}
		checkIfGameOver();
		choosenCards.length = 0;
	}
};

const resetCards = (cards: HTMLElement[]) => {
	cards.forEach((card) => {
		card.classList.remove("animate-flip-card");
	});
};
const hideMatchedCards = async (choosenCards: HTMLElement[]) => {
	for (const card of choosenCards) {
		await pause(500);
		card.remove();
	}
};
const removeCardsAnimation = (choosenCards: HTMLElement[]) => {
	choosenCards.forEach((card) => {
		card.classList.add("hide-matched-card");
	});
};

const checkIfGameOver = () => {
	const remainingCards = document.querySelectorAll<HTMLElement>(".card");
	if (remainingCards.length === 0) {
		console.log("Game Over! All cards matched.");
	}
};

const giveCardsImages = (cardsArr: HTMLElement[], category: string) => {
	cardsArr.forEach((card) => {
		const matchNumber = parseInt(card.dataset.match || "0");
		const img = card.querySelector<HTMLImageElement>("img");
		if (!img || !selectedCategory) return;

		if (selectedCategory.textContent === "Select category") {
			img.src = categories["animals"]?.[matchNumber] ?? "";

			return;
		}

		img.src = categories[category.toLowerCase()]?.[matchNumber] ?? "";
	});
};

const countUpTimer = (time: HTMLElement) => {
	let secondsCount = 0;
	let minutesCount = 0;
	const minutes = time.querySelector<HTMLElement>(".minutes");
	const seconds = time.querySelector<HTMLElement>(".seconds");

	if (!minutes || !seconds) return;

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

const changeCategory = (e: MouseEvent, cards: HTMLElement[]) => {
	const category = (e.target as HTMLElement).textContent;
	selectedCategory!.textContent = category || "Selected category";
	showCategories();
	giveCardsImages(cards, category);
};
const showCategories = () => {
	const categoryBox = document.querySelector<HTMLElement>(".category-box");
	if (!categoryBox) return;
	categoryBox.classList.toggle("select-visible");
};
