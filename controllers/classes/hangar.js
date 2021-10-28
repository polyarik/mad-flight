/**
 * Hangar with planes
 */
class Hangar {
	constructor(imgsPath) {
		this.planes = {
			'crop-duster': {
				'price': 10,
				'settings': {'coinMultiplier': 1, 'inertness': 10, 'trackInterval': 200, 'trackLifetime': 2000},
				'imgs': {'self': null, 'tracks': [null]}
			},

			'senior-limon': {
				'price': 250,
				'settings': {'coinMultiplier': 2, 'inertness': 12, 'trackInterval': 50, 'trackLifetime': 500},
				'imgs': {'self': null, 'tracks': [null, null]}
			},

			'hawk': {
				'price': 750,
				'settings': {'coinMultiplier': 5, 'inertness': 8, 'trackInterval': 0, 'trackLifetime': 1000},
				'imgs': {'self': null, 'tracks': [null]}
			},

			//
		};

		this.places = [];

		for (let planeName in this.planes) {
			let data = this.planes[planeName];
			data.name = planeName;

			this.places.push(data);
		}

		this.places.push( {} ); // empty place

		this.planeInFlightName = "";
		this.initializePlanes(imgsPath); // images, ...
	}

	initializePlanes() {
		for (let planeName in this.planes) {
			let plane = this.planes[planeName];

			let planeImg = new Image();
				planeImg.src = "./assets/images/planes/"+planeName+"/"+planeName+".svg";

			let trackImgs = [];

			if (plane.imgs.tracks) {
				for (let i = 0, l = plane.imgs.tracks.length; i < l; i++) {
					let trackImg = new Image();
						trackImg.src = "./assets/images/planes/"+planeName+"/tracks/track-"+i+".svg";

						trackImgs.push(trackImg);
				}
			}

			plane.imgs = {'self': planeImg, 'tracks': trackImgs};
		}
	}

	/**
	 * Takes aircraft out of the hangar
	 */
	takePlane(place, coins) {
		const plane = this.places[place];

		if (!plane || plane.price > coins)
			return false;

		this.places[place] = {};
		this.planeInFlightName = plane.name;

		return plane;
	}

	/**
	 * Returns the aircraft
	 */
	leavePlane(place) {
		const plane = this.places[place];

		if (plane && plane.name)
			return false;

		let planeData = this.planes[this.planeInFlightName];
		planeData.name = this.planeInFlightName;
		planeData.price = 0; // the plane is free for future flights

		this.places[place] = planeData; // returning the aircraft
		this.planeInFlightName = "";

		return true;
	}
}