function assertEqual(actual, expected) {
	if (actual !== expected) {
		throw new Error(`Expected ${expected}, but received ${actual}`);
	}
}

// Run tests and return the results to the dashboard
function runTests() {
	const tests = [
		{
			name: 'Example passing test',
			run: () => {
				assertEqual(2 + 2, 4);
			},
		},
		{
			name: 'Multiplication assertion succeeds',
			run: () => {
				assertEqual(10 * 2, 20);
			},
		},
	];

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
