var url = require("url");

class Room extends Controller {
	constructor(room_name, video_id) {
		super();

		this.io = null;
		this.video = video_id;//"jCx4zEKp6jg";
		this.time = 0;
		this.light = true;
		this.play = false;
		this.auto_stop = 0;
		this.room = room_name;
		this.users = [];
		this.changed = false;

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
				this.io.sockets.in(this.room).emit("sync", {
					video: this.video,
					time: this.time
				});
				
				Logger.EventTick(this.video, this.time, this.room);
			}
		}


		if (this.auto_stop >= 900) {
			this.auto_stop = 0;
			this.play = false;
			this.io.sockets.in(this.room).emit("pause", {
				time: this.time,
				nick: "SERVER"
			});
			Logger.EventAutopause(this.time, this.room);
		}
	}

	auto_cancel() {
		if (this.play == true) {
			this.auto_stop = 0;
		}
	}
}

module.exports = Room;