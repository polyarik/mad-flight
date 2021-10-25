/**
 * Follows the cursor, renders, leaves tracks
 */
class Follower {
	constructor(data) {
		const ctxs = data.ctxs;
		const imgs = data.imgs;
		const settings = data.settings;

		this.rendering = {
			'self': {
				'ctx': ctxs.follower,
				'img': imgs.self
			}
		};

		if (imgs.tracks !== undefined) {
			this.rendering.track = {
				'ctx': ctxs.track,
				'imgs': imgs.tracks,
				'current': 0, // current track image number
				'interval': 0, // distance between tracks (px)
				'lastTrackDist': 0 // distance since the last track (px)
			};
		}

		this.movement = {
			'coords': {'x': 0, 'y': 0},
			'dist': 0, // distance since the last speed check
			'totalDist': 0,
			'speed': 0,
			'direction': Math.Pi/2
		};

		if (settings) {
			if (settings.trackInterval)
				this.rendering.track.interval = settings.trackInterval;

			if (settings.x)
				this.movement.coords.x = settings.x;

			if (settings.y)
				this.movement.coords.y = settings.y;
		}

		if (this.initialize)
			this.initialize(data);

		this.clearCtx(this.rendering.track.ctx);
		this.render();

		this.speedCalc = true; // check speed
		this.calcSpeed(this, 100); // check speed (once in 100msec)
	}

	/**
	 * Handles movement
	 */
	move(newX, newY) {
		this.calcDist(newX, newY);
		
		if ( this.calcDirection(newX, newY) ) {
			this.movement.coords = {'x': newX, 'y': newY};

			this.render();
			this.track();
		}
	}

	calcDist(newX, newY) {
		const movement = this.movement;

		const x = movement.coords.x;
		const y = movement.coords.y;

		const dist = Math.sqrt( Math.pow(Math.abs(newX - x), 2) + Math.pow(Math.abs(newY - y), 2) );

		movement.dist += dist; // distance since the last speed check
		movement.totalDist += dist;
		this.rendering.track.lastTrackDist += dist; // distance since the last track
	}

	calcDirection(newX, newY) {
		const coords = this.movement.coords;
		const x = coords.x;
		const y = coords.y;

		// ignore small movements
		if ( Math.abs(newY - y) + Math.abs(newX - x) < 9 )
			return false;

		const angle = Math.atan2((newY - y), (newX - x));

		this.movement.direction = angle;
		return true;
	}

	render() {
		const rendering = this.rendering.self;

		const coords = this.movement.coords;
		const x = coords.x;
		const y = coords.y;

		const ctx = rendering.ctx;
		this.clearCtx(ctx);

		const img = rendering.img;
		const imgWidth = img.width;
		const imgHeight = img.height;

		ctx.save();
			ctx.translate(x, y);
			ctx.rotate(this.movement.direction + Math.PI/2);

			ctx.drawImage(img, -imgWidth/2, -imgHeight/2, imgWidth, imgHeight);
		ctx.restore();
	}

	/**
	 * Leaves a track
	 */
	track() {
		const rendering = this.rendering.track;

		if (rendering.lastTrackDist < rendering.interval)
			return false;

		const coords = this.movement.coords;
		const x = coords.x;
		const y = coords.y;

		const ctx = rendering.ctx;

		const img = rendering.imgs[rendering.current];
		const imgWidth = img.width;
		const imgHeight = img.height;

		ctx.save();
			ctx.translate(x, y);
			ctx.rotate(this.movement.direction + Math.PI/2);

			ctx.drawImage(img, -imgWidth/2, -imgHeight/2, imgWidth, imgHeight);
		ctx.restore();

		rendering.current = (rendering.current + 2 > rendering.imgs.length) ? 0 : rendering.current + 1;
		rendering.lastTrackDist = 0;
	}

	clearCtx(ctx) {
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	}

	calcSpeed(follower, delay) {
		const movement = follower.movement;

		const dist = movement.dist;
		const speed = Math.round(dist * 1000 / delay); // px/sec
		
		movement.dist = 0;
		movement.speed = speed;

		if (follower.speedCalc) {
			setTimeout(function() {
				follower.calcSpeed(follower, delay);
			}, delay);
		}
	}
}