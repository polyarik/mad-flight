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

		// special tracks for fast movement
		/*if (imgs.speedTracks !== undefined) {
			this.rendering.speedTrack = {
				'ctx': ctxs.follower,
				'imgs': imgs.speedTracks
				//...
			};
		}*/
	}

	/*leaveSpeedTrack() {
		//
	}*/

	calcSpeed() {
		const movement = this.movement;

		const dist = movement.dist;
		const currentTime = Date.now();
		const timeShift = currentTime - movement.time;
		const speed = Math.round(dist / timeShift * 1000); // px/sec
		
		movement.dist = 0;
		movement.time = currentTime;
		movement.speed = speed;

		if (speed) 
			this.coins += this.getCoins(speed);
	}

	/**
	 * Earn coins from the current speed
	 */
	getCoins(speed) {
		const scale = window.devicePixelRatio;
		const coins = Math.ceil( Math.pow(Math.floor(speed * scale / 1000), 3) / 600 );

		return Math.min(coins, 5);
	}
}