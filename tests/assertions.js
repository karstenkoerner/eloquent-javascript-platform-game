export function assertEqual(actual, expected) {
	if (actual !== expected) {
		throw new Error(`Expected ${expected}, but received ${actual}`);
	}
}

function deepEqual(actual, expected) {
	// Base case: identical values
	if (Object.is(actual, expected)) return true;

	// Both must be non-null objects
	if (
		actual === null ||
		expected === null ||
		typeof actual !== 'object' ||
		typeof expected !== 'object'
	) {
		return false;
	}

	// Arrays must be compared with arrays
	if (Array.isArray(actual) !== Array.isArray(expected)) {
		return false;
	}

	const keysA = Object.keys(actual);
	const keysB = Object.keys(expected);

	// Different numbers of properties
	if (keysA.length !== keysB.length) {
		return false;
	}

	for (const key of keysA) {
		// Verify the property exists in both objects
		if (!Object.hasOwn(expected, key)) {
			return false;
		}

		// Recursively compare the property values
		if (!deepEqual(actual[key], expected[key])) {
			return false;
		}
	}

	return true;
}

export function assertDeepEqual(actual, expected) {
	if (!deepEqual(actual, expected)) {
		throw new Error(
			`Expected ${JSON.stringify(expected)}, ` + `but received ${JSON.stringify(actual)}`,
		);
	}
}

export function assertThrows(fn, expectedPattern) {
	try {
		fn();
	} catch (error) {
		if (expectedPattern && !expectedPattern.test(error.message)) {
			throw new Error(
				`Expected error matching ${expectedPattern}, but received: ${error.message}`,
				{ cause: error },
			);
		}
		return;
	}

	throw new Error('Expected function to throw an error.');
}
