const Controller = require("./Controller.js");
const Logger = require("./Logger.js");
const url = require("url");


class Video extends Controller {
	constructor() {
		super();

		this.io = null;
		this.video = "1YTLvqZNW_4";//"jCx4zEKp6jg";
		this.time = 511;
		this.light = true;
		this.play = false;
		this.auto_stop = 0;

		setInterval(() => this.watcher(), 1000);
	}

	parse(link, playlist) {
		if (playlist == false) {
			var temp = url.parse(link, true);
			
			if (temp.query.v) {
				link = temp.query.v;
			}
			else {
				link = temp.path.slice(1);
			}
		}

		link = link.replace("https://youtu.be/", "");
		return link;
	}

	watcher() {
		if (this.play) {
			this.time++;
			this.auto_stop++;
		}

		if (this.time % 2 == 0) {
			if (this.time % 4 == 0) {
				this.io.sockets.emit("sync", {
					video: this.video.video,
					time: this.video.time
				});
				Logger.EventSync(this.video, this.time);
			}
			Logger.EventTick(this.video, this.time);
		}

		if (this.auto_stop >= 9000) {
			this.auto_stop = 0;
			this.play = false;
			this.io.sockets.emit("pause", {
				time: this.time, 
				nick: "SERVER"
			});
			Logger.EventAutopause(this.time);
		}
	}
}

module.exports = Video;