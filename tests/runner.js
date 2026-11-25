import { tests as parserTests } from './unit/level-parser.test.js';
import { tests as stateTests } from './unit/state.test.js';

// When adding new test suites, simply import them and add them to the suites object below
const suites = {
	'Level Parser': parserTests,
	State: stateTests,
};

export function runTests() {
	const results = {
		totals: {
			passed: 0,
			failed: 0,
		},
		suites: {},
	};

	for (const [suiteName, tests] of Object.entries(suites)) {
		// Initialize suite-specific results
		results.suites[suiteName] = {
			totals: {
				passed: 0,
				failed: 0,
			},
			passedTests: [],
			failedTests: [],
		};

		const suiteResults = results.suites[suiteName];

		for (const test of tests) {
			// Execute test
			// Record suite-specific results
			// Update overall totals
			try {
				test.run();
				results.totals.passed++;
				suiteResults.totals.passed++;
				suiteResults.passedTests.push(test.name);
			} catch (error) {
				results.totals.failed++;
				suiteResults.totals.failed++;
				suiteResults.failedTests.push(`${test.name}: ${error.message}`);
			}
		}
	}

	return results;
}
