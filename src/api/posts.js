import { faker } from '@faker-js/faker';
import { getRandomNumber } from '../utils';
import { CONFIG } from '../constants';

const DAY_IN_MS = 86400 * 1000;

function buildPosts(count, toDate = Date.now()) {
	let fromDate = toDate - DAY_IN_MS;
	const posts = Array(count)
		.fill(undefined)
		.map((_) => {
			toDate = fromDate;
			fromDate = toDate - DAY_IN_MS;
			return {
				id: faker.datatype.uuid(),
				name: `${faker.name.firstName()} ${faker.name.lastName()}`,
				content: faker.lorem.sentence(15),
				time: faker.date.between(fromDate, toDate),
			};
		});

	return {
		posts,
		toDate: fromDate,
	};
}

async function fetchPosts(...args) {
	console.log('fetchPosts');
	return new Promise((resolve, reject) => {
		const randomMs = getRandomNumber(CONFIG.API_MAX_LATENCY_MS);
		setTimeout(() => {
			if (randomMs < CONFIG.API_SUCCESS_THRESHOLD_MS) {
				resolve(buildPosts(...args));
			} else {
				reject(`Unable to fetch people from API, time: ${randomMs}ms`);
			}
		}, randomMs);
	});
}

export { fetchPosts };
