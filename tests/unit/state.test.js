import State from '../../src/model/state.js';
import { assertDeepEqual, assertThrows, assertEqual } from '../assertions.js';
import {
	initializationTests,
	snapshotTests,
	attemptIndependenceTests,
} from '../fixtures/state.fixtures.js';

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

	// Fixture-driven attempt independence tests
	...Object.entries(attemptIndependenceTests).map(([name, fixture]) => ({
		name: `New attempts are independent from prior attempts: ${name}`,
		run: () => {
			const attempt1 = State.start(fixture.input);
			const attempt2 = State.start(fixture.input);

			assertEqual(attempt1 === attempt2, false);
			assertEqual(attempt1.player === attempt2.player, false);
			assertEqual(attempt1.coins === attempt2.coins, false);
			assertEqual(attempt1.lava === attempt2.lava, false);

			for (let i = 0; i < attempt1.coins.length; i++) {
				assertEqual(attempt1.coins[i] === attempt2.coins[i], false);
			}

			for (let i = 0; i < attempt1.lava.length; i++) {
				assertEqual(attempt1.lava[i] === attempt2.lava[i], false);
			}

			fixture.modifyAttempt(attempt1);

			assertDeepEqual(attempt2, fixture.expected);
			assertDeepEqual(fixture.input, fixture.expected.level);
		},
	})),
];
