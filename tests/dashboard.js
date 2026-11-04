import runTests from './runner.js';

// Render the test results on the webpage UI
function renderResults(results) {
	const resultsContainer = document.querySelector('#test_results');

	// The test result totals container, which contains the 3 totals_box divs
	const totalsContainer = document.createElement('div');
	totalsContainer.id = 'totals_container';
	totalsContainer.className = 'totals_container';

	// Total tests container
	const totalTestsContainer = document.createElement('div');
	totalTestsContainer.className = 'totals_box total_tests_container';
	totalTestsContainer.textContent =
		'Total tests: ' + (results.totals.passed + results.totals.failed);

	// Passed tests container
	const totalPassedTestsContainer = document.createElement('div');
	totalPassedTestsContainer.className = 'totals_box total_passed_tests_container';
	totalPassedTestsContainer.textContent = 'Passed tests: ' + results.totals.passed;

	// Failed tests container
	const totalFailedTestsContainer = document.createElement('div');
	totalFailedTestsContainer.className = 'totals_box total_failed_tests_container';
	totalFailedTestsContainer.textContent = 'Failed tests: ' + results.totals.failed;

	totalsContainer.append(
		totalTestsContainer,
		totalPassedTestsContainer,
		totalFailedTestsContainer,
	);

	// Container for specific details for failed tests, the error messages for each failed test gets listed in this div
	const failedTestsContainer = document.createElement('div');
	failedTestsContainer.id = 'failed_tests_container';
	failedTestsContainer.className = 'failed_tests_container';

	// Listing all failed tests in the failed tests container
	results.failedTests.forEach((failedTest) => {
		const failedTestContainer = document.createElement('div');
		failedTestContainer.className = 'failed_test_container';
		failedTestContainer.textContent = failedTest;

		failedTestsContainer.appendChild(failedTestContainer);
	});

	// Update results container
	resultsContainer.replaceChildren(totalsContainer, failedTestsContainer);
}

function updateResults() {
	const results = runTests();
	renderResults(results);
}

// Initialize the UI
const root = document.querySelector('#root');

const heading = document.createElement('h1');
heading.textContent = 'Platform Game - Test Suite';

const resultsContainer = document.createElement('div');
resultsContainer.id = 'test_results';
resultsContainer.className = 'test_results';

const runButton = document.createElement('button');
runButton.className = 'run_button';
runButton.textContent = 'Run tests';
runButton.addEventListener('click', updateResults);

// Replace the static fallback once the UI is constructed
root.replaceChildren(heading, runButton, resultsContainer);

updateResults();
