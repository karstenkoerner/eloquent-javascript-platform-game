export const integrationTests = {
	basic_level: {
		input: `
			#####
			#...#
			#@.o#
			#####
		`,
		expected: {
			level: {
				width: 5,
				height: 4,
				rows: [[...'#####'], [...'#...#'], [...'#...#'], [...'#####']],
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
		input: `
			#########
			#......v#
			#.....|.#
			#@o.=...#
			#########
		`,
		expected: {
			level: {
				width: 9,
				height: 5,
				rows: [
					[...'#########'],
					[...'#.......#'],
					[...'#.......#'],
					[...'#.......#'],
					[...'#########'],
				],
				actors: [
					{
						type: 'dripping lava',
						x: 7,
						y: 1,
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
					type: 'horizontal lava',
					x: 4,
					y: 3,
					width: 1,
					height: 1,
					vx: 2,
					vy: 0,
				},
			],
			status: 'playing',
		},
	},

	large_level: {
		input: `
			##############
			#.........v..#
			#..o..o......#
			#....###...|.#
			#.......o....#
			#..##....##..#
			#@...=...=..o#
			##############
		`,
		expected: {
			level: {
				width: 14,
				height: 8,
				rows: [
					[...'##############'],
					[...'#............#'],
					[...'#............#'],
					[...'#....###.....#'],
					[...'#............#'],
					[...'#..##....##..#'],
					[...'#............#'],
					[...'##############'],
				],
				actors: [
					{
						type: 'dripping lava',
						x: 10,
						y: 1,
						width: 1,
						height: 1,
					},
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
						type: 'vertical lava',
						x: 11,
						y: 3,
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
						type: 'horizontal lava',
						x: 9,
						y: 6,
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
					x: 5,
					y: 6,
					width: 1,
					height: 1,
					vx: 2,
					vy: 0,
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
			],
			status: 'playing',
		},
	},
};
