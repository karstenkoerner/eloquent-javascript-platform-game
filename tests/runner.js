// Run tests and return the results to the dashboard
function runTests() {
	const results = {
		totals: {
			passed: 2,
			failed: 1,
		},
		failedTests: ['SyntaxError: Blah blah blah stubby example'],
	};

	return results;
}

export default runTests;
