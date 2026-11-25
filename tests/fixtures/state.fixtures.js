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
};

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
};
