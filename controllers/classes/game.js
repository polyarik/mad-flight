/**
 * The main game class
 */
class Game {
	constructor() {
		this.initializeImages();
		this.initializeCanvases();

		this.status = 'ground'; // ground, air
		this.coins = 10; // player money

		this.audioPlayer = new AudioPlayer;
		this.hangar = new Hangar("../../assets/images/planes/");
		this.createFollower( {'imgs': this.images.pilot} ); // follows the cursor
	}

	initializeCanvases() {
		this.canvases = {'follower': {}, 'track': {}};

		for (let i in this.canvases) {
			this.canvases[i].cnvs = document.getElementById("cnvs-"+i);
			this.canvases[i].ctx = this.canvases[i].cnvs.getContext('2d');
		}

		this.setCanvasesSize();
	}

	setCanvasesSize() {
		const width = window.innerWidth;
		const height = window.innerHeight;
		const scale = window.devicePixelRatio;

		for (let i in this.canvases) {
			this.canvases[i].cnvs.style.width = width + "px";
			this.canvases[i].cnvs.style.height = height + "px";

			this.canvases[i].cnvs.width = Math.floor(width * scale);
			this.canvases[i].cnvs.height = Math.floor(height * scale);

			this.canvases[i].ctx.scale(scale, scale);
		}
	}

	initializeImages() {
		this.images = {};

		let pilot = new Image();
		pilot.src = "./assets/images/pilot/pilot.svg";

		let track0 = new Image();
		track0.src = "./assets/images/pilot/tracks/track-0.svg";

		let track1 = new Image();
		track1.src = "./assets/images/pilot/tracks/track-1.svg";

		this.images.pilot = {'self': pilot, 'tracks': [track0, track1]};
	}

	createFollower(data) {
		data.ctxs = {'follower': this.canvases.follower.ctx, 'track': this.canvases.track.ctx};

		if (!data.settings)
			data.settings = {};

		if (this.follower) {
			this.follower.speedCalc = false;

			const coords = this.follower.movement.coords;
			data.settings.x = coords.x;
			data.settings.y = coords.y;
		}

		if (this.status == "air") {
			this.follower = new Plane(data);
		} else {
			data.settings.trackInterval = 42;
			this.follower = new Pilot(data);
		}
	}

	/**
	 * Boards plane
	 */
	takePlane(place) {
		if (this.status == "air")
			return false;

		const planeData = this.hangar.takePlane(place, this.coins); // taking the aircraft out of the hangar

		if (planeData) {
			this.coins -= planeData.price;

			this.status = "air";
			this.createFollower(planeData); // boarding the plane
			this.audioPlayer.playMusic('flight');
		}
	}

	/**
	 * Returns the plane
	 */
	leavePlane(place) {
		if (this.status == "ground")
			return false;

		const planeCoins = this.follower.coins * this.follower.coinMultiplier;
		this.coins += planeCoins;

		this.hangar.leavePlane(place); // returning the plane

		this.status = "ground";
		this.createFollower( {'imgs': this.images.pilot} ); // disembarking
		this.audioPlayer.stopMusic();
	}

	//
}