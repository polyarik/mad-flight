/**
 * Follower that earns money
 */
class Plane extends Follower {
	initialize(data) {
		console.log("I'm a Plane!");

		this.coins = 0; // money earned for the flight

		const imgs = data.imgs;
		const settings = data.settings;

		if (settings) {
			if (settings.coinMultiplier)
				this.coinMultiplier = settings.coinMultiplier;
		}

		if (imgs.speedTracks !== undefined) {
			this.rendering.speedTrack = {
				'ctx': ctxs.follower,
				'imgs': imgs.speedTracks
				//... | special tracks for fast movement
			};
		}

	}

	/*leaveSpeedTrack() {
		//
	}*/

	calcSpeed(follower, delay) {
		const movement = follower.movement;

		const dist = movement.dist;
		const speed = Math.round(dist * 1000 / delay); // px/sec
		
		movement.dist = 0;
		movement.speed = speed;

		if (speed)
			this.coins += this.getCoins(speed);

		if (follower.speedCalc) {
			setTimeout(function() {
				follower.calcSpeed(follower, delay);
			}, delay);
		}
	}

	/**
	 * Earn coins from the current speed
	 */
	getCoins(speed) {
		return Math.ceil( Math.pow(Math.floor(speed / 1000), 3) / 600 );
	}
}