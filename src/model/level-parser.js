// 1. Normalize CRLF to LF and remove outer empty lines. DONE
// 2. Validate the plan's structure and symbols.
// 3. Build the representation:
//    width, height, rows, actors.
// 4. Validate actor counts, positions, and overlaps.
// 5. Return the validated representation.

export default function parseLevel(plan) {
	const rows = plan.replace(/\r\n/g, '\n').split('\n');

	// Remove empty rows from beginning and end of plan
	while (rows[0]?.trim() === '') {
		rows.shift();
	}

	while (rows[rows.length - 1]?.trim() === '') {
		rows.pop();
	}

	if (rows.length === 0) {
		throw new Error('Level plan cannot be empty.');
	}

	const width = rows[0].trimStart().length;
	const height = rows.length;
	const terrainRows = [];
	const actors = [];

	// Iterate over each row in the plan
	for (let y = 0; y < rows.length; y++) {
		const row = rows[y].trimStart();
		const terrainRow = [];

		if (row.length !== width) throw new Error('Level plan rows must be of consistent width.');

		// Iterate over each character in the current row
		for (let x = 0; x < row.length; x++) {
			const char = row[x];

			if (!/[.#+@o=|v]/.test(char)) {
				throw new Error(`Row number ${y + 1} contains invalid characters.`);
			}

			// Differentiate static characters vs actor characters
			if (/[@o=|v]/.test(char)) {
				switch (char) {
					case '@':
						actors.push({
							type: 'player',
							x: x + (1 - 0.8) / 2,
							y: y + 1 - 1.5,
							width: 0.8,
							height: 1.5,
						});

						break;
					case 'o':
						actors.push({
							type: 'coin',
							x: x + (1 - 0.6) / 2,
							y: y + (1 - 0.6) / 2,
							width: 0.6,
							height: 0.6,
						});

						break;
					case '=':
						actors.push({
							type: 'horizontal lava',
							x: x,
							y: y,
							width: 1,
							height: 1,
						});

						break;
					case '|':
						actors.push({
							type: 'vertical lava',
							x: x,
							y: y,
							width: 1,
							height: 1,
						});

						break;
					case 'v':
						actors.push({
							type: 'dripping lava',
							x: x,
							y: y,
							width: 1,
							height: 1,
						});

						break;
				}

				terrainRow.push('.');
			} else {
				terrainRow.push(char);
			}
		}

		terrainRows.push(terrainRow);
	}

	const actorCounts = {
		player: 0,
		coin: 0,
	};

	// Actor count validation
	for (const actor of actors) {
		if (actor.type === 'player') {
			actorCounts.player++;
		}

		if (actor.type === 'coin') {
			actorCounts.coin++;
		}
	}

	if (actorCounts.player !== 1 || actorCounts.coin < 1) {
		throw new Error('There must be exactly one player and at least one coin.');
	}

	// Actor bounds validation
	for (const actor of actors) {
		const left = Math.floor(actor.x);
		const right = Math.ceil(actor.x + actor.width) - 1;
		const top = Math.floor(actor.y);
		const bottom = Math.ceil(actor.y + actor.height) - 1;

		if (
			actor.x < 0 ||
			actor.y < 0 ||
			actor.x + actor.width > width ||
			actor.y + actor.height > height
		) {
			throw new Error('Actor extends outside level bounds.');
		}

		for (let y = top; y <= bottom; y++) {
			for (let x = left; x <= right; x++) {
				if (terrainRows[y][x] !== '.') {
					throw new Error('Actor overlaps forbidden terrain.');
				}
			}
		}
	}

	for (let i = 0; i < actors.length; i++) {
		for (let j = i + 1; j < actors.length; j++) {
			const a = actors[i];
			const b = actors[j];

			if (
				a.x < b.x + b.width &&
				a.x + a.width > b.x &&
				a.y < b.y + b.height &&
				a.y + a.height > b.y
			) {
				throw new Error('Actor overlaps with another actor.');
			}
		}
	}

	return {
		width: width,
		height: height,
		rows: terrainRows,
		actors: actors,
	};
}
