interface CardPosition {
	top: string;
	left: string;
}
const cards = [...document.querySelectorAll<HTMLElement>(".card")].map(
	(card) => {
		return {
			top: getComputedStyle(card).top,
			left: getComputedStyle(card).left,
		};
	}
);

document.addEventListener("DOMContentLoaded", function () {
	const startButton = document.querySelector<HTMLElement>(".start-game-button");

	if (!startButton) return;
	startButton.addEventListener("click", () => {
		startGame();
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

const startGame = () => {
	const overlay = document.querySelector<HTMLElement>(".start-game");
	const cards = [...document.querySelectorAll<HTMLElement>(".card")];

	if (!overlay) return;
	overlay.style.display = "none";

	assignNumbersToCards(cards);
	moveCardsToOneTarget(cards);

	setTimeout(() => {
		placeCardsOnBoard(cards);
	}, 2000);
};

const moveCardsToOneTarget = (cards: HTMLElement[]) => {
	cards.forEach((card) => {
		card.style.top = "285px";
		card.style.left = "225px";
	});
};
const placeCardsOnBoard = (cardsArr: HTMLElement[]) => {
	const shuffledCards = shuffleCards(cards);
	cardsArr.forEach((card, index) => {
		card.style.top = shuffledCards[index]!.top;
		card.style.left = shuffledCards[index]!.left;
	});
};
const setNumbersRange = () => {
	let numbers: number[] = [];

	const cards = [...document.querySelectorAll<HTMLElement>(".card")];
	let maxNumber = cards.length / 2;
	for (let i = 1; i <= maxNumber; i++) {
		numbers.push(i);
	}
	return numbers;
};
const assignNumbersToCards = (cardsArr: HTMLElement[]) => {
	const numbers = setNumbersRange();
	let index = 0;

	cardsArr.forEach((card) => {
		card.dataset.match = String(numbers[index]);
		index++;

		if (index >= numbers.length) {
			index = 0;
		}
	});
};
