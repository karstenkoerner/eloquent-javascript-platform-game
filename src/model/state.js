export default class State {
	constructor(level, player, coins, lava, status) {
		this.level = level;
		this.player = player;
		this.coins = coins;
		this.lava = lava;
		this.status = status;
	}

	static start(level) {
		const player = {
			...level.actors.find((a) => a.type === 'player'),
			vx: 0,
			vy: 0,
		};

		const coins = level.actors.filter((a) => a.type === 'coin').map((a) => ({ ...a }));

		const lava = level.actors
			.filter((a) => a.type.includes('lava'))
			.map((a) => {
				const copy = { ...a };

				switch (a.type) {
					case 'horizontal lava':
						copy.vx = 2;
						copy.vy = 0;
						break;

					case 'vertical lava':
						copy.vx = 0;
						copy.vy = 2;
						break;

					case 'dripping lava':
						copy.vx = 0;
						copy.vy = 3;
						copy.originX = a.x;
						copy.originY = a.y;
						break;
				}

				return copy;
			});

		return new State(level, player, coins, lava, 'playing');
	}
}
