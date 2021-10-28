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
			this.rendering.tracks = {
				'list': [], // list of visible tracks
				'ctx': ctxs.track, // canvas context
				'imgs': imgs.tracks, // tracks image
				'current': 0, // current track image number
				'interval': 0, // distance between tracks (px)
				'lastTrackDist': 0 // distance since the last track (px)
			};
		}

		this.movement = {
			'coords': {'x': 0, 'y': 0},
			'direction': Math.Pi/2,
			'speedCheck': false,
			'time': Date.now(), // of the last check
			'dist': 0, // distance since the last speed check
			'totalDist': 0,
			'speed': 0
		};

		if (settings) {
			if (settings.trackInterval)
				this.rendering.tracks.interval = settings.trackInterval;

			if (settings.trackLifetime)
				this.rendering.tracks.lifetime = settings.trackLifetime;

			if (settings.x)
				this.movement.coords.x = settings.x;

			if (settings.y)
				this.movement.coords.y = settings.y;
		}

		if (this.initialize)
			this.initialize(data);

		this.clearCtx(this.rendering.tracks.ctx);
		this.render();

		this.interval = setInterval(() => {
			this.calcSpeed();
			this.renderTracks();
		}, 100);
	}

	onTouchStart(newX, newY) {
		this.movement.coords = {'x': newX, 'y': newY};
	}

	/**
	 * Handles movement
	 */
	move(newX, newY) {
		this.calcDist(newX, newY);
		
		if ( this.calcDirection(newX, newY) ) {
			this.movement.coords = {'x': newX, 'y': newY};
			this.render();

			this.leaveTrack();
		}
	}

	calcDist(newX, newY) {
		const movement = this.movement;

		const x = movement.coords.x;
		const y = movement.coords.y;

		const dist = Math.sqrt( Math.pow(Math.abs(newX - x), 2) + Math.pow(Math.abs(newY - y), 2) );

		movement.dist += dist; // distance since the last speed check
		movement.totalDist += dist;
		this.rendering.tracks.lastTrackDist += dist; // distance since the last track
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

	calcSpeed() {
		const movement = this.movement;

		if (movement.speedCheck) {
			const dist = movement.dist;
			const timeShift = Date.now() - movement.time;

			const speed = Math.round(dist * 1000 / timeShift); // px/sec
			
			movement.dist = 0;
			movement.speed = speed;
		}
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
	leaveTrack() {
		const rendering = this.rendering.tracks;

		if (rendering.lastTrackDist < rendering.interval)
			return false;

		const track = {
			'type': rendering.current,
			'x': this.movement.coords.x,
			'y': this.movement.coords.y,
			'direction': this.movement.direction,
			'time': Date.now()
		};

		this.renderTrack(track);
		rendering.list.push(track);

		rendering.current = (rendering.current + 2 > rendering.imgs.length) ? 0 : rendering.current + 1;
		rendering.lastTrackDist = 0;

		return true;
	}

	renderTracks() {
		const rendering = this.rendering.tracks;

		if (rendering) {
			this.clearCtx(rendering.ctx);

			for (let track of rendering.list) {
				if (rendering.lifetime && Date.now() - track.time > rendering.lifetime) {
					rendering.list.shift(); // remove old track
				} else
					this.renderTrack(track);
			}
		}
	}

	renderTrack(track) {
		const rendering = this.rendering.tracks;

		const img = rendering.imgs[track.type];
		const imgWidth = img.width;
		const imgHeight = img.height;

		const ctx = this.rendering.tracks.ctx;
		ctx.globalAlpha = Math.pow((track.time + rendering.lifetime - Date.now()), 0.5) / Math.pow(rendering.lifetime, 0.5);

		ctx.save();
			ctx.translate(track.x, track.y);
			ctx.rotate(track.direction + Math.PI/2);

			ctx.drawImage(img, -imgWidth/2, -imgHeight/2, imgWidth, imgHeight);
		ctx.restore();
	}

	clearCtx(ctx) {
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	}
}