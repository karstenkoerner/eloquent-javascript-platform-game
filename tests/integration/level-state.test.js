import parseLevel from '../../src/model/level-parser.js';
import State from '../../src/model/state.js';
import { assertDeepEqual } from '../assertions.js';
import { integrationTests } from '../fixtures/level-state.fixtures.js';

export const tests = [
	...Object.entries(integrationTests).map(([name, fixture]) => ({
		name: `Level parser and state class integrate correctly: ${name}`,
		run: () => {
			const level = parseLevel(fixture.input);
			const state = State.start(level);

			assertDeepEqual(state, fixture.expected);
		},
	})),
];
