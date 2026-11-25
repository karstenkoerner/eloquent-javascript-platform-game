import { runTests } from './runner.js';

// Create an HTML element with optional styling and text
function createElement(tag, className = '', text = '') {
	const element = document.createElement(tag);
	element.className = className;
	element.textContent = text;

	return element;
}

// Render overall test totals
function renderTotals(totals) {
	const container = createElement('div', 'totals_container');
	container.id = 'totals_container';

	container.append(
		createElement(
			'div',
			'totals_box total_tests_container',
			`Total tests: ${totals.passed + totals.failed}`,
		),
		createElement(
			'div',
			'totals_box total_passed_tests_container',
			`Passed tests: ${totals.passed}`,
		),
		createElement(
			'div',
			'totals_box total_failed_tests_container',
			`Failed tests: ${totals.failed}`,
		),
	);

	return container;
}

// Render a collection of individual test results
function renderTestList(tests, status) {
	const container = createElement('div', `${status}_tests_container`);

	for (const test of tests) {
		container.appendChild(createElement('div', `${status}_test_container`, test));
	}

	return container;
}

// Render an individual collapsible test suite
function renderSuite(name, results) {
	const { passed, failed } = results.totals;
	const total = passed + failed;
	const status = failed === 0 ? 'passed' : 'failed';

	const suite = createElement('details', `test_suite ${status}`);

	// Automatically expand suites containing failures
	suite.open = failed > 0;

	const summary = createElement(
		'summary',
		'suite_summary',
		`${name} — ${passed}/${total} passed`,
	);

	suite.append(
		summary,
		renderTestList(results.failedTests, 'failed'),
		renderTestList(results.passedTests, 'passed'),
	);

	return suite;
}

// Render all test results
function renderResults(results) {
	const resultsContainer = document.querySelector('#test_results');
	const suitesContainer = createElement('div', 'suites_container');

	for (const [name, suiteResults] of Object.entries(results.suites)) {
		suitesContainer.appendChild(renderSuite(name, suiteResults));
	}

	resultsContainer.replaceChildren(renderTotals(results.totals), suitesContainer);
}

// Run tests and refresh the dashboard
function updateResults() {
	renderResults(runTests());
}

// Initialize the UI
const root = document.querySelector('#root');

const heading = createElement('h1', '', 'Platform Game - Test Suite');

const resultsContainer = createElement('div', 'test_results');
resultsContainer.id = 'test_results';

const runButton = createElement('button', 'run_button', 'Run tests');
runButton.addEventListener('click', updateResults);

root.replaceChildren(heading, runButton, resultsContainer);

updateResults();
