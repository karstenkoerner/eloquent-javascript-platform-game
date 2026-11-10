import { tests } from './unit/level-parser.test.js';

// Run tests and return the results to the dashboard
function runTests() {
	const results = {
		totals: {
			passed: 0,
			failed: 0,
		},
		failedTests: [],
		passedTests: [],
	};

	for (const test of tests) {
		try {
			test.run();
			results.totals.passed++;
			results.passedTests.push(test.name);
		} catch (error) {
			results.totals.failed++;
			results.failedTests.push(`${test.name}: ${error.message}`);
		}
	}

	return results;
}

export default runTests;
