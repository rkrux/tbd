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

export { getRandomNumber, getSortOrder };
