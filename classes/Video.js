const Controller = require("./Controller.js");
const Logger = require("./Logger.js");
const url = require("url");


class Video extends Controller {
	constructor(video_id, room_name) {
		super();

		this.io = null;
		this.video = video_id;//"jCx4zEKp6jg";
		this.time = 0;
		this.light = true;
		this.play = false;
		this.auto_stop = 0;
		this.room = room_name;

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

			if (this.time % 60 == 0) {
				if (this.time % 120 == 0) {
					this.io.sockets.in(this.room).emit("sync", {
						video: this.video.video,
						time: this.video.time
					});
					//Logger.EventSync(this.video, this.time);
				}
				Logger.EventTick(this.video, this.time);
			}
		}


		if (this.auto_stop >= 9000) {
			this.auto_stop = 0;
			this.play = false;
			this.io.sockets.in(this.room).emit("pause", {
				time: this.time, 
				nick: "SERVER"
			});
			Logger.EventAutopause(this.time);
		}
	}
}

module.exports = Video;