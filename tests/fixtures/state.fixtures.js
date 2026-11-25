// Fixture-driven initialization tests
export const initializationTests = {
	basic_level: {
		input: {
			width: 5,
			height: 4,
			rows: ['#####', '#...#', '#...#', '#####'],
			actors: [
				{
					type: 'player',
					x: 1,
					y: 1.5,
					width: 0.8,
					height: 1.5,
				},
				{
					type: 'coin',
					x: 3.2,
					y: 2.1,
					width: 0.6,
					height: 0.6,
				},
			],
		},
		expected: {
			level: {
				width: 5,
				height: 4,
				rows: ['#####', '#...#', '#...#', '#####'],
				actors: [
					{
						type: 'player',
						x: 1,
						y: 1.5,
						width: 0.8,
						height: 1.5,
					},
					{
						type: 'coin',
						x: 3.2,
						y: 2.1,
						width: 0.6,
						height: 0.6,
					},
				],
			},
			player: {
				type: 'player',
				x: 1,
				y: 1.5,
				width: 0.8,
				height: 1.5,
				vx: 0,
				vy: 0,
			},
			coins: [
				{
					type: 'coin',
					x: 3.2,
					y: 2.1,
					width: 0.6,
					height: 0.6,
				},
			],
			lava: [],
			status: 'playing',
		},
	},
	lava_level: {
		input: {
			width: 9,
			height: 5,
			rows: ['#########', '#.......#', '#.......#', '#.......#', '#########'],
			actors: [
				{
					type: 'player',
					x: 1,
					y: 2.5,
					width: 0.8,
					height: 1.5,
				},
				{
					type: 'coin',
					x: 2.2,
					y: 3.1,
					width: 0.6,
					height: 0.6,
				},
				{
					type: 'horizontal lava',
					x: 4,
					y: 3,
					width: 1,
					height: 1,
				},
				{
					type: 'vertical lava',
					x: 6,
					y: 2,
					width: 1,
					height: 1,
				},
				{
					type: 'dripping lava',
					x: 7,
					y: 1,
					width: 1,
					height: 1,
				},
			],
		},
		expected: {
			level: {
				width: 9,
				height: 5,
				rows: ['#########', '#.......#', '#.......#', '#.......#', '#########'],
				actors: [
					{
						type: 'player',
						x: 1,
						y: 2.5,
						width: 0.8,
						height: 1.5,
					},
					{
						type: 'coin',
						x: 2.2,
						y: 3.1,
						width: 0.6,
						height: 0.6,
					},
					{
						type: 'horizontal lava',
						x: 4,
						y: 3,
						width: 1,
						height: 1,
					},
					{
						type: 'vertical lava',
						x: 6,
						y: 2,
						width: 1,
						height: 1,
					},
					{
						type: 'dripping lava',
						x: 7,
						y: 1,
						width: 1,
						height: 1,
					},
				],
			},
			player: {
				type: 'player',
				x: 1,
				y: 2.5,
				width: 0.8,
				height: 1.5,
				vx: 0,
				vy: 0,
			},
			coins: [
				{
					type: 'coin',
					x: 2.2,
					y: 3.1,
					width: 0.6,
					height: 0.6,
				},
			],
			lava: [
				{
					type: 'horizontal lava',
					x: 4,
					y: 3,
					width: 1,
					height: 1,
					vx: 2,
					vy: 0,
				},
				{
					type: 'vertical lava',
					x: 6,
					y: 2,
					width: 1,
					height: 1,
					vx: 0,
					vy: 2,
				},
				{
					type: 'dripping lava',
					x: 7,
					y: 1,
					width: 1,
					height: 1,
					vx: 0,
					vy: 3,
					originX: 7,
					originY: 1,
				},
			],
			status: 'playing',
		},
	},
	large_level: {
		input: {
			width: 14,
			height: 8,
			rows: [
				'##############',
				'#............#',
				'#............#',
				'#....###.....#',
				'#............#',
				'#..##....##..#',
				'#............#',
				'##############',
			],
			actors: [
				{
					type: 'coin',
					x: 3.2,
					y: 2.1,
					width: 0.6,
					height: 0.6,
				},
				{
					type: 'player',
					x: 1,
					y: 5.5,
					width: 0.8,
					height: 1.5,
				},
				{
					type: 'horizontal lava',
					x: 5,
					y: 6,
					width: 1,
					height: 1,
				},
				{
					type: 'coin',
					x: 6.2,
					y: 2.1,
					width: 0.6,
					height: 0.6,
				},
				{
					type: 'vertical lava',
					x: 11,
					y: 3,
					width: 1,
					height: 1,
				},
				{
					type: 'horizontal lava',
					x: 9,
					y: 6,
					width: 1,
					height: 1,
				},
				{
					type: 'coin',
					x: 8.2,
					y: 4.1,
					width: 0.6,
					height: 0.6,
				},
				{
					type: 'dripping lava',
					x: 10,
					y: 1,
					width: 1,
					height: 1,
				},
				{
					type: 'coin',
					x: 12.2,
					y: 6.1,
					width: 0.6,
					height: 0.6,
				},
			],
		},
		expected: {
			level: {
				width: 14,
				height: 8,
				rows: [
					'##############',
					'#............#',
					'#............#',
					'#....###.....#',
					'#............#',
					'#..##....##..#',
					'#............#',
					'##############',
				],
				actors: [
					{
						type: 'coin',
						x: 3.2,
						y: 2.1,
						width: 0.6,
						height: 0.6,
					},
					{
						type: 'player',
						x: 1,
						y: 5.5,
						width: 0.8,
						height: 1.5,
					},
					{
						type: 'horizontal lava',
						x: 5,
						y: 6,
						width: 1,
						height: 1,
					},
					{
						type: 'coin',
						x: 6.2,
						y: 2.1,
						width: 0.6,
						height: 0.6,
					},
					{
						type: 'vertical lava',
						x: 11,
						y: 3,
						width: 1,
						height: 1,
					},
					{
						type: 'horizontal lava',
						x: 9,
						y: 6,
						width: 1,
						height: 1,
					},
					{
						type: 'coin',
						x: 8.2,
						y: 4.1,
						width: 0.6,
						height: 0.6,
					},
					{
						type: 'dripping lava',
						x: 10,
						y: 1,
						width: 1,
						height: 1,
					},
					{
						type: 'coin',
						x: 12.2,
						y: 6.1,
						width: 0.6,
						height: 0.6,
					},
				],
			},
			player: {
				type: 'player',
				x: 1,
				y: 5.5,
				width: 0.8,
				height: 1.5,
				vx: 0,
				vy: 0,
			},
			coins: [
				{
					type: 'coin',
					x: 3.2,
					y: 2.1,
					width: 0.6,
					height: 0.6,
				},
				{
					type: 'coin',
					x: 6.2,
					y: 2.1,
					width: 0.6,
					height: 0.6,
				},
				{
					type: 'coin',
					x: 8.2,
					y: 4.1,
					width: 0.6,
					height: 0.6,
				},
				{
					type: 'coin',
					x: 12.2,
					y: 6.1,
					width: 0.6,
					height: 0.6,
				},
			],
			lava: [
				{
					type: 'horizontal lava',
					x: 5,
					y: 6,
					width: 1,
					height: 1,
					vx: 2,
					vy: 0,
				},
				{
					type: 'vertical lava',
					x: 11,
					y: 3,
					width: 1,
					height: 1,
					vx: 0,
					vy: 2,
				},
				{
					type: 'horizontal lava',
					x: 9,
					y: 6,
					width: 1,
					height: 1,
					vx: 2,
					vy: 0,
				},
				{
					type: 'dripping lava',
					x: 10,
					y: 1,
					width: 1,
					height: 1,
					vx: 0,
					vy: 3,
					originX: 10,
					originY: 1,
				},
			],
			status: 'playing',
		},
	},
};

