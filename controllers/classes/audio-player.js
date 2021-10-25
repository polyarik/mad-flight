class AudioPlayer {
	constructor(musicPath) {
		this.audio = {
			'music': {
				'flight': null
				//
			},

			'sounds': {
				//
			}
		};

		this.initializeAudio();

		this.isMuted = false;
		this.playingMusic = null;
		this.playingSounds = [];
	}

	initializeAudio() {
		// music
		for (let musicName in this.audio.music) {
			let audioFile = new Audio();
				audioFile.src = "./assets/audio/music/"+musicName+".mp3";

			this.audio.music[musicName] = audioFile;
		}

		// sounds
		for (let soundName in this.audio.sounds) {
			let audioFile = new Audio();
				audioFile.src = "./assets/audio/music/"+soundName+".mp3";

			this.audio.sounds[soundName] = audioFile;
		}
	}

	playMusic(musicName) {
		if (this.isMuted)
			return false;

		let music = this.audio.music[musicName];

		music.volume = 0.1;
		music.play();
		music.loop = true;
		this.playingMusic = musicName;
	}

	playSound(soundName) {
		if (this.isMuted)
			return false;

		//
	}

	stopMusic() {
		if (this.playingMusic)
			this.audio.music[this.playingMusic].pause();
	}

	mute() {
		this.isMuted = !this.isMuted;

		if (this.isMuted) {
			this.stopMusic();
			//
		} else {
			this.playMusic(this.playingMusic);
			//
		}
	}
}