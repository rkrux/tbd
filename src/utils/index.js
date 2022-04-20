import { CONFIG } from '../constants';

function getRandomNumber(maxValue) {
	return Math.floor(Math.random() * maxValue);
}

function getSortOrder(currentSortOrder) {
	if (!currentSortOrder || currentSortOrder === CONFIG.SORT_ORDER.NONE) {
		return CONFIG.SORT_ORDER.ASCENDING;
	}
	if (currentSortOrder === CONFIG.SORT_ORDER.ASCENDING) {
		return CONFIG.SORT_ORDER.DESCENDING;
	}
	return CONFIG.SORT_ORDER.NONE;
}

function throttle(callbackFn, timeout, ...args) {
	let previousTimeout = 0;
	return () => {
		clearTimeout(previousTimeout);
		previousTimeout = setTimeout(() => callbackFn(...args), timeout);
	};
}

export { getRandomNumber, getSortOrder, throttle };
