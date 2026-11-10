import parseLevel from '../../src/model/level-parser.js';
import { assertEqual, assertDeepEqual, assertThrows } from '../assertions.js';
import { validLevels } from '../fixtures/level-parser.fixtures.js';

export const tests = [
	{
		name: 'Successfully and correctly parses small 24x15 level',
		run: () => {
			assertDeepEqual(
				parseLevel(validLevels.small_24x15.input),
				validLevels.small_24x15.expected,
			);
		},
	},
	{
		name: 'Successfully and correctly parses medium 30x19 level with hazards',
		run: () => {
			assertDeepEqual(
				parseLevel(validLevels.medium_30x19_with_moving_lava.input),
				validLevels.medium_30x19_with_moving_lava.expected,
			);
		},
	},
	{
		name: 'Successfully and correctly parses large 48x23 level with scrolling and combined hazards',
		run: () => {
			assertDeepEqual(
				parseLevel(validLevels.large_48x23_with_combined_hazards.input),
				validLevels.large_48x23_with_combined_hazards.expected,
			);
		},
	},
	{
		name: 'Accepts level with 1 player',
		run: () => {
			assertEqual();
		},
	},
];
