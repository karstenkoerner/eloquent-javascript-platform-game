function parseLevel(plan) {
	// 1. Normalize CRLF to LF and remove outer empty lines. DONE
	// 2. Validate the plan's structure and symbols.
	// 3. Build the representation:
	//    width, height, rows, actors.
	// 4. Validate actor counts, positions, and overlaps.
	// 5. Return the validated representation.

	const rows = plan.replace(/\r\n/g, '\n').split('\n');

	// Remove empty rows from beginning and end of plan
	while (rows[0]?.trim() === '') {
		rows.shift();
	}

	while (rows[rows.length - 1]?.trim() === '') {
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
						actors.push({
							type: 'player',
							x: x,
							y: y,
						});

						break;
					case 'o':
						actors.push({
							type: 'coin',
							x: x,
							y: y,
						});

						break;
					case '=':
						actors.push({
							type: 'horizontal lava',
							x: x,
							y: y,
						});

						break;
					case '|':
						actors.push({
							type: 'vertical lava',
							x: x,
							y: y,
						});

						break;
					case 'v':
						actors.push({
							type: 'dripping lava',
							x: x,
							y: y,
						});

						break;
				}

				terrainRow.push('.');
			} else {
				// Char is static
				terrainRow.push(char);
			}

			// Actor validation
			// 1: Actor counts (verify theres exactly one player and at least one coin).
			// 2: Bounds (verify that each actor's entire bounding rectangle fits inside the level).
			// 3: Overlaps (verify that actor rectangles don't intersect forbidden terrain or other rectangles).
		}

		terrainRows.push(terrainRow);
	}
}
