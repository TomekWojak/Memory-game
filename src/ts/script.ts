import { pause } from "./helpers.js";
const TIME_TO_SHOW_CARDS = 1500;
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
	const startButton = document.querySelector<HTMLElement>(".start-game-btn");
	const cards = [...document.querySelectorAll<HTMLElement>(".card")];
	const positions = getCardsPositions();
	const choosenCards: HTMLElement[] = [];
	let lastClickedCard: HTMLElement;

	if (!startButton) return;
	startButton.addEventListener("click", () => {
		startGame(positions, cards);
	});
	cards.forEach((card) => {
		card.addEventListener("click", () => {
			if (card === lastClickedCard || choosenCards.length === 2) return;
			lastClickedCard = card;

			handleMatch(card, choosenCards);
		});
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
	cardsArr: HTMLElement[]
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
	for (let i = 1; i <= maxNumber; i++) {
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
	const cardMatchNumber = parseInt(card.dataset.match || "");

	if (!cardMatchNumber) return;

	showCardBack(card);

	choosenCards.push(card);

	if (choosenCards.length === 2) {
		if (choosenCards[0]?.dataset.match === choosenCards[1]?.dataset.match) {
			console.log("It's a match!");
			await pause(TIME_TO_SHOW_CARDS);
			hideMatchedCards(choosenCards);
		} else {
			await pause(TIME_TO_SHOW_CARDS);
			resetCards(choosenCards);
		}
		choosenCards.length = 0;
	}
};

const resetCards = (cards: HTMLElement[]) => {
	cards.forEach((card) => {
		card.classList.remove("animate-flip-card");
	});
};
const hideMatchedCards = (choosenCards: HTMLElement[]) => {
	choosenCards.forEach(async (card) => {
		card.classList.add("hide-matched-card");
		await pause(1000);
		card.remove();
	});
};
