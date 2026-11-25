import State from '../../src/model/state.js';
import { assertDeepEqual, assertThrows } from '../assertions.js';
import { initializationTests, snapshotTests } from '../fixtures/state.fixtures.js';

export const tests = [
	// Fixture-driven initialization tests
	...Object.entries(initializationTests).map(([name, fixture]) => ({
		name: `State.start() correctly builds initial state for level: ${name}`,
		run: () => {
			assertDeepEqual(State.start(fixture.input), fixture.expected);
		},
	})),

	// Fixture-driven snapshot preservation tests
	...Object.entries(snapshotTests).map(([name, fixture]) => ({
		name: `Constructs a new state without modifying the previous state: ${name}`,
		run: () => {
			const initialState = State.start(fixture.input);
			const next = fixture.updatedState(initialState);

			const updatedState = new State(
				next.level,
				next.player,
				next.coins,
				next.lava,
				next.status,
			);

			assertDeepEqual(initialState, fixture.expected);
			assertDeepEqual(updatedState, fixture.updatedExpected);
		},
	})),
];
