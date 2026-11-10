import parseLevel from '../../src/model/level-parser.js';
import { levelPlans } from '../../src/levels.js';
import { assertEqual, assertDeepEqual, assertThrows } from '../assertions.js';
import { validLevels } from '../fixtures/level-parser.fixtures.js';

export const tests = [
	{
		name: 'Successfully and correctly parses small 24x15 level',
		run: () => {
			assertDeepEqual(parseLevel(levelPlans[0]), validLevels.small_24x15);
		},
	},
	{
		name: 'Successfully and correctly parses medium 30x19 level with hazards',
		run: () => {
			assertDeepEqual(parseLevel(levelPlans[1]), validLevels.medium_30x19_with_moving_lava);
		},
	},
	{
		name: 'Successfully and correctly parses large 48x23 level with scrolling and combined hazards',
		run: () => {
			assertDeepEqual(parseLevel(levelPlans[2]), {
				width: 48,
				height: 23,
				rows: [
					[...'................................................'],
					[...'................................................'],
					[...'................................................'],
					[...'......................................######....'],
					[...'................................................'],
					[...'............................######..............'],
					[...'................................................'],
					[...'..................######........................'],
					[...'................................................'],
					[...'................................................'],
					[...'...........######...............................'],
					[...'................................................'],
					[...'................................................'],
					[...'.....######.....................................'],
					[...'................................................'],
					[...'..................................######........'],
					[...'######.............######.......................'],
					[...'.....#..........................................'],
					[...'.....#......++++++...........++++++.............'],
					[...'.....#....##########.......##########...........'],
					[...'.....#..........................................'],
					[...'.....###########################################'],
					[...'................................................'],
				],
				actors: [
					{ type: 'coin', x: 41.2, y: 2.2, width: 0.6, height: 0.6 },
					{ type: 'coin', x: 31.2, y: 4.2, width: 0.6, height: 0.6 },
					{ type: 'coin', x: 21.2, y: 6.2, width: 0.6, height: 0.6 },
					{ type: 'horizontal lava', x: 38, y: 7, width: 1, height: 1 },
					{ type: 'coin', x: 14.2, y: 9.2, width: 0.6, height: 0.6 },
					{ type: 'coin', x: 7.2, y: 12.2, width: 0.6, height: 0.6 },
					{ type: 'vertical lava', x: 27, y: 12, width: 1, height: 1 },
					{ type: 'coin', x: 37.2, y: 14.2, width: 0.6, height: 0.6 },
					{ type: 'player', x: 2.1, y: 14.5, width: 0.8, height: 1.5 },
					{ type: 'coin', x: 22.2, y: 15.2, width: 0.6, height: 0.6 },
					{ type: 'dripping lava', x: 42, y: 20, width: 1, height: 1 },
				],
			});
		},
	},
	{
		name: 'Accepts level with 1 player',
		run: () => {
			assertEqual();
		},
	},
];