// Fixture-driven snapshot preservation tests
export const snapshotTests = {
	player_movement: {
		input: initializationTests.basic_level.input,
		expected: initializationTests.basic_level.expected,

		updatedState(initialState) {
			return {
				...initialState,
				player: {
					...initialState.player,
					x: initialState.player.x + 1,
				},
			};
		},

		updatedExpected: {
			...initializationTests.basic_level.expected,
			player: {
				...initializationTests.basic_level.expected.player,
				x: 2,
			},
		},
	},
	coin_collection: {
		input: initializationTests.basic_level.input,
		expected: initializationTests.basic_level.expected,

		updatedState(initialState) {
			return {
				...initialState,
				coins: [],
			};
		},

		updatedExpected: {
			...initializationTests.basic_level.expected,
			coins: [],
		},
	},
	lava_movement: {
		input: initializationTests.lava_level.input,
		expected: initializationTests.lava_level.expected,

		updatedState(initialState) {
			return {
				...initialState,
				lava: initialState.lava.map((actor) => ({
					...actor,
					x: actor.x + actor.vx * 0.5,
					y: actor.y + actor.vy * 0.5,
				})),
			};
		},

		updatedExpected: {
			...initializationTests.lava_level.expected,
			lava: [
				{
					...initializationTests.lava_level.expected.lava[0],
					x: 5,
				},
				{
					...initializationTests.lava_level.expected.lava[1],
					y: 3,
				},
				{
					...initializationTests.lava_level.expected.lava[2],
					y: 2.5,
				},
			],
		},
	},
};

// Fixture-driven attempt independence tests
export const attemptIndependenceTests = {
	modified_attempt: {
		input: initializationTests.large_level.input,
		expected: initializationTests.large_level.expected,

		modifyAttempt(attempt) {
			attempt.player.x += 1;
			attempt.player.vx = 2;

			attempt.coins[0].x += 1;
			attempt.coins.pop();

			attempt.lava[0].x += 1;
			attempt.lava[0].vx = -2;

			attempt.status = 'lost';
		},
	},
};
