import { faker } from '@faker-js/faker';
import { getRandomNumber } from '../utils';
import { CONFIG } from '../constants';

const PEOPLE_ATTRIBUTES = [
	'id',
	'name',
	'gender',
	'phone',
	'company',
	'jobTitle',
	'jobArea',
	'vehicle',
	'addressLine1',
	'addressLine2',
];

function buildPeople(count) {
	return Array(count)
		.fill(undefined)
		.map((_) => {
			const fakeName = faker.name;
			const fakeAddress = faker.address;
			return {
				id: faker.datatype.uuid(),
				name: `${fakeName.firstName()} ${fakeName.lastName()}`,
				gender: fakeName.gender(true),
				phone: faker.phone.phoneNumber('+## ## ### ## ###'),
				company: faker.company.companyName(),
				jobTitle: fakeName.jobTitle(),
				jobArea: fakeName.jobArea(),
				vehicle: faker.vehicle.vehicle(),
				addressLine1: `${fakeAddress.streetAddress()}, ${fakeAddress.streetName()}`,
				addressLine2: `${fakeAddress.cityName()}, ${fakeAddress.state()}, ${fakeAddress.country()}`,
			};
		});
}

async function fetchPeople(count) {
	return new Promise((resolve, reject) => {
		const randomMs = getRandomNumber(CONFIG.API_MAX_LATENCY_MS);
		setTimeout(() => {
			if (randomMs < CONFIG.API_SUCCESS_THRESHOLD_MS) {
				resolve(buildPeople(count));
			} else {
				reject(`Unable to fetch people from API, time: ${randomMs}ms`);
			}
		}, randomMs);
	});
}

export { fetchPeople, PEOPLE_ATTRIBUTES };
