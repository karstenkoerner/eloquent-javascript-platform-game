import { runTests } from './runner.js';

const results = runTests();

for (const test of results.failedTests) {
	console.error(`FAIL: ${test}`);
}

console.log(`Tests: ${results.totals.passed} passed, ` + `${results.totals.failed} failed`);

if (results.totals.failed > 0) {
	process.exitCode = 1;
}
