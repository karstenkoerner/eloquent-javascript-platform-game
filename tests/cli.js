import { runTests } from './runner.js';

const results = runTests();

for (const [suiteName, suiteResults] of Object.entries(results.suites)) {
	for (const test of suiteResults.failedTests) {
		console.error(`FAIL [${suiteName}]: ${test}`);
	}
}

console.log(`Tests: ${results.totals.passed} passed, ` + `${results.totals.failed} failed`);

if (results.totals.failed > 0) {
	process.exitCode = 1;
}
