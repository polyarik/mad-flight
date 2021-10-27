class Pilot extends Follower {
	initialize(data) {
		console.log("I'm a Pilot!");

		this.rendering.tracks.lifetime = 10000; // in msec
	}

	// ...
}