const Controller = require("./Controller.js");
const Logger = require("./Logger.js");

const io = require("socket.io");
const middleware = require("socketio-wildcard")();


class Socket extends Controller {
	constructor(Video) {
		super();

		this.video = Video;
		this.port = 8080;
		this.io = null;
	}

	create() {
		this.io = io(this.port);
		this.io.use(middleware);
		this.video.io = this.io;

		Logger.ServerStarted(this.port);
		return this.io;
	}

	events(socket) {
		this.io.sockets.on("connection", (socket) => {
			this.event_connect(socket);
			this.event_disconnect(socket);
			this.event_join(socket);
			this.event_load(socket);
			this.event_message(socket);
			this.event_light(socket);
			this.event_play(socket);
			this.event_pause(socket);
			this.event_rewind(socket);
		});

		Logger.EventsLoaded();
	}

	event_connect(socket) {
		socket.ip = socket.conn.remoteAddress.replace("::ffff:", "");

		socket.emit("connected", {
			video: this.video.video, 
			time: this.video.time, 
			play: this.video.play, 
			light: this.video.light
		});
	}

	event_disconnect(socket) {
		socket.on("disconnect", () => {
			Logger.EventDisconnect(socket.nick);
			this.io.sockets.in(socket.room).emit("disc", {
				nick: socket.nick,
				type: "disc"
			});
		});
	}

	event_join(socket) {
		socket.on("join", (data) => {
			socket.nick = data.nick;
			socket.room = "default";
			socket.join(socket.room);

			this.io.sockets.in(socket.room).emit("join", {
				nick: data.nick,
				type: "join"
			});

			Logger.EventJoin(socket.nick, socket.ip);
		});
	}

	event_load(socket) {
		socket.on("load", (data) => {
			var link = this.video.parse(data.link, data.playlist);
			this.video.video = link;
			this.video.play = false;
			this.video.time = 0;

			this.io.sockets.emit("load", {
				video: this.video.video,
				nick: socket.nick
			});

			Logger.EventLoad(this.video.video, socket.nick);
		});
	}

	event_play(socket) {
		socket.on("play", (data) => {
			if (this.video.play == false) {
				this.io.sockets.in(socket.room).emit("play", {
					video: this.video.video, 
					time: this.video.time, 
					nick: socket.nick
				});
				this.video.play = true;
				Logger.EventPlay(socket.nick, this.video.time);
			}
		});
	}

	event_pause(socket) {
		socket.on("pause", (data) => {
			if (this.video.play == true) {
				this.io.sockets.in(socket.room).emit("pause", {
					time: this.video.time, 
					nick: socket.nick
				});
				this.video.play = false;
				Logger.EventPause(socket.nick, this.video.time);
			}
		});
	}

	event_message(socket) {
		socket.on("message", (data) => {
			data.text = this.html(data.text);
			data.nick = socket.nick;
			this.io.sockets.in(socket.room).emit("message", data);
			Logger.EventMessage(socket.nick, data.text);
		});
	}

	event_rewind(socket) {
		socket.on("rewind", (data) => {
			var new_time = Math.floor(data.time);
			Logger.EventRewind(socket.nick, this.video.time, new_time);

			this.video.time = new_time;
			this.io.sockets.in(socket.room).emit("rewind", {
				time: this.video.time, 
				nick: socket.nick,
				type: "rewind"
			});
		});
	}

	event_light(socket) {
		socket.on("light", (data) => {
			this.video.light = !this.video.light;
			this.io.sockets.in(socket.room).emit("light", {light: this.video.light});
		});
	}
}

module.exports = Socket;