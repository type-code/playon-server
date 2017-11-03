const Controller = require("./Controller.js");


class Video extends Controller {
	constructor() {
		super();

		this.video = "jCx4zEKp6jg";
		this.time = 511;
		this.light = true;
		this.play = false;
	}

	video_load(id) {
		this.video = id;
	}

	video_rewind(time) {
		this.time = time;
	}

	video_light(light) {
		this.light = light;
	}

	video_played(played) {
		this.play = played;
	}
}

module.exports = Video;