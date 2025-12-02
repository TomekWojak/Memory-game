import { pause } from "./helpers.js";
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

	if (!startButton) return;
	startButton.addEventListener("click", () => {
		startGame(positions, cards);
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

	assignNumbersToCards(cards);
	moveCardsToOneTarget(cards);

	await pause(2000);
	placeCardsOnBoard(cards, positions);

	await pause(1500);
	addAnimation(cards);

	await pause(1000);
	addAnimation(cards);
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
