function parseLevel(plan) {
	// 1. Normalize CRLF to LF and remove outer empty lines. DONE
	// 2. Validate the plan's structure and symbols.
	// 3. Build the representation:
	//    width, height, rows, actors.
	// 4. Validate actor counts, positions, and overlaps.
	// 5. Return the validated representation.

	const rows = plan.replace(/\r\n/g, '\n').split('\n');

	// Remove empty rows from beginning and end of plan
	while (rows[0] === '') {
		rows.shift();
	}

	while (rows[rows.length - 1] === '') {
		rows.pop();
	}

	// Reject empty plan
	if (rows.length === 0) {
		throw new Error('Level plan cannot be empty.');
	}

	const width = rows[0].length;
	const height = rows.length;
	const terrainRows = [];
	const actors = [];

	// Iterate over each row in the plan
	for (let y = 0; y < rows.length; y++) {
		const row = rows[y];
		const terrainRow = [];

		if (row.length !== width) throw new Error('Level plan rows must be of consistent width.');

		// Iterate over each character in the current row
		for (let x = 0; x < row.length; x++) {
			const char = row[x];

			if (!/[.#+@o=|v]/.test(char)) {
				throw new Error(`Row number ${y + 1} contains invalid characters.`);
			}

			if (/[@o=|v]/.test(char)) {
				// Char is an actor
				switch (char) {
					case '@':
						// Player
						break;
					case 'o':
						// Coin
						break;
					case '=':
						// Horizontal lava
						break;
					case '|':
						// Vertical lava
						break;
					case 'v':
						// Dripping lava
						break;
				}

				terrainRow.push('.');
			} else {
				// Char is static
				terrainRow.push(char);
			}
		}

		terrainRows.push(terrainRow);
	}
}
