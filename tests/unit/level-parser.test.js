import parseLevel from '../../src/model/level-parser.js';
import { assertDeepEqual, assertThrows } from '../assertions.js';
import { validLevels, invalidLevels } from '../fixtures/level-parser.fixtures.js';

export const tests = [
	// Valid level tests
	...Object.entries(validLevels).map(([name, fixture]) => ({
		name: `Correctly parses valid level: ${name}`,
		run: () => {
			assertDeepEqual(parseLevel(fixture.input, name), fixture.expected);
		},
	})),

	// Invalid level tests
	...Object.entries(invalidLevels).map(([name, fixture]) => ({
		name: `Rejects invalid level: ${name}`,
		run: () => {
			assertThrows(() => parseLevel(fixture.input, name), fixture.expectedPattern);
		},
	})),
];
