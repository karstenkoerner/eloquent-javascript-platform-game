// Normalize CRLF to LF, remove whitespace, and reject empty plans
function normalizeLevel(plan, levelName) {
	const result = plan.replace(/\r\n/g, '\n').split('\n');

	while (result[0]?.trim() === '') {
		result.shift();
	}

	while (result[result.length - 1]?.trim() === '') {
		result.pop();
	}

	if (result.length === 0) {
		throw new Error(`Level '${levelName}': Level plan cannot be empty.`);
	}

	return result.map((row) => row.trimStart());
}

//Validate the plan's structure and symbols
function validateLevelRows(normalizedLevel, levelName) {
	const width = normalizedLevel[0].length;

	for (let y = 0; y < normalizedLevel.length; y++) {
		const row = normalizedLevel[y];

		if (row.length === 0) throw new Error(`Level '${levelName}': Row ${y + 1} is empty.`);
		if (row.length !== width)
			throw new Error(
				`Level '${levelName}', row ${y + 1}: Level plan rows must be of consistent width.`,
			);

		for (let x = 0; x < row.length; x++) {
			const char = row[x];

			if (!/[.#+@o=|v]/.test(char)) {
				throw new Error(
					`Level '${levelName}', row ${y + 1}, column ${x + 1}: Invalid character '${char}'.`,
				);
			}
		}
	}
}

// Build the representation: width, height, rows, actors
function buildRepresentation(normalizedLevel) {
	const width = normalizedLevel[0].length;
	const height = normalizedLevel.length;
	const terrainRows = [];
	const actors = [];

	for (let y = 0; y < normalizedLevel.length; y++) {
		const row = normalizedLevel[y];
		const terrainRow = [];

		for (let x = 0; x < row.length; x++) {
			const char = row[x];

			// Differentiate static characters vs actor characters
			if (/[@o=|v]/.test(char)) {
				switch (char) {
					case '@':
						actors.push({
							type: 'player',
							x: x,
							y: y + 1 - 1.5,
							width: 0.8,
							height: 1.5,
							sourceRow: y + 1,
							sourceColumn: x + 1,
						});

						break;
					case 'o':
						actors.push({
							type: 'coin',
							x: x + 0.2,
							y: y + 0.1,
							width: 0.6,
							height: 0.6,
							sourceRow: y + 1,
							sourceColumn: x + 1,
						});

						break;
					case '=':
						actors.push({
							type: 'horizontal lava',
							x: x,
							y: y,
							width: 1,
							height: 1,
							sourceRow: y + 1,
							sourceColumn: x + 1,
						});

						break;
					case '|':
						actors.push({
							type: 'vertical lava',
							x: x,
							y: y,
							width: 1,
							height: 1,
							sourceRow: y + 1,
							sourceColumn: x + 1,
						});

						break;
					case 'v':
						actors.push({
							type: 'dripping lava',
							x: x,
							y: y,
							width: 1,
							height: 1,
							sourceRow: y + 1,
							sourceColumn: x + 1,
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

	return {
		width: width,
		height: height,
		rows: terrainRows,
		actors: actors,
	};
}

// Validate actor counts, positions, and overlaps/bounds
function validateActors(representation, levelName) {
	const actorCounts = {
		player: 0,
		coin: 0,
	};

	// Actor count validation
	for (const actor of representation.actors) {
		if (actor.type === 'player') {
			actorCounts.player++;
		}

		if (actor.type === 'coin') {
			actorCounts.coin++;
		}
	}

	if (actorCounts.player !== 1 || actorCounts.coin < 1) {
		throw new Error(
			`Level '${levelName}': There must be exactly one player and at least one coin.`,
		);
	}

	// Actor bounds validation
	for (const actor of representation.actors) {
		const left = Math.floor(actor.x);
		const right = Math.ceil(actor.x + actor.width) - 1;
		const top = Math.floor(actor.y);
		const bottom = Math.ceil(actor.y + actor.height) - 1;

		if (
			actor.x < 0 ||
			actor.y < 0 ||
			actor.x + actor.width > representation.width ||
			actor.y + actor.height > representation.height
		) {
			throw new Error(
				`Level '${levelName}', row ${actor.sourceRow}, column ${actor.sourceColumn}: Actor extends outside level bounds.`,
			);
		}

		for (let y = top; y <= bottom; y++) {
			for (let x = left; x <= right; x++) {
				if (representation.rows[y][x] !== '.') {
					throw new Error(
						`Level '${levelName}', row ${actor.sourceRow}, column ${actor.sourceColumn}: Actor overlaps forbidden terrain.`,
					);
				}
			}
		}
	}

	for (let i = 0; i < representation.actors.length; i++) {
		for (let j = i + 1; j < representation.actors.length; j++) {
			const a = representation.actors[i];
			const b = representation.actors[j];

			if (
				a.x < b.x + b.width &&
				a.x + a.width > b.x &&
				a.y < b.y + b.height &&
				a.y + a.height > b.y
			) {
				throw new Error(
					`Level '${levelName}': ${a.type} at row ${a.sourceRow}, column ${a.sourceColumn} overlaps with ${b.type} at row ${b.sourceRow}, column ${b.sourceColumn}.`,
				);
			}
		}
	}
}

// Main function to parse the level plan
export default function parseLevel(plan, levelName) {
	const rows = normalizeLevel(plan, levelName);

	validateLevelRows(rows, levelName);

	const representation = buildRepresentation(rows);

	validateActors(representation, levelName);

	for (const actor of representation.actors) {
		delete actor.sourceRow;
		delete actor.sourceColumn;
	}

	return representation;
}
