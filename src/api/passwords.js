import { faker } from '@faker-js/faker';
import { getRandomNumber } from '../utils';
import { CONFIG } from '../constants';

function buildPasswords(count, query) {
	return Array(count)
		.fill(undefined)
		.map((_, index) => ({
			key: index,
			displayValue: faker.internet.password(12, false, undefined, query),
		}));
}

async function fetchPasswords(...args) {
	return new Promise((resolve, reject) => {
		const randomMs = getRandomNumber(CONFIG.API_MAX_LATENCY_MS);
		setTimeout(() => {
			// console.log('fetchPasswords, randomMs: ', randomMs, ...args);
			if (randomMs < CONFIG.API_SUCCESS_THRESHOLD_MS) {
				resolve(buildPasswords(...args));
			} else {
				reject(`Unable to fetch passwords from API, time: ${randomMs}ms`);
			}
		}, randomMs);
	});
}

export { fetchPasswords };
